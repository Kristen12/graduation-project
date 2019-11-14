<template>
  <div class="home">
    <!-- 轮播图 -->
  	<van-swipe :autoplay="3000" class="swipe-size">
	  	<van-swipe-item
	  		v-for="(image, index) in swipeImgs"
	  		:key="index">
	    	<img :src="image" @click="swipeClick"/>
	  	</van-swipe-item>
	  </van-swipe>
    <!-- 作品推荐 -->
  	<div class="home-work">
  		<p>{{ workTitle }}</p>
  		<div class="home-work-ul">
  			<div class="img-box" v-for="(item, index) in picIntro">
  				<div class="img" v-lazy:background-image="item.picContent" @click="workClick(item)"></div>
  			</div>
  		</div>
  	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ImagePreview } from 'vant';
import axios from 'axios';
import url from '@/service.config.js';

export default {
  	name: 'home',
  	components: {},
  	data() {
    	return {
      		swipeImgs:[
        		require('../assets/WechatIMG3.jpeg'),
        		require('../assets/WechatIMG4.jpeg'),
        		require('../assets/WechatIMG5.jpeg'),
        		require('../assets/WechatIMG6.jpeg'),
      		],
          picIntro: [],
          workTitle: '推荐作品',
    	};
  	},
    mounted() {
      setTimeout(()=>{
        this.showPic();
      });
    },
    methods: {
      swipeClick() {
        ImagePreview(this.swipeImgs);
      },
      workClick(item) {
        this.$router.push('/follow?userid=' + encodeURI(item.userId) + '&picid=' + encodeURI(item._id));
      },
      showPic() {
        axios({
          url: url.showPic,
          method: 'post',
        }).then(res=>{
          this.picIntro = res.data.data;
        }).catch(err=>{
          console.log(err);
        });
      },

    }
}
</script>

<style scoped>
.home {
  margin-bottom: 0.44rem;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.swipe-size {
  width: 90%;
  height: 2.5rem;
  margin: 0.1rem auto;
}
.swipe-size img {
	width: 100%;
	height: auto;
}

.home-work p {
	margin: 0.3rem 0.17rem 0;
	color: #999;
	font-size: 0.14rem;
}
.home-work-ul {
	overflow: hidden;
}
.img-box {
	height: 2.5rem;
  margin: 0.2rem;
  box-shadow: 4px 4px 10px #ccc;
}
.img {
	width: 100%;
  height: 100%;
  display: block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
}
</style>
