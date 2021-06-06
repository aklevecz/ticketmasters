const { expect } = require("chai");
const { ethers } = require("hardhat");

const testURI = "ipfs://SOME_HASH_SHIT";
const testBoopURI = "testBoop";
const FIRST_TICKET = 1;
const SECOND_TICKET = 2;

let Ticket;
let ticket;
let owner;
let notowner;
describe("Ticket shit", function () {
  beforeEach(async function () {
    Ticket = await ethers.getContractFactory("TicketMaster");
    ticket = await Ticket.deploy(1);
    [owner, notowner] = await ethers.getSigners();

    await ticket.deployed();
  });

  it("Should deploy contract with hardcoded name and symbol", async function () {
    expect(await ticket.name()).to.equal("Ticketmaster");
    expect(await ticket.symbol()).to.equal("TM");
  });

  it("Should have an owner", async function () {
    expect(await ticket.owner()).to.equal(owner.address);
  });

  it("Should create a ticket", async function () {
    await ticket.createTicket(owner.address, testURI);
    const ownerOfFirstTicket = await ticket.ownerOf(FIRST_TICKET);
    expect(ownerOfFirstTicket).to.equal(owner.address);
  });

  it("Should assign the total supply of tickets to the owner", async function() {
    const ownerBalance = await ticket.balanceOf(owner.address)
    expect(await ticket.totalSupply()).to.equal(ownerBalance)
  });

  it("Should have the uri we set", async function () {
    await ticket.createTicket(owner.address, testURI);
    const uri = await ticket.tokenURI(FIRST_TICKET);
    expect(uri).to.equal(testURI);
  });

  it("Should not create a ticket sent from not the owner", async function () {
    const wrongTicketSigner = ticket.connect(notowner);
    await expect(
      wrongTicketSigner.createTicket(owner.address, testURI)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should transfer between accounts", async function() {
    await ticket.transferFrom(owner.address, notowner.address, FIRST_TICKET);
    const newOwner = await ticket.ownerOf(FIRST_TICKET)
    expect(newOwner).to.not.equal(owner.address)
    expect(newOwner).to.equal(notowner.address)
  });

  it("Should fail if not enough tickets in supply", async function() {
    await ticket.transferFrom(owner.address, notowner.address, FIRST_TICKET);
    await expect(
      ticket.transferFrom(owner.address, notowner.address, SECOND_TICKET)
    ).to.be.revertedWith("nonexistent token")
    const ownerBalance = await ticket.balanceOf(owner.address);
    expect(ownerBalance).to.equal(0);
  });

  it("Should update supply after transfers", async function() {
    await ticket.transferFrom(owner.address, notowner.address, FIRST_TICKET);
    const ownerBalance = await ticket.balanceOf(owner.address);
    const notOwnerBalance = await ticket.balanceOf(notowner.address);
    expect(ownerBalance).to.equal(0);
    expect(notOwnerBalance).to.equal(1);
  });

  it("Should be booped", async function() {
    const uri = await ticket.tokenURI(FIRST_TICKET);
    await ticket.boopTicket(FIRST_TICKET, testBoopURI);
    const newURI = await ticket.tokenURI(FIRST_TICKET);
    expect(newURI).to.not.equal(uri);
  });
});
