<template>
  <div class="list">
  	<van-list
      class="list-content"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
      <van-cell
        class="list-cell"
        v-for="(item,index) in list"
        :key="item.id"
        @click="cellClick(item)">
        <img :src='item.userHead'/>
        <span>{{ item.userName }}</span>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';

export default {
  name: 'followerlist',
  components: {
  },
  data() {
  	return {
      list: [],
      loading: false,
      finished: false,

      myid: '',
      userid: '',
      followlist: [],
    };
  },
  computed: {
      ...mapState(['userInfo']),
  },
  mounted() {
    console.log(this.userInfo.userName);
    this.myid = this.$route.query.userid;
    console.log(this.myid);
    setTimeout(()=>{
      this.myInto();
    });
  },
  methods: {

    myInto() {
      axios({
        url: url.followedNum,
        method: 'post',
        data: {
          userid: this.myid,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.followlist = res.data.data;
        }
      }).catch(err=>{
        console.log(err);
      });
    },

    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let j = 0; j < this.followlist.length; j++) {
            if(this.followlist[j].userHead == '') {
              this.followlist[j].userHead = require('../assets/default_img.jpeg');
            }
            this.list.push(this.followlist[j]);
        }
        //加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= this.followlist.length) {
          this.finished = true;
        }
      }, 500);
    },

    cellClick(item) {
      console.log(item);
      if(item.userName == this.userInfo.userName) {
        this.$router.push('/introduce');
      }
      else {
        this.$router.push('/friends?userid=' + item._id);
      }
    }
  }
}
</script>
<style scoped>
.list {
	padding-bottom: 0.44rem;
  position: absolute;
  width: 100%;
  background-color: #f1f1f1;
  height: 100%;
}
.list-content {
  margin-bottom:0.44rem;
  border-top: 1px solid #f1f1f1;
}
.list-cell img {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  margin-right: 0.3rem;
}
</style>