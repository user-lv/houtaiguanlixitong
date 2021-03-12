<template>
  <div class="home">
    <el-container class="container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <!-- logo -->
          <h1 class="logo">
            <a href="javascript:;">星星的模样</a>
          </h1>
          <h2>
            后台管理系统
          </h2>
        </div>
        <!-- 退出按钮 -->
        <el-button type="info" @click="logout" class="logout">
          退出
        </el-button>
      </el-header>
      <!-- 主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-row>
            <el-col :span="12">
              <el-menu
                unique-opened
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="iconfont icon-users"></i>
                    <span> 用户管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1" class="el-icon-menu">
                      用户列表</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="iconfont icon-tijikongjian"></i>
                    <span> 权限管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="2-1" class="el-icon-menu">
                      角色列表</el-menu-item
                    >
                    <el-menu-item index="2-2" class="el-icon-menu">
                      权限列表</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="iconfont icon-shangpin"></i>
                    <span> 商品管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="3-1" class="el-icon-menu">
                      商品列表</el-menu-item
                    >
                    <el-menu-item index="3-2" class="el-icon-menu">
                      分类参数</el-menu-item
                    >
                    <el-menu-item index="3-3" class="el-icon-menu">
                      商品分类</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="iconfont icon-danju"></i>
                    <span> 订单管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="4-1" class="el-icon-menu">
                      订单列表</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                  <template slot="title">
                    <i class="iconfont icon-baobiao"></i>
                    <span> 数据统计</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="5-1" class="el-icon-menu">
                      数据列表</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 主要内容 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.axios.get('menus')
      const token = window.sessionStorage.getItem('token')
      console.log(token)
      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #cfcfd0;
}
.el-button {
  height: 40px;
  transform: translateY(10px);
}
.el-header {
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  background-color: #67686c;
  div {
    position: relative;
    width: 100%;
    height: 60px;
    h2 {
      position: absolute;
      top: 10px;
      left: 80px;
      width: 150px;
      height: 60px;
      margin: 0;
      color: #1e2232;
    }
  }
  .logo {
    width: 60px;
    height: 60px;
    margin: 0;
  }
  a {
    display: block;
    border-radius: 10px;
    width: 60px;
    height: 60px;
    font-size: 0;
    background: url("./../assets/logo.jpg") no-repeat;
    background-size: 60px 60px;
  }
}
.logout {
  background-color: #6f6f6f;
}
.el-aside {
  overflow-x: hidden;
}
.el-menu {
  width: 200px;
  height: 525px;
  text-indent: 10px;
}
</style>
