// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

error NotOwner();
error NotEnoughFunds();
error DomainIsOwned();
error NotValidID();

contract ETHDaddy is ERC721 {
    uint256 public totalDomains;
    address public owner;
    address totalSupply;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }
    
    mapping(uint256 => Domain) public domains;

    constructor(string memory _name, string memory _symbol) ERC721(_name,_symbol) {
        owner = msg.sender;

    }

    function list(string memory _name, uint256 _cost) public {
        if(msg.sender != owner) revert NotOwner();
        totalDomains++;
        //model domain
        domains[totalDomains] = Domain(_name, _cost, false);

        //save domain
        //update total domain count

    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }
    function mint (uint256 _id) public payable {
        if(domains[_id].isOwned) revert DomainIsOwned();
        if(msg.value < domains[_id].cost) revert NotEnoughFunds();
        _safeMint(msg.sender, _id);
        domains[_id].isOwned = true;    
    }
    // function buyDomain()
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    function withdraw() public {
        if(msg.sender != owner) revert NotOwner();
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    }

}
