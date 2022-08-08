const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 1

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")

    const tx = await nftMarketplace.cancelListing(freakyEyes.address, TOKEN_ID)
    await tx.wait(1)
    console.log("NFT Canceled!")

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if ((network.config.chainId = "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
