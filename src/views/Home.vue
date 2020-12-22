<template>
  <div class="home">
    <Head></Head>
    <div id="wrapper">
      <el-row :gutter="50">
        <el-col :span="8">
          <el-card shadow="hover">
            <img class="unitLogo" src="../assets/imgs/healthFac.png" />
            Health facility
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <img class="unitLogo" src="../assets/imgs/verify.png" />
            Verifier
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <img class="unitLogo" src="../assets/imgs/yetTocome.jpg" />
            Loading...
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
#footerDiv {
  position: absolute;
  top: 38em;
  left: 0;
  width: 100%;
  height: 14%;
}
</style>
