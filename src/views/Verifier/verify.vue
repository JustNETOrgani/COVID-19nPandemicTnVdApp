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
                                <el-col :span="9" :offset="0">
                                    <p id="computedLabel">Person signature:</p>
                                </el-col>
                                <el-col :span="6" :offset="0">
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

export default {
  // name: 'Home',
  data () {
    return {
      verificationForm: {
        ifpsHash: '',
        verifyBtnLoadState: false
      },
      sigOnIPFShash: '',
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

  },
  methods: {
    backToPrvPg () {
      this.$router.push('/')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
  font-size: 1rem;
  color: rgb(113, 140, 189);
}
#formattedString{
  font-size: 0.71rem;
  font-style: italic;
  color: rgb(95, 64, 116);
}
</style>
