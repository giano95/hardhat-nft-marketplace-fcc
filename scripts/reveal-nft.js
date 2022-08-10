const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function revealNft() {
    const { deployer } = await getNamedAccounts()
    const freakyEyes = await ethers.getContract("FreakyEyes", deployer)

    await freakyEyes.reveal()
    console.log("NFT's revealed!")

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if ((network.config.chainId = "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

revealNft()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
