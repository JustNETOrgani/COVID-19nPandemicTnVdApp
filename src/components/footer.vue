<template>
  <div>
    <el-footer>
      <el-row :gutter="20">
        <!-- <el-col :span="5">
            <div class="grid-content bg-purple-dark">
                <span id="ftLeftSpanOne">
                    <p class="quickLinks"><a href="/">Home</a></p>
                    <p class="quickLinks"><a href="/proveOfAuthorship">Prove Authorship</a></p>
                </span>
            </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-dark">
              <span id="ftLeftSpanTwo">
                    <p class="quickLinks"><a href="/authors/submitPaper">Submit Manuscript</a></p>
                    <p class="quickLinks"><a href="/paperTrackingService">Track Manuscript</a></p>
                </span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-dark">
                <span id="ftLeftSpanThree">
                    <p class="quickLinks"><a href="/authorProfile">Author Works</a></p>
                    <p class="quickLinks"><a href="/globalUsers/globalDashboard">Check Open Access</a></p>
                </span>
            </div>
        </el-col>

        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
              <a href="https://www.facebook.com"><img id="mysocialImg" src="../assets/imgs/fb.png" width="50px" height="50px" alt="facebook" class="rounded-circle"></a>
            </div>
        </el-col> -->
        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
                <a href="https://www.twitter.com"><img id="mysocialImg" src="../assets/imgs/tw.png" width="50px" height="50px" alt="twitter" class="rounded-circle"></a>
            </div>
        </el-col>
        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
                <a href="https://www.instagram.com"><img id="mysocialImg" src="../assets/imgs/instag.png" width="50px" height="50px" alt="instagram" class="rounded-circle"></a>
            </div>
        </el-col>
        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
                <a href="https://www.youtube.com"><img id="mysocialImg" src="../assets/imgs/yTube.png" width="50px" height="50px" alt="youtube" class="rounded-circle"></a>
            </div>
        </el-col>
        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
                <a href="https://www.baidu.com"><img id="mysocialImg" src="../assets/imgs/bdu.png" width="50px" height="50px" alt="baidu" class="rounded-circle"></a>
            </div>
        </el-col>
        <el-col :span="1">
            <div class="grid-content bg-purple-dark">
                <a href="https://www.github.com"><img id="mysocialImg" src="../assets/imgs/gith.png" width="50px" height="50px" alt="gitHub" class="rounded-circle"></a>
            </div>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                    <div id="footerBottom">
                        <p><u>BlockCovid-19: Designed by JustNET from SWUST - P. R. CHINA</u></p>
                        <p class="h6">Copyright © {{currentYear}} BlockCovid-19. All rights reserved.</p>
                    </div>
            </div>
          </el-col>
        </el-row>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {}
  },
  computed: {
    currentYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
/* .el-footer{
    background-color: #d6e1f0;
} */
.quickLinks{
    margin-left: 5.5%;
    margin-top: 3.5%;
}
.quickLinks a{
    color: inherit;
    text-decoration: none;
}

.quickLinks a:hover{
    color: rgb(104, 129, 124);
    font-family: cursive;
    text-decoration: none;
}
#footer h5{
  padding-left: 10px;
    border-left: 3px solid #eeeeee;
    padding-bottom: 2px;
    margin-bottom: 0.5px;
    color:#ffffff;
}
#footer a {
    color: #ffffff;
    text-decoration: none !important;
    background-color: transparent;
    -webkit-text-decoration-skip: objects;
}
#footer ul.social li{
    padding-top: 1.5%;
    padding-bottom: 0.5%;
    margin-right: 4%;
}
#footer ul.social li a i {
    margin-right: 5px;
  font-size:25px;
  -webkit-transition: .5s all ease;
  -moz-transition: .5s all ease;
    transition: .5s all ease;
}
#footer ul.social li:hover a i {
  font-size:30px;
    margin-top:-10px;
}

#footer ul.social li a:hover{
    color:#eeeeee;
}

#mysocialImg:hover{
    transform: scale(1.1); /* Negative value rotates and decreases size.*/
}

</style>
