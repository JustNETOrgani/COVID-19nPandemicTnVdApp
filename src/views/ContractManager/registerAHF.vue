<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="formArea" v-loading="loadingJcreationPage">
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
                           <el-form-item label="**User's consent**" prop="authCheckBox">
                                <el-checkbox v-model="ahfRegistForm.authCheckBox">I fully understand the implication of this action.</el-checkbox>
                            </el-form-item>
                            <el-form-item label="Name of AHF" prop="ahfName">
                                <el-input v-model="ahfRegistForm.ahfName" placeholder="Name of the Aproved Health Facility (AHF)."></el-input>
                            </el-form-item>
                            <el-form-item label="Address of AHF" prop="ahfAddress">
                                <el-input v-model="ahfRegistForm.ahfAddress" placeholder="Please input Eth address of AHF."></el-input>
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

export default {
  // name: 'Home',
  data () {
    return {
      ahfRegistForm: {
        authCheckBox: '',
        ahfName: '',
        ahfAddress: '',
        registAHFBtnLoadState: false
      },
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

  },
  methods: {
    backToPrvPg () {
      this.$router.push('/')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
