<template>
  <div class="home">
    <header class="gh-between">
      <div class="title">gauhar</div>
      <Search @getSongList="getSongList" />
    </header>
    <main class="flex">
      <!-- <div class="music-list"> -->
      <el-scrollbar view-class="view-box" :native="false" wrap-class="music-list">
        <div class="item gh-between" v-for="(item, index) in songList" :key="index">
          <i class="iconfont icon-bofang" @click="handlePlay(item.id)"></i>
          <div class="item-text">{{item.name}}-{{item.artists[0].name}}</div>
          <i class="iconfont icon-PlayIconFilled"></i>
        </div>
      </el-scrollbar>
      <!-- </div> -->
      <!-- <div class="music-list">
        <div class="item gh-between" v-for="(item, index) in songList" :key="index">
          <i class="iconfont icon-bofang"></i>
          <div class="item-text">{{item.name}}-{{item.artists[0].name}}</div>
          <i class="iconfont icon-PlayIconFilled"></i>
        </div>
      </div>-->
      <div class="center-wall"></div>
      <div class="comment"></div>
    </main>
    <footer>
      <audio ref="audio" autoplay :src="url" controls></audio>
    </footer>
    <!-- 抽屉 -->
    <el-drawer title :visible.sync="drawer" :direction="direction" :with-header="false">
      <div class="tips gh-center">暂时没有该资源！</div>
    </el-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from "../components/Search";
export default {
  name: "home",
  data() {
    return {
      songList: [],
      url: "",
      drawer: false,
      direction: "ttb"
    };
  },
  components: {
    Search
  },
  mounted() {
    let songList = localStorage.getItem("songList");
    if (!songList) {
      songList = "[]";
    }
    this.songList = JSON.parse(songList);
  },
  methods: {
    getSongList(list) {
      this.songList = list.songs;
      localStorage.setItem("songList", JSON.stringify(this.songList));
    },
    handlePlay(id) {
      this.$axios
        .get("https://autumnfish.cn/song/url", {
          params: {
            id
          }
        })
        .then(res => {
          this.url = res.data.data[0].url;
          if (!this.url) {
            this.drawer = true;
            return;
          }
          this.$refs.audio.load();
        });
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 70%;
  height: 70vh;
  margin: 15vh auto 0;
  background-color: rgba(255, 255, 255, 0.2);
  // header
  header {
    padding: 1rem;
    background-color: #da3a3a;

    .title {
      color: #fff;
      font-size: 1rem;
    }
  }
  // mian
  main {
    height: calc(100% - 4rem);
    .el-scrollbar {
      width: 25%;
    }
    /deep/.el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /deep/.el-scrollbar__thumb {
      background-color: rgb(202, 71, 71);
    }
    .music-list {
      width: 25%;
      height: 100%;
      box-sizing: border-box;
      .item {
        padding: 0.5rem;
        padding-right: 1rem;
        &:nth-child(2n + 1) {
          background-color: rgba(255, 255, 255, 0.4);
        }
        .icon-bofang {
          color: red;
          font-size: 1rem;
        }
        .item-text {
          font-size: 0.7rem;
        }
        .icon-PlayIconFilled {
          color: red;
          font-size: 1rem;
        }
      }
    }
    .center-wall {
      width: 50%;
      height: 100%;
      border-left: 2px solid #ccc;
      border-right: 2px solid #ccc;
    }
    .comment {
      width: 25%;
      height: 100%;
    }
  }
  footer {
    audio {
      width: 100%;
      -moz-border-radius: 0px;
      -webkit-border-radius: 0px;
      border-radius: 0px;
      background-color: #fff;
    }
  }
  .tips {
    height: 100%;
  }
}
</style>
