const path = require("path");
const HDWallet = require("truffle-hdwallet-provider");
var mnemonic = "replace with dummy account";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    rinkeby : {
      provider: () => {
        return new HDWallet(mnemonic,"https://rinkeby.infura.io/v3/d3c1e5dfdc2649b4bf82b08bd33ff64d")
      },
      network_id: "4"
    }
}}
