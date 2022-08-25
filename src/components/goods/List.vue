<template>
  <h3>Lists</h3>
   <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="输入搜索内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
        >
        <template #append>
          <el-button :icon="Search" @click="getGoodsList" />
        </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddpage">添加商品</el-button>
      </el-col>
    </el-row>
     <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template #default="scope">
            {{formatDate(scope.row.add_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template #default="scope">
            <el-button size="mini" type="primary">
              <el-icon :size="size" :color="color"><Edit /></el-icon>
            </el-button>
            <el-button size="mini" type="danger" @click="removeById(scope.row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="queryInfo.pagenum" 
        :page-sizes="[5, 10, 15, 20]" 
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total" background
      >
      </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
       queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  methods : {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }

      this.$message.success('获取商品列表成功！')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) { m = '0' + m; }
      if (d < 10) { d = '0' + d; }
      if (h < 10) { h = '0' + h; }
      if (i < 10) { i = '0' + i; }
      if (s < 10) { s = '0' + s; }
      let t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
      return t;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>

</style>