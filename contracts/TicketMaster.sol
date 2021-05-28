//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketMaster is ERC721, ERC721URIStorage, Ownable {
    // This is just a convenient and safe way to count up
    // Each ticket/token will have an id +1 from the last,
    // which we will just reference with _id
    using Counters for Counters.Counter;
    Counters.Counter private _id;

    mapping(uint256 => bool) booped;

    event TicketCreated(address indexed _recipient, uint256 _ticketId);

    // The constructor uses the ERC721(NFT) interface from the library I imported above
    //    -  Openzeppelin is a convenient way to use smart contract interfaces that have been heavily
    //       audited, so you care less about low level behaviors fucking your shit up
    //    -  I just pass in the ERC721 interface with the name I want and the symbol for the token
    //       which is how it will appear publically on chain -- you can literally name it anything
    constructor() ERC721("Ticketmaster", "TM") {}

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function createTicket(address _recipient, string memory _ticketURI)
        public
        onlyOwner
    {
        _id.increment(); // add one to the id, starting at 0, so our first ticket id is 1
        uint256 _newTicketId = _id.current(); // grab the current id for the ticket we are creating
        _mint(_recipient, _newTicketId); // _mint comes from the ERC721(NFT) interface that we imported from openzeppelin, it creates the ticket
        _setTokenURI(_newTicketId, _ticketURI); // this will set the metadata for the ticket, this way we can just store the id on chain and all other content else where. we do this because storing large chunks of data onchain is expensive
        emit TicketCreated(_recipient, _newTicketId); // this just creates an event that we can listen to on the frontend or somewhere else if we want to react to the creation of a ticket
    }

    function boopTicket(uint256 _ticketId, string memory _boopURI)
        public
        onlyOwner
    {
        booped[_ticketId] = true;
        _setTokenURI(_ticketId, _boopURI);
    }
}
