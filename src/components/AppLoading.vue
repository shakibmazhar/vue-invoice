<template>
  <div class="app-loading flex">
      <img src="https://img.icons8.com/color/48/000000/rhombus-loader.png"/>
  </div>
</template>

<script>
    export default {
        name: 'AppLoading'
    }
</script>

<style scoped>
    .app-loading{
        height: 100vh;
        width: 100vw;
        background-color: #141625;
        align-items: center;
        justify-content: center;
    }

    img{
        width: 40vw;
        max-width: 300px;
    }
</style>