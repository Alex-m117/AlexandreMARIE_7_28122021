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
      this.connected = true
      tag.$router.push('/post/:id');

    }
    else if (token == undefined || null) {
      this.connected = false
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