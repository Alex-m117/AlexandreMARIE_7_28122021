<template>
    <header> 
        <a href="/" class="header"> 
            <img src="../../assets/images/logo_white.png" alt="Groupomania">
        </a>
    </header>
</template>

<script>
export default {
name: 'Header'
}
</script>

<style lang="scss" scoped >

.header {
    display:flex;
    justify-content: center;
    width: 100%;
    background-color: #303030;
}

img {
    display:flex;
    justify-content: center;
    width: 35%;
    padding:5px;
    padding-top:10px;
}


</style>