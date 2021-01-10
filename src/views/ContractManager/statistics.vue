<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPage">Previous Page</el-link>
        </div>
        <el-row>
          <el-col :span="23" :offset="1">
            <el-col :span="7">
              <h3 id="activityHub">Contract Deployer Statistics Hub</h3>
            </el-col>
            <el-col :span="5">
                    <h4 class="textPlacements">Task selection area</h4>
            </el-col>
            <el-col :span="7">
              <div class="rowAlignment">
                  <el-form
                      :model="contractDeployerTasks"
                      :rules="rules"
                      ref="contractDeployerTasks"
                      label-width="120px"
                  >
                      <el-form-item label="Required task" prop="deployerTask">
                          <el-select
                              v-model="contractDeployerTasks.deployerTask"
                              style="width:100%"
                              placeholder="Please select the desired task.">
                              <el-option label="Get onboarded tests and vaccination results" value="allTestsNvacResults"></el-option>
                              <el-option label="Get updated tests and vaccination results" value="updatedTestsNvacResults"></el-option>
                              <el-option label="AHF-specific records" value="AHFspecific"></el-option>
                              <el-option label="AHFs" value="AHFs"></el-option>
                          </el-select>
                      </el-form-item>
                    </el-form>
              </div>
            </el-col>
            <div class="rowAlignment">
            <el-col :span="5">
              <el-button type="primary" :loading="getDataBtnLoadState" @click="submitForm('contractDeployerTasks')">Get data</el-button>
            </el-col>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :offset="0">
            <h4>Retrieved data appears below</h4>
            <div v-if="getAllTestsNvac" v-loading="allTestsNvacLoading">
                <el-table
                :data="pageTableData"
                style="width: 100%"
                height="550px"
                >
                <!--Building table body-->
                <template v-for="(item, index) in allTestsNvactableLabel">
                  <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label" :width="item.width">
                  </el-table-column>
                </template>
              </el-table>
            </div>
            <div v-else-if="updatedTnVData" v-loading="updatedTnVDataLoading">
                <p class="infoAtGlance">Updated data</p>
                <el-table
                :data="pageTableData"
                style="width: 100%"
                height="550px"
                >
                <!--Building table body-->
                <template v-for="(item, index) in updatedTestsNvactableLabel">
                  <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label" :width="item.width">
                  </el-table-column>
                </template>
              </el-table>
            </div>
            <div v-else-if="ahfSpecificData" v-loading="ahfSpecificLoading">
                <p class="infoAtGlance">AHF-specific statistics. Address: {{addressOfAHF}}</p>
                <el-table
                :data="pageTableData"
                style="width: 100%"
                height="550px"
                >
                <!--Building table body-->
                <template v-for="(item, index) in ahfSpecifictableLabel">
                  <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label" :width="item.width">
                  </el-table-column>
                </template>
              </el-table>
            </div>
            <div v-else-if="ahfs" v-loading="ahfLoading">
              <p class="infoAtGlance">Total number of AHFs: {{numOfAHFs}}</p>
                <el-table
                :data="pageTableData"
                style="width: 100%"
                height="550px"
                >
                <!--Building table body-->
                <template v-for="(item, index) in ahftableLabel">
                  <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label" :width="item.width">
                  </el-table-column>
                </template>
              </el-table>
            </div>
            <div v-else-if="defaultPageItem">
                <p>No data retrieved</p>
            </div>
          </el-col>
        </el-row>
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
      contractDeployerTasks: {
        deployerTask: ''
      },
      addressOfAHF: '',
      // Table data begins.
      pageTableData: [],
      // Table data ends.
      // Array to hold requested IPFS hashes of papers begins.
      reqIPFShashes: [],
      // Array to hold requested IPFS hashes of papers ends.
      // v-if states.
      getAllTestsNvac: false,
      updatedTnVData: false,
      ahfSpecificData: false,
      ahfs: false,
      defaultPageItem: false,
      // Loading states.
      getDataBtnLoadState: false,
      updatedTnVDataLoading: false,
      allTestsNvacLoading: false,
      ahfSpecificLoading: false,
      ahfLoading: false,
      // Contract Deployer's address
      contractDeployerAddress: '',
      rules: {
        deployerTask: [
          { required: true, message: 'Please select desired task', trigger: 'blur' }
        ]
      },
      // Table labels begin.
      allTestsNvactableLabel: [
        { label: 'Persons tested', prop: 'totalTests', width: '130px' },
        { label: 'Number of Positives', prop: 'numOfTotalPos', width: '110px' },
        { label: 'Number of Negatives', prop: 'numOfTotalNeg', width: '110px' },
        { label: 'Number of persons vaccinated', prop: 'numOfVacc', width: '160px' },
        { label: 'Number of persons not vaccinated', prop: 'numOfNonVacc', width: '160px' }
      ],
      updatedTestsNvactableLabel: [
        { label: 'Persons tested', prop: 'totalTests', width: '130px' },
        { label: 'Number of Positives', prop: 'numOfTotalPos', width: '110px' },
        { label: 'Number of Negatives', prop: 'numOfTotalNeg', width: '110px' },
        { label: 'Number of persons vaccinated', prop: 'numOfVacc', width: '160px' },
        { label: 'Number of persons not vaccinated', prop: 'numOfNonVacc', width: '160px' }
      ],
      ahfSpecifictableLabel: [
        { label: 'Persons tested', prop: 'totalTests', width: '130px' },
        { label: 'Number of Positives', prop: 'numOfTotalPos', width: '110px' },
        { label: 'Number of Negatives', prop: 'numOfTotalNeg', width: '110px' },
        { label: 'Number of persons vaccinated', prop: 'numOfVacc', width: '160px' },
        { label: 'Number of persons not vaccinated', prop: 'numOfNonVacc', width: '160px' }
      ],
      ahftableLabel: [
        { label: 'Name of Approved Health Facility (AHF)', prop: 'nameOfAHF', width: '320px' },
        { label: 'Ethereum address of AHF', prop: 'ethAddOfAHF', width: '380px' }
      ]
      // Table labels end.
    }
  },
  components: {
  },
  created () {
    if (!ethEnabled()) {
      this.$message('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!')
    } else {
      this.getAccount().then(accounts => {
        this.contractDeployerAddress = accounts[0]
        console.log('Current account: ', this.contractDeployerAddress)
      })
    }
  },
  watch: {
    'contractDeployerAddress' () {
      this.switchAccount()
    }
  },
  methods: {
    async getAccount () {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      return accounts
    },
    switchAccount () {
      var myRoot = this // Ensure all this or vue global variables can be accessed within this fucntion via myRoot.
      window.ethereum.on('accountsChanged', function (accounts) {
        myRoot.contractDeployerAddress = accounts[0]
        console.log('Selected account: ', myRoot.contractDeployerAddress)
        myRoot.$message({
          message: 'Account switched successfully.',
          type: 'success'
        })
        console.log('Account switched')
        myRoot.accountChangeStatus = true
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        this.getDataBtnLoadState = true
        if (valid) {
          // Call different methods here based on journal's selection.
          if (this.contractDeployerTasks.deployerTask === 'allTestsNvacResults') {
            this.getAllTestsAndVaccResults()
          } else if (this.contractDeployerTasks.deployerTask === 'updatedTestsNvacResults') {
            this.getupdatedTestsNvacRes()
          } else if (this.contractDeployerTasks.deployerTask === 'AHFspecific') {
            this.getAHFspecificTnVresults()
          } else if (this.contractDeployerTasks.deployerTask === 'AHFs') {
            this.getRegisteredAHF()
          }
        } else {
          console.log('Submission error.')
          this.getDataBtnLoadState = false
          return false
        }
      })
    },
    backToPrvPage () {
      this.$router.push('managerlanding')
    },
    getAllTestsAndVaccResults () {
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.allTestsNvacLoading = true
      this.ahfs = false
      this.ahfSpecificData = false
      this.updatedTnVData = false
      this.defaultPageItem = false
      // Perform required task and return true.
      var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      blockCovid.getPastEvents('onboarded', { fromBlock: 0, toBlock: 'latest' },
        (err, results) => {
          if (err) {
            this.allTestsNvacLoading = false
            this.$message.error('Sorry! Error retrieving data. Please, try again later.')
          } else {
          // Get the data and display.
            if (Object.keys(results).length === 0) {
              console.log('No data available.')
              this.getDataBtnLoadState = false
              this.getAllTestsNvac = false
              this.defaultPageItem = true
              this.$message({
                message: 'Sorry! No person onboarded on BlockCovid.',
                type: 'info'
              })
            } else {
              // Results is not empty hence get and display.
              console.log('Results from Contract: ', results)
              console.log('Total: ', Object.keys(results).length)
              var testStatus = []
              var vaccStatus = []
              for (let i = 0; i < Object.keys(results).length; i++) {
                testStatus.push(results[i].returnValues.tStatus)
                vaccStatus.push(results[i].returnValues.vStatus)
              }
              // Get counts regarding number of occurrences of each item in the array.
              var tOccurences = this.getCounts(testStatus)
              var vOccurences = this.getCounts(vaccStatus)
              for (let i = 0; i < 1; i++) {
                this.pageTableData[i] = []
                this.pageTableData[i].totalTests = Object.keys(results).length
                this.pageTableData[i].numOfTotalPos = tOccurences.Positive
                this.pageTableData[i].numOfTotalNeg = tOccurences.Negative
                this.pageTableData[i].numOfVacc = vOccurences.vaccinated
                this.pageTableData[i].numOfNonVacc = vOccurences['Not Vaccinated']
              }
              this.getDataBtnLoadState = false
              this.allTestsNvacLoading = false
              this.getAllTestsNvac = true
            }
          }
        })
    },
    getupdatedTestsNvacRes () {
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.updatedTnVDataLoading = true
      this.ahfs = false
      this.ahfSpecificData = false
      this.defaultPageItem = false
      // Perform required task and return true.
      var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      blockCovid.getPastEvents('personUpdated', { fromBlock: 0, toBlock: 'latest' },
        (err, results) => {
          if (err) {
            this.updatedTnVData = false
            this.updatedTnVDataLoading = false
            this.$message.error('Sorry! Error retrieving data. Please, try again later.')
          } else {
          // Get the data and display.
            if (Object.keys(results).length === 0) {
              console.log('No data available.')
              this.getDataBtnLoadState = false
              this.updatedTnVDataLoading = false
              this.updatedTnVData = false
              this.defaultPageItem = true
              this.$message({
                message: 'Sorry! No person updated record exist on BlockCovid.',
                type: 'info'
              })
            } else {
              // Results is not empty hence get and display.
              console.log('Results from Contract: ', results)
              console.log('Total: ', Object.keys(results).length)
              var testStatus = []
              var vaccStatus = []
              for (let i = 0; i < Object.keys(results).length; i++) {
                testStatus.push(results[i].returnValues.tStatus)
                vaccStatus.push(results[i].returnValues.vStatus)
              }
              // Get counts regarding number of occurrences of each item in the array.
              var tOccurences = this.getCounts(testStatus)
              var vOccurences = this.getCounts(vaccStatus)
              for (let i = 0; i < 1; i++) {
                this.pageTableData[i] = []
                this.pageTableData[i].totalTests = Object.keys(results).length
                this.pageTableData[i].numOfTotalPos = tOccurences.Positive
                this.pageTableData[i].numOfTotalNeg = tOccurences.Negative
                this.pageTableData[i].numOfVacc = vOccurences.vaccinated
                this.pageTableData[i].numOfNonVacc = vOccurences['Not Vaccinated']
              }
              this.getDataBtnLoadState = false
              this.updatedTnVDataLoading = false
              this.updatedTnVData = true
            }
          }
        })
    },
    getAHFspecificTnVresults () {
      this.$prompt('Please enter Ethereum address of the AHF.', 'Information required', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        inputPlaceholder: 'Eth address of the AHF.',
        inputPattern: /^0x[0-9A-F]{40}$/i
      }).then(({ value }) => {
        if (web3.utils.isAddress(value) === true) {
          this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
          this.ahfSpecificLoading = true
          this.ahfs = false
          this.getAllTestsNvac = false
          this.updatedTnVData = false
          this.defaultPageItem = false
          // Perform required task and return true.
          var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
          console.log('Contract instance for access type retrieval created.')
          blockCovid.getPastEvents('onboarded', { filter: { txInitiator: [value] }, fromBlock: 0, toBlock: 'latest' },
            (err, results) => {
              if (err) {
                this.ahfSpecificLoading = false
                this.$message.error('Sorry! Error retrieving data. Please, try again later.')
              } else {
                // Get the data and display.
                if (Object.keys(results).length === 0) {
                  console.log('No data available.')
                  this.getDataBtnLoadState = false
                  this.ahfSpecificData = false
                  this.defaultPageItem = true
                  this.$message({
                    message: 'Sorry! This AHF has no data on BlockCovid.',
                    type: 'info'
                  })
                } else {
                  // Results is not empty hence get and display.
                  console.log('Results from Contract: ', results)
                  console.log('Total: ', Object.keys(results).length)
                  var testStatus = []
                  var vaccStatus = []
                  for (let i = 0; i < Object.keys(results).length; i++) {
                    testStatus.push(results[i].returnValues.tStatus)
                    vaccStatus.push(results[i].returnValues.vStatus)
                  }
                  // Get counts regarding number of occurrences of each item in the array.
                  var tOccurences = this.getCounts(testStatus)
                  var vOccurences = this.getCounts(vaccStatus)
                  for (let i = 0; i < 1; i++) {
                    this.pageTableData[i] = []
                    this.pageTableData[i].totalTests = Object.keys(results).length
                    this.pageTableData[i].numOfTotalPos = tOccurences.Positive
                    this.pageTableData[i].numOfTotalNeg = tOccurences.Negative
                    this.pageTableData[i].numOfVacc = vOccurences.vaccinated
                    this.pageTableData[i].numOfNonVacc = vOccurences['Not Vaccinated']
                  }
                  this.addressOfAHF = value
                  this.getDataBtnLoadState = false
                  this.ahfSpecificLoading = false
                  this.ahfSpecificData = true
                }
              }
            })
        }
      }).catch(err => {
        console.log('User cancelled. Error: ', err)
        this.ahfSpecificLoading = false
        this.$message.error('Sorry! Ethereum address of AHF required.')
        this.getDataBtnLoadState = false
      })
    },
    getRegisteredAHF () {
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.ahfLoading = true
      this.getAllTestsNvac = false
      this.updatedTnVData = false
      this.ahfSpecificData = false
      this.defaultPageItem = false
      // Perform required task and return true.
      var blockCovid = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      blockCovid.getPastEvents('approvedHFdone', { fromBlock: 0, toBlock: 'latest' },
        (err, results) => {
          if (err) {
            this.ahfs = false
            this.$message.error('Sorry! Error retrieving data. Please, try again later.')
          } else {
          // Get the data and display.
            if (Object.keys(results).length === 0) {
              console.log('No data available.')
              this.getDataBtnLoadState = false
              this.ahfs = false
              this.$message({
                message: 'Sorry! No registered AHFs on BlockCovid.',
                type: 'info'
              })
              this.defaultPageItem = true
            } else {
              // Results is not empty hence get and display.
              console.log('Results from Contract: ', results)
              console.log('Total: ', Object.keys(results).length)
              for (let i = 0; i < Object.keys(results).length; i++) {
                this.pageTableData[i] = []
                this.pageTableData[i].nameOfAHF = results[i].returnValues.nameOfappHealthFac
                this.pageTableData[i].ethAddOfAHF = results[i].returnValues.addOfAHF
              }
              this.numOfAHFs = Object.keys(results).length
              this.getDataBtnLoadState = false
              this.ahfLoading = false
              this.ahfs = true
            }
          }
        })
    },
    getCounts (theArray) {
      var counts = {}
      for (var i = 0; i < theArray.length; i++) {
        if (typeof counts[theArray[i]] === 'undefined') {
          counts[theArray[i]] = 1
        } else {
          counts[theArray[i]]++
        }
      }
      return counts
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
  margin-top: 0.5rem;
  width: 100%;
  height: 5%;
}

#headingTop {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 0.6% auto;
  width: 100%;
  padding: 0.2rem 1.5rem;
}

#headingTitle{
  width: 30%;
  float: left;
}

#topRight{
  background-color: #ffffff;
  width: 68%;
}

#activityHub{
  text-align: left;
}

.rowAlignment{
  margin-top: 0.8rem;
}

.textPlacements{
    margin-left: -2rem;
}

.infoAtGlance{
  text-align: left;
  margin-left: 1rem;
  font-size: 1.1rem;
  color: rgb(113, 140, 189);
}
</style>
