// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Returns the Ethere balance ofa given address and
async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Logs the Ethere balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purcahses.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} said ${message}`);
  }
}



async function main() {
  //Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();


  //get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to", buyMeACoffee.address);


  //Check balance before the coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ===");
  await printBalances(addresses);


  //Buy the owner a few coffee.
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Caroline", "Awsome !", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "WOW !!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("May", "Lame :D", tip);


  //Check balance after the coffee purchase.
  console.log("== bought coffee ===");
  await printBalances(addresses);


  //Withdraw funds.
  await buyMeACoffee.connect(owner).withdrawTips();


  //Check balance after the withdrawal.
  console.log("== wirthdrawTips ===");
  await printBalances(addresses);


  //Read all the memos left for the owner
  console.log("== memos ===");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});
