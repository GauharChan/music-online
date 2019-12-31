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
          <i class="iconfont icon-PlayIconFilled" @click="handleMv(item.mvid)"></i>
        </div>
      </el-scrollbar>
      <!-- <div class="music-list">
        <div class="item gh-between" v-for="(item, index) in songList" :key="index">
          <i class="iconfont icon-bofang"></i>
          <div class="item-text">{{item.name}}-{{item.artists[0].name}}</div>
          <i class="iconfont icon-PlayIconFilled"></i>
        </div>
      </div>-->
      <div class="center-wall" :class="{playing: isPlaying}">
        <!-- 封面 -->
        <div class="bi-box">
          <img src="../assets/bi.png" alt />
        </div>
        <div class="cd-box">
          <img class="cd-bg" src="../assets/center.png" alt />
          <img class="album" :src="picUrl" alt />
        </div>
      </div>
      <!-- 评论 -->
      <el-scrollbar view-class="view-box" :native="false" wrap-class="comment">
        <h3>热门评论</h3>
        <div class="item flex" v-for="(item, index) in comment" :key="index">
          <img class="avatar-box" :src="item.user.avatarUrl" alt="头像" />
          <div class="comment-content-box">
            <div class="comment-title">{{item.user.nickname}}</div>
            <div class="comment-content">{{item.content}}</div>
          </div>
        </div>
      </el-scrollbar>
    </main>
    <footer>
      <audio
        ref="audio"
        autoplay
        :src="url"
        controls
        @ended="handleNext"
        @play="handleStart"
        @pause="handlePause"
      ></audio>
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
    <div class="mv-box" v-show="isMvPlaying" @click="handleCloseMv">
      <video ref="video" :src="mvUrl" autoplay controls></video>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from "../components/Search";
export default {
  name: "home",
  data() {
    return {
      // 歌曲列表
      songList: [],
      // 歌曲链接
      url: "",
      // 抽屉
      drawer: false,
      direction: "ttb",
      // 当前播放歌曲id
      playId: 0,
      // 专辑封面
      picUrl: require("../assets/default.png"),
      // 评论数组
      comment: [],
      // 播放中，暂停
      isPlaying: false,
      mvUrl: '',
      isMvPlaying: false
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
          this.comment = res.data.hotComments;
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
    },
    // 播放
    handleStart() {
      this.isPlaying = true;
    },
    // 暂停
    handlePause() {
      this.isPlaying = false;
    },
    handleMv(mvid){
      this.$axios.get('https://autumnfish.cn/mv/url',{
        params:{
          id: mvid
        }
      }).then(res => {
        let url = res.data.data.url
        this.mvUrl = url
        // 暂停音乐
        this.$refs.audio.pause()
        // 播放mv
        this.$refs.video.load()
        this.$refs.video.volume = 0.5;
        this.isMvPlaying = true
      })
    },
    handleCloseMv(){
      let that = this
      this.$confirm('你确定要关闭MV播放吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.isMvPlaying = false
          that.$refs.video.pause()
          this.$refs.audio.play()
        }).catch(() => {
                  
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
        top: -37px;
        right: 40%;
        width: 5rem;
        margin-right: -2rem;
        z-index: 3;
        transform: rotate(-40deg);
        transition: all 1s;
      }
      .cd-box {
        position: relative;
        width: 70%;
        height: 100%;
        margin: 20px auto 0;
        animation: around 10s infinite linear;
        animation-play-state: paused;
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
    .playing{
      .bi-box{
        top: 0px;
        right: 43%;
        transform: rotate(0deg);
        transition: all 1s;
      }
      .cd-box{
        animation-play-state: running;
      }
    }
    @keyframes around {
        0%{
          transform: rotate(0deg);
        }
        25%{
          transform: rotate(90deg);
        }
        50%{
          transform: rotate(180deg);
        }
        75%{
          transform: rotate(270deg);
        }
        100%{
          transform: rotate(360deg);
        }
      }
    .comment {
      width: 25%;
      height: 100%;
      h3 {
        padding: 0.3rem;
      }
      .item {
        padding: 0.5rem;
        .avatar-box {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
        .comment-content-box {
          flex: 1;
          padding: 0.5rem;
          padding-top: 0;
          .comment-title {
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 0.2rem;
          }
          .comment-content {
            font-size: 0.6rem;
            color: #000;
            line-height: 0.8rem;
          }
        }
      }
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
  .mv-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.8);
    z-index: 4;
    video{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 26rem;
      height: 18rem;
      margin-top: -9rem;
      margin-left: -13rem;
      outline: none;
      z-index: 6;
    }
  }
  .mvPlaying{
    display: flex;
  }
}
</style>
