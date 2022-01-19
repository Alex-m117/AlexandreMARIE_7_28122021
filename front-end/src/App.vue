<template>
<body id="app"> 
  <header-main></header-main>
    <main>
      <router-view></router-view>
    </main>
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
#app {
  margin:0;
  padding:0;
}
</style>
