<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  background: url("./assets/bg.jpg") no-repeat;
  background-size: 100% 100%;
  padding-top: 0.1px;
}

.flex {
  display: flex;
}

.gh-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gh-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.gh-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 768px) {
  html {
    font-size: 20px;
  }
}

@media screen and (max-width: 414px) {
  html {
    font-size: 10px;
  }
}
</style>
