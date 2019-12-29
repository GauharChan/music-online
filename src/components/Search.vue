<template>
  <div>
    <div class="input-box gh-between">
      <input
        type="text"
        class="input"
        placeholder="请输入关键字搜索"
        v-model="keyword"
        @keyup.enter="handleSearch"
      />
      <div class="icon-box" @click="handleSearch">
        <i class="iconfont icon-search"></i>
      </div>
    </div>
    <!-- 抽屉 -->
    <el-drawer
      title=""
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
    >
      <div class="tips gh-center">关键字不能为空哦！</div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: "",
      drawer: false,
      direction: 'ltr',
    };
  },
  methods: {
    handleSearch() {
      if (!this.keyword) {
        this.drawer = true
        return
      }
      this.$axios.get('https://autumnfish.cn/search',{
        params:{
          keywords: this.keyword
        }
      }).then((res) => {
        let list = res.data.result
        this.$emit('getSongList',list)
      }).catch(err => {
        console.log(err);
      })
    },
  }
};
</script>
<style lang='less' scoped>
.input-box {
  width: 15rem;
  height: 2rem;
  padding: 0rem 0.6rem;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, .5);
  .input {
    flex: 1;
    height: inherit;
    border: none;
    outline: none;
    background-color: transparent;
  }
  .icon-box {
    padding: 0.3rem;
    i {
      font-size: 1.2rem;
    }
  }
}
.tips{
  height: 100%;
}
</style>