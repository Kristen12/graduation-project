<template>
  	<div class="upload">
	  	<div class="upload-content">
	  		<p class="upload-title">图片</p>
	    	<van-uploader class="upload-img-box" :after-read="onRead" :max-size="2097152" accept="image/jpeg,image/png,image/jpg" multiple>
	    		<img id="uploadImg" class="upload-img" :src="imgcontent" ref="goodsImg"/>
			</van-uploader>
		</div>
		<div class="upload-content">
	  		<p class="upload-title">作品描述</p>
	  		<textarea style="vertical-align: middle;" cols="35" rows="5" placeholder="请输入（可选）" v-model="picText"></textarea>
		</div>
		<div class="upload-btn">
			<van-button type="danger" size="large" @click="savePic">上传作品</van-button>
		</div>
  	</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';

export default {
  	name: 'upload',
  	components: {
  	},
  	data() {
  		return {
  			imgcontent: require('../assets/upload.png'),
  			picText: '',
  			islogin: false,
  			isupload: false,
  		};
  	},
  	computed: {
      	...mapState(['userInfo']),
    },
  	mounted() {
  		this.islogin = this.userInfo.isLogin;
  	},
  	methods: {
    	onRead(file) {
    		console.log(file);
	      	this.$refs.goodsImg.src = file.content;
	      	this.imgcontent = file.content;
	      	this.isupload = true;
    	},
	    savePic() {
	    	if(this.islogin) {
		    	if(this.isupload) {
		    		axios({
			    		url: url.uploadPic,
			    		method: 'post',
			    		data: {
			    			picContent: this.imgcontent,
			    			picText: this.picText,
			    			userId: this.userInfo.userId
			    		},
			    	}).then(res=>{
			    		if(res.data.code == 200) {
			    			this.$toast.success('上传成功');
			    			this.picText = '';
			    			this.imgcontent = require('../assets/upload.png');
			    			setTimeout(()=>{
					          this.$router.push('/home');
					        },500);
			    		}
			    		else {
			    			this.$toast.fail('上传失败');
			    		}
			    	}).catch(err=>{
			    		this.$toast.fail('图片太大了');
			    	});
		    	}
		    	else {
		    		this.$toast.fail('图片非空'); 
		    	}
	    	}
	    	else {
	    		this.$toast.fail('您未登录'); 
	    	}
	    },
  	}
}
</script>
<style scoped>
.upload {
    position: absolute;
    width: 100%;
    background-color: #f8f8f8;
    height: 100%;
}
.upload-content {
	background-color: #fff;
	padding-bottom: 0.2rem;
}
.upload-title {
	padding: 0.2rem 0.17rem;
	margin-top: 0.3rem;
	color: #555;
	font-size: 0.18rem;
}
.upload-img-box {
	margin: 0 0.17rem;
}
.upload-img {
	width: 2rem;
	height: 2rem;
	border: 2px dashed #999;
	border-radius: 20px;
}
.upload-content textarea {
	padding: 0.17rem;
	border: none;
}
.upload-content textarea:focus {
    outline: none;
}
.upload-content textarea::-webkit-input-placeholder{
  color: #999;
  font-size: .14rem;
}
.upload-btn {
	width: 60%;
	margin: 0.35rem auto;
	padding-bottom: 0.44rem; 
}

#img-upload {
	/*width: 2rem;
	height: 2rem;*/
	/*opacity: 0;*/
}
</style>