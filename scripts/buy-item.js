const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 2

async function buyItem() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")

    const listing = await nftMarketplace.getListing(freakyEyes.address, TOKEN_ID)
    const price = listing.price.toString()
    const tx = await nftMarketplace.buyItem(freakyEyes.address, TOKEN_ID, { value: price })
    await tx.wait(1)
    console.log("NFT Bought!")

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if ((network.config.chainId = "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
