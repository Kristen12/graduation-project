<template>
  <div class="follow">
    <!-- 图片名片 -->
    <div class="follow-intro" @click="friensHome">
      <p class="user-des">{{ picText }}</p>
      <img class="user-img" :src='userhead'/>
      <span class="user-name">{{ username }}</span>
      <span class="user-like-box">
        <van-icon
        name="like"
        class="user-like" 
        :class="{'nomalColor': isLike==false, 'likeColor': isLike==true}"
        @click="likeClick"
        @click.stop/>
      </span>
      <span class="user-like-box">
        <van-icon
        name="star"
        class="user-like" 
        :class="{'snomalColor': isStar==false, 'starColor': isStar==true}"
        @click="collectClick"
        @click.stop/>
      </span>
    </div>
    <!-- 图片展示 -->
    <div class="work-img-box">
      <img class="work-img" :src='workImgs[0]' @click="workClick"/>
    </div>
    
    <!-- 三期修改 -->
    <van-tabs>
        <van-tab title="评论">
          <div class="follow-comment">
            <p>评论 ({{comments.length}})</p>
            <div class="follow-comment-box">
              <div v-if="comments" class="follow-work-ul">
                <div class="components-box" v-for="(item, index) in comments">
                  <img class="components-img" :src='item.userHead'/>
                  <span class="user-name">{{ item.userName }}</span>

                  <span class="repeat-name" v-if="item.reComment[0]!==''">回复：{{ item.reComment[0].userName }}</span>

                  <p class="components-text">{{ item.commentText }}</p>
                  <p class="components-date">{{ item.date }}</p>
                  <p class="components-repeat" @click='repeat(item)'>回复</p>
                </div>
                <div class="my-components">
                  <textarea  id='inputVal' style="vertical-align: middle;" cols="25" rows="5" placeholder="请输入你的评论..." v-model="comText"></textarea>
                </div>
                <div class="components-btn">
                  <van-button size="large"  type="danger" @click="submitComment">提交评论</van-button>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="点赞">
          <div class="follow-comment">
            <p class='liked-title'>点赞 ({{likedlist.length}})</p>
            <div v-if="likedlist.length!==0" class="follow-comment-box">
              <div v-for="(item, index) in likedlist">
                <div @click="likeder(item)">
                  <img class="liked-img" :src='item.userHead'/>
                  <span class="liked-name">{{ item.userName }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
    </van-tabs>
    <!-- 评论 -->
    <!-- <div class="follow-comment">
      <p>评论</p>
      <div class="follow-comment-box">
        <div v-if="comments" class="follow-work-ul">
          <div class="components-box" v-for="(item, index) in comments">
            <img class="components-img" :src='item.userHead'/>
            <span class="user-name">{{ item.userName }}</span>
            <p class="components-text">{{ item.commentText }}</p>
            <p class="components-date">{{ item.date }}</p>
          </div>
          <div class="my-components">
            <textarea style="vertical-align: middle;" cols="25" rows="5" placeholder="请输入你的评论..." v-model="comText"></textarea>
          </div>
          <div class="components-btn">
            <van-button type="primary" size="large" @click="submitComment">提交评论</van-button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { ImagePreview } from 'vant';
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';

export default {
  name: 'follow',
  components: {
  },
  data() {
    return {
      isLike: false,
      isStar: false,
      workImgs: [],
      // 用户id
      userid: '',
      // ”我的“id
      myid: '',
      picid: '',
      islogin: false,
      picText: '',
      username: '',
      userhead: require('../assets/default_img.jpeg'),
      likelist: [],
      comments: [],
      comText: '',
      myName: '',
      myHead: require('../assets/default_img.jpeg'),

      likedlist: [],
      repeatId: {},
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  mounted() {
    this.islogin = this.userInfo.isLogin;
    this.myid = this.userInfo.userId;
    this.myName = this.userInfo.userName
    this.userid = this.$route.query.userid;
    this.picid = this.$route.query.picid;

    setTimeout(()=>{
      this.picInto();
      this.userInto();
      this.myInto();
      this.showComment();
    });
  },
  methods: {
    // 用户主页
    friensHome() {
      if(this.islogin){
        if(this.username == this.myName) {
          this.$router.push('/introduce');
        }
        else {
          this.$router.push('/friends?userid=' + this.userid);
        }
      }
      else{
        this.$toast.fail('您未登录'); 
      }
      
    },

    workClick() {
      ImagePreview(this.workImgs);
    },

    picInto() {
      axios({
        url: url.picInto,
        method: 'post',
        data: {
          picid: this.picid,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.picText = res.data.data.picText;
          this.workImgs.push(res.data.data.picContent);
          this.likedlist = res.data.data.liked;
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
          // 名字
          this.username = res.data.data.userName;
          // 头像
          if(res.data.data.userHead !== '') {
            this.userhead = res.data.data.userHead;
          }
          else {
            this.userhead = require('../assets/default_img.jpeg');
          }
        }
      }).catch(err=>{
        console.log(err);
      });
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
          if (res.data.data.userHead !== '') {
            this.myHead = res.data.data.userHead;
          }
          else {
            this.myHead = require('../assets/default_img.jpeg');
          }
          // 点赞状态
          if(res.data.data.likeList.indexOf(this.picid) > -1) {

            this.isLike = true;
          }
          else{
            this.isLike = false;
          }

          //收藏状态
          if(res.data.data.collectList.indexOf(this.picid) > -1) {

            this.isStar = true;
          }
          else{
            this.isStar = false;
          }
        }
      }).catch(err=>{
        console.log(err);
      });
    },

    showComment() {
      axios({
        url: url.showComment,
        method: 'post',
        data: {
          picid: this.picid,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          console.log(res);
          this.comments = res.data.data;
        }
      }).catch(err=>{
        console.log(err);
      });
    },

    //tab展示点赞
    showLiked() {
      axios({
        url: url.showLiked,
        method: 'post',
        data: {
          userid: this.myid,
          picid: this.picid,
          userName: this.myName,
          userHead: this.myHead,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.$router.go(0);
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    //tab展示取消点赞
    showUnLiked() {
      axios({
        url: url.showUnLiked,
        method: 'post',
        data: {
          userid: this.myid,
          picid: this.picid,
          userName: this.myName,
          userHead: this.myHead,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.$router.go(0);
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    // 点赞
    likeClick() {
      if(this.islogin) {
        this.isLike = !this.isLike;
        if(this.isLike) {
          // this.likelist.push(this.picid);
          axios({
            url: url.isLike,
            method: 'post',
            data: {
              userid: this.myid,
              picid: this.picid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.$toast.success('成功点赞');
              setTimeout(()=>{
                this.showLiked();
              },500);
              
            }
          }).catch(err=>{
            console.log(err);
          });
        }
        else {
          axios({
            url: url.unLike,
            method: 'post',
            data: {
              userid: this.myid,
              picid: this.picid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.$toast.success('取消点赞');
              setTimeout(()=>{
                this.showUnLiked();
              },500);
              
            }
          }).catch(err=>{
            console.log(err);
          });
        }
      }
      else {
        this.$toast.fail('您未登录');
      }
    },

    likeder(item) {
      console.log(item);
      if(this.islogin){
        if(item.userName == this.myName) {
          this.$router.push('/introduce');
        }
        else {
          this.$router.push('/friends?userid=' + item.userId);
        }
      }
      else{
        this.$toast.fail('您未登录'); 
      }
    },






    // 收藏
    collectClick() {
      if(this.islogin) {
        this.isStar = !this.isStar;
        if(this.isStar) {
          axios({
            url: url.isStar,
            method: 'post',
            data: {
              userid: this.myid,
              picid: this.picid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.$toast.success('成功收藏');

            }
          }).catch(err=>{
            console.log(err);
          });
        }
        else {
          axios({
            url: url.unStar,
            method: 'post',
            data: {
              userid: this.myid,
              picid: this.picid,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.$toast.success('取消收藏');
            }
          }).catch(err=>{
            console.log(err);
          });
        }
      }
      else {
        this.$toast.fail('您未登录');
      }
    },

    

    // 提交评论
    submitComment() {
      if(this.islogin) {
        var date = new Date();
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds(); 
        var time = Y+M+D+h+m+s;


        var repeatId = this.repeatId;


        if (this.comText == ''){
          this.$toast.fail('评论非空');
        }
        else {
          axios({
            url: url.submitComment,
            method: 'post',
            data: {
              userId: this.myid,
              commentText: this.comText,
              picId: this.picid,
              date: time,
              userName: this.myName,
              userHead: this.myHead,
              reComment: JSON.stringify(repeatId)=='{}' ? '' : repeatId,
              // reComment: '',
            }
          }).then(res=>{
            if(res.data.code == 200) {
              console.log(res);
              console.log("success");
              this.repeatId = {};
              this.$router.go(0);
            }
          }).catch(err=>{
            console.log(err);
          });
        }
      }
      else {
        this.$toast.fail('您未登录');
      }
    },

    repeat(item) {
      this.$set(this.repeatId,'id',item._id);
      this.$set(this.repeatId,'userName',item.userName);
      console.log(this.repeatId);

      this.$nextTick(function () {
        document.getElementById("inputVal").focus();
      });
      // this.submitComment();

    },


  },
}
</script>

<style scoped>
.follow-intro {
  background: url('../assets/WechatIMG1740.jpeg') no-repeat center center;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
}
.user-des {
  margin: 0.3rem 0;
  width: 100%;
  text-overflow: ellipsis;
  word-wrap: break-word;
  line-height: 0.3rem;
  color: #fff;
  font-weight: 800;
  min-height: 1rem;
}
.user-img {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.user-name {
  font-size: 0.14rem;
  color: #999;
  margin-left: 0.08rem;
}
.repeat-name {
  font-size: 0.14rem;
  color: #436EEE;
  margin-left: 0.08rem;
}
.user-like-box {
  margin: 0.08rem;
}
.user-like {
  vertical-align: sub;
}
.nomalColor {
  color: #999;
}
.likeColor {
  color:  #FF4040;
}
.snomalColor {
  color: #999;
}
.starColor {
  color:  yellow;
}
.work-img-box {
  margin-bottom: 0.5rem;
}
.work-img {
  width: 100%;
  height: auto;
  display: block;
}
.follow-work-ul {
  margin: 0.1rem 0; 
}
.follow-comment {
  background: #f8f8f8;
  padding: 0.3rem;
  margin-bottom: 0.44rem;
}
.follow-comment-box {
  background: #fff;
  border-radius: 4px;
  padding: 0.1rem;
  margin: 0.2rem 0;
  min-height: 1rem;
}
.components-box {
  border-bottom: 1px dashed #f1f1f1;
  margin-bottom: 0.2rem;
}
.components-img {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.components-text {
  color: #333;
  font-size: 0.14rem;
  line-height: 0.2rem;
  margin: 0.05rem 0.38rem 0.1rem 0.38rem;
}
.components-date {
  color: #555;
  font-size: 0.14rem;
  line-height: 0.1rem;
  margin: 0 0.38rem 0.1rem 0.38rem;
}
.components-repeat {
  color: #436EEE;
  font-size: 0.14rem;
  line-height: 0.2rem;
  margin: 0 0.38rem 0.2rem 0.38rem;
}
.my-components textarea {
  padding: 0 0.38rem;
  border: none;
  color: #333;
}
.my-components textarea:focus {
    outline: none;
}
.my-components textarea::-webkit-input-placeholder{
  color: #999;
  font-size: .14rem;
}
.components-btn {
  margin: 0.2rem 0.38rem;
}
.liked-title {
  margin: 0.05rem;  
}
.liked-img {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  margin: 0.1rem;
}
.liked-name {
  font-size: 0.18rem;
  color: #999;
}
</style>