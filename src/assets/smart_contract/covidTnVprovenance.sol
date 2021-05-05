// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
// A Smart Contract to allow for for updated covid-19 test results and vaccination as proof of concept.
// Contract begins. 
contract coronaVirusTnV{
    // Structs to be used in the contract.
    struct personStruct{
        address personAddress; // Blockchain address of person.
        bytes32 HID; // Hashed Identifier of user.
        bytes32 hashOfEncCovDigRec; // Hash of the EcDR
        bytes32 hIPFShash; // Hash of the IPFS hash. // Delinks on-chain connection to IPFS.
        bytes32 covidTnVStatus; // Contains Merkle root hash. 
        string signature; // Signature generated from the IPFShash as message.
    }
    struct personhEcDRnAddrLkup{
        bytes32 hashOfEncCovDigRec; // Hash of the EcDR
        bytes32 HID; // Hashed Identifier of user.
    }
    struct approvedHF{
        string AHF_name;
        address AHF_address;
    }
    // Global state variables.
    address[] internal approvedHealthFacilities; // To hold address of Approved Health facilities (AHFs).
    address contractDeployer; // Contract deployer like Ministry of Health or CDC.
    // Public mappings.
    mapping (bytes32 => personStruct) internal person; //Mapping for persons.
    mapping (bytes32 => personhEcDRnAddrLkup)  internal personLookup; // Mapping for person lookup based on hEcDR. To be used to "blind verifiers"
    mapping (address => approvedHF)  public approvedHC; // Mapping for approved health facilities.
    // Events begin.
    event onboarded(address indexed txInitiator, bytes32 HID);
    event personUpdated(address indexed txInitiator,bytes32 HID);
    event approvedHFdone(string nameOfappHealthFac, address addOfAHF);
    
    // Constructor for the contract.
    constructor() {
        contractDeployer = msg.sender;
    }
    //Creating an access modifier for contractDeployer
    modifier deployer {
     require(msg.sender == contractDeployer);
     _;
     }
    // Function to run checks on membership of approved health facilities. 
    function verifyInclusiveness(address hAddress, address[] memory addressesArray) internal pure returns (uint8){
        for(uint256 i = 0; i < addressesArray.length; i++){ // AHFs within a jurisdiction are finite so still ok.
            if (addressesArray[i] == hAddress){               
              return 1;
            }
         }      
        return 0;
        }
    //Public Function to register an approved health facility.
    function registerHealthFacility(string memory AHF_name,address AHF_address) deployer public returns (bool){
        approvedHC[AHF_address].AHF_address = AHF_address;
        approvedHC[AHF_address].AHF_name = AHF_name;
        approvedHealthFacilities.push(AHF_address);
        emit approvedHFdone(AHF_name, AHF_address); // Emit event on creation of approved Health facility. 
        return true;
    }
    // Function to onboard person.
    function personOnboarding(address personAddress, bytes32 HID, bytes32 hashOfEncCovDigRec, bytes32 hIPFShash, bytes32 covidTnVStatus, string memory signature) public returns (bool result){
        // AA checks.
        require (verifyInclusiveness(msg.sender,approvedHealthFacilities)==1, 'Access denied');// Check msg.sender is part of approvedHealthFacilities.
        person[HID].personAddress = personAddress;
        person[HID].HID = HID;
        person[HID].hashOfEncCovDigRec = hashOfEncCovDigRec;
        person[HID].hIPFShash = hIPFShash;
        person[HID].covidTnVStatus = covidTnVStatus;
        person[HID].signature = signature;
        personLookup[hashOfEncCovDigRec].hashOfEncCovDigRec = hashOfEncCovDigRec;
        personLookup[hashOfEncCovDigRec].HID = HID;
        emit onboarded(msg.sender, HID);
        return true;
    }
    //  Fucntion to update a person's Covid-19 test status by an approvedHealthFacility.
    function updatePersonData(address personAddress, bytes32 HID, bytes32 hashOfEncCovDigRec_new,  bytes32 hIPFShash, bytes32 covidTnVStatus, string memory signature_new) public returns (bool result){
        // AA checks.
        require (verifyInclusiveness(msg.sender,approvedHealthFacilities)==1, 'Access denied');// Check msg.sender is part of approvedHealthFacilities.
        require(person[HID].HID == HID, 'Invalid Hashed Identifier');
        require (person[HID].personAddress == personAddress, "Address mismatch");
        // Update person records
        person[HID].hashOfEncCovDigRec = hashOfEncCovDigRec_new;
        person[HID].hIPFShash = hIPFShash;
        person[HID].covidTnVStatus = covidTnVStatus;
        person[HID].signature = signature_new;
        personLookup[hashOfEncCovDigRec_new].hashOfEncCovDigRec = hashOfEncCovDigRec_new;
        personLookup[hashOfEncCovDigRec_new].HID = HID;
        emit personUpdated(msg.sender, HID);
        return true;
    }
    // Function for status verification.
    // Check possibility of removing personAddress and using the resultant address from signature verification. Check out ecrecover.--> Incurs cost.
    function verifyPersonStatus(bytes32 hIPFShash, bytes32 hashOfEncCovDigRec, bytes32 covidTnVStatus, string memory signature) public view returns (bool) {
        bytes memory sigBytes = bytes(signature);
        if (sigBytes.length == 0) {
            personStruct memory ps = person[personLookup[hashOfEncCovDigRec].HID];
            require (ps.hIPFShash==hIPFShash);
            require (ps.covidTnVStatus==covidTnVStatus, 'Test or vaccination status mismatch');
            require (ps.hashOfEncCovDigRec==hashOfEncCovDigRec, 'Encrypted Covid Record mismatch');
            return true;
        }
        else {
            // Person is verifying via Signature
            // Check signature matches on-chain signature to confirm ownership of the address.
            require (keccak256(abi.encodePacked(person[personLookup[hashOfEncCovDigRec].HID].signature)) == keccak256(abi.encodePacked(signature)), 'Signature mismatch');
            personStruct memory ps = person[personLookup[hashOfEncCovDigRec].HID];
            require (ps.hIPFShash==hIPFShash);
            require (ps.covidTnVStatus==covidTnVStatus, 'Test or vaccination status mismatch');
            return true;   
        }
    }
}