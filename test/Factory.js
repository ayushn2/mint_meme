const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const {expect} =  require("chai")
const {ethers} = require("hardhat")

// Testing the contract "Factory"
describe("Factory", function () {

    const FEE  = ethers.parseUnits("0.01",18)//converts decimal into wei (non decimal), and convert it into 18 decimal places

 

    async function deployFactoryFixture(){
        // Fetch accounts
        const [deployer] = await ethers.getSigners()

        // Fetch the contract : load the contract in JavaScript
         const Factory = await ethers.getContractFactory("Factory")
         // Deploy the contract 
         const factory = await Factory.deploy(FEE) // When contract is deployed constructor is called
        
         return { factory, deployer}
    }

    describe("Deployment", function(){
        it("Should set the right fee", async function(){
            const {factory} = await deployFactoryFixture()
            expect(await factory.fee()).to.equal(FEE)
        })

        it("Should set the owner", async function(){
            const {factory,deployer} = await deployFactoryFixture()
            expect(await factory.owner()).to.equal(deployer.address)
        })
})
})