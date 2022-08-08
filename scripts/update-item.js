const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 3
const SELLING_PRICE = ethers.utils.parseEther("0.2")

async function update() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")

    const tx = await nftMarketplace.updateListing(freakyEyes.address, TOKEN_ID, SELLING_PRICE)
    await tx.wait(1)
    console.log("NFT Listing update!")

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if ((network.config.chainId = "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

update()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
