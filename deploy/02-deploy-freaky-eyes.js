const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    args = [
        "FreakyEyes", // _name
        "FE", // _symbol
        "ipfs://QmTdn1ugApxCjKdt9ggKRamgPegLTRiRghZWFzeSZJQXW3/", // _initBaseURI
        "ipfs://QmbXuAz4LKbALHFHMoMD4KtXJaz59nBn96qCJTAUyM7ai5/hidden.json", // _initNotRevealedUri
    ]
    const freakyEyes = await deploy("FreakyEyes", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(freakyEyes.address, args)
    }
}

module.exports.tags = ["all", "freaky-eyes", "main"]
