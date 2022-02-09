<template>
  <div class="home">
    <Post v-if="controlUser()" />
  </div>
</template>

<script>
import Post from './Post.vue';

export default {
  name : 'Home',

  components : { 
    Post,
    },
  data: function() {
    return {
    connected: true,
    }
  },
  methods: {
  controlUser: function() {
    const tag = this;
    const token = localStorage.getItem("token");

    if (token !== undefined || null) {
      console.log(localStorage.token)
      this.connected = true
      console.log('test connect')
      tag.$router.push('/post/:id');

    }
    else if (token == undefined || null) {
      this.connected = false
      console.log('test reject')
      tag.$router.push('/');
    }
  },
  created() {
    this.controlUser()
  },
},
};
</script>
<style scoped></style>