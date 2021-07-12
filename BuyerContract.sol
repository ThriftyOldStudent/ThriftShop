// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


/*
 * @dev Simple minimal forwarder to be used together with an ERC2771 compatible contract. See {ERC2771Context}.
 */
contract StorageContract{

    struct User {
        string email;
        string phone;
        string userName;
        string deliveryAdds;
        string specialNotes;
        string paymentHash;
    }

    mapping(address=>User) mappingToUser;

    address[] public ContractsAdresses;

    function savePersonalInfo_1(
        string calldata Name, 
        string calldata Email, 
        string calldata Phone,
        address Addr) internal {
        mappingToUser[Addr].email = Email;
        mappingToUser[Addr].userName = Name;
        mappingToUser[Addr].phone = Phone;
    }
    
    function savePersonalInfo_2(
        string calldata Delivery_Address,
        string calldata Special_Notes,
        string calldata Payment_Hash,
        address Addr) internal {
        mappingToUser[Addr].deliveryAdds = Delivery_Address;
        mappingToUser[Addr].specialNotes = Special_Notes;
        mappingToUser[Addr].paymentHash = Payment_Hash;
    }
    
    function savePersonalInfo(
        string calldata All_Info_1,
        string calldata All_Info_2,
        address Addr) public {
        
        string calldata Name = All_Info_1; 
        string calldata Email = All_Info_1; 
        string calldata Phone = All_Info_1;
        string calldata Delivery_Address = All_Info_2;
        string calldata Special_Notes = All_Info_2;
        string calldata Payment_Hash = All_Info_2;
        savePersonalInfo_1(Name,Email,Phone,Addr);
        savePersonalInfo_2(Delivery_Address,Special_Notes,Payment_Hash,Addr);
        ContractsAdresses.push(Addr);
    }
}
