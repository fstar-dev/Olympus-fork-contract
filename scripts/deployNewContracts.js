const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const firstEpochNumber = "550";
    const firstBlockNumber = "9505000";
    const Authority = await ethers.getContractFactory("OlympusAuthority");
    const authority = await Authority.deploy(
        deployer.address,
        deployer.address,
        deployer.address,
        deployer.address
    );

    const OHM = await ethers.getContractFactory("OlympusERC20Token");
    const ohm = await OHM.deploy(authority.address);

    const OlympusTreasury = await ethers.getContractFactory("OlympusTreasury");
    const olympusTreasury = await OlympusTreasury.deploy(ohm.address, "0", authority.address);

    const SOHM = await ethers.getContractFactory("sOlympus");
    const sOHM = await SOHM.deploy();

    const GOHM = await ethers.getContractFactory("gOHM");
    const gOHM = await GOHM.deploy(sOHM.address);

    const OlympusStaking = await ethers.getContractFactory("OlympusStaking");
    const staking = await OlympusStaking.deploy(
        ohm.address,
        sOHM.address,
        gOHM.address,
        "2200",
        firstEpochNumber,
        firstBlockNumber,
        authority.address
    );

    const Distributor = await ethers.getContractFactory("Distributor");
    const distributor = await Distributor.deploy(
        olympusTreasury.address,
        ohm.address,
        staking.address,
        authority.address
    );

    await sOHM.setIndex("7675210820");
    await sOHM.setgOHM(gOHM.address);
    await sOHM.initialize(staking.address, olympusTreasury.address);

    console.log("OHM: " + ohm.address);
    console.log("Olympus Treasury: " + olympusTreasury.address);
    console.log("Staked Olympus: " + sOHM.address);
    console.log("Staking Contract: " + staking.address);
    console.log("Distributor: " + distributor.address);
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
