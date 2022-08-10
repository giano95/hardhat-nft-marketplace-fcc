const { ethers, network, getNamedAccounts } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function mint() {
    const { deployer } = await getNamedAccounts()
    const freakyEyes = await ethers.getContract("FreakyEyes", deployer)

    // Un-paused the contract
    await freakyEyes.pause(false)
    console.log('Toggled the value of "paused" to ' + (await freakyEyes.paused()))

    // Get the cost
    const cost = await freakyEyes.cost()
    console.log("FreakyEyes NFTs have a mint cost of: " + ethers.utils.formatEther(cost) + " ETH")

    // Mint one NFT and save the tokenId
    const freakyEyesTx = await freakyEyes.mint(1, { value: cost.toString() })
    const freakyEyesReceipt = await freakyEyesTx.wait(1)
    console.log(`FreakyEyes NFT minted at txHash: ${freakyEyesReceipt.transactionHash}`)
    const tokenId = freakyEyesReceipt.events[0].args.tokenId
    console.log(`Minted the NFT #${tokenId}`)

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
