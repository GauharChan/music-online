<template>
  <div class="home">
    <header class="gh-between">
      <div class="title">gauhar</div>
      <Search @getSongList="getSongList" />
    </header>
    <main class="flex">
      <el-scrollbar view-class="view-box" :native="false" wrap-class="music-list">
        <div class="item gh-between" v-for="(item, index) in songList" :key="index">
          <i class="iconfont icon-bofang" @click="handlePlay(item.id)"></i>
          <div class="item-text">{{item.name}}-{{item.artists[0].name}}</div>
          <i class="iconfont icon-PlayIconFilled"></i>
        </div>
      </el-scrollbar>
      <!-- <div class="music-list">
        <div class="item gh-between" v-for="(item, index) in songList" :key="index">
          <i class="iconfont icon-bofang"></i>
          <div class="item-text">{{item.name}}-{{item.artists[0].name}}</div>
          <i class="iconfont icon-PlayIconFilled"></i>
        </div>
      </div>-->
      <div class="center-wall">
        <!-- 封面 -->
        <div class="bi-box">
          <img src="../assets/bi.png" alt />
        </div>
        <div class="cd-box">
          <img class="cd-bg" src="../assets/center.png" alt />
          <img class="album" :src="picUrl" alt />
        </div>
      </div>
      <div class="comment"></div>
    </main>
    <footer>
      <audio ref="audio" autoplay :src="url" controls @ended="handleNext"></audio>
    </footer>
    <!-- 抽屉 -->
    <el-drawer
      title
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      :before-close="handleClose"
    >
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
      direction: "ttb",
      playId: 0,
      picUrl: require("../assets/default.png")
    };
  },
  components: {
    Search
  },
  mounted() {
    // 获取上一次搜索的歌曲列表
    let songList = localStorage.getItem("songList");
    if (!songList) {
      songList = "[]";
    }
    this.songList = JSON.parse(songList);
  },
  methods: {
    // 获取歌曲列表
    getSongList(list) {
      this.songList = list.songs;
      this.$print(this.songList);
      localStorage.setItem("songList", JSON.stringify(this.songList));
    },
    handlePlay(id) {
      // 把点击播放的id记录下来，为播下一首
      this.playId = id;
      // 获取歌曲链接
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
          this.$refs.audio.volume = 0.5;
          this.$refs.audio.load();
        });
      // 获取封面
      this.$axios
        .get("https://autumnfish.cn/song/detail", {
          params: {
            ids: id
          }
        })
        .then(res => {
          let src = res.data.songs[0].al.picUrl;
          src ? (this.picUrl = src) : (this.picUrl = "../assets/default.jpg");
        });
      // 获取评论
      this.$axios
        .get("https://autumnfish.cn/comment/hot?type=0", {
          params: {
            id
          }
        })
        .then(res => {
          console.log(res.data);
        });
    },
    handleClose(done) {
      // 关闭抽屉
      this.handleNext();
      done();
    },
    handleNext() {
      // 下一首
      let that = this;
      this.songList.some((e, i) => {
        if (e.id == that.playId) {
          // 如果是最后一首，则下一首播放列表第一首
          let id =
            i == that.songList.length - 1
              ? that.songList[0].id
              : that.songList[i + 1].id;
          that.handlePlay(id);
          return true;
        }
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
      position: relative;
      width: 50%;
      height: 100%;
      border-left: 2px solid #ccc;
      border-right: 2px solid #ccc;
      .bi-box {
        position: absolute;
        top: 0px;
        right: 50%;
        width: 4rem;
        margin-right: -2rem;
        z-index: 3;
      }
      .cd-box {
        position: relative;
        width: 70%;
        height: 100%;
        margin: 0 auto;
        .cd-bg {
          position: absolute;
          top: 3rem;
          left: 0%;
          z-index: 2;
        }
        .album {
          width: 70%;
          border-radius: 50%;
          position: absolute;
          top: 22%;
          left: 15%;
          z-index: 1;
        }
      }
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
