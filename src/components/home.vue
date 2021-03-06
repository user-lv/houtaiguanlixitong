<template>
  <div class="home">
    <el-button type="info" @click="logout" class="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.logout {
    background-color: #6F6F6F;
}
</style>
