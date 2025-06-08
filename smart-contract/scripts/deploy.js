const hre = require('hardhat');

async function main() {
    const Stackup = await hre.ethers.getContractFactory('StackUp')

    console.log('Deploying...', typeof Stackup)
    const stackup = await Stackup.deploy();

    console.log('Waiting for deployment...', typeof stackup)


    await stackup.waitForDeployment();

    const address = await stackup.getAddress();

    console.log("Stackup deployed to:", address)

    let adminAddr = await stackup.admin()
    console.log("admin address:", adminAddr);

    await stackup.createQuest("Introduction to Hardhat", 2, 600);
    await stackup.createQuest("Unit Testing with Hardhat", 4, 500);
    await stackup.createQuest("Debugging and Deploying with Hardhat", 5, 500);
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
