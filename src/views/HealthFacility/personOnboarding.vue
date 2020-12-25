<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper">
            <h2>Person Onboarding on the blockchain</h2>
            <el-row>
                <el-col :span="22">
                    <div class="grid-content bg-purple-dark">
                        <el-form
                            :model="onboardPerson"
                            :rules="rules"
                            ref="onboardPerson"
                            label-width="180px"
                        >
                            <el-form-item label="Person address" prop="personAddress">
                                <el-input v-model="onboardPerson.personAddress" placeholder="Please enter Eth address of person."></el-input>
                            </el-form-item>
                            <el-form-item label="**Journal's consent**" prop="authCheckBox">
                                <el-checkbox v-model="onboardPerson.authCheckBox">I fully understand the implication of this action.</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :loading="personOnboardLoadBtn" @click="submitForm('onboardPerson')">Submit</el-button>
                                <el-button @click="resetForm('onboardPerson')">Reset</el-button>
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
  data () {
    return {
      isCollapse: true
    }
  },
  methods: {
    backToPrvPg () {
      this.$router.push('/healthFacIndexPg')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
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
.wrapper {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 2.5% auto;
  width: 40%;
  padding: 1rem 1.5rem;
}
</style>
