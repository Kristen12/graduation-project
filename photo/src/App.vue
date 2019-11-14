<template>
  <div id="app">
    <top></top>
    <div class="app-content">
      <router-view/>
    </div>
    <foot></foot>
  </div>
</template>

<script>
import top from './components/top.vue'
import foot from './components/foot.vue'

export default {
  name: 'app',
  components: {
    top,
    foot
  },
  methods: {
  },
}
</script>

<style>
.app-content {
  margin-bottom: 0.44rem;
}
</style>
