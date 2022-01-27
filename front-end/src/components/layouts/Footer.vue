<template>
  <footer>
    <ul>
        <li><a href="mailto:contact@groupomania.com"><fa icon="at"/> Contact</a></li>
        <li><a href="#"><fa icon="copyright"/> 2022 - Groupomania</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style lang="scss" scoped>

footer {
    display: flex;
    width: 100%;
    height: 50px;
    background-color: #303030;
};

ul {
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
};

li {
    list-style-type: none;
};

a {
    color:white;
    text-decoration: none;
    font-size: 16px;
};

</style>