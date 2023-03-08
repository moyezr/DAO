const {ethers} = require("hardhat");

async function main () {

  const AiMintsNFTContractAddress = "0x744656fbCa6EfEBC042dD080a7AC3660c0fDCEBb";;

  const FakeNFTMarketplace = await ethers.getContractFactory("FakeNFTMarketplace");
  const fakeNFTMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNFTMarketplace.deployed();

  console.log(`FakeNFTMarketplace Contract deployed to --> ${fakeNFTMarketplace.address}`);


  // Now deploying the DeDevsDAO contract

  // ASSUMING THAT YOUR WALLET HAS 1 ETHER
  const DeDevsDAO = await ethers.getContractFactory("DeDevsDAO");
  const deDevsDAO = await DeDevsDAO.deploy(
    fakeNFTMarketplace.address,
    AiMintsNFTContractAddress,
    {value: ethers.utils.parseEther("1"),}
  )
  
  await deDevsDAO.deployed();

  console.log(`DeDevsDAO deployed to ${deDevsDAO.address}`);
}


main().then(() => {
  console.log("Contract Successfully Deployed");
}).catch((err) => {
  console.log("Error deploying contract", err);
})



// FakeNFTMarketplace Contract deployed to --> 0x089676126F88B9a0E39C721Cd07E2abcB92E5B6d
// DeDevsDAO deployed to 0xccc464BA1B77C844e9CC1e6676d5a5299cF27DA4