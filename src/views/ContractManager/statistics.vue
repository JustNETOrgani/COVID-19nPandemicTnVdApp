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
      // Table data begins.
      pageTableData: [],
      reqPageTableData: [],
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
      ahfLoading: '',
      rules: {
        deployerTask: [
          { required: true, message: 'Please select desired task', trigger: 'blur' }
        ]
      },
      // Table labels begin.
      receivedPaperstableLabel: [
        { label: 'Paper Hash', prop: 'paperHash', width: '320px' },
        { label: 'IPFS hash', prop: 'paperIPFShash' },
        { label: 'Paper Title', prop: 'paperTitle' },
        { label: 'Submitting author', prop: 'submittingAuthor' },
        { label: 'Authors public key', prop: 'userPubKey' },
        { label: 'IPFS hash of Suppl. paper', prop: 'suppleFileIPFShash' }
      ],
      revisedPaperstableLabel: [
        { label: 'Hash of the original paper', prop: 'origPaperHash', width: '560px' },
        { label: 'Hash of the revised paper', prop: 'newPaperHash' }
      ],
      paidPaperstableLabel: [
        // { label: 'Payee', prop: 'source', width: '380px' }, // Commented for privacy reasons.
        { label: 'Hash of the paid paper', prop: 'paperHash' }
      ],
      reqPaperstableLabel: [
        { label: 'IPFS hash of requested paper', prop: 'IPFShash', width: '440px' },
        { label: 'Public key of requestee', prop: 'userPUbKey' }
      ]
      // Table labels end.
    }
  },
  components: {
    // Head
    // Footer
  },
  created () {
  },
  methods: {
    submitForm (formName) {
      if (this.jAccountIndexEntered.length !== 0) {
        this.$refs[formName].validate(valid => {
          this.jDashboardTaskBtnLoadState = true
          if (valid) {
            // Call different methods here based on journal's selection.
            if (this.jBoardTasks.jTask === 'recSub') {
              // console.log('Preparing to retrieve submitted papers')
              this.getReceivedSub()
              return
            } else if (this.jBoardTasks.jTask === 'revisedSub') {
              // console.log('Preparing to retrieve revised papers')
              this.getRevisedSub()
              return
            } else if (this.jBoardTasks.jTask === 'paymentsMade') {
              // console.log('Preparing to retrieve accepted paid papers')
              this.getPaidPapers()
              return
            } else if (this.jBoardTasks.jTask === 'requestedPaper') {
              // console.log('Preparing to retrieve requested papers')
              this.getReqPaper()
              return
            } else if (this.jBoardTasks.jTask === 'sendPaperToUser') {
              // console.log('Preparing for send paper to user procedure.')
              if (this.reqIPFShashes.length === 0) {
                this.defaultPageItem = true
                this.$alert('There exist no requested paper to be sent.', 'Status of requested papers.', {
                  confirmButtonText: 'OK',
                  callback: action => {
                    this.$message({
                      type: 'info',
                      message: `action: ${action}`
                    })
                  }
                })
              } else {
                this.captureSendPaperToUserDialog = true
              }
            }
            this.jDashboardTaskBtnLoadState = false
          } else {
            console.log('Submission error.')
            this.jDashboardTaskBtnLoadState = false
            return false
          }
        })
      } else {
        this.$message('Enter required journal account. Reloading page...')
        window.location.reload()
      }
    },
    jPubKeyInputValidation (input) {
      const count = input.toString().length
      if (input === '' || isNaN(input) === true || input < 0 || count <= 63) {
        return 0
      } else {
        return 1
      }
    },
    backToPrvPage () {
      this.$router.push('managerlanding')
    },
    getReceivedSub () {
      this.pageTableData.splice(0, this.pageTableData.length) // Remove all previously stored values.
      this.jDashboardTaskBtnLoadState = false
      this.receivedSubLoading = true
      this.defaultPageItem = false
      this.revisedSub = false
      this.reqPaper = false
      this.sendPaperToUser = false
      this.paidPapers = false
      // Perform required task and return true.
      var jpBlockContract = new web3.eth.Contract(ABI, contractAddress, { defaultGas: suppliedGas })// End of ABi Code from Remix.
      console.log('Contract instance for access type retrieval created.')
      jpBlockContract.getPastEvents('journalRecSub', { filter: { jAddress: [web3.eth.defaultAccount] }, fromBlock: 0, toBlock: 'latest' },
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
              console.log('Total submissions: ', Object.keys(results).length)
              for (let i = 0; i < Object.keys(results).length; i++) {
                this.pageTableData[i] = []
                this.pageTableData[i].paperHash = results[i].returnValues.paperHash
                this.pageTableData[i].paperTitle = web3.utils.hexToUtf8(results[i].returnValues.paperTitle)
                this.pageTableData[i].submittingAuthor = results[i].returnValues.submittingAuthor
                this.pageTableData[i].userPubKey = results[i].returnValues.userPubKey
              }
              this.jDashboardTaskBtnLoadState = false
              this.receivedSubLoading = false
              // console.log('Objet to display as table: ', this.pageTableData)
              this.receivedSub = true
            }
          }
        })
    },
    getRevisedSub () {
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
    getPaidPapers () {
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
    getAHFaddress () {

    },
    getSendPaperToUser () {
      this.jDashboardTaskBtnLoadState = true
      this.sendPaperLoading = true
      this.defaultPageItem = false // 1
      this.receivedSub = false // 2
      this.reqPaper = false // 3
      this.paidPapers = false // 4
      this.revisedSub = false // 5
      // Perform required task and return true.
      this.sendPaperLoading = false
      this.sendPaperToUser = true // 6
    },
    convertHextoBytes (hexString) {
      var bytes = new Uint8Array(Math.ceil(hexString.length / 2))
      for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hexString.substr(i * 2, 2), 16)
      return bytes
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
