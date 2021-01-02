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
                              <el-option label="Get tests and vaccination results" value="allTestsNvacResults"></el-option>
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
            <div v-else-if="ahfSpecificData" v-loading="ahfSpecificLoading">
                <h4>AHF-specific statistics. Address: {{addressOfAHF}}</h4>
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
            <el-dialog title="Ethereum address of AHF" width="36%" :visible.sync="getAHFaddressDialog">
                  <el-form :model="ahfAddressRequest"
                  :rules="rules"
                  ref="ahfAddressRequest">
                        <el-form-item label="AHF's address" prop="ahfAddress">
                            <el-input v-model="ahfAddressRequest.ahfAddress" autocomplete="off"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="getAHFaddressDialog = false">Cancel</el-button>
                      <el-button :loading="getAHFaddressLoadState" type="primary" @click="getAHFaddress('ahfAddressRequest')">Confirm</el-button>
                  </span>
                </el-dialog>
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
      ahfAddressRequest: {
        ahfAddress: ''
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
      ahfSpecificData: false,
      ahfs: false,
      defaultPageItem: false,
      // Loading states.
      getDataBtnLoadState: false,
      allTestsNvacLoading: false,
      ahfSpecificLoading: false,
      getAHFaddressLoadState: false,
      // Dialog.
      getAHFaddressDialog: false,
      // Contract Deployer's address
      contractDeployerAddress: '',
      ahfLoading: '',
      rules: {
        deployerTask: [
          { required: true, message: 'Please select desired task', trigger: 'blur' }
        ]
      },
      // Table labels begin.
      allTestsNvactableLabel: [
        { label: 'Total tests', prop: 'totalTests', width: '320px' },
        { label: 'Number of Positives', prop: 'numOfTotalPos' },
        { label: 'Number of Negatives', prop: 'numOfTotalNeg' },
        { label: 'Number of persons vaccinated', prop: 'numOfVacc' },
        { label: 'Number of persons not vaccinated', prop: 'numOfNonVacc' }
      ],
      ahfSpecifictableLabel: [
        { label: 'Total tests', prop: 'totalTests', width: '320px' },
        { label: 'Number of Positives', prop: 'numOfTotalPos' },
        { label: 'Number of Negatives', prop: 'numOfTotalNeg' },
        { label: 'Number of persons vaccinated', prop: 'numOfVacc' },
        { label: 'Number of persons not vaccinated', prop: 'numOfNonVacc' }
      ],
      ahftableLabel: [
        { label: 'Name of Approved Health Facility (AHF)', prop: 'nameOfAHF' },
        { label: 'Ethereum address of AHF', prop: 'ethAddOfAHF' }
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
              this.getDataBtnLoadState = false
              this.getAllTestsNvac = false
              this.defaultPageItem = true
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
    getAHFspecificTnVresults () {
      // console.log('Retrieving revised papers.')
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.revSubLoading = true
      this.defaultPageItem = false
      this.receivedSub = false
      this.reqPaper = false
      this.sendPaperToUser = false
      this.paidPapers = false
      // Perform required task and return true.
      var jpBlockContract = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      jpBlockContract.getPastEvents('revisedAndReSubmittedManu', { filter: { jAddress: [web3.eth.defaultAccount] }, fromBlock: 0, toBlock: 'latest' },
        (err, results) => {
          if (err) {
            this.receivedSubLoading = false
            this.$message.error('Sorry! Error retrieving data. Please, try again later.')
          } else {
          // Get the data and display.
            if (Object.keys(results).length === 0) {
              this.jDashboardTaskBtnLoadState = false
              this.receivedSubLoading = false
              this.defaultPageItem = true
            } else {
              // Results is not empty hence get and display.
              // console.log('Received submissions: ', results)
              console.log('Total revised papers: ', Object.keys(results).length)
              for (let i = 0; i < Object.keys(results).length; i++) {
                this.pageTableData[i] = []
                this.pageTableData[i].origPaperHash = results[i].returnValues.origPaperHash
                this.pageTableData[i].newPaperHash = results[i].returnValues.newPaperHash
              }
              this.jDashboardTaskBtnLoadState = false
              this.revSubLoading = false
              // console.log('Objet to display as table: ', this.pageTableData)
              this.revisedSub = true
            }
          }
        })
    },
    getRegisteredAHF () {
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.jDashboardTaskBtnLoadState = true
      this.paidPapersbLoading = true
      this.defaultPageItem = false // 1
      this.receivedSub = false // 2
      this.reqPaper = false // 3
      this.sendPaperToUser = false // 4
      this.revisedSub = false // 5
      // Perform required task and return true.
      var jpBlockContract = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      jpBlockContract.getPastEvents('paymentMade', { filter: { to: [web3.eth.defaultAccount] }, fromBlock: 0, toBlock: 'latest' },
        (err, results) => {
          if (err) {
            this.receivedSubLoading = false
            this.$message.error('Sorry! Error retrieving data. Please, try again later.')
          } else {
          // Get the data and display.
            if (Object.keys(results).length === 0) {
              this.jDashboardTaskBtnLoadState = false
              this.receivedSubLoading = false
              this.defaultPageItem = true
            } else {
              // Results is not empty hence get and display.
              // console.log('Received submissions: ', results)
              console.log('Total paid for papers: ', Object.keys(results).length)
              for (let i = 0; i < Object.keys(results).length; i++) {
                this.pageTableData[i] = []
                // this.pageTableData[i].source = results[i].returnValues.source // Commented for privacy reasons.
                this.pageTableData[i].paperHash = results[i].returnValues.paperHash
              }
              this.jDashboardTaskBtnLoadState = false
              this.paidPapersbLoading = false
              // console.log('Objet to display as table: ', this.pageTableData)
              this.paidPapers = true
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

#midLeft {
  background-color: #ffffff;
  margin: 0.1% auto;
  width: 20%;
  padding: 0.2rem 2.5rem;
  float: left;
}

.rowAlignment{
  margin-top: 0.8rem;
}

.textPlacements{
    margin-left: -2rem;
}
</style>
