// This file holds contracts ABI, Address and Default Gas for contract execution.

var ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'jMap',
    outputs: [
      {
        name: 'jName',
        type: 'bytes32'
      },
      {
        name: 'jAdd',
        type: 'address'
      },
      {
        name: 'jURL',
        type: 'string'
      },
      {
        name: 'jState',
        type: 'uint8'
      },
      {
        name: 'totalPublications',
        type: 'uint256'
      },
      {
        name: 'jImpactFactor',
        type: 'uint8'
      },
      {
        name: 'pubKey',
        type: 'bytes32'
      },
      {
        name: 'priceForOAPublication',
        type: 'uint256'
      },
      {
        name: 'priceForOtherPublication',
        type: 'uint256'
      },
      {
        name: 'subPrice',
        type: 'uint256'
      },
      {
        name: 'reputationScore',
        type: 'uint256'
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
        type: 'bytes32'
      }
    ],
    name: 'paperMap',
    outputs: [
      {
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'OAchoice',
        type: 'uint8'
      },
      {
        name: 'authorIDhashed',
        type: 'bytes32'
      },
      {
        name: 'authorsNamesHashed',
        type: 'bytes32'
      },
      {
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        name: 'paperIPFShash',
        type: 'bytes32'
      },
      {
        name: 'suppleFileIPFShash',
        type: 'bytes32'
      },
      {
        name: 'paperToJAdd',
        type: 'address'
      },
      {
        name: 'journalName',
        type: 'bytes32'
      },
      {
        name: 'pState',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getAmtAccrued',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'countOpenAccessPublications',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      }
    ],
    name: 'pushPaperForReview',
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
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        name: 'paperHashPrv',
        type: 'bytes32'
      },
      {
        name: 'paperHashNew',
        type: 'bytes32'
      },
      {
        name: 'paperIPFSHash',
        type: 'bytes32'
      }
    ],
    name: 'createPublication',
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
    constant: true,
    inputs: [],
    name: 'stateOfPaper',
    outputs: [
      {
        name: '',
        type: 'uint8'
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
        type: 'bytes32'
      }
    ],
    name: 'paymentStatus',
    outputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'paidOrNot',
        type: 'uint8'
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
        type: 'bytes32'
      }
    ],
    name: 'rpaperToIPFSlink',
    outputs: [
      {
        name: 'jAdd',
        type: 'address'
      },
      {
        name: 'IPFShash',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOpenAccesspapers',
    outputs: [
      {
        name: '',
        type: 'bytes32[]'
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
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        name: 'authorsNamesHashed',
        type: 'bytes32'
      },
      {
        name: 'authorIDhashed',
        type: 'bytes32'
      }
    ],
    name: 'proveAuthorship',
    outputs: [
      {
        name: '',
        type: 'uint8'
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
        type: 'uint256'
      }
    ],
    name: 'openAccessPublishedWorks',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'stateOfJournal',
    outputs: [
      {
        name: '',
        type: 'uint8'
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
    name: 'authorMap',
    outputs: [
      {
        name: 'authorAddress',
        type: 'address'
      },
      {
        name: 'authorNumOfPub',
        type: 'uint256'
      },
      {
        name: 'jVoteCount',
        type: 'uint256'
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
        name: 'jAdd',
        type: 'address'
      }
    ],
    name: 'getAjournalDetail',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      },
      {
        name: '',
        type: 'string'
      },
      {
        name: '',
        type: 'string'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint8'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRegisteredJournals',
    outputs: [
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'address[]'
      },
      {
        name: '',
        type: 'bytes32[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'jAdd',
        type: 'address'
      },
      {
        name: 'amountToPay',
        type: 'uint256'
      }
    ],
    name: 'payForPaperPublication',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'jName',
        type: 'bytes32'
      },
      {
        name: 'jURL',
        type: 'string'
      },
      {
        name: 'jIF',
        type: 'uint8'
      },
      {
        name: 'jOAcost',
        type: 'uint256'
      },
      {
        name: 'jnOAcost',
        type: 'uint256'
      },
      {
        name: 'subPrice',
        type: 'uint256'
      },
      {
        name: 'pubKey',
        type: 'bytes32'
      }
    ],
    name: 'updateJournalDetails',
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
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'IPFShashOfRevNote',
        type: 'bytes32'
      }
    ],
    name: 'pushPaperForRevisionAndReSub',
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
    inputs: [],
    name: 'makeJournalInactive',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'activateJournal',
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
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'paidUserForPaper',
    outputs: [
      {
        name: 'requester',
        type: 'address'
      },
      {
        name: 'voteCount',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'paperIPFSHash',
        type: 'bytes32'
      },
      {
        name: 'userPUbKey',
        type: 'bytes32'
      },
      {
        name: 'amountToPay',
        type: 'uint256'
      }
    ],
    name: 'payToGetRestrictedPaper',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'jAdd',
        type: 'address'
      }
    ],
    name: 'voteUpJreputation',
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
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'ipfsHashOfRejReason',
        type: 'bytes32'
      }
    ],
    name: 'pushPaperForRejection',
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
        name: 'jName',
        type: 'bytes32'
      },
      {
        name: 'jURL',
        type: 'string'
      },
      {
        name: 'jIF',
        type: 'uint8'
      },
      {
        name: 'jOAcost',
        type: 'uint256'
      },
      {
        name: 'jnOAcost',
        type: 'uint256'
      },
      {
        name: 'subPrice',
        type: 'uint256'
      },
      {
        name: 'pubKey',
        type: 'bytes32'
      }
    ],
    name: 'createJournal',
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
    constant: true,
    inputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      }
    ],
    name: 'authorPublicationChoice',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      }
    ],
    name: 'pushPaperForAcceptance',
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
        name: 'hashOfOrigSubpaper',
        type: 'bytes32'
      },
      {
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'paperIPFShash',
        type: 'bytes32'
      },
      {
        name: 'suppleFileIPFShash',
        type: 'bytes32'
      },
      {
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        name: 'authorIDhashed',
        type: 'bytes32'
      },
      {
        name: 'nameOfAuthorHashed',
        type: 'bytes32'
      },
      {
        name: 'jAdd',
        type: 'address'
      },
      {
        name: 'jName',
        type: 'bytes32'
      },
      {
        name: 'authorPubKey',
        type: 'bytes32'
      },
      {
        name: 'pubOption',
        type: 'uint8'
      }
    ],
    name: 'submitPaper',
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
    constant: true,
    inputs: [
      {
        name: 'authorAddress',
        type: 'address'
      }
    ],
    name: 'retrieveAuthorWorks',
    outputs: [
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'bytes32[]'
      },
      {
        name: '',
        type: 'bytes32[]'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'bytes32[]'
      },
      {
        name: '',
        type: 'bytes32[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'paperIPFSHash',
        type: 'bytes32'
      },
      {
        name: 'perUserIPFSencryptedLink',
        type: 'bytes32'
      }
    ],
    name: 'sendToPaidUser',
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
    constant: true,
    inputs: [
      {
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        name: 'authorsNamesHashed',
        type: 'bytes32'
      }
    ],
    name: 'checkPaperStatus',
    outputs: [
      {
        name: '',
        type: 'string'
      },
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
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
        indexed: false,
        name: 'jName',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'jAddress',
        type: 'address'
      },
      {
        indexed: false,
        name: 'jURL',
        type: 'string'
      }
    ],
    name: 'newJournalCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        indexed: false,
        name: 'jURL',
        type: 'string'
      }
    ],
    name: 'paperSubDetails',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'jAddress',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperIPFShash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'suppleFileIPFShash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'userPubKey',
        type: 'bytes32'
      }
    ],
    name: 'journalRecSub',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'title',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'paperIPFShash',
        type: 'bytes32'
      }
    ],
    name: 'publishedOAPaper',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'source',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      }
    ],
    name: 'paymentMade',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'IPFShash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'userPUbKey',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'jAdd',
        type: 'address'
      }
    ],
    name: 'userRequestedPaper',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'paperTitle',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'paperIPFSHash',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'jAdd',
        type: 'address'
      }
    ],
    name: 'restrictedPaperPublished',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'paperIPFSHashReq',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'perUserIPFSencryptedLink',
        type: 'bytes32'
      }
    ],
    name: 'userRequestMet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'jAddress',
        type: 'address'
      },
      {
        indexed: false,
        name: 'origPaperHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'newPaperHash',
        type: 'bytes32'
      }
    ],
    name: 'revisedAndReSubmittedManu',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'revisionNote',
        type: 'bytes32'
      }
    ],
    name: 'noticeOfRevision',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'jName',
        type: 'bytes32'
      }
    ],
    name: 'noticeOfAcceptance',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'submittingAuthor',
        type: 'address'
      },
      {
        indexed: false,
        name: 'paperHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'ipfsHashOfRejReason',
        type: 'bytes32'
      }
    ],
    name: 'rejectionNotice',
    type: 'event'
  }
]

var contractAddress = '0x3A04805998CDE6f2A8075BEa45744857909e49b5'

var suppliedGas = 6700000

export { ABI, contractAddress, suppliedGas }
