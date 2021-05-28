require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const INFURA_KEY = "e835057bad674697959be47dcac5028e";
const pp = "d386e3dac68bcd13d229a89eef9fc4ee2610ab7c708d0c9ba91998752fa9462c";
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [pp],
    },
  },
  paths: {
    artifacts: "./app/src/contracts",
  },
  solidity: "0.8.0",
};
