pragma solidity ^0.5.7;
// A Smart Contract to allow for for updated covid-19 test results and vaccination as proof of concept.
// Contract begins. 
contract coronaVirusTnV{
    // Structs to be used in the contract.
    struct personStruct{
        address personAddress; // Blockchain address of person.
        string IPFShash; // IPFS hash of encrypted covid Digital records (EcDR).
        bytes32 hashOfEncCovDigRec; // Hash of the EcDR
        string tStatus; // Covid-19 Test status.
        string vStatus; // Covid-19 vaccination status
        string signature; // Signature generated from the IPFShash as message.
    }
    struct approvedHF{
        string AHF_name;
        address AHF_address;
    }
    // Global state variables.
    address[] internal approvedHealthFacilities; // To hold address of Approved health facilities.
    address contractDeployer; // Contract deployer like ministry of Health or CDC.
    // Public mappings.
    mapping (address => personStruct) public person; //Mapping for persons.
    mapping (address => approvedHF)  public approvedHC; // Mapping for approved health facilities.
    // Events begin.
    event onboarded(address indexed txInitiator, string tStatus, string vStatus);
    event personUpdated(address indexed txInitiator,string tStatus,string vStatus);
    event approvedHFdone(string nameOfappHealthFac, address addOfAHF);
    
    // Constructor for the contract.
    constructor() public {
        contractDeployer = msg.sender;
    }
    //Creating an access modifier for contractDeployer
    modifier deployer {
     require(msg.sender == contractDeployer);
     _;
     }
    //Public Function to register an approved health facility.
    function registerHealthFacility(string memory AHF_name,address AHF_address) deployer public returns (bool){
        approvedHC[AHF_address].AHF_address = AHF_address;
        approvedHC[AHF_address].AHF_name = AHF_name;
        approvedHealthFacilities.push(AHF_address);
        emit approvedHFdone(AHF_name, AHF_address); // Emit event on creation of approved Health facility. 
        return true;
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
    // Function to onboard person.
    function personOnboarding(address personAddress, string memory IPFShash,bytes32 hashOfEncCovDigRec, string memory tStatus, string memory vStatus, string memory signature) public returns (bool){
        // AA checks.
        if (verifyInclusiveness(msg.sender,approvedHealthFacilities)==1){ // Check msg.sender is part of approvedHealthFacilities.
            person[personAddress].personAddress = personAddress;
            person[personAddress].IPFShash = IPFShash;
            person[personAddress].hashOfEncCovDigRec = hashOfEncCovDigRec;
            person[personAddress].tStatus = tStatus;
            person[personAddress].vStatus = vStatus;
            person[personAddress].signature = signature;
            emit onboarded(msg.sender, tStatus, vStatus);
            return true;
        }
        else {
            return false;
        }
        
    }
    //  Fucntion to update a person's Covid-19 test status by an approvedHealthFacility.
    function updatePersonTestStatus(address personAddress, string memory IPFShash_new, bytes32 hashOfEncCovDigRec_new, string memory tStatus_new, string memory vStatus_new, string memory signature_new) public returns (bool){
        // AA checks.
        require (verifyInclusiveness(msg.sender,approvedHealthFacilities)==1);// Check msg.sender is part of approvedHealthFacilities.
        // Update person records
        person[personAddress].IPFShash = IPFShash_new;
        person[personAddress].hashOfEncCovDigRec = hashOfEncCovDigRec_new;
        person[personAddress].tStatus = tStatus_new;
        person[personAddress].vStatus = vStatus_new;
        person[personAddress].signature = signature_new;
        emit onboarded(msg.sender, tStatus_new, vStatus_new);
        return true;
    }
    // Function for status verification.
    // Check possibility of removing personAddress and using the resultant address from signature verification. Check out ecrecover.--> Incurs cost.
    function verifyPersonStatus(address personAddress, string memory IPFShash, bytes32 hashOfEncCovDigRec, string memory signature) public view returns (string memory, string memory) {
        // Check signature matches onchain signature to confirm ownership of the address.
        require (keccak256(abi.encodePacked(person[personAddress].signature)) == keccak256(abi.encodePacked(signature)));
        // Address belongs to Person hence proceed.
        personStruct memory ps = person[personAddress];
        if (keccak256(abi.encodePacked(ps.IPFShash))==keccak256(abi.encodePacked(IPFShash)) && ps.hashOfEncCovDigRec==hashOfEncCovDigRec){
            return (ps.tStatus,ps.vStatus);
        }
        else {
            return ("Sorry!","You failed verification checks");
        }
    }
}