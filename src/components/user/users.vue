<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="query" placeholder="请输入内容" clearable>
            <el-button
              slot="append"
              size="medium"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="60%">
        <el-form
          :model="addForm"
          status-icon
          :rules="rules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="addForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="addForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="addForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input
              type="tel"
              v-model="addForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editUserVisible"
        width="60%"
        @close="closeEditDialog"
      >
        <el-form
          :model="editForm"
          status-icon
          :rules="rules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              disabled
              type="text"
              v-model="editForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              type="text"
              v-model="editForm.mobile"
              autocomplete="off"
              clearable=""
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="text"
              v-model="editForm.email"
              autocomplete="off"
              clearable=""
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEditDialog()">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="fenpeiUserVisible" width="60%">
        <div>
          <p>当前的用户:{{ userInfo.username }}</p>
          <p>当前的角色:{{ userInfo.role_name }}</p>
          <p>
            分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFenpeiDialog()">取 消</el-button>
          <el-button type="primary" @click="fenpeiUserButton()"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 表格区域 -->
      <template>
        <el-table border stripe style="width: 100%" :data="this.usersList">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="120">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="120">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="300">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="120">
            <template slot-scope="scope">
              <!-- 通过模板插槽获取本行数据 -->
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  round
                  size="small"
                  icon="el-icon-edit"
                  @click="editUserInfo(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 删除按钮 -->
              <el-tooltip
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  round
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteUser(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 分配角色按钮 -->
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  round
                  size="small"
                  icon="el-icon-setting"
                  @click="fenpeiUser(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 5, 10, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (value === '') return cb()
      if (regEmail.test(value) === false) {
        return cb(new Error('请输入合法邮箱'))
      }
      return cb()
    }
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (value === '') return cb()
      if (regMobile.test(value) === false) {
        return cb(new Error('请输入有效手机号'))
      }
      return cb()
    }
    return {
      // 邮箱验证规则
      usersList: [], // 用户数据
      pagenum: 1, // 当前页
      pagesize: 5, // 每页显示数
      total: 0, // 总页数
      query: '', // input的值
      addDialogVisible: false, // 添加用户对话框的显隐
      editUserVisible: false, // 编辑用户对话框的显隐
      deleteDialog: false,
      // 查询用户信息
      editForm: {},
      addForm: {
        username: '',
        pass: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { message: '请输入11位手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示
      fenpeiUserVisible: false,
      // 分配权限用户信息
      userInfo: [],
      // 被选中的角色id
      selectedRoleId: '',
      // 角色列表数据
      roleList: []
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表
    async getUsersList () {
      const { data: res } = await this.axios.get('/users', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      })
      this.usersList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 页码改变
    handleSizeChange (size) {
      this.pagesize = size
      this.getUsersList()
    },
    // 当前页改变
    handleCurrentChange (newpagenum) {
      this.pagenum = newpagenum
      this.getUsersList()
    },
    // 用户状态改变
    async userStateChange (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.axios.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('状态更新失败,不好意思')
      }
      this.$message.success('状态更新成功')
      console.log(res)
    },
    // 关闭添加用户对话框
    cancelDialog () {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      console.log(this.$refs)
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        console.log(valid)

        const { data: res } = await this.axios.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message('用户添加失败,请稍后再试')
        }
        this.getUsersList()
        this.$refs.addFormRef.resetFields()
        this.addDialogVisible = false
        this.$message.success('用户添加成功')
        console.log(res)
      })
    },
    // 编辑用户信息按钮
    async editUserInfo (id) {
      this.editUserVisible = true
      const { data: res } = await this.axios.get('/users/' + id)
      if (res.meta.status !== 200) {
        this.$refs.editFormRef.resetFields()
        this.editUserVisible = false
        return this.$message.error('用户信息查询失败,请稍后再试')
      }
      this.editForm = res.data
      console.log(res)
    },
    // 取消用户对话框
    cancelEditDialog () {
      this.editUserVisible = false
    },
    // 确定修改用户信息按钮
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('请输入正确格式')
        const { data: res } = await this.axios.put(
          '/users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('用户更新失败 ' + res.meta.msg)
        }
        this.getUsersList()
        this.editUserVisible = false
        console.log(res)
      })
    },
    closeEditDialog () {
      this.$refs.editFormRef.resetFields()
    },
    async deleteUser (id) {
      this.$message.closeAll()
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        console.log(111)
        this.axios.delete('/users/' + id)
        this.getUsersList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }
    },
    async fenpeiUser (info) {
      this.userInfo = info

      // 获取所有角色列表
      const { data: res } = await this.axios.get('/roles/')
      if (res.meta.status !== 200) {
        return this.$message.error('角色列表获取失败')
      }
      this.roleList = res.data
      this.fenpeiUserVisible = true
      console.log(info)
    },
    // 关闭分配角色色对话框
    cancelFenpeiDialog () {
      this.roleList = []
      this.selectedRoleId = ''
      this.fenpeiUserVisible = false
      this.$message.info('角色分配取消')
    },
    // 分配角色按钮
    async fenpeiUserButton () {
      const { data: res } = await this.axios.put(
        `users/${this.userInfo.id}/role/`,
        {
          rid: this.selectedRoleId
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('角色分配失败')
      }
      this.roleList = []
      this.selectedRoleId = ''
      this.getUsersList()
      this.fenpeiUserVisible = false
      this.$message.success('角色分配成功')
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  font-size: 12px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
