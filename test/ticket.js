const { expect } = require("chai");
const { ethers } = require("hardhat");

const testURI = "ipfs://SOME_HASH_SHIT";
const FIRST_TICKET = 1;

let Ticket;
let ticket;
let owner;
let notowner;
describe("Ticket shit", function () {
  beforeEach(async function () {
    Ticket = await ethers.getContractFactory("TicketMaster");
    ticket = await Ticket.deploy(100, testURI);
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
});
