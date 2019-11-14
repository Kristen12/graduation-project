<template>
  <div class="foot">
    <van-row class="foot-flex">
      <van-col
        span="8"
        v-for="(item,index) in footBtns"
        :key="item.id">
        <router-link :to="item.tabLink">
          <van-icon :name="item.name" @click="select(item)"/>
        </router-link>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'Foot',
  data() {
    return {
      footBtns:[
        {name:'browsing-history',tabLink:'/home',pageName:'发现'},
        {name:'photograph',tabLink:'/upload',pageName:'上传'},
        {name:'manager',tabLink:'/introduce',pageName: '主页'},
      ]
    };
  },
  methods: {
    select(item) {
      this.$emit('showPageName', item);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--  eslint-disable  -->
<style scoped>
.foot {
  background-color: #161616;
  height: 0.44rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
.foot-flex {
  font-size: 0.36rem;
  text-align: center;
}
.foot-flex i {
  line-height: 0.44rem;
  color: #929292;
}
.router-link-active i{
  color: #fff;
}
</style>
