<template>
  <div class="home">
    <header class="gh-between">
      <div class="title">悦听</div>
      <Search />
    </header>
    <main class="flex">
      <div class="music-list"></div>
      <div class="center-wall"></div>
      <div class="comment"></div>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '../components/Search'
export default {
  name: 'home',
  components:{
    Search
  }
}
</script>
<style lang="less" scoped>
  .home{
    width: 70%;
    height: 70vh;
    margin: 15vh auto 0;
    background-color: rgba(255, 255, 255, .2);
    // header
    header{
      padding: 1rem;
      background-color: #13a1df;

      .title{
        color: #fff;
        font-size: 1rem;
      }
    }
    // mian
    main{
      height: 100%;
      .music-list{
        width: 25%;
        height: 100%;
        background-color: red;
      }
      .center-wall{
        width: 50%;
        height: 100%;
        background-color: green;
      }
      .comment{
        width: 25%;
        height: 100%;
        background-color: blue;
      }
    }
  }
</style>
