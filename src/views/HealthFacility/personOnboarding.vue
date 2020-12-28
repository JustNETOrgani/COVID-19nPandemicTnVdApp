<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper" v-loading="loadingPOnboardingPage">
            <h2>Person Onboarding on the blockchain</h2>
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
                            <br>
                            <el-form-item label="**AHP's consent**" prop="authCheckBox">
                                <el-checkbox v-model="onboardPerson.authCheckBox">I fully understand the implication of this action.</el-checkbox>
                            </el-form-item>
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
                                    <p class="formattedString">{{hEcDR}}</p>
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
                                <el-col :span="10" :offset="0">
                                    <p class="computedLabels">Person signature:</p>
                                    <p class="formattedString">{{signature}}</p>
                                </el-col>
                            </el-row>
                    </fieldset>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" :loading="personOnboardLoadBtn" @click="submitForm('onboardPerson')">Submit</el-button>
                <el-button @click="resetForm('onboardPerson')">Reset</el-button>
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
    </div>
</template>

<script>
import ethEnabled from '@/assets/js/web3nMetaMask'
import * as signingByAHP from '@/assets/js/sigHelperFns'
import { generateKeyPair, asymmEncrypt } from '@/assets/js/asymmEncrypt'
import getHash from '@/assets/js/hashFunc'
// import convertIPFSstringToBytes from '@/assets/js/convertIPFShash.js'
const ipfs = new window.Ipfs()

export default {
  data () {
    return {
      onboardPerson: {
        centerID: '',
        tStatus: '',
        vStatus: '',
        authCheckBox: ''
      },
      // Dynamic variables.
      EcDR: '',
      hEcDR: '',
      IPFSHashOfhEcDR: '',
      signature: '',
      address: '',
      currentEthAddress: '',
      pubKeyOfPerson: '',
      AHPkeyGenerated: '',
      sigOfAHP: '',
      // Loading states
      personOnboardLoadBtn: false,
      loadingPOnboardingPage: true,
      // Account change status.
      accountChangeStatus: false,
      // Dialogs.
      accountSwitchDialogVisible: false,
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
  methods: {
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
    submitForm (formName) {
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
            this.personOnboardLoadBtn = false
          } else {
            console.log('Submission error.')
            this.personOnboardLoadBtn = false
            return false
          }
        })
      } else {
        this.$message('Please check the checkbox')
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
        // window.location.reload() // Reload page.
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
      signingByAHP.signByAHP(this.hEcDR, this.currentEthAddress, (sig) => {
        this.sigOfAHP = sig
        console.log('AHP sig.: ', this.sigOfAHP)
        // Get daa ready for upload to IPFS.
        var preparedData = this.prepareDataToIPFS()
        // Push encryptedDataWithAHPsignature to IPFS.
        this.pushToIPFShub(preparedData)
      })
    },
    pushToIPFShub (encryptedDataWithAHPsignature) {
      var encryptedDataToSendToJviaIPFS = JSON.stringify({ encryptedDataWithAHPsignature })
      // console.log('Connecting to IPFS.')
      const MyBuffer = window.Ipfs.Buffer
      var dataToBuffer = MyBuffer.from(encryptedDataToSendToJviaIPFS)
      // console.log('Buffer conversion done.')
      ipfs.add(dataToBuffer).then(res => {
        console.log('Data upload to IPFS sucessful')
        this.$message('File upload to IPFS successful.')
        this.IPFSHashOfhEcDR = res[0].hash
        if (this.accountChangeStatus === false) {
          this.accountSwitchDialogVisible = true
          window.ethereum.on('accountsChanged', function (accounts) {
            this.currentEthAddress = accounts[0]
            console.log('New account: ', this.currentEthAddress)
            this.accountChangeStatus = true
          })
        }
      })
    },
    prepareDataToIPFS () {
      var encryptedDataWithAHPsignature = { encryptedData: this.EcDR, signedByAHP: this.sigOfAHP }
      return encryptedDataWithAHPsignature
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
.formattedString{
  font-size: 0.73rem;
  font-style: italic;
  color: rgb(95, 64, 116);
}
</style>
