<template>
<body>
  <header-main></header-main>
    
      <router-view></router-view>
    
  <footer-main></footer-main>
</body>
</template>

<script>
import Header from "./components/layouts/Header"
import Footer from "./components/layouts/Footer"

export default {
  name: 'App',
  components: {
    'header-main': Header,
    'footer-main': Footer
  }
}
</script>

<style lang="scss" scoped>

body {
  width: 100%;
  height: 100%;
  margin:0;
  padding:0;
}

</style>