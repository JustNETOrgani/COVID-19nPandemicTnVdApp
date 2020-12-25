<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper">
            <h2>Approved Health Facility Dashboard</h2>
            <el-row>
                <el-col :span="12">
                    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                    <el-radio-button :label="false">Expand menu</el-radio-button>
                    <el-radio-button :label="true">Collapse menu</el-radio-button>
                    </el-radio-group>
                    <el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-user-solid"></i>
                        <span slot="title">Person onboarding</span>
                        </template>
                        <el-menu-item-group>
                        <span slot="title">User registration</span>
                        <el-menu-item index="1-1">Onboard user</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="AHF Admin">
                        <el-menu-item index="1-3">Verify AHP signature</el-menu-item>
                        <el-menu-item index="1-4">Anchor on Blockchain</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-5" disabled>
                        <span slot="title">More</span>
                        <el-menu-item index="1-5-1">Loading...</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2" disabled>
                        <i class="el-icon-menu"></i>
                        <span slot="title">Navigator Two</span>
                    </el-menu-item>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span slot="title">Navigator Three</span>
                    </el-menu-item>
                    </el-menu>
                </el-col>
                 <el-col :span="12">
                   <h3>Core tasks.</h3>
                   <a href="personOnboarding"><img class="coreTasksLogo" src="../../assets/imgs/onboardPerson.png" /></a>
                   <br>
                   <el-link :underline="false" href="personOnboarding"><p class="imgDescription">Person onboarding</p></el-link>
                   <br>
                   <a href="ahfStatistics"><img class="coreTasksLogo" src="../../assets/imgs/statisticsImg.png" /></a>
                   <br>
                  <el-link :underline="false" href="ahfStatistics"><p>Retrieve test/vaccine statistics for this AHF</p></el-link>
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.coreTasksLogo{
  height: 5rem;
  border-radius: 50%;
  width: 5em;
}
.coreTasksLogo:hover{
    transform: scale(1.1); /* Negative value rotates and decreases size.*/
}
.imgDescription{
    margin-bottom: 3rem;
}
</style>
