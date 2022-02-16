<template>
    <header> 
          <img src="../../assets/images/logo_white.png" alt="Groupomania">
    </header>
</template>

<script>
export default {
name: 'Header'
}
</script>

<style lang="scss" scoped >

header {
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

// Média Queries

@media (min-width: 280px) and (max-width: 400px) {

img {
     width: 80%
}

};

@media (min-width: 400px)and (max-width: 700px) {

img {
     width: 60%
}

};

@media (min-width: 700px)and (max-width: 850px) {

img {
     width: 45%
}

};

@media (min-width: 1300px)and (max-width: 1900px) {

img {
     width: 30%
}

};

</style>