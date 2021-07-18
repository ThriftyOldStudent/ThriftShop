// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
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
    
    address payable public deployWallet;

    function mintItem(string memory uri) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);
        emit ItemMinted(newItemId, msg.sender, uri, msg.sender);
        return newItemId;
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function burnItem(uint256 tokenId) public onlyOwner{
        _burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return Items[tokenId].uri;
    }
    
    function _transfer(address from,address to,uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        emit ItemTransferred(from, to, tokenId);
    }
    
    function buyItems(uint256 tokenId) public payable{
        address payable nft_Wallet = payable(deployWallet);
        require(msg.sender != address(0));
        require(ownerOf(tokenId) == nft_Wallet);
        uint256 etherUsed = msg.value;
        require(etherUsed > 0);
        
        _approve(payable(msg.sender), tokenId);
        safeTransferFrom(nft_Wallet,msg.sender,tokenId);
        payable(nft_Wallet).transfer(etherUsed);
    }
    
    constructor() ERC721("TOSshop", "TOSS") {
        deployWallet = payable(address(msg.sender));
    }
}