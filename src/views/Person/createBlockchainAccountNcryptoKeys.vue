<template>
    <div class="pageContainer">
        <div id="topNav">
          <el-link icon="el-icon-arrow-left" style="font-size:17px;float:left;" @click="backToPrvPg">Previous Page</el-link>
        </div>
        <div class="wrapper">
            <h2>Person Blockchain credential creation</h2>
            <el-row>
                <el-col :span="12">
                  <el-link :underline="false" href="https://www.myetherwallet.com/" target="_blank">
                    <p>Create your blockchian address here</p>
                  </el-link>
                </el-col>
                <el-col :span="12">
                  <a href="https://www.myetherwallet.com/"><img src="../../assets/imgs/mewImg.png" /></a>
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
</style>
