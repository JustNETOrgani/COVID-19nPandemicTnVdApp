<template>
  <div class="home">
    <Head></Head>
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
#footerDiv {
  position: absolute;
  top: 38em;
  left: 0;
  width: 100%;
  height: 14%;
}
</style>
