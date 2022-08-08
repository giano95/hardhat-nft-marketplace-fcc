const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        vrfCoordinatorAddress: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei keyHash
        subscriptionId: "7928",
        callbackGasLimit: "500000",
    },
    31337: {
        name: "hardhat",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // Dumb one, mock doesn't care what we pass
        callbackGasLimit: "500000",
    },
}

const developmentChains = ["hardhat", "localhost"]

const nftVariables = {
    mintFee: ethers.utils.parseEther("0.01"),
    ipfsGateway: "https://gateway.pinata.cloud/ipfs/",
}

const UPDATE_FRONTEND = true

module.exports = {
    networkConfig,
    developmentChains,
    nftVariables,
    UPDATE_FRONTEND,
}
