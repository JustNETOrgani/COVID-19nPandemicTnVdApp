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
        <div class="wrapper">
            <h2>Generate Asymmetric keys</h2>
            <el-row>
                <el-col :span="12" :offset="6">
                  <el-button type="primary" :loading="keyGenBtnLoadState" @click="keyGen()">Generate keys</el-button>
                </el-col>
            </el-row>
        </div>
        <div id="overlay">
          <div id="cryptoContainer">
            <el-row>
                <el-col :span="6" >
                   <el-card shadow="hover">
                    <table style="table-layout: fixed; width: 100%">
                      <tr>
                        <td style="word-wrap: break-word">{{pubKey}}}</td>
                      </tr>
                    </table>
                  </el-card>
                </el-col>
                <el-col :span="18">
                  <el-card shadow="hover">
                    <table style="table-layout: fixed; width: 100%">
                      <tr>
                        <td style="word-wrap: break-word">{{prvKey}}}</td>
                      </tr>
                    </table>
                  </el-card>
                </el-col>
            </el-row>
          </div>
          <el-button type="primary" @click="closeDiv()">Close</el-button>
        </div>
    </div>
</template>

<script>

export default {
  data () {
    return {
      keyGenBtnLoadState: false,
      prvKey: null,
      pubKey: null
    }
  },
  methods: {
    backToPrvPg () {
      this.$router.push('/')
    },
    keyGen () {
      this.keyGenBtnLoadState = true
      window.crypto.subtle.generateKey({
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
      ).then(keyPair => {
        console.log('Public key: ', keyPair.publicKey)
        console.log('Private key: ', keyPair.privateKey)
        this.exportPrvCryptoKey(keyPair.privateKey).then(exportedPrvKey => {
          this.prvKey = exportedPrvKey
          this.exportPubCryptoKey(keyPair.publicKey).then(exportedPubKey => {
            this.keyGenBtnLoadState = false
            console.log('Public key in PEM format: ', exportedPubKey)
            this.pubKey = exportedPubKey
            // Show Div
            document.getElementById('overlay').style.display = 'block'
          })
        }).catch(err => {
          console.log('Error converting to PEM format', err)
          this.keyGenBtnLoadState = false
        })
      }).catch(err => {
        this.keyGenBtnLoadState = false
        console.log('Error generating RSA keypair', err)
      })
    },
    // Key conversion function helpers begin.
    // Convert  an ArrayBuffer into a string
    ab2str (buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf))
    },
    async exportPrvCryptoKey (key) {
    // Export the given key and write it into the "exported-key" space.
      const exported = await window.crypto.subtle.exportKey(
        'pkcs8',
        key
      )
      const exportedAsString = this.ab2str(exported)
      const exportedAsBase64 = window.btoa(exportedAsString)
      const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`
      return pemExported
    }, // Key conversion function helpers end.
    async exportPubCryptoKey (key) {
      const exported = await window.crypto.subtle.exportKey(
        'spki',
        key
      )
      const exportedAsString = this.ab2str(exported)
      const exportedAsBase64 = window.btoa(exportedAsString)
      const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`
      return pemExported
    },
    // General function
    str2ab (str) {
      const buf = new ArrayBuffer(str.length)
      const bufView = new Uint8Array(buf)
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    },
    closeDiv () {
      document.getElementById('overlay').style.display = 'none'
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
#overlay {
  position: fixed;
  display: none; /* Should be hidden by on page load */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order based on other divs */
  cursor: pointer; /* Adds a pointer on hover */
}
#cryptoContainer {
  width: 60%;
  height: 70%;
  margin: 2% auto;
}
td {
  border: 1px solid;
}
</style>
