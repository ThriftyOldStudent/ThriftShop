// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract TosNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct Item {
        uint256 id;
        address creator;
        string uri;
    }
    
    event ItemMinted(
        uint256 tokenId,
        address creator,
        string uri,
        address owner
    );
    
    event ItemTransferred(address from, address to, uint256 tokenId);
    mapping(uint256 => Item) public Items;

    

    function mintItem(string memory uri) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);
        emit ItemMinted(newItemId, msg.sender, uri, msg.sender);

        return newItemId;
    }
    
    function mintItemLoop(string memory BaseUri, uint256 TotalNum) public onlyOwner returns (uint256) {
        uint256 totItemId;
        string memory UriGen;
        
        for(uint256 i=0; i<TotalNum; i++){
            UriGen = string(abi.encodePacked(BaseUri,i.toString(),".jpeg"));
            totItemId = mintItem(UriGen);
        }
    
        return totItemId;
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return Items[tokenId].uri;
    }
    
    function _transfer(address from,address to,uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        emit ItemTransferred(from, to, tokenId);
    }
    
    constructor(string memory name, string memory symbol) ERC721("TOSshop", "TOSS") {}
}