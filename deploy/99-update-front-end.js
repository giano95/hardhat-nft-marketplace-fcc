const { ethers, network } = require("hardhat")
const { UPDATE_FRONTEND } = require("../helper-hardhat-config")
const fs = require("fs")

const CONTRACT_ADDRESSES_FILE_PATH =
    "../nextjs-moralis-nft-marketplace-fcc/constants/addressesMapping.json"
const CONTRACT_ABIS_FILE_PATH = "../nextjs-moralis-nft-marketplace-fcc/constants/abisMapping.json"

module.exports = async function () {
    if (UPDATE_FRONTEND) {
        await updateContractAddresses()
        await updateContractAbis()
    }
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(CONTRACT_ADDRESSES_FILE_PATH, "utf-8"))

    if (
        chainId in contractAddresses &&
        contractAddresses[chainId].hasOwnProperty("NftMarketplace")
    ) {
        contractAddresses[chainId]["NftMarketplace"] = nftMarketplace.address
    } else {
        contractAddresses[chainId] = { NftMarketplace: nftMarketplace.address }
    }

    fs.writeFileSync(CONTRACT_ADDRESSES_FILE_PATH, JSON.stringify(contractAddresses))
}

async function updateContractAbis() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const freakyEyes = await ethers.getContract("FreakyEyes")
    const contractAbis = JSON.parse(fs.readFileSync(CONTRACT_ABIS_FILE_PATH, "utf-8"))

    contractAbis["NftMarketplace"] = nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    contractAbis["FreakyEyes"] = freakyEyes.interface.format(ethers.utils.FormatTypes.json)

    fs.writeFileSync(CONTRACT_ABIS_FILE_PATH, JSON.stringify(contractAbis))
}

module.exports.tags = ["all", "update-front-end", "main"]
