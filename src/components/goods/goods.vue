<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加商品对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addCateDialogVisible"
      width="60%"
    >
    </el-dialog>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="query" placeholder="请输入内容" clearable>
            <el-button
              slot="append"
              size="medium"
              icon="el-icon-search"
              @click="getCateList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addCateDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table border stripe style="width: 100%" :data="this.cateList">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="goods_state" label="商品状态"> </el-table-column>
        <el-table-column prop="add_time" label="添加时间"> </el-table-column>
        <el-table-column prop="upd_time" label="更新时间"> </el-table-column>
        <el-table-column prop="hot_mumber" label="热销品数量">
        </el-table-column>
        <el-table-column prop="is_promote" label="是否为热销品">
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 50,100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品数据
      cateList: [],
      pagenum: 1, // 当前页
      pagesize: 5, // 每页显示数
      total: 0, // 总页数
      query: '', // input的值
      addCateDialogVisible: false // 添加商品对话框的显隐
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.axios.get('/goods/', {
        params: { pagenum: this.pagenum, pagesize: this.pagesize }
      })
      console.log('商品列表---\n', res)
      if (res.meta.status !== 200) {
        return this.$message.error('商品列表获取失败')
      }
    },
    // 页码改变
    handleSizeChange (size) {
      this.pagesize = size
      this.getCateList()
    },
    // 当前页改变
    handleCurrentChange (newpagenum) {
      this.pagenum = newpagenum
      this.getCateList()
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
