<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 编辑商品分类对话框 -->
    <el-dialog :visible.sync="editCateDialogVisible" title="编辑商品分类">
      <el-form
        :model="editCateForm"
        status-icon
        :rules="editCateRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            type="text"
            clearable
            v-model="editCateForm.cat_name"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditCateDialog()">取 消</el-button>
        <el-button type="primary" @click="editCateSureButton()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 卡片区域 -->
    <el-card>
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        show-index
        stripe
        border
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            :class="
              scope.row.cat_deleted == false
                ? 'el-icon-success'
                : 'el-icon-error'
            "
            :style="
              scope.row.cat_deleted == false
                ? 'color: lightgreen'
                : 'color: red'
            "
          ></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->

        <template slot="edit" slot-scope="scope">
          <el-button type="primary" @click="editCate(scope.row)" size="small"
            >编辑</el-button
          >
          <el-button
            type="danger"
            class="el-delete-button"
            size="small"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类数据列表
      cateList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 当前页
      currentPage: 1,
      // 总数据条数
      total: 0,
      // 添加用户对话框显示按钮
      addCateButton: false,
      // 指定table数据列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '100px',
          align: 'center'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          width: '100px',
          type: 'template',
          template: 'isok',
          align: 'center'
        },
        {
          label: '排序',
          prop: 'cat_level',
          width: '100px',
          type: 'template',
          template: 'order',
          align: 'center'
        },
        {
          label: '操作',
          width: '100px',
          type: 'template',
          template: 'edit',
          align: 'center'
        }
      ],
      // 编辑商品对话框的显影
      editCateDialogVisible: false,
      editCateForm: {
        cat_name: ''
      },
      // 分类 ID
      editCateId: '',
      // 编辑用户对话框规则
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.axios.get('/categories/', {
        params: this.queryInfo
      })
      console.log('商品分类列表---\n', res)

      if (res.meta.status !== 200) {
        return this.$message.error('商品分类列表获取失败')
      }
      this.total = res.data.total
      this.cateList = res.data.result
    },

    // 编辑商品分类按钮
    editCate (cateInfo) {
      console.log(cateInfo)
      this.editCateForm.cat_name = cateInfo.cat_name
      this.editCateId = cateInfo.cat_id
      this.editCateDialogVisible = true
    },
    // 关闭编辑商品对话框
    cancelEditCateDialog () {
      this.editCateForm.cat_name = ''
      this.editCateDialogVisible = false
    },
    // 确定更改编辑用户对话框
    async editCateSureButton () {
      const { data: res } = await this.axios.put(
        `/categories/${this.editCateId}`,
        {
          cat_name: this.editCateForm.cat_name
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败,请稍后再试')
      }
      this.$message.success('分类更新成功')
      this.getCategoriesList()
      this.editCateForm.cat_name = ''
      this.editCateDialogVisible = false
      console.log(res)
    },
    // 删除分类
    async deleteCate (info) {
      const { data: res } = await this.axios.delete(
        `/categories/${info.cat_id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('商品分类删除失败')
      }
      this.$message.success('商品分类删除成功')
      console.log('删除商品分类----', res)
      this.getCategoriesList()
    },
    // 每页展示条数改变触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoriesList()
    },
    // 页码改变触发
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCategoriesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.tree-table {
  margin-top: 25px;
  overflow-y: scroll;
  height: 330px;
}
.el-delete-tag {
  margin-left: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
