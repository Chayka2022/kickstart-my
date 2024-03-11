const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const Factory = require("./build/Factory.json");

const provider = new HDWalletProvider(
    "script bulb garbage ranch force filter much firm oil mouse object book",
  // remember to change this to your own phrase!
  "https://sepolia.infura.io/v3/6ce62c123e444ffc909313c5d4dcc882"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(Factory.abi)
    .deploy({ data: Factory.evm.bytecode.object })
    .send({ gas: "1400000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

