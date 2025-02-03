const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const {expect} =  require("chai")
const {ethers} = require("hardhat")

// Testing the contract "Factory"
describe("Factory", function () {

    const FEE  = ethers.parseUnits("0.01",18)//converts decimal into wei (non decimal), and convert it into 18 decimal places

 

    async function deployFactoryFixture(){
        // Fetch accounts
        const [deployer, creator, buyer] = await ethers.getSigners()

        // Fetch the contract : load the contract in JavaScript
         const Factory = await ethers.getContractFactory("Factory")
         // Deploy the contract 
         const factory = await Factory.deploy(FEE) // When contract is deployed constructor is called
        
        //Create Token
        const transaction = await factory.connect(creator).create("Nainwal Token", "NN", {value:FEE}) // We are passing metadata with this transaction i.e. value, becoz when the creator will run the contract some gas fee will be required which will be FEE
        await transaction.wait() 

        // Get the token address
        const tokenAddress = await factory.tokens(0)
        const token = await ethers.getContractAt("Token", tokenAddress)

         return { factory, token, deployer, creator, buyer}
    }

    async function buyTokenFixture(){
        const {factory, token, creator, buyer} = await deployFactoryFixture()
        const AMOUNT = ethers.parseUnits("10000", 18)
        const COST = ethers.parseUnits("1", 18)

        // Buy tokens
        const transaction = await factory.connect(buyer).buy(await token.getAddress(), AMOUNT, { value : COST})
        await transaction.wait()

        return { factory, token, creator, buyer}
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

    describe("Creating tokens",function(){
        it("Should set the owner", async function(){
            const {factory,token} = await deployFactoryFixture()

            //The token should be owned by factory, the creator lists it
            expect(await token.owner()).to.equal(await factory.getAddress())
        })

        it("Should set the creator", async function(){
            const {token, creator} = await deployFactoryFixture()
            expect(await token.creator()).to.equal(creator.address)
        })

        it("Should set the supply", async function(){
            const {factory, token} = await loadFixture(deployFactoryFixture)

            const totalSupply = ethers.parseUnits("1000000", 18)

            expect(await token.balanceOf(await factory.getAddress())).to.equal(totalSupply)

        })

        it("Should update the ETH balance", async function(){
            const { factory, deployer, creator} = await loadFixture(deployFactoryFixture)

            const balance = await ethers.provider.getBalance(await factory.getAddress())
            
            // Ensuring that the balance of the factory address is equal to the FEE
            expect(balance).to.equal(FEE)
        })

        it("should create the sale", async function(){
            const { factory, deployer, creator, token} = await loadFixture(deployFactoryFixture)

            const count = await factory.totalTokens()
            expect(count).equal(1) 

            const sale = await factory.getTokenSale(0)
            expect(sale.token).equal(await token.getAddress())
        })

    })

    describe("Buying", function(){
        const AMOUNT = ethers.parseUnits("10000", 18)
        const COST = ethers.parseUnits("1", 18)

        // Check that the contract received ETH
        it("Should update the ETH balance", async function(){
            const  { factory } = await loadFixture(buyTokenFixture)
            const balance = await ethers.provider.getBalance(await factory.getAddress())

            expect(balance).to.equal(FEE+COST)
        })

        // Check that buyeer received tokens
        it("Should update token balances", async function(){
            const { factory, buyer, token} = await loadFixture(buyTokenFixture)
            const balance = await token.balanceOf(buyer.address)

            expect(balance).to.equal(AMOUNT)
        })

        it("Should update the token sale", async function(){
            const { factory, buyer, token} = await loadFixture(buyTokenFixture)

            const sale = await factory.tokenToSale(await token.getAddress())

            expect(sale.sold).to.equal(AMOUNT)
            expect(sale.raised).to.equal(COST)
            expect(sale.isOpen).to.equal(true)
        
        })

        it("Should increase base cost", async function(){
            const { factory, token} = await loadFixture(buyTokenFixture)

            const sale = await factory.tokenToSale(await token.getAddress())
            const cost = await factory.getCost(sale.sold)

            expect(cost).to.equal(ethers.parseUnits("0.0002"))
        
        })

})
})