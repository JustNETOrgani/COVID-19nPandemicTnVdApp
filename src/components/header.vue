<template>
  <div class="header">
    <img class="logo" src="../assets/imgs/app_logo.png" />
    <div class="menu">
      <p id="appHeadingOne">Privacy-preserving Covid-19 test result and vaccination provenance based on Blockchain and Smart Contract</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Head',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.header {
  height: 4.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  background-color: #ffffff;
}
.logo {
  height: 5rem;
}

.menu {
  flex: 1;
  display: flex;
  /* align-items: center; */
  justify-content: flex-end;
}

.menu-item {
  text-decoration: none;
  color: #60bdfa;
  margin: 0 0.5rem;
}

#appHeadingOne{
    color: rgb(60, 87, 117);
    font-size: 2rem;
    font-family: sans-serif;
    margin: 0.5% auto;
}
el-menu-item:hover{
  text-decoration: cadetblue;
}
</style>
