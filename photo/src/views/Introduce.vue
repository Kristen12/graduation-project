<template>
  <div class="introduce">
    <!-- 登陆 -->
  	<div v-if="userInfo.isLogin">
  		<div class="my-intro">
		    <div class="my-left">
			    <van-uploader class="upload-img-box" :after-read="onRead" accept="image/jpeg,image/png" multiple>
	    			<img class="user-img" :src='userhead' ref="goodsImg"/>
				  </van-uploader>
		    </div>
		    <div class="my-right">
		      <p class="user-name" @click="gotoList">关注<span> {{ followNum }}</span></p>
          <p class="user-name" @click="followerList">粉丝<span> {{ followedNum }}</span></p>
		      <div class="edit-button" @click="userEdit">个人设置</div>
		    </div>
		  </div>
      <p class="user-sex" a-if="usersex!==''">{{ usersex }}</p>
  		<van-tabs>
  			<van-tab title="我的作品">
  				<div class="my-work-ul" v-if="workImgs">
  				    <div class="img-box" v-for="(item, index) in workImgs">
  				        <div class="img" v-lazy:background-image="item.picContent" @click="workClick(item,index)"></div>
  				    </div>
  				</div>
  			</van-tab>

  			<van-tab title="喜欢">
  				<div class="my-work-ul" v-if="likephoto">
  				    <div class="img-box" v-for="(item, index) in likephoto">
  				        <div class="img" v-lazy:background-image="item.picContent" @click="likeClick(item)"></div>
  				    </div>
  				</div>
  			</van-tab>
        <!-- 二期 -->
        <van-tab title="收藏">
          <div class="my-work-ul" v-if="collectphoto">
              <div class="img-box" v-for="(item, index) in collectphoto">
                  <div class="img" v-lazy:background-image="item.picContent" @click="collectClick(item)"></div>
              </div>
          </div>
        </van-tab>
        <van-tab title="管理作品">
          <div class="my-work-ul" v-if="workImgs">
              <div class="img-box" v-for="(item, index) in workImgs">
                  <div class="img" v-lazy:background-image="item.picContent" @click="deleteClick(item,index)"></div>
              </div>
          </div>
        </van-tab>
  		</van-tabs>
  	</div>

    <!-- 未登陆 -->
  	<div v-else class="no-login">
  		<van-tabs>
  			<van-tab title="登陆">
  			  <van-cell-group>
  					<van-field label="用户名" required clearable placeholder="请输入用户名" v-model="loginUsername"/>
  					<van-field label="密码" type="password" required clearable placeholder="请输入密码" v-model="loginPassword"/>
  				</van-cell-group>
  				<div>
  					<van-button type="primary" size="large" @click="loginHandler">登陆</van-button>
  				</div>
  			</van-tab>
  			<van-tab title="注册">
  				<van-cell-group>
  					<van-field label="用户名" required clearable placeholder="请输入用户名" v-model="registUsername"/>
  					<van-field label="密码" type="password" required clearable placeholder="请输入密码" v-model="registPassword"/>
            <van-field label="确认密码" type="password" required clearable placeholder="请再次输入密码" v-model="againPassword"/>
  				</van-cell-group>
  				<div>
  					<van-button type="primary" size="large" @click="registHandler">注册</van-button>
  				</div>
  			</van-tab>
		  </van-tabs>
  	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import axios from 'axios';
import url from '@/service.config.js';
import { ImagePreview } from 'vant';
import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {
  	name: 'introduce',
  	components: {
    	HelloWorld
  	},
  	data() {
    	return {
      		loginUsername: '',
      		loginPassword: '',
      		registUsername: '',
      		registPassword: '',
          againPassword: '',
          // 当前用户id
          userid: '',
          // 图片作者
          user: '',
          workImgs: [],
          likelist: [],
          likephoto: [],
          collectlist: [],
          collectphoto: [],
          workpic: [],
          userhead: require('../assets/default_img.jpeg'),
          usersex: '',
          followNum: '0',
          followedNum: '0',
    	};
  	},
    computed: {
      ...mapState(['userInfo']),
    },
  	mounted() {
      if(this.userInfo.isLogin) {
        this.userid = this.userInfo.userId;
        setTimeout(()=>{
          this.myInto();
          this.userPic();
          this.followed();
        });
      }
  	},
  	methods: {
  		// 映射vuex里的方法
  		...mapActions(['loginAction']),

    	// 注册
    	registHandler() {
        if(this.registPassword !== this.againPassword) {
          this.$toast.fail('密码不一致');
        }
        else if(this.registPassword.length < 6 || this.registPassword.length > 11) {
          this.$toast.fail('密码6-10位');
        }
        else {
          axios({
            url: url.registUser,
            method: 'post',
            data: {
              userName: this.registUsername,
              password: this.registPassword,
              sex: '',
              userHead: '',
            }
          }).then(res=>{
            if(res.data.code == 200) {
              this.registUsername = '';
              this.registPassword = '';
              this.againPassword = '';
              this.$toast.success('注册成功');
            }
          }).catch(err=>{
            console.log(err);
            this.$toast.fail('注册失败');
          });
        }
    	},

    	// 登陆
    	loginHandler() {
    		axios({
    			url: url.loginUser,
    			method: 'post',
    			data: {
    				userName: this.loginUsername,
    				password: this.loginPassword
    			}
    		}).then(res=>{
    			if (res.data.code == 200) {
    				new Promise ((resolve, reject) => {
    					setTimeout(() => {
    						resolve();
    					},10);
    				}).then(() => {
    					this.$toast.success('登陆成功');
    					// 保存登陆状态
              this.loginAction(res.data.userInfo);
    					this.$router.push('/');
    				}).catch(err => {
    					this.$toast.fail('登陆失败');
    				});
    			}
          else if(res.data.code == 201){
            this.$toast.fail('用户不存在');
          }
          else if(res.data.code == 202){
            this.$toast.fail('密码错误');
          }
    		}).catch(err=>{
    			console.log(err);
    			console.log('失败');
    			this.$toast.fail('登陆失败');
    		});
    	},

      myInto() {
        axios({
          url: url.userInto,
          method: 'post',
          data: {
            userid: this.userid,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            // 喜欢作品
            this.likelist = res.data.data.likeList;
            for (var i = 0; i < this.likelist.length; i++) {
              axios({
                url: url.picInto,
                method: 'post',
                data: {
                  picid: this.likelist[i],
                }
              }).then(res=>{
                if(res.data.code == 200) {
                  this.likephoto.push(res.data.data);
                  this.user = res.data.data.userId;
                }
              }).catch(err=>{
                console.log(err);
              });
            }
            // 收藏作品
            this.collectlist = res.data.data.collectList;
            for (var j = 0; j < this.collectlist.length; j++) {
              axios({
                url: url.picInto,
                method: 'post',
                data: {
                  picid: this.collectlist[j],
                }
              }).then(res=>{
                if(res.data.code == 200) {
                  this.collectphoto.push(res.data.data);
                  this.user = res.data.data.userId;
                }
              }).catch(err=>{
                console.log(err);
              });
            }

            // 头像
            if (res.data.data.userHead !== '') {
              this.userhead = res.data.data.userHead;
            }
            else {
              this.userhead = require('../assets/default_img.jpeg');
            }
            this.usersex = res.data.data.sex;
            this.followNum = res.data.data.followList.length;

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

	    // 个人作品
    	workClick(item,index) {
        this.workpic.push(this.workImgs[index].picContent);
    		ImagePreview(this.workpic);
        this.workpic = [];
    	},

    	// 我喜欢的
    	likeClick(item) {
        this.$router.push('/follow?userid=' + encodeURI(this.user) + '&picid=' + encodeURI(item._id));
    	},

      // 收藏
      collectClick(item) {
        this.$router.push('/follow?userid=' + encodeURI(this.user) + '&picid=' + encodeURI(item._id));
      },

      // 删除照片
      deleteClick(item,index) {
        console.log(this.workImgs[index]._id);
        this.$dialog.confirm({
          title: '提示',
          message: '是否删除作品'
        }).then(() => {
          // on confirm
          axios({
            url: url.deletePic,
            method: 'post',
            data: {
              picid: this.workImgs[index]._id,
            }
          }).then(res=>{
            if(res.data.code == 200) {
              console.log(res);
              this.$router.go(0);
            }
          }).catch(err=>{
            console.log(err);
          });
        }).catch(() => {

        });
      },

      // 更改头像
      onRead(file) {
        this.userhead = file.content;
        axios({
          url: url.userHead,
          method: 'post',
          data: {
            userid: this.userid,
            userhead: this.userhead,
          }
        }).then(res=>{
          if(res.data.code == 200) {
            this.$refs.goodsImg.src = file.content;
            
          }
        }).catch(err=>{
          console.log(err);
        });
      },

    	// 个人设置
    	userEdit() {
        this.$router.push('/useredit?userid=' + encodeURI(this.userid));
    	},

    	// 关注
    	gotoList() {
        this.$router.push('/list?userid=' + encodeURI(this.userid));
    	},

      // 粉丝
      followerList() {
        this.$router.push('/followerlist?userid=' + encodeURI(this.userid));
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
.introduce {
  margin-bottom: 0.44rem;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
}
.my-intro {
  background-color: #fff;
  border-top: 1px solid #f1f1f1;
  padding: 0.3rem;
  display: flex;
}
.user-sex{
  background-color: #fff;
  padding: 0 0.3rem 0.3rem 0.3rem;
  color: #333;
  font-size: 0.14rem;
}
.my-left {
  flex-grow: 1;
  width: 0;
}
.user-img {
  border-radius: 50%;
  width: 0.8rem;
  height: 0.8rem;
  display: inline-block;
  margin-top: 0.15rem;
}
.my-right {
  flex-grow: 1;
  width: 0;
  text-align: center;
}
.user-name {
  font-size: 0.18rem;
  margin-bottom: 0.2rem; 
  font-weight: 500;
  line-height: 0.2rem;
}
.user-name span {
	margin-left: 0.2rem;
}
.edit-button {
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
.my-tab {
  height: 0.4rem;
  background-color: #fff;
  border: 1px solid #f1f1f1; 
}
.my-tab {
  text-align: center;
  line-height: 0.4rem;
}
.my-work-ul {
  overflow: hidden;
  margin-bottom: 0.44rem;
}
.my-work-ul .img-box {
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