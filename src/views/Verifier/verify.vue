<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="formArea">
          <el-row>
            <el-col :span="4" :offset="9">
              <img id="verifyImg" src="../../assets/imgs/verify.png" />
            </el-col>
          </el-row>
            <h2>Verification</h2>
            <p>A provably secure proof solidly backed by blockchain</p>
            <el-row>
                <el-col :span="20" :offset="2">
                    <div class="grid-content bg-purple-dark">
                        <el-form
                            :model="verificationForm"
                            :rules="rules"
                            ref="verificationForm"
                            label-width="90px">
                            <el-form-item label="IPFS hash" prop="ifpsHash">
                                <el-input v-model="verificationForm.ifpsHash" placeholder="Enter IPFS hash."></el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="5" :offset="0">
                                    <p id="computedLabel">Person signature:</p>
                                </el-col>
                                <el-col :span="5" :offset="0">
                                    <p id="formattedString">{{sigOnIPFShash}}</p>
                                </el-col>
                            </el-row>
                            <el-form-item>
                                <el-button type="primary" :loading="verifyBtnLoadState" @click="submitForm('verificationForm')">Verify</el-button>
                                <el-button @click="resetForm('verificationForm')">Reset</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import ethEnabled from '@/assets/js/web3nMetaMask'
import * as signingByAHP from '@/assets/js/sigHelperFns'
import getHash from '@/assets/js/hashFunc'
const ipfs = new window.Ipfs()

export default {
  // name: 'Home',
  data () {
    return {
      verificationForm: {
        ifpsHash: ''
      },
      hEcDR: '',
      sigOnIPFShash: '',
      fullSignature: '',
      personAccount: '',
      verifyBtnLoadState: false,
      rules: {
        ifpsHash: [
          { required: true, message: 'Please input IPFS hash of the paper', trigger: 'blur' },
          { min: 46, message: 'Length should be at least 46', trigger: 'blur' }
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
        this.personAccount = accounts[0]
        console.log('Current account: ', this.personAccount)
      })
    }
  },
  methods: {
    async getAccount () {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      return accounts
    },
    backToPrvPg () {
      this.$router.push('/')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      if (this.verificationForm.ifpsHash !== '') {
        if (this.ipfsInputValidation(this.verificationForm.ifpsHash) !== 0) {
          this.$refs[formName].validate(valid => {
            this.verifyBtnLoadState = true
            if (valid) {
              var data = {
                ipfsHash: this.verificationForm.ifpsHash
              }
              // Steps ---> TODO
              // Acquire encrypted data on IPFS.
              ipfs.cat(data.ipfsHash).then(retrievedData => {
                var EcDRwithSig = JSON.parse(retrievedData.toString()) // Convert to string and parse as JSON object.
                console.log('Encrypted data: ', EcDRwithSig)
                // Hash the EcDR.
                getHash(EcDRwithSig.encryptedData).then(res => {
                  this.hEcDR = res
                  // Allow user to sign IPFS hash.
                  signingByAHP.signatureGen(data.ipfsHash, this.personAccount, (sig) => {
                    this.fullSignature = sig
                    this.sigOnIPFShash = (sig.substring(0, 25) + '...' + sig.substr(sig.length - 25)).replace(/"/g, '') // Remove the double quotes.
                    console.log('Person sig.: ', this.fullSignature)
                    // Verify on-chain
                    this.verifyBtnLoadState = false
                  })
                })
              })
            } else {
              console.log('Submission error.')
              this.verifyBtnLoadState = false
              return false
            }
          })
        } else {
          this.$message({
            message: 'Sorry! Invalid IPFS hash entered. Please, re-enter.',
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: 'Sorry! IPFS field cannot be empty.',
          type: 'warning'
        })
      }
    },
    ipfsInputValidation (input) {
      const count = input.toString().length
      if (input === '' || count < 46 || input.startsWith('Qm') === false) { // Consider: inputPattern: /^Qm[0-9A-Z]{44}$/i
        return 0
      } else {
        return 1
      }
    }
  },
  computed: {

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

.formArea {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 2.5% auto;
  width: 40%;
  padding: 1rem 1.5rem;
}

#verifyImg{
    margin-top: 1.2rem;
    width: 9rem;
    height: 6rem;
}
#computedLabel{
  text-align: left;
  font-size: 0.8rem;
  color: rgb(113, 140, 189);
}
#formattedString{
  font-size: 0.75rem;
  text-align: left;
  font-style: italic;
  color: rgb(95, 64, 116);
}
</style>
