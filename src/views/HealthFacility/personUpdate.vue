<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper" v-loading="loadingPOnboardingPage">
            <h3>Person record update on blockchain</h3>
            <el-row>
                <el-steps :active="active" align-center finish-status="success">
                <el-step title="Step 1" description="Enter and Process data"></el-step>
                <el-step title="Step 2" description="Get Person's signature"></el-step>
                <el-step title="Step 3" description="Get IPFS hash via QR code"></el-step>
                <el-step title="Step 4" description="Anchor in blockchain"></el-step>
                </el-steps>
            </el-row>
            <br>
            <el-row>
                <el-col :span="9">
                    <div class="grid-content bg-purple-dark">
                        <el-form
                            :model="updatePerson"
                            :rules="rules"
                            ref="updatePerson"
                            label-width="145px"
                        >
                            <el-form-item label="Person ID" prop="userID">
                                <el-input v-model="updatePerson.userID" placeholder="Please enter user ID"></el-input>
                            </el-form-item>
                            <el-form-item label="New test status" prop="tStatus">
                                <el-select
                                    v-model="updatePerson.tStatus"
                                    style="width:100%"
                                    placeholder="Select test status">
                                    <el-option label="Positive" value="Positive"></el-option>
                                    <el-option label="Negative" value="Negative"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="New Vacc. status" prop="vStatus">
                                <el-select
                                    v-model="updatePerson.vStatus"
                                    style="width:100%"
                                    placeholder="Select vaccination status">
                                    <el-option label="Not vaccinated" value="Not Vaccinated"></el-option>
                                    <el-option label="Vaccinated" value="vaccinated"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-row>
                              <el-form-item label="**AHP's consent**" prop="authCheckBox">
                                  <el-checkbox v-model="updatePerson.authCheckBox">I understand the implication of this action.</el-checkbox>
                              </el-form-item>
                            </el-row>
                            <el-row>
                                <el-button :disabled='isDisabled' :loading="personOnboardLoadBtn" @click="processFormData('updatePerson')">Process data</el-button>
                                <el-button @click="resetForm('updatePerson')">Reset</el-button>
                            </el-row>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="13" :offset="2">
                    <fieldset>
                        <legend>On-chain data</legend>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p class="computedLabels">Hash of ID:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p id="formattedString_hEcDR">{{HashedID}}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p class="computedLabels">IPFS Hash of EcDR:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p class="formattedString">{{IPFSHashOfhEcDR}}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p class="computedLabels">Person address:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p class="formattedString">{{address}}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p class="computedLabels">Person signature:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p class="formattedString">{{signature_substring}}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="4" :offset="8">
                                <el-button type="info" round :loading="personSigGenLoadBtn" @click="getPersonSig()">Get Person signature</el-button>
                              </el-col>
                            </el-row>
                    </fieldset>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" :loading="submitLoadBtn" @click="anchorOnchain()">Submit to blockchain</el-button>
            </el-row>
        </div>
        <el-dialog
          title="Switch account"
          :visible.sync="accountSwitchDialogVisible"
          width="30%"
          :before-close="handleAccountSwitchDialogClose">
          <span>Allow user to sign IPFS hash</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="accountSwitchDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="accountSwitchDialogVisible = false">Ok</el-button>
          </span>
        </el-dialog>
        <div id="overlay" v-loading="qrCodeLoading">
          <div id="qrCodeGenerated"></div>
          <el-button type="primary" @click="qrCodeDivDisappear()">Done</el-button>
        </div>
    </div>
</template>

<script>
import ethEnabled from '@/assets/js/web3nMetaMask'
import * as signatureGenerator from '@/assets/js/sigHelperFns'
import getMerkleRootFromMkTree from '@/assets/js/getMerkleRootOfData'
import computeIPFShash from '@/assets/js/computeIPFShashBeforeStorage'
import getHash from '@/assets/js/hashFunc'
import web3 from '@/assets/js/web3Only'
import { ABI, contractAddress, suppliedGas } from '@/assets/js/contractABI'
const ipfs = new window.Ipfs()
const qrCode = new window.QRCodeStyling({
  width: 200,
  height: 200,
  data: 'https://github.com/JustNETOrgani',
  image: 'https://user-images.githubusercontent.com/44321289/104082810-0c3de900-5274-11eb-95c1-ace8c24356d4.png',
  dotsOptions: {
    color: '#4267b2',
    type: 'rounded'
  }
})

export default {
  data () {
    return {
      updatePerson: {
        userID: '',
        tStatus: '',
        vStatus: '',
        authCheckBox: false
      },
      // Steps.
      active: 0,
      // Dynamic variables.
      EcDR: '',
      hEcDR: '',
      timeStamp: '',
      IPFSHashOfhEcDR: '',
      hIPFShash: '',
      HashedID: '',
      fullSignature: '',
      signature_substring: '',
      address: '',
      currentEthAddress: '',
      pgAccounts: [],
      personAccount: '',
      pubKeyOfPerson: '',
      AHPkeyGenerated: '',
      sigOfAHP: '',
      mkRoot: '',
      merkeTreeData: [],
      // Loading states
      personOnboardLoadBtn: false,
      loadingPOnboardingPage: true,
      personSigGenLoadBtn: false,
      submitLoadBtn: false,
      qrCodeLoading: false,
      // Account change status.
      accountChangeStatus: false,
      // Dialogs.
      accountSwitchDialogVisible: false,
      qrCodeOfIPFShashDialog: false,
      // Button disable tracker.
      processDataBtnState: false,
      getPersonSigBtnState: false,
      anchorOnBlockBtnState: false,
      rules: {
        userID: [
          { required: true, message: 'Please input center ID', trigger: 'blur' },
          { min: 5, message: 'Length should be at least 5', trigger: 'blur' }
        ],
        tStatus: [
          { required: true, message: 'Please select test status from the list.', trigger: 'blur' }
        ],
        vStatus: [
          { required: true, message: 'Please select vaccination status from the list.', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (!ethEnabled()) {
      this.$message('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!')
    } else {
      this.loadingPOnboardingPage = false
      this.getAccount().then(accounts => {
        this.currentEthAddress = accounts[0]
        this.pgAccounts.push(this.currentEthAddress)
        console.log('Current account: ', this.currentEthAddress)
        this.getPublicKeyOfPerson()
      })
    }
  },
  watch: {
    'currentEthAddress' () {
      this.switchAccount()
    }
  },
  computed: {
    isDisabled: function () {
      return !this.updatePerson.authCheckBox
    }
  },
  methods: {
    switchAccount () {
      var myRoot = this // Ensure all this or vue global variables can be accessed within this fucntion via myRoot.
      window.ethereum.on('accountsChanged', function (accounts) {
        myRoot.personAccount = accounts[0]
        myRoot.pgAccounts.push(accounts[0])
        myRoot.personAccount = accounts[0]
        console.log('Selected account: ', myRoot.personAccount)
        myRoot.$message({
          message: 'Account switched successfully..',
          type: 'success'
        })
        console.log('Account switched')
        myRoot.accountChangeStatus = true
      })
    },
    backToPrvPg () {
      this.$router.push('healthFacIndexPg')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleAccountSwitchDialogClose (done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    processFormData (formName) {
      if (this.processDataBtnState === false) {
        if (this.updatePerson.authCheckBox === true) {
          this.$refs[formName].validate(valid => {
            this.personOnboardLoadBtn = true
            if (valid) {
              var data = {
                userID: this.updatePerson.userID,
                tStatus: this.updatePerson.tStatus,
                vStatus: this.updatePerson.vStatus,
                tTime: Math.round(+new Date() / 1000)// unix timestamp
              }
              this.timeStamp = data.tTime
              console.log('Data: ', data)
              // Access previous records from IPFS.
              this.$prompt('Please input IPFS hash.', 'Information required', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
              }).then(({ value }) => {
                // Valid Public key before proceeding.
                ipfs.cat(value).then(retrievedData => {
                  console.log('Data received from IPFS')
                  var EcDRwithSig = JSON.parse(retrievedData.toString()) // Convert to string and parse as JSON object.
                  console.log('Pulled data: ', EcDRwithSig)
                  // Update it.
                  if (Object.keys(EcDRwithSig).length > 0 && 'timeStamp' in EcDRwithSig) {
                    // Correct IPFS data pulled.
                    // Allow user to decrypt.
                    this.$prompt('Decryption required.', 'Information required', {
                      confirmButtonText: 'OK',
                      cancelButtonText: 'Cancel'
                    }).then(({ value }) => {
                      this.importPrivateKeyAndDecrypt(EcDRwithSig.encryptedData, value).then(decryptedData => {
                        var originalData = JSON.parse(decryptedData.toString())
                        console.log('Decrypted data: ', originalData)
                        // Check userID before performing update
                        if (originalData.userID === data.userID) {
                          // Perform update
                          originalData.tStatus = data.tStatus
                          originalData.vStatus = data.vStatus
                          originalData.tTime = data.tTime
                          // Perform encryption.
                          this.importPubKeyAndEncrypt(JSON.stringify(originalData)).then(encryptedDataRes => {
                            console.log('EcDR: ', encryptedDataRes)
                            this.EcDR = encryptedDataRes
                            // Hash encrypted data---> hEcDR.
                            getHash(this.EcDR).then(res => {
                              this.hEcDR = res
                              // Hash the UserID alone as input to the SC.
                              getHash(data.userID).then(HID => {
                                this.HashedID = HID
                                console.log('Hashed ID: ', this.HashedID)
                                // Prepare data for Merkle Tree.
                                this.merkeTreeData.push(data.tStatus, data.vStatus, this.timeStamp, this.HashedID)
                                // AHP signs hEcDR to get signature. --->AHPsignature
                                this.signatureOfAHP() // Includes push to IPFS.
                              })
                            })
                          })
                        } else {
                          this.personOnboardLoadBtn = false
                          console.log('User ID mismatch.')
                          this.$message.error('Sorry! Mismatch in user ID detected.')
                        }
                      }).catch(err => {
                        this.personOnboardLoadBtn = false
                        console.log('Error decrypting data.', err)
                        this.$message.error('Sorry! Possible wrong decryption key.')
                      })
                    })
                  } else {
                    this.personOnboardLoadBtn = false
                    console.log('Invalid encrypted data from IPFS for Blockcovid.')
                    this.$message.error('Invalid encrypted data from IPFS for Blockcovid.')
                  }
                })
              })
            } else {
              console.log('Submission error.')
              this.personOnboardLoadBtn = false
              return false
            }
          })
        } else {
          this.$message('Please check the checkbox')
        }
      } else {
        this.$message({
          message: 'Sorry! Person data already processed.',
          type: 'warning'
        })
      }
    },
    async getAccount () {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      return accounts
    },
    async getPublicKeyOfPerson () {
      this.$prompt('Please input public key of Person.', 'Information required', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(({ value }) => {
        // Valid Public key before proceeding.
        this.pubKeyOfPerson = value
        console.log('Public key acquired.')
      }).catch((err) => {
        console.log('User has cancelled.', err)
        this.$message.error('Sorry! Public key of person required. Reloading...')
        window.location.reload() // Reload page.
      })
    },
    signatureOfAHP () {
      // eslint-disable-next-line no-return-assign
      signatureGenerator.signatureGen(this.hEcDR, this.currentEthAddress, (sig) => {
        this.sigOfAHP = sig
        console.log('AHP sig.: ', this.sigOfAHP)
        // Push encryptedDataWithAHPsignature to IPFS.
        this.pushToIPFShub()
      })
    },
    pushToIPFShub () {
      const merkleToutput = this.getMerkleRoot()
      if (merkleToutput.aProof === true) {
        this.mkRoot = merkleToutput.merkleRoot
        console.log('Data to IPFS: ', { timeStamp: this.timeStamp, sigOfAHP: this.sigOfAHP, encryptedData: this.EcDR })
        var encryptedDataToSendToJviaIPFS = JSON.stringify({ timeStamp: this.timeStamp, sigOfAHP: this.sigOfAHP, encryptedData: this.EcDR })
        // console.log('Connecting to IPFS.')
        const MyBuffer = window.Ipfs.Buffer
        var dataToBuffer = MyBuffer.from(encryptedDataToSendToJviaIPFS)
        // console.log('Buffer conversion done.')
        // Pre-compute IPFS hash before pushing to IPFS.
        computeIPFShash(dataToBuffer).then(returnedIPFShash => {
          ipfs.add(dataToBuffer).then(res => {
          // Confirm returned IPFS matches precomputed hash.
            if (returnedIPFShash === res[0].hash) {
            // Match confirmed
              this.IPFSHashOfhEcDR = res[0].hash
              // Hash IPFS hash to be stored in SC.
              getHash(this.IPFSHashOfhEcDR).then(hashOfIPFShash => {
                this.hIPFShash = hashOfIPFShash
                console.log('Data upload to IPFS sucessful')
                this.$message('File upload to IPFS successful.')
                this.active += 1 // Increment step by 1 to move to next step.
                this.personOnboardLoadBtn = false
                if (this.accountChangeStatus === false) {
                  this.accountSwitchDialogVisible = true
                  // Change state of processData button.
                  this.processDataBtnState = true
                }
              })
            } else {
              this.$message({
                message: 'IPFS mismatch! Possible MiTM attack',
                type: 'warning'
              })
              this.$alert('Possible MiTM attack! IPFS mismatch! ', 'IPFS hash mismatch', {
                confirmButtonText: 'OK',
                callback: action => {
                  this.$message({
                    type: 'warning ',
                    message: 'User informed'
                  })
                }
              })
            }
          })
        })
      } else {
        this.$alert('Invalid proof generation of covid records. ', 'Invalid Proof', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'warning ',
              message: 'User informed'
            })
          }
        })
      }
    },
    getMerkleRoot () {
      // This generates a root hash composed of tStatus, vStatus, timeStamp and userID.
      return getMerkleRootFromMkTree(this.merkeTreeData)
    },
    getPersonSig () {
      if (this.getPersonSigBtnState === false) {
        if (this.hEcDR !== '' && this.IPFSHashOfhEcDR !== '') {
          if (this.personAccount !== '') {
            this.personSigGenLoadBtn = true
            this.signatureOfPerson()
          } else {
            this.$message({
              message: 'Account switching not done. Switch account now.',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: 'Sorry! Complete step 1 before proceeding.',
            type: 'warning'
          })
        }
      } else {
        this.$message.error('Sorry! On-chain data already generated')
      }
    },
    signatureOfPerson () {
      console.log('Signing using address: ', this.personAccount, 'on data: ', this.IPFSHashOfhEcDR)
      // eslint-disable-next-line no-return-assign
      signatureGenerator.signatureGen(this.IPFSHashOfhEcDR, this.personAccount, (sig) => {
        this.address = this.personAccount
        this.fullSignature = sig
        // Prepare signature substring due to length.
        this.signature_substring = (sig.substring(0, 25) + '...' + sig.substr(sig.length - 25)).replace(/"/g, '') // Remove the double quotes.
        console.log('Person signature acquired.')
        this.personSigGenLoadBtn = false
        console.log('Person sig.: ', this.fullSignature)
        this.$alert('Scan QR that follows to get the IPFS hash for proof', 'User information', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: 'User consented'
            })
            // Display the QR code by callign the method.
            this.displayQRcode(this.IPFSHashOfhEcDR)
          }
        })
        this.active += 1 // Increment step to move to next stage.
        // Change state of person signature button.
        this.getPersonSigBtnState = true
      }).catch(err => {
        console.log('Error generating signature.', err)
        this.$message.error('Oops, Error getting person\'s signature')
      })
    },
    displayQRcode (userIPFShash) {
      this.qrCodeLoading = true
      console.log('Preparing QR code for: ', userIPFShash)
      console.log('Generating QR code containing IPFS hash of person.')
      // Update the QR code instance.
      qrCode.update({
        data: 'https://ipfs.io/ipfs/' + userIPFShash
      })
      console.log('Appending QR code to DOM.')
      document.getElementById('overlay').style.display = 'block'
      qrCode.append(document.getElementById('qrCodeGenerated'))
      this.qrCodeLoading = false
      this.active += 1 // Increment step to move to next stage.
    },
    qrCodeDivDisappear () {
      document.getElementById('overlay').style.display = 'none'
    },
    async sendTnx (txParams) {
      // Transaction execution in Ethereum from Metamask
      var txReceipt = await window.ethereum.request({ method: 'eth_sendTransaction', params: [txParams] })
      return txReceipt
    },
    anchorOnchain () {
      this.getAccount().then(accounts => {
        var acc = accounts[0]
        if (acc === this.currentEthAddress) {
          // Account switched.
          if (this.anchorOnBlockBtnState === false) {
            // Check all needed smart contract-related data have been acquired.
            if (this.HashedID !== '' && this.IPFSHashOfhEcDR !== '' && this.hIPFShash !== '' && this.personAccount !== '' && this.fullSignature !== '') {
              console.log('Sending to blockchain')
              this.submitLoadBtn = true
              var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })
              console.log('Contract instance created.')
              // Smart contract and other logic continues.
              try {
                // Transaction parameters
                const txParams = {
                  from: this.currentEthAddress,
                  to: contractAddress,
                  data: blockCovid.methods.updatePersonData(this.pgAccounts[1], this.HashedID, this.hIPFShash, this.mkRoot, this.fullSignature).encodeABI()
                }
                this.sendTnx(txParams).then(tnxReceipt => {
                  console.log('Transaction receipt: ', tnxReceipt)
                  this.$message({
                    type: 'info',
                    message: 'Transaction successful'
                  })
                  // Display success note.
                  this.active += 1 // Increment step.
                  this.$alert('Person data updated successfully on BlockCovid-19.', 'Record update success', {
                    confirmButtonText: 'OK',
                    callback: action => {
                      this.$message({
                        type: 'info',
                        message: 'Transaction successful'
                      })
                      this.anchorOnBlockBtnState = true
                      // this.getUserChoiceForRedirect() // Allow user to decide.
                    }
                  })
                  this.$message({
                    message: 'Person successfully updated on BlockCovid-19.',
                    type: 'success'
                  })
                  this.submitLoadBtn = false
                })
              } catch {
                console.log('Sorry! Error occured.')
                this.submitLoadBtn = false
                this.$message.error('Non-transactional error. Please try again later.')
              }
              this.submitLoadBtn = false
            } else {
              this.$message.error('Sorry! On-chain data not generated.')
            }
          } else {
            this.$message.error('Sorry! Data on page already processed.')
          }
        } else {
          this.$message({
            message: 'Account switching not done. Switch account now.',
            type: 'warning'
          })
        }
      })
    },
    getUserChoiceForRedirect () {
      this.$confirm('Do you want to onboard another person?', 'Information needed', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'info'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Awaiting new input'
        })
        window.location.reload() // Reload page.
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Redirecting to landing page'
        })
        this.$router.push('healthFacIndexPg')
      })
    },
    async importPrivateKeyAndDecrypt (encryptedData, prvKey) {
      try {
        const priv = await this.importPrivateKey(prvKey)
        const decrypted = await this.decryptRSA(priv, this.str2ab(window.atob(encryptedData)))
        return decrypted
      } catch (error) {
        console.log(error)
      }
    },
    async importPrivateKey (pkcs8Pem) {
      return await window.crypto.subtle.importKey(
        'pkcs8',
        this.getPkcs8Der(pkcs8Pem),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        true,
        ['decrypt']
      )
    },
    async decryptRSA (key, ciphertext) {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        key,
        ciphertext
      )
      return new TextDecoder().decode(decrypted)
    },
    getPkcs8Der (pkcs8Pem) {
      const pemHeader = '-----BEGIN PRIVATE KEY-----'
      const pemFooter = '-----END PRIVATE KEY-----'
      var pemContents = pkcs8Pem.substring(pemHeader.length, pkcs8Pem.length - pemFooter.length)
      var binaryDerString = window.atob(pemContents)
      return this.str2ab(binaryDerString)
    },
    str2ab (str) {
      const buf = new ArrayBuffer(str.length)
      const bufView = new Uint8Array(buf)
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    },
    // Encrypting functions.
    async importPubKeyAndEncrypt (plaintext) {
      // const plaintext = 'This text will be encoded UTF8 and may contain special characters like § and €.'// Also works for json.

      try {
        const pub = await this.importPublicKey(this.pubKeyOfPerson)
        const encrypted = await this.encryptRSA(pub, new TextEncoder().encode(plaintext))
        const encryptedBase64 = window.btoa(this.ab2str(encrypted))
        // console.log('Encrypted Msg: ', encryptedBase64.replace(/(.{64})/g, '$1\n'))
        return encryptedBase64.replace(/(.{64})/g, '$1\n')
      } catch (error) {
        console.log('Error during encryption', error)
      }
    },
    // Helper functions to encrypt.
    async importPublicKey (spkiPem) {
      return await window.crypto.subtle.importKey(
        'spki',
        this.getSpkiDer(spkiPem),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        true,
        ['encrypt']
      )
    },
    async encryptRSA (key, plaintext) {
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        key,
        plaintext
      )
      return encrypted
    },
    ab2str (buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf))
    },
    getSpkiDer (spkiPem) {
      const pemHeader = '-----BEGIN PUBLIC KEY-----'
      const pemFooter = '-----END PUBLIC KEY-----'
      var pemContents = spkiPem.substring(pemHeader.length, spkiPem.length - pemFooter.length)
      var binaryDerString = window.atob(pemContents)
      return this.str2ab(binaryDerString)
    }
  }
}
</script>

<style scoped>
#pageContainer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#topNav{
  width: 100%;
  height: 5%;
}
.wrapper {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 3% auto;
  width: 75%;
  padding: 1rem 1.5rem;
}
fieldset {
  border-radius: 2rem;
}

legend {
 font-style: italic;
}
.computedLabels{
  text-align: left;
  font-size: 0.72rem;
  color: rgb(113, 140, 189);
}
#formattedString_hEcDR {
  font-size: 0.66rem;
  font-style: italic;
  color: rgb(95, 64, 116);
}
.formattedString{
  font-size: 0.71rem;
  font-style: italic;
  color: rgb(95, 64, 116);
}

#overlay {
  position: fixed;
  display: none; /* Should be hidden by on page load */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order based on other divs */
  cursor: pointer; /* Adds a pointer on hover */
}

#qrCodeGenerated {
  margin-top: 15%;
}
</style>
