import ethUtil from 'ethereumjs-util'
import Web3 from 'web3'

function signByAHP (data, accountToUse) {
  var msg = ethUtil.bufferToHex(Buffer.from(data, 'utf8'))
  var from = accountToUse
  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msg, from]
  var method = 'personal_sign'

  window.web3 = new Web3(window.ethereum)

  window.web3.currentProvider.sendAsync({
    method,
    params,
    from
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) return console.error(result.error)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))
  })
}

export default signByAHP
