# ticketmasters

## Before anything...

you will need to have npm and node installed on your masheen
https://nodejs.org/en/download/

I think if you install node you will get npm for free, but I always forget

## Setup for testing

step 1, install dependences:
`npm i`

step 2, run tests
`npx hardhat test`

if that all works then you are setup

## Cool files

`contracts/Ticket.sol`
This is the Solidity smart contract that produces the NFT Tickets

`test/ticket.js`
This file has the tests that are run on `npx hardhat test`
