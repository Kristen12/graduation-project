<template>
  <div class="friends">
    <!-- 他人主页 -->
  	<div class="friends-intro">
      <div class="friends-left">
        <img class="user-img" :src='userhead'/>
      <div class="user-chat" @click="goChat">聊天</div>
      </div>
      <div class="friends-right">
        <p class="user-name-one">{{ username }}</p>
        <p class="user-name" @click="gotoList">他的关注<span> {{ followNum }}</span></p>
        <p class="user-name" @click="followerList">他的粉丝<span> {{ followedNum }}</span></p>
        <div class="follow-button" @click="userFollow">{{followTitle}}</div>
      </div>
    </div>

    <van-tabs>
        <van-tab title="他的作品">
          <div class="friends-work-ul" v-if="workImgs">
            <div class="img-box" v-for="(item, index) in workImgs">
              <div class="img" v-lazy:background-image="item.picContent" @click="workClick(item)"></div>
            </div>
          </div>
        </van-tab>

        <van-tab title="他的赞">
          <div class="friends-work-ul" v-if="likephoto">
            <div class="img-box" v-for="(item, index) in likephoto">
              <div class="img" v-lazy:background-image="item.picContent" @click="likeClick(item)"></div>
            </div>
          </div>
        </van-tab>

      </van-tabs>
    <!-- <div class="friends-tab">
      <p>他的作品</p>
    </div> -->
    <!-- <div class="friends-work-ul" v-if="workImgs">
      <div class="img-box" v-for="(item, index) in workImgs">
        <div class="img" v-lazy:background-image="item.picContent" @click="workClick(item)"></div>
      </div>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';

export default {
  	name: 'friends',
  	components: {
  	},
  	data() {
    	return {
      		followTitle: '关注',
          isfollow: false,
          islogin: false,
          myid: '',
          userid: '',
          username: '',
          userhead: require('../assets/default_img.jpeg'),
          workImgs: [],
          workLike: [],
          likephoto:[],
          followNum:'0',
          followedNum: '0',
          followList:[]

    	};
  	},
    computed: {
      ...mapState(['userInfo']),
    },
  	mounted() {
      this.islogin = this.userInfo.isLogin;
      this.myid = this.userInfo.userId;
      this.userid = this.$route.query.userid;
      setTimeout(()=>{
        this.userInto();
        this.userPic();
        this.myInto();
        this.followed();
      });
  	},
  	methods: {
      likePic() {
        axios({
          url: url.picInto,
          method: 'post',
          data: {
            userid: this.picid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            console.log(res);
          }
        }).catch(err=>{
          console.log(err);
        });
      },

      userInto() {
        axios({
          url: url.userInto,
          method: 'post',
          data: {
            userid: this.userid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            console.log(res.data);
            this.followList = res.data.data.followList;

            this.followNum = this.followList.length;
            // 名字
            this.username = res.data.data.userName;
            // 头像
            if(res.data.data.userHead !== '') {
              this.userhead = res.data.data.userHead;
            }
            else {
              this.userhead = require('../assets/default_img.jpeg');
            }

            this.workLike = res.data.data.likeList;
            for (var i = 0; i < this.workLike.length; i++) {
              axios({
                url: url.picInto,
                method: 'post',
                data: {
                  picid: this.workLike[i],
                }
              }).then(res=>{
                if(res.data.code == 200) {
                  this.likephoto.push(res.data.data);
                  this.user = res.data.data.userId;
                  console.log(this.likephoto);
                }
              }).catch(err=>{
                console.log(err);
              });
            }



          }
        }).catch(err=>{
          console.log(err);
        });
      },

      userPic() {
        axios({
          url: url.userPic,
          method: 'post',
          data: {
            userid: this.userid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            this.workImgs = res.data.data;
          }
        }).catch(err=>{
          console.log(err);
        });
      },

      gotoList() {
        this.$router.push('/list?userid=' + encodeURI(this.userid));
      },

      followerList() {
        this.$router.push('/followerlist?userid=' + encodeURI(this.userid));
      },

      workClick(item) {
        this.$router.push('/follow?userid=' + encodeURI(this.userid) + '&picid=' + encodeURI(item._id));
      },

      likeClick(item) {
        this.$router.push('/follow?userid=' + encodeURI(this.userid) + '&picid=' + encodeURI(item._id));
      },

      goChat() {
        this.$router.push('/chat?userid=' + encodeURI(this.userid));
      },

      myInto() {
        axios({
          url: url.userInto,
          method: 'post',
          data: {
            userid: this.myid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            // 关注状态
            if(res.data.data.followList.indexOf(this.userid) > -1) {
              this.isfollow = true;
              this.followTitle = '取消关注';
            }
            else{
              this.isfollow = false;
              this.followTitle = '关注';
            }
          }
        }).catch(err=>{
          console.log(err);
        });
      },

      userFollow() {
        this.isfollow = !this.isfollow;
        if(this.isfollow) {
          axios({
            url: url.isFollow,
            method: 'post',
            data: {
              userid: this.userid,
              myid: this.myid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.followTitle = '取消关注';
              setTimeout(()=>{
                this.$router.go(0);
              },500);
            }
          }).catch(err=>{
            console.log(err);
          });

        }
        else {
          axios({
            url: url.unFollow,
            method: 'post',
            data: {
              userid: this.userid,
              myid: this.myid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.followTitle = '关注';
              setTimeout(()=>{
                this.$router.go(0);
              },500);
            }
          }).catch(err=>{
            console.log(err);
          });
        }
      },

      followed() {
        axios({
          url: url.followedNum,
          method: 'post',
          data: {
            userid: this.userid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            console.log(res);
            this.followedNum = res.data.data.length;
            
          }
        }).catch(err=>{
          console.log(err);
        });
      }
    },



    
}
</script>

<style scoped>
.friends {
    margin-bottom: 0.44rem;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
}
.friends-intro {
  background-color: #fff;
  /* border-top: 1px solid #f1f1f1; */
  padding: 0.3rem;
  display: flex;
}
.friends-left {
  flex-grow: 1;
  width: 0;
  position: relative;
}
.user-img {
  border-radius: 50%;
  width: 0.8rem;
  height: 0.8rem;
  display: inline-block;
  margin-top: 0.2rem;
}
.user-chat {
  width: 0.8rem;
  text-align: center;
  /* margin-top: 0.2rem; */
  position: absolute;
  bottom: 0;
  background-color: #ff4444;
  height: 0.3rem;
  border-radius: 8px;
  line-height: 0.3rem;
  color: #fff;
}
.friends-right {
  flex-grow: 1;
  width: 0;
  text-align: center;
}
.user-name-one {
  font-size: 0.18rem;
  margin-bottom: 0.2rem; 
  font-weight: 500;
  line-height: 0.2rem;
  font-weight: 600 !important;
}
.user-name {
  font-size: 0.18rem;
  margin-bottom: 0.2rem; 
  font-weight: 500;
  line-height: 0.2rem;
}
.follow-button {
  background-color: #f1f1f1;
  border: none;
  color: #333;
  padding: 0.1rem 0;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.14rem;
  border-radius: 8px;
  width: 1.5rem;
}
.friends-tab {
  height: 0.4rem;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  text-align: center;
  line-height: 0.4rem;
}
.friends-work-ul {
  overflow: hidden;
  margin-bottom: 0.44rem;
}
.friends-work-ul .img-box {
  width: 50%;
  height: 1.5rem;
  float: left;
}
.img {
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
}
</style>