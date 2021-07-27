// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract TosNFT {

    uint256 _tokenIds;
    address payable private deployWallet;
    string public name = "TOSshop";
    string public symbol = "TOSS";
    
    struct Item {
        uint256 id;
        address creator;
        string uri;
    }
    
    mapping(uint256 => Item) private Items;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    modifier onlyOwner() {
        require(msg.sender == deployWallet);
        _;
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }
    
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }
    
    function _beforeTokenTransfer(address from,address to,uint256 tokenId) internal virtual {}
    
    function balanceOf(address owner) public view virtual returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }
    
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
    
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;
    }
    
    function getLastID() public view returns (uint256) {
        return _tokenIds;
    }

    function mintItem(string memory uri) public onlyOwner returns (uint256) {
        unchecked {
            _tokenIds += 1;
        }
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        Items[newItemId] = Item(newItemId, msg.sender, uri);
        
        return newItemId;
    }
    
    function buyItem(uint256[] memory tokenIds, string[] memory newURI) public payable{
        
        for(uint i=0; i<tokenIds.length; i++){
            _transfer(payable(deployWallet), payable(msg.sender), tokenIds[i]);
            Items[tokenIds[i]].uri = newURI[i];
        }
        
        require(msg.sender != address(0));
        uint256 etherUsed = msg.value;
        require(etherUsed > 0);
        payable(deployWallet).transfer(etherUsed);
        
    }

    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }
    
    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, toString(tokenId))) : "";
    }
    
    
    constructor(string memory name_, string memory symbol_) {
        name_ = name;
        symbol_ = symbol;
        deployWallet = payable(address(msg.sender));
    }
}