// *** ** IGNORE THIS FOR NOW BESIDES REFERENCE FOR HARDHAT ** ***

// *** I DID NOT UPDATE THIS TO REFLECT ANY TICKET STUFF ** ***

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const TicketMaster = await hre.ethers.getContractFactory("TicketMaster");
  const ticketMaster = await TicketMaster.deploy(
    70,
    "ipfs://QmfVHiEoao42xWi4bw7o6fRqBwE4LsGpisUJ4kiHoj1tGE"
  );

  await ticketMaster.deployed();

  console.log("TicketMaster:", ticketMaster.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
