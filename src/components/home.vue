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
                router
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active="$route.path"
              >
                <!-- 一级菜单 -->
                <el-submenu
                  :index="item.id + ''"
                  v-for="item in menuList"
                  :key="item.id"
                >
                  <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconFonts[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{ item.authName }}</span>
                  </template>
                  <!-- 二级菜单 -->
                  <el-menu-item-group>
                    <el-menu-item
                      class="el-icon-menu"
                      v-for="items in item.children"
                      :key="items.id"
                      :index="'/' + items.path"
                    >
                      {{ items.authName }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      iconFonts: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-lock_fill',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
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
      // 菜单列表
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
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
}
.iconfont {
  margin-right: 10px;
}
</style>
