<template>
  <div class="home">
    <posts></posts>
  </div>
</template>

<script>
import Post from "./components/Post"

export default {
    name: "Home",
    components: { 'posts': Post, }
}
</script>

<style>

</style>