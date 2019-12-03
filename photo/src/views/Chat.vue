<template>
  	<div class="chat">
        <!-- 导航 -->
        <van-nav-bar
            :title="navTitle"
            left-text=""
            left-arrow
            @click-left="onClickLeft"
            />
        <!-- 聊天区域 -->
        <div class="box">
            <div
                class="chat-list"
                v-for="(item,index) in chatmsgs"
                :key="item.id">
                <div v-if="item.from == myUserInfo.userId" class="chat-left">
                    <img class="user-img" :src='item.avatar'/>
                    <div>{{item.content}}</div>
                </div>
                <div v-else class="chat-right">
                    <div>{{item.content}}</div>
                    <img class="user-img" :src='item.avatar'/>
                </div>  
            </div>
        </div>
        <!-- 输入框 -->
        <div class="chat-foot">
            <input id="input" type="text" placeholder="请输入..." v-model="inputText"/>
            <span @click="send">发送</span>
        </div>
  	</div>
</template>

<script>
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';
import io from 'socket.io-client'

export default {
  	name: 'chat',
  	components: {
  	},
  	data() {
  		return {
            myUserInfo: {},
            navTitle: '',
            userId: '',
            inputText: '',
            socket: '',
            msgsList: [],
            avatar: require('../assets/default_img.jpeg'),
            flag: false,
            socketData: {},
            chatmsgs:[]
  		};
  	},
  	computed: {
      	...mapState(['userInfo']),
    },
  	mounted() {
        this.islogin = this.userInfo.isLogin;
        this.myUserInfo = this.userInfo;
        this.userId = this.$route.query.userid;
        // 发生跨域，需要手动链接
        this.socket = io('ws://localhost:3000');
        this.socket.on('recvmsg', data=>{
            console.log(data,"监听全局消息");
            this.flag = true;
            this.socketData = data;
            this.userInto(data.from);
        })
        setTimeout(()=>{
            this.userInto(this.userId);
            this.getMsgList();
            document.addEventListener("keydown", this.keyDownEvent);
        });
        console.log("我的信息=======", this.myUserInfo)
  	},
  	methods: {
        onClickLeft() {
            this.flag = false;
            window.history.go(-1);
        },
        userInto(user) {
            axios({
                url: url.userInto,
                method: 'post',
                data: {
                    userid: user,
                }
            }).then(res=>{
                if(res.data.code == 200) {
                    const data = res.data.data;
                    if(!this.flag) {
                        this.navTitle = data.userName;
                    } else {
                        this.avatar = res.data.data.userHead == '' 
                                    ? require('../assets/default_img.jpeg')
                                    : res.data.data.userHead;

                        this.$set(this.socketData,'avatar',this.avatar);
                        this.msgsList=[...this.msgsList,this.socketData];

                        const chatid = [this.userId,this.myUserInfo.userId].sort().join('_');
                        this.chatmsgs = this.msgsList.filter(v=>v.chatid == chatid);
                        console.log("this.msgsList,this.chatmsgs=============", this.msgsList, this.chatmsgs);
                    }
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        getMsgList() {
            axios({
                url: url.getMsgList,
                method: 'post',
                data: {
                    from: this.myUserInfo.userId,
                }
            }).then(res=>{
                if(res.data.code == 200) {
                    this.msgsList = res.data.data.msgs;
                    this.msgsList.forEach((item,index) => {
                        let avatar = res.data.data.users[item.from].avatar;
                        let userHead = avatar=='' ? require('../assets/default_img.jpeg') :avatar
                        this.$set(item,'avatar',userHead);
                    });
                    const chatid = [this.userId,this.myUserInfo.userId].sort().join('_');
                    this.chatmsgs = this.msgsList.filter(v=>v.chatid == chatid);
                }
            })
        },
        send() {
            let text = document.getElementById("input").value
            const from = this.myUserInfo.userId;
            const to = this.userId;
            const msg = text;
            this.socket.emit('sendmsg',{from,to,msg})
            this.inputText='';
        },
        keyDownEvent(event) {
            if (event.keyCode === 13) this.send();
        },
  	}
}
</script>
<style scoped>
.chat-foot {
    position: fixed;
    bottom: 0.44rem;
    width: 100%;
    height: 0.44rem;
    background: #f8f8f8;
    border-top: 1px solid #eee;
}
.chat-foot input{
    background: #fff;
    width: 80%;
    height: 0.35rem;
    border-radius: 10px;
    margin: 4.5px 10px;
    border: 1px solid #eee;
    padding: 0 10px;
    
}
.chat-foot span {
    line-height: 0.44rem;
    color:#9498a8;
}
.user-img{
    width: 0.4rem;
    height: 0.4rem;
    padding: 0.05rem 0.15rem;
    border-radius: 50%;
}
.box {
    padding-bottom: 0.44rem;
}
.chat-list {
    position: relative;
    height: 0.5rem;
    width: 100%;
    margin-bottom: 0.3rem;
}
.chat-left div,.chat-right div{
    display: inline-block;
    height: 0.5rem;
    line-height: 0.5rem;
    vertical-align: bottom;
}
.chat-right {
    position: absolute;
    right: 0;
}
</style>