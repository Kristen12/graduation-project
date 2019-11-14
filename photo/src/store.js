import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	userInfo: JSON.parse(sessionStorage.getItem("userInfo")) ||
    {
  		isLogin:  false,
  		userName:  '毕设',
      userId: '',
  	}
  },
  // 数据筛选，数据之间的计算
  getters: {
    getLogin(state){
      if (!state.userInfo) {
        state.userInfo = sessionStorage.getItem('userInfo');
      }
      return state.userInfo;
    }

  },
  // 运用方法改变state数据的值，只能处理同步操作
  mutations: {
    changeLogin(state, data){
      if(data){
        sessionStorage.setItem('userInfo', JSON.stringify(data));
      }
      else{
        sessionStorage.removeItem('userInfo', JSON.stringify(data));
      }
        state.userInfo = data;
    }

  },
  // 可以处理异步操作，用于提交mutations
  actions: {
  	loginAction({commit}, user) {
  		commit('changeLogin', user);
  	}
  }
})
