import web3 from "./web3";
import CampaignFactory from "./build/Factory.json";

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0x55c2C0f253a30830416e653f6819CFD9Fc053fd1"
    //"0xE740D15281d1eCB3e34184ed35E27fE6418ddb33"
);

export default instance;