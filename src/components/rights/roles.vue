<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="rolesDialogVisible"
      width="60%"
      @close="closeDialog"
    >
      <el-form
        :model="roleForm"
        status-icon
        ref="roleFormRef"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            type="tel"
            v-model="roleForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="tel"
            v-model="roleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialog"
      width="60%"
      @close="closeEditRole"
    >
      <el-form
        status-icon
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" editRoleForm.Desc prop="roleDesc">
          <el-input type="text" v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleButton">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleRights"
      width="60%"
      @close="closeEditRights"
    >
      <el-tree
        :data="roleRightsData"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        :props="props"
        default-expand-all
        ref="tree"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleRights = false">取 消</el-button>
        <el-button type="primary" @click="editRoleRightsButton"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加用户按钮 -->
      <el-row :span="7">
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        size="mini"
        border
        stripe
        style="width: 100%"
        :data="this.rolesList"
        type="expand"
      >
        <el-table-column type="expand" width="50" border>
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index === 0 ? 'bdtop' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="deleteRights(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['bdbottom', i2 === 0 ? '' : 'bdtop']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="deleteRights(scope.row, item2.id)"
                      closable
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteRights(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 按钮区域 -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="技术负责人"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-col>
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="editRole(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="delRole(scope.row.id)"
                >
                  删除
                </el-button>
                <el-button
                  type="warning"
                  class="el-icon-edit"
                  size="mini"
                  @click="roleRights(scope.row)"
                >
                  分配权限
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      rolesDialogVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      editRoleDialog: false,
      editRoleForm: {},
      editRoleRights: false,
      roleRightsData: [],
      props: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中节点
      defKeys: [],
      roleId: 0
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('角色列表获取失败')
      }
      this.rolesList = res.data
      console.log(res)
    },
    closeDialog () {
      this.$refs.roleFormRef.resetFields()
      this.rolesDialogVisible = false
    },
    async addRole () {
      const { data: res } = await this.axios.post('/roles', this.roleForm)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.$refs.roleFormRef.resetFields()
      this.getRolesList()
      this.$message.success('角色添加成功')
      this.rolesDialogVisible = false
    },
    editRole (info) {
      this.editRoleForm = info
      console.log(info)
      this.editRoleDialog = true
    },
    // 关闭编辑用户对话框
    closeEditRole () {
      this.editRoleDialog = false
      this.$refs.editRoleFormRef.resetFields()
    },
    async editRoleButton () {
      const { data: res } = await this.axios.put(
        '/roles/' + this.editRoleForm.id,
        this.editRoleForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error('用户编辑失败')
      }
      this.getRolesList()

      this.$refs.editRoleFormRef.resetFields()
      this.$message.success('用户编辑成功')
      this.editRoleDialog = false
    },
    // 删除角色
    async delRole (id) {
      this.$message.closeAll()
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log(confirmResult === 'confirm')
      if (confirmResult === 'confirm') {
        const { data: res } = await this.axios.delete('/roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        }
        this.$message.success('删除角色成功')
        this.getRolesList()
      }
    },
    // 关闭分配权限对话框
    closeEditRights () {
      this.defKeys = []
      this.editRoleRights = false
    },
    // 获取分配角色权限列表
    async roleRights (role) {
      this.editRoleRights = true
      const { data: res } = await this.axios.get('/rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('权限列表获取失败')
      }
      this.roleRightsData = res.data
      this.roleId = role.id
      this.isLeaf(role, this.defKeys)
      console.log(res)
    },
    // 编辑角色权限按钮
    async editRoleRightsButton () {
      const idStr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const { data: res } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限更新失败')
      }
      this.getRolesList()
      this.$message.success('权限更新成功')
      this.editRoleRights = false
      console.log(res)
    },
    // 递归判断是否是三级节点
    isLeaf (node, roleArr) {
      if (!node.children) {
        return roleArr.push(node.id)
      }
      node.children.forEach(item => {
        this.isLeaf(item, roleArr)
      })
    },
    // 删除单个权限
    async deleteRights (role, rightsId) {
      const confirm = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        console.log(err)
      })
      if (confirm !== 'confirm') {
        return this.$message.info('删除取消')
      }
      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightsId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('权限删除失败')
      }
      this.$message.success('权限删除成功')
      role.children = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  overflow-y: scroll;
  height: 350px;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
</style>
