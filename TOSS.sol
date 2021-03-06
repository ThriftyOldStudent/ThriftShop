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
    Counters.Counter public _tokenIds;
    
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
    
    function getLastID() public view returns (uint256) {
        uint256 curTokId = _tokenIds.current();
        return curTokId;
    }

    function mintItem(string memory uri) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);
        emit ItemMinted(newItemId, msg.sender, uri, msg.sender);
        
        address payable nft_Wallet = payable(deployWallet);
        require(msg.sender != address(0));
        uint256 etherUsed = msg.value;
        require(etherUsed > 0);
        payable(nft_Wallet).transfer(etherUsed);
        
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
    
    constructor() ERC721("TOSshop", "TOSS") {
        deployWallet = payable(address(msg.sender));
    }
}