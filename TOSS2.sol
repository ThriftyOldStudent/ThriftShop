// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TosNFT {

    uint256 _tokenIds;
    address payable private deployWallet;
    string private _name = "TOSshop";
    string private _symbol = "TOSS";
    
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
    
    mapping(uint256 => Item) private Items;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }
    
    function _beforeTokenTransfer(address from,address to,uint256 tokenId) internal virtual {}
    
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        //emit Transfer(address(0), to, tokenId);
    }
    
    function getLastID() public view returns (uint256) {
        return _tokenIds;
    }

    function mintItem(string memory uri) public payable returns (uint256) {
        unchecked {
            _tokenIds += 1;
        }
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);
        emit ItemMinted(newItemId, msg.sender, uri, msg.sender);
        
        address payable nft_Wallet = payable(deployWallet);
        require(msg.sender != address(0));
        uint256 etherUsed = msg.value;
        require(etherUsed > 0);
        payable(nft_Wallet).transfer(etherUsed);
        
        return newItemId;
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return Items[tokenId].uri;
    }
    
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        deployWallet = payable(address(msg.sender));
    }
}