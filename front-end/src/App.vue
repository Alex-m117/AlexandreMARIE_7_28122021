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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;1,100;1,300;1,400;1,500&display=swap');
body {
  font-family: "roboto", "sans-serif";
  width: 100%;
  height: 100%;
  margin:0;
  padding:0;
}

</style>