<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper">
            <h2>Contract Deployer Management</h2>
            <el-row>
                <el-col :span="12">
                    <el-menu
                    default-active="1-1"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-user-solid"></i>
                        <span>AHF Management</span>
                        </template>
                        <el-menu-item-group title="About AHF">
                        <el-menu-item index="1-1">Register new AHF</el-menu-item>
                        <el-menu-item index="1-2"><el-link :underline="false" style="color:#fff" href="ContractManager/revokeAHF">Revoke AHF Licence</el-link></el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Covid-19 Statistics">
                        <el-menu-item index="1-3">Check statistics</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                        <template slot="title">More</template>
                        <el-menu-item index="1-4-1">Detailed analysis</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2" disabled>
                        <i class="el-icon-menu"></i>
                        <span>Navigator Two</span>
                    </el-menu-item>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span>Navigator Three</span>
                    </el-menu-item>
                    <el-menu-item index="4" disabled>
                        <i class="el-icon-setting"></i>
                        <span>Navigator Four</span>
                    </el-menu-item>
                    </el-menu>
                </el-col>
                 <el-col :span="12">
                   <h3>Core tasks.</h3>
                   <a href="registerAHF"><img class="coreTasksLogo" src="../../assets/imgs/registerAHF.png" /></a>
                   <br>
                   <el-link :underline="false" href="registerAHF"><p>Register new AHF</p></el-link>
                   <br>
                   <a href="statistics"><img class="coreTasksLogo" src="../../assets/imgs/statisticsImg.png" /></a>
                   <br>
                   <el-link :underline="false" href="statistics"><p>Retrieve test/vaccine statistics</p></el-link>
                   <br>
                   <a href="revokeAHF"><img class="coreTasksLogo" src="../../assets/imgs/revokeAHF.png" /></a>
                   <br>
                   <el-link :underline="false" href="revokeAHF"><p>Revoke AHF</p></el-link>
                 </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    backToPrvPg () {
      this.$router.push('/')
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
.coreTasksLogo{
  height: 5rem;
  border-radius: 50%;
  width: 5em;
}
.coreTasksLogo:hover{
    transform: scale(1.1); /* Negative value rotates and decreases size.*/
}
</style>
