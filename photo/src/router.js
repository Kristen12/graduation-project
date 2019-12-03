import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Upload from './views/Upload.vue'
import Introduce from './views/Introduce.vue'
import Follow from './views/Follow.vue'
import Friends from './views/Friends.vue'
import Edit from './views/Useredit.vue'
import List from './views/Followlist.vue'
import Followerlist from './views/Followerlist.vue'
import Chat from './views/Chat.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: Introduce
    },
    {
      path: '/follow',
      name: 'follow',
      component: Follow
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends
    },
    {
      path: '/useredit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/list',
      name: 'list',
      component: List
    },
    {
      path: '/followerlist',
      name: 'followerlist',
      component: Followerlist
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
  ]
})
