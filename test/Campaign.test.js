const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/Factory.json');
const compiledCompaign = require('../ethereum/build/Campaign.json');
const { time } = require('console');

let accounts;
let factory;
let campaignAddress;
let campaign;

console.log("1//////////////////////////");

describe('Campaigns', () => {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        
        console.log("2//////////////////////////");

        factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({from: accounts[0], gas: "3000000"});

        console.log("3//////////////////////////");

       await factory.methods.createCampaign("100")
       .send({ from: accounts[0], gas: "1000000"});

        console.log("4//////////////////////////");

        campaignAddress = await factory.methods.getDeployedCampaigns().call();
        campaign = await new web3.eth.Contract(compiledCompaign.abi, campaignAddress[0]);
        console.log("5//////////////////////////");    
    });
    
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    }).timeout(10000);    

    it("marks caller as a campaign manager", async () => {
        const manager = await campaign.methods.manager().call(); 
        assert.equal(accounts[0], manager);
    })

    it("allows people to contribute money and marks them as approvers", async () => {
        await campaign.methods.contribute().send({
            value: "200",
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it("requires a minimum contribution", async () => {
        try {
            await campaign.methods.Contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            
        }
    });

    it("allows a manager to make a payment request", async() =>{
        await campaign.methods.createRequest("Buy batteries", '100', accounts[1])
        .send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();

        assert.equal("Buy batteries", request.description);
    });

    it("processes request", async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
        .createRequest('A', web3.utils.toWei("5", "ether"), accounts[1])
        .send({ from: accounts[0], gas: "1000000"});

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: "1000000"
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: "1000000"
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104)
    })
});