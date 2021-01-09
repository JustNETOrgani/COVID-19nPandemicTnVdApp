<template>
  <div class="home">
    <Head></Head>
    <div id="wrapper">
      <el-row :gutter="50">
        <el-col :span="6">
          <el-card shadow="hover">
            <a href="ContractManager/managerLanding"><img class="unitLogo" src="../assets/imgs/contractDeployer.png" /></a>
            <br>
            <el-link :underline="false" href="ContractManager/managerLanding"><p class="identification">Contract Deployer</p></el-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <a href="HealthFacility/healthFacIndexPg"><img class="unitLogo" src="../assets/imgs/healthFac.png" /></a>
            <br>
            <el-link :underline="false" href="HealthFacility/healthFacIndexPg"><p class="identification">Health facility</p></el-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <a href="Person/createBlockchainAccount"><img class="unitLogo" src="../assets/imgs/personImg.png" /></a>
            <br>
            <el-link :underline="false" href="Person/createBlockchainAccount"><p class="identification">Person</p></el-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <a href="Verifier/verify"><img class="unitLogo" src="../assets/imgs/verify.png" /></a>
            <br>
            <el-link :underline="false" href="Verifier/verify"><p class="identification">Verifier</p></el-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
  <div id="footerDiv">
    <Footer></Footer>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Head from '@/components/header'
import Footer from '@/components/footer'

export default {
  // name: 'Home',
  data () {
    return {

    }
  },
  components: {
    Head,
    Footer
  },
  created () {

  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>
#wrapper{
  margin: 2em 10em;
}
.unitLogo{
  height: 10rem;
  border-radius: 50%;
  width: 10em;
}
.unitLogo:hover{
    transform: scale(1.1); /* Negative value rotates and decreases size.*/
}
.identification{
  color: rgb(133, 112, 143);
  font-size: 1.5rem;
  font-family: sans-serif;
}
#footerDiv {
  position: absolute;
  top: 36em;
  left: 0;
  width: 100%;
  height: 14%;
}
</style>
