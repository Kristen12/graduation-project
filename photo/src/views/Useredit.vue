<template>
  	<div class="edit">
	  	<van-cell-group class="edit-top">
			  <van-field label="性别" clearable  v-model="usersex"/>
		  </van-cell-group>
  		<div class="upload-btn">
        <van-button type="danger" round size="large" class="btn-top" @click="noLogin">退出登录</van-button>
  			<van-button type="primary" round size="large" @click="saveInfo">保存</van-button>
  		</div>
  	</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import url from '@/service.config.js';
import { mapState } from 'vuex';

export default {
  name: 'edit',
  components: {
  },
  data() {
  	return {
  		username: '',
  		usersex: '',
  	};
  },
  computed: {
    ...mapState(['userInfo']),
  },
  mounted() {
    this.userid = this.$route.query.userid;
    setTimeout(()=>{
      this.myInto();
    });
  },
  methods: {
    myInto() {
      axios({
        url: url.userInto,
        method: 'post',
        data: {
          userid: this.userid,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.usersex = res.data.data.sex;
        }
      }).catch(err=>{
        console.log(err);
      });
    },

    saveInfo() {
      axios({
        url: url.userSex,
        method: 'post',
        data: {
          userid: this.userid,
          usersex: this.usersex,
        }
      }).then(res=>{
        if(res.data.code == 200) {
          this.$router.push('/introduce');
        }
      }).catch(err=>{
        console.log(err);
      });
    },

    noLogin() {
      sessionStorage.removeItem('userInfo', JSON.stringify(this.userInfo));
      this.$router.push('/introduce');
      this.$router.go(0);
    },
  }
}
</script>
<style scoped>
.edit {
	padding-bottom: 0.44rem;
    position: absolute;
    width: 100%;
    background-color: #f1f1f1;
    height: 100%;
}
.edit-top {
  margin-top: 0.2rem; 
}
.upload-btn {
  margin: 0 0.5rem; 
}
.btn-top {
  margin: 0.2rem 0;
}
</style>