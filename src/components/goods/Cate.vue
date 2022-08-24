<template>
  <h3>Cate</h3>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="cateList" :column="column"></tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表
      cateList : [],
      // 总数据条数
      total : '',
      queryInfo : {
        type : 3,
        pagenum : 1,
        pagesize : 5
      },
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ]
    }
  },
  methods : {
    async getCateList() {
      const {data : res} = await this.$http.get('/categories',{params : this.queryInfo});
      console.log(res);

      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      console.log(this.cateList);
      this.total = res.data.total;
    }
  },
  created() {
    this.getCateList();
  }
}
</script>

<style lang="less" scoped>

</style>