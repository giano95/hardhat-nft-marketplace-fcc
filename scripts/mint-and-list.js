const { ethers, network, getNamedAccounts } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const SELLING_PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const { deployer } = await getNamedAccounts()
    const freakyEyes = await ethers.getContract("FreakyEyes", deployer)
    const nftMarketplace = await ethers.getContract("NftMarketplace", deployer)

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

    // Get the approval for our nftMarketplace contract to transfer the NFT
    const approvalTx = await freakyEyes.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)

    // List the NFT
    const listItemTx = await nftMarketplace.listItem(freakyEyes.address, tokenId, SELLING_PRICE)
    await listItemTx.wait(1)

    // If we're on a localhost chain move blocks so that moralis DB
    // get the confirm transaction
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
