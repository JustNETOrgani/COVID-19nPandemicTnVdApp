<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper" v-loading="loadingPOnboardingPage">
            <h3>Person Onboarding on the blockchain</h3>
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
                            :model="onboardPerson"
                            :rules="rules"
                            ref="onboardPerson"
                            label-width="145px"
                        >
                            <el-form-item label="Center ID" prop="centerID">
                                <el-input v-model="onboardPerson.centerID" placeholder="Please enter center ID."></el-input>
                            </el-form-item>
                            <el-form-item label="Test status" prop="tStatus">
                                <el-select
                                    v-model="onboardPerson.tStatus"
                                    style="width:100%"
                                    placeholder="Select test status">
                                    <el-option label="Positive" value="Positive"></el-option>
                                    <el-option label="Negative" value="Negative"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Vaccination status" prop="vStatus">
                                <el-select
                                    v-model="onboardPerson.vStatus"
                                    style="width:100%"
                                    placeholder="Select vaccination status">
                                    <el-option label="Not vaccinated" value="Not Vaccinated"></el-option>
                                    <el-option label="Vaccinated" value="vaccinated"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-row>
                              <el-form-item label="**AHP's consent**" prop="authCheckBox">
                                  <el-checkbox v-model="onboardPerson.authCheckBox">I understand the implication of this action.</el-checkbox>
                              </el-form-item>
                            </el-row>
                            <el-row>
                                <el-button :loading="personOnboardLoadBtn" @click="processFormData('onboardPerson')">Process data</el-button>
                                <el-button @click="resetForm('onboardPerson')">Reset</el-button>
                            </el-row>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="13" :offset="2">
                    <fieldset>
                        <legend>On-chain data</legend>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p class="computedLabels">Hash of EcDR:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p id="formattedString_hEcDR">{{hEcDR}}</p>
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
import { generateKeyPair, asymmEncrypt } from '@/assets/js/asymmEncrypt'
import getHash from '@/assets/js/hashFunc'
import web3 from '@/assets/js/web3Only'
import { ABI, contractAddress, suppliedGas } from '@/assets/js/contractABI'
// import convertIPFSstringToBytes from '@/assets/js/convertIPFShash.js'
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
      onboardPerson: {
        centerID: '',
        tStatus: '',
        vStatus: '',
        authCheckBox: ''
      },
      // Steps.
      active: 0,
      // Dynamic variables.
      EcDR: '',
      hEcDR: '',
      IPFSHashOfhEcDR: '',
      fullSignature: '',
      signature_substring: '',
      address: '',
      currentEthAddress: '',
      personAccount: '',
      pubKeyOfPerson: '',
      AHPkeyGenerated: '',
      sigOfAHP: '',
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
        centerID: [
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
  methods: {
    switchAccount () {
      var myRoot = this // Ensure all this or vue global variables can be accessed within this fucntion via myRoot.
      window.ethereum.on('accountsChanged', function (accounts) {
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
        if (this.onboardPerson.authCheckBox === true) {
          this.$refs[formName].validate(valid => {
            this.personOnboardLoadBtn = true
            if (valid) {
              var data = {
                centerID: this.onboardPerson.centerID,
                tStatus: this.onboardPerson.tStatus,
                vStatus: this.onboardPerson.vStatus,
                timeStamp: new Date().getTime()
              }
              console.log('Data: ', data)
              // Encrypt data using user public key ---> EcDR
              this.EcDR = asymmEncrypt(this.AHPkeyGenerated, data, this.pubKeyOfPerson)
              console.log('EcDR: ', this.EcDR)
              // Hash encrypted data---> hEcDR.
              getHash(this.EcDR).then(res => {
                this.hEcDR = res
                // AHP signs hEcDR to get signature. --->AHPsignature
                this.signatureOfAHP() // Includes push to IPFS.
              })
              // Person signs IPFShash to get signature.
              // Anchor data onto the blockchain via Smart Contract.
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
        cancelButtonText: 'Cancel',
        inputPattern: /^0x[0-9A-F]{64}$/i
      }).then(({ value }) => {
        // Valid Public key before proceeding.
        this.pubKeyOfPerson = this.convertHextoBytes(value.substring(2))
        // Create key pair.
        var AHPkeyGen = generateKeyPair()
        this.AHPkeyGenerated = AHPkeyGen.secretKey
        console.log('Public key acquired.')
      }).catch((err) => {
        console.log('User has cancelled.', err)
        this.$message.error('Sorry! Public key of person required. Reloading...')
        window.location.reload() // Reload page.
      })
    },
    // Some helper functions during encryption.
    convertHextoBytes (hexString) {
      var bytes = new Uint8Array(Math.ceil(hexString.length / 2))
      for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hexString.substr(i * 2, 2), 16)
      return bytes
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
      var encryptedDataToSendToJviaIPFS = JSON.stringify({ encryptedData: this.EcDR, signedByAHP: this.sigOfAHP })
      // console.log('Connecting to IPFS.')
      const MyBuffer = window.Ipfs.Buffer
      var dataToBuffer = MyBuffer.from(encryptedDataToSendToJviaIPFS)
      // console.log('Buffer conversion done.')
      ipfs.add(dataToBuffer).then(res => {
        console.log('Data upload to IPFS sucessful')
        this.$message('File upload to IPFS successful.')
        this.IPFSHashOfhEcDR = res[0].hash
        this.active += 1 // Increment step by 1 to move to next step.
        this.personOnboardLoadBtn = false
        if (this.accountChangeStatus === false) {
          this.accountSwitchDialogVisible = true
          // Change state of processData button.
          this.processDataBtnState = true
        }
      })
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
    anchorOnchain () {
      if (this.anchorOnBlockBtnState === false) {
        // Check all needed smart contract-related data have been acquired.
        if (this.hEcDR !== '' && this.IPFSHashOfhEcDR !== '' && this.personAccount !== '' && this.fullSignature !== '') {
          console.log('Sending to blockchain')
          this.submitLoadBtn = true
          var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })
          console.log('Contract instance created.')
          // Smart contract and other logic continues.
          try {
            blockCovid.methods.personOnboarding(this.personAccount, this.IPFSHashOfhEcDR, this.hEcDR, this.onboardPerson.tStatus, this.onboardPerson.vStatus, this.fullSignature).send({
              from: this.currentEthAddress,
              gas: 400000
            }).on('transactionHash', (hash) => {
              console.log('Trans. hash is: ', hash)
            }).on('receipt', (receipt) => {
              console.log('Trans. Block Number is: ', receipt.blockNumber)
              // Display success note.
              this.active += 1 // Increment step.
              this.$alert('Person successfully anchored on BlockCovid.', 'Creation success', {
                confirmButtonText: 'OK',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: 'Transaction successful'
                  })
                  this.anchorOnBlockBtnState = true
                  this.getUserChoiceForRedirect()
                }
              })
              this.$message({
                message: 'Person successfully created on BlockCovid.',
                type: 'success'
              })
              this.submitLoadBtn = false
            }).on('error', (error) => {
              console.log('Error occured', error)
              this.submitLoadBtn = false
              this.$message.error('Oops. Eror occured during transaction processing.')
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
