// bufferConvert.js file to convert input string to buffer.
// IPFS conversion.
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var ALPHABET_MAP = {}
for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i
}
var BASE = 58

function encode (buffer) {
  if (buffer.length === 0) return ''

  var i; var j; var digits = [0]
  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] <<= 8

    digits[0] += buffer[i]

    var carry = 0
    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry

      carry = (digits[j] / BASE) | 0
      digits[j] %= BASE
    }

    while (carry) {
      digits.push(carry % BASE)

      carry = (carry / BASE) | 0
    }
  }

  // deal with leading zeros
  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0)

  // convert digits to a string
  var stringOutput = ''
  for (i = digits.length - 1; i >= 0; i--) {
    stringOutput = stringOutput + ALPHABET[digits[i]]
  }
  return stringOutput
}

export function getIPFSstring (bytes32Hex) {
// Add default ipfs values for first 2 bytes: function:0x12=sha2, size:0x20=256 bits and cut off leading "0x"
  var hashHex = '1220' + bytes32Hex.slice(2)
  var hashBytes = Buffer.from(hashHex, 'hex')
  var convertedBacktoIPFSstring = encode(hashBytes)
  // console.log('IPFS string is: ', convertedBacktoIPFSstring)
  return convertedBacktoIPFSstring
}
