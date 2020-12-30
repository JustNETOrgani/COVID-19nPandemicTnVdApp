// This file holds contracts ABI, Address and Default Gas for contract execution.

var ABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'personAddress',
        type: 'address'
      },
      {
        name: 'IPFShash',
        type: 'string'
      },
      {
        name: 'hashOfEncCovDigRec',
        type: 'bytes32'
      },
      {
        name: 'tStatus',
        type: 'string'
      },
      {
        name: 'vStatus',
        type: 'string'
      },
      {
        name: 'signature',
        type: 'string'
      }
    ],
    name: 'personOnboarding',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'AHF_name',
        type: 'string'
      },
      {
        name: 'AHF_address',
        type: 'address'
      }
    ],
    name: 'registerHealthFacility',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'personAddress',
        type: 'address'
      },
      {
        name: 'IPFShash_new',
        type: 'string'
      },
      {
        name: 'hashOfEncCovDigRec_new',
        type: 'bytes32'
      },
      {
        name: 'tStatus_new',
        type: 'string'
      },
      {
        name: 'vStatus_new',
        type: 'string'
      },
      {
        name: 'signature_new',
        type: 'string'
      }
    ],
    name: 'updatePersonTestStatus',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'txInitiator',
        type: 'address'
      },
      {
        indexed: true,
        name: 'tStatus',
        type: 'string'
      },
      {
        indexed: true,
        name: 'vStatus',
        type: 'string'
      }
    ],
    name: 'onboarded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'txInitiator',
        type: 'address'
      },
      {
        indexed: true,
        name: 'tStatus',
        type: 'string'
      },
      {
        indexed: true,
        name: 'vStatus',
        type: 'string'
      }
    ],
    name: 'personUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'nameOfappHealthFac',
        type: 'string'
      }
    ],
    name: 'approvedHFdone',
    type: 'event'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'approvedHC',
    outputs: [
      {
        name: 'AHF_name',
        type: 'string'
      },
      {
        name: 'AHF_address',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'person',
    outputs: [
      {
        name: 'personAddress',
        type: 'address'
      },
      {
        name: 'IPFShash',
        type: 'string'
      },
      {
        name: 'hashOfEncCovDigRec',
        type: 'bytes32'
      },
      {
        name: 'tStatus',
        type: 'string'
      },
      {
        name: 'vStatus',
        type: 'string'
      },
      {
        name: 'signature',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'personAddress',
        type: 'address'
      },
      {
        name: 'IPFShash',
        type: 'string'
      },
      {
        name: 'hashOfEncCovDigRec',
        type: 'bytes32'
      },
      {
        name: 'signature',
        type: 'string'
      }
    ],
    name: 'verifyPersonStatus',
    outputs: [
      {
        name: '',
        type: 'string'
      },
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

var contractAddress = '0x3a04805998cde6f2a8075bea45744857909e49b5'

var suppliedGas = 3000000

export { ABI, contractAddress, suppliedGas }
