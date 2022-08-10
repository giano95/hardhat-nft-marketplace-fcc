const { ethers, network } = require("hardhat")
const { UPDATE_FRONTEND } = require("../helper-hardhat-config")
const fs = require("fs")

const CONTRACT_ADDRESSES_FILE_PATHS = [
    "../nextjs-moralis-nft-marketplace-fcc/constants/addressesMapping.json",
    "../nextjs-thegraph-nft-marketplace-fcc/constants/addressesMapping.json",
]
const CONTRACT_ABIS_FILE_PATHS = [
    "../nextjs-moralis-nft-marketplace-fcc/constants/abisMapping.json",
    "../nextjs-thegraph-nft-marketplace-fcc/constants/abisMapping.json",
]

module.exports = async function () {
    if (UPDATE_FRONTEND) {
        for (const i in CONTRACT_ADDRESSES_FILE_PATHS) {
            await updateContractAddresses(CONTRACT_ADDRESSES_FILE_PATHS[i])
            await updateContractAbis(CONTRACT_ABIS_FILE_PATHS[i])
        }
    }
}

async function updateContractAddresses(path) {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(path, "utf-8"))

    // Set NftMarketplace address
    if (
        chainId in contractAddresses &&
        contractAddresses[chainId].hasOwnProperty("NftMarketplace")
    ) {
        contractAddresses[chainId]["NftMarketplace"] = nftMarketplace.address
    } else if (chainId in contractAddresses) {
        Object.assign(contractAddresses[chainId], { NftMarketplace: nftMarketplace.address })
    } else {
        contractAddresses[chainId] = { NftMarketplace: nftMarketplace.address }
    }

    // Set FreakyEyes address
    if (chainId in contractAddresses && contractAddresses[chainId].hasOwnProperty("FreakyEyes")) {
        contractAddresses[chainId]["FreakyEyes"] = freakyEyes.address
    } else if (chainId in contractAddresses) {
        Object.assign(contractAddresses[chainId], { FreakyEyes: freakyEyes.address })
    } else {
        contractAddresses[chainId] = { FreakyEyes: freakyEyes.address }
    }

    fs.writeFileSync(path, JSON.stringify(contractAddresses))
}

async function updateContractAbis(path) {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")
    const contractAbis = JSON.parse(fs.readFileSync(path, "utf-8"))

    contractAbis["NftMarketplace"] = nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    contractAbis["FreakyEyes"] = freakyEyes.interface.format(ethers.utils.FormatTypes.json)

    fs.writeFileSync(path, JSON.stringify(contractAbis))
}

module.exports.tags = ["all", "update-front-end", "main"]
