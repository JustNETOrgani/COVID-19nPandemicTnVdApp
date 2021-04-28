// This file holds contracts ABI, Address and Default Gas for contract execution.

var ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'nameOfappHealthFac',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'addOfAHF',
        type: 'address'
      }
    ],
    name: 'approvedHFdone',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'txInitiator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'ipfsHash',
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
        internalType: 'address',
        name: 'txInitiator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string'
      }
    ],
    name: 'personUpdated',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'approvedHC',
    outputs: [
      {
        internalType: 'string',
        name: 'AHF_name',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'AHF_address',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'personAddress',
        type: 'address'
      },
      {
        internalType: 'bytes32',
        name: 'HID',
        type: 'bytes32'
      },
      {
        internalType: 'string',
        name: 'IPFShash',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: 'hashOfEncCovDigRec',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'covidTnVStatus',
        type: 'bytes32'
      },
      {
        internalType: 'string',
        name: 'signature',
        type: 'string'
      }
    ],
    name: 'personOnboarding',
    outputs: [
      {
        internalType: 'bool',
        name: 'result',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'AHF_name',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'AHF_address',
        type: 'address'
      }
    ],
    name: 'registerHealthFacility',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'HID',
        type: 'bytes32'
      },
      {
        internalType: 'string',
        name: 'IPFShash_new',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: 'hashOfEncCovDigRec_new',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'covidTnVStatus',
        type: 'bytes32'
      },
      {
        internalType: 'string',
        name: 'signature_new',
        type: 'string'
      }
    ],
    name: 'updatePersonTestStatus',
    outputs: [
      {
        internalType: 'bool',
        name: 'result',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'IPFShash',
        type: 'string'
      },
      {
        internalType: 'bytes32',
        name: 'hashOfEncCovDigRec',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'covidTnVStatus',
        type: 'bytes32'
      },
      {
        internalType: 'string',
        name: 'signature',
        type: 'string'
      }
    ],
    name: 'verifyPersonStatus',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

var contractAddress = '0x1Bba9445114488422f7794aBC56F0b0436cEFF9a'

var suppliedGas = 3000000

export { ABI, contractAddress, suppliedGas }
