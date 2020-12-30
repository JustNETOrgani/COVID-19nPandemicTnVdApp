<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="formArea">
          <el-row>
            <el-col :span="4" :offset="10">
              <img id="registImg" src="../../assets/imgs/registerAHF.png" />
            </el-col>
          </el-row>
            <h2>Approved Health Facility (AHF) registration</h2>
            <p>This empowers the AHF to onboard persons on the blockchain.</p>
            <el-row>
                <el-col :span="20" :offset="2">
                    <div class="grid-content bg-purple-dark">
                        <el-form
                            :model="ahfRegistForm"
                            :rules="rules"
                            ref="ahfRegistForm"
                            label-width="180px">
                            <el-form-item label="Name of AHF" prop="ahfName">
                                <el-input v-model="ahfRegistForm.ahfName" placeholder="Name of the Aproved Health Facility (AHF)."></el-input>
                            </el-form-item>
                            <el-form-item label="Address of AHF" prop="ahfAddress">
                                <el-input v-model="ahfRegistForm.ahfAddress" placeholder="Please input Eth address of AHF."></el-input>
                            </el-form-item>
                            <el-form-item label="**Manager's consent**" prop="authCheckBox">
                                <el-checkbox v-model="ahfRegistForm.authCheckBox">I fully understand the implication of this action.</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :loading="registAHFBtnLoadState" @click="submitForm('ahfRegistForm')">Create</el-button>
                                <el-button @click="resetForm('ahfRegistForm')">Reset</el-button>
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
import web3 from '@/assets/js/web3Only'
import { ABI, contractAddress, suppliedGas } from '@/assets/js/contractABI'
export default {
  // name: 'Home',
  data () {
    return {
      ahfRegistForm: {
        authCheckBox: '',
        ahfName: '',
        ahfAddress: ''
      },
      registAHFBtnLoadState: false,
      contractDeployerAccount: '',
      rules: {
        authCheckBox: [
          { required: true, message: 'Please check the checkbox', trigger: 'blur' }
        ],
        ahfName: [
          { required: true, message: 'Please input name of AHF.', trigger: 'blur' },
          { min: 2, message: 'Length should be at least 2', trigger: 'blur' }
        ],
        ahfAddress: [
          { required: true, message: 'Please input ethereum address of the AHF.', trigger: 'blur' },
          { min: 20, message: 'Length should be at least 20', trigger: 'blur' }
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
        this.contractDeployerAccount = accounts[0]
        console.log('Current account: ', this.contractDeployerAccount)
      })
    }
  },
  methods: {
    async getAccount () {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      return accounts
    },
    backToPrvPg () {
      this.$router.push('managerlanding')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      if (this.ahfRegistForm.authCheckBox === true) {
        if (this.ahfNameValidation(this.ahfRegistForm.ahfName) !== 0) {
          if (web3.utils.isAddress(this.ahfRegistForm.ahfAddress) === true) {
            this.$refs[formName].validate(valid => {
              this.registAHFBtnLoadState = true
              if (valid) {
                console.log('Valid data.')
                var data = {
                  ahfName: this.ahfRegistForm.ahfName,
                  ahfAddress: this.ahfRegistForm.ahfAddress
                }
                console.log('Registration data: ', data)
                var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })
                console.log('Contract instance created.')
                // Smart contract and other logic continues.
                try {
                  blockCovid.methods.registerHealthFacility(data.ahfName, data.ahfAddress).send({
                    from: this.contractDeployerAccount,
                    gas: 265000
                  }).on('transactionHash', (hash) => {
                    console.log('Trans. hash is: ', hash)
                  }).on('receipt', (receipt) => {
                    console.log('Trans. Block Number is: ', receipt.blockNumber)
                    // Display success note.
                    this.registAHFBtnLoadState = false
                    this.$alert('The AHF ' + data.ahfName + ' has successfully been created on BlockCovid.', 'Creation success', {
                      confirmButtonText: 'OK',
                      callback: action => {
                        this.$message({
                          type: 'info',
                          message: 'Transaction successful'
                        })
                        this.$router.push('managerlanding')
                      }
                    })
                    this.$message({
                      message: 'AHF successfully created on BlockCovid.',
                      type: 'success'
                    })
                  }).on('error', (error) => {
                    console.log('Error occured', error)
                    this.registAHFBtnLoadState = false
                    this.$message.error('Oops. Eror occured during transaction processing.')
                  })
                } catch {
                  console.log('Sorry! Error occured.')
                  this.registAHFBtnLoadState = false
                  this.$message.error('Non-transactional error. Please try again later.')
                }
              } else {
                console.log('Submission error.')
                this.registAHFBtnLoadState = false
                return false
              }
            })
          } else {
            this.$message({
              message: 'Invalid Ethereum address.',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: 'Invalid AHF name.',
            type: 'warning'
          })
        }
      } else {
        this.$message('Please check the checkbox')
      }
    },
    ahfNameValidation (input) {
      if (input === '' || /[^a-zA-Z]/.test(input) === true || input == null) {
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

#registImg{
    margin-top: 1.2rem;
    width: 9rem;
    height: 6rem;
}
</style>
