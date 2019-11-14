<template>
  <div class="top">
    <!-- <div class="top-title">萝卜の毕设</div> -->
    <div class="top-title">{{ userInfo.userName }}</div>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'Top',
  props: {
  },
  computed: {
    // ...mapState(['userInfo']),
    ...mapState(['userInfo']),
    // mapState({
    //   userInfo: (state) =>{state.userInfo},
    // }),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--  eslint-disable  -->
<style scoped>
.top {
  /*background-color: rgba(250,250,250,0.98);*/
  background-color: #fff;
  height: 0.44rem;
/*  position: fixed;*/
  width: 100%;
  top: 0;
}
.top-title {
	text-align: center;
	line-height: 0.44rem;
	font-size: 0.20rem;
  font-weight: bold;
	color: #030303;
}
</style>
