<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="logo" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRule"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" label-width="65px" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密 码" label-width="60px" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data } = await this.axios.post('login', this.loginForm)
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.$message.success(data.meta.msg)

        // 登陆成功之后将token存到 sessionStorage
        window.sessionStorage.setItem('token', data.data.token)
        // 跳转页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  height: 100%;
  background: url("../assets/bigbgc.jpg");
  background-size: 100% 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #cfcfcf;
  border-radius: 5px;
  background: url("../assets/bgc.jpeg") no-repeat;
  background-size: 450px 300px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 0 10px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 20px;
  left: 45px;
  width: 80%;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
