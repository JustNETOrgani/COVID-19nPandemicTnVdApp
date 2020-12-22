// base58 Global declarations.
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var ALPHABET_MAP = {}
for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i
}
var BASE = 58

// Decoder function to convert IPFS returned hash to bytes.
function decode (string) {
  if (string.length === 0) return []

  var i; var j; var bytes = [0]
  for (i = 0; i < string.length; i++) {
    var c = string[i]
    if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
    bytes[0] += ALPHABET_MAP[c]

    var carry = 0
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry

      carry = bytes[j] >> 8
      bytes[j] &= 0xff
    }

    while (carry) {
      bytes.push(carry & 0xff)

      carry >>= 8
    }
  }

  // deal with leading zeros
  for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)

  return bytes.reverse()
}

function convertIPFSstringToBytes (IPFSstring) {
  const theBuffer = decode(IPFSstring).slice(2)
  return '0x' + Array.prototype.map.call(new Uint8Array(theBuffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

export default convertIPFSstringToBytes
