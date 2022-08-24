<template>
  <h3>Params</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert 
        title="注意：只允许为第三级分类设置相关参数" 
        type="warning" 
        :closable="false" 
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cate_opt">
        <el-col>
          <span>选择商品的分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            :change-on-select="true"
          />
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleTabClick"
      >
      <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                   <!-- 循环渲染Tag标签 -->
                <el-row>
                  <el-tag 
                    v-for="(item, i) in scope.row.attr_vals" 
                    :key="i" 
                    closable 
                    @close="handleClose(i, scope.row)"
                  >
                    {{item}}
                  </el-tag>
                    <!-- 输入的文本框 -->
                  <el-input 
                    class="input-new-tag" 
                    v-if="scope.row.inputVisible" 
                    v-model="scope.row.inputValue" 
                    ref="saveTagInput" 
                    size="small" 
                    @keyup.enter.native="handleInputConfirm(scope.row)" 
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button 
                    v-else 
                    class="button-new-tag" 
                    size="small" 
                    @click="showInput(scope.row)"
                  >
                    + New Tag
                  </el-button>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="primary" @click="showEditDialog(scope.row.attr_id)">
                  <el-icon :size="size" :color="color"><Edit /></el-icon>编辑
                </el-button>
                <el-button size="mini" type="danger"  @click="removeParams(scope.row.attr_id)">
                  <el-icon :size="size" :color="color"><delete /></el-icon>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
             <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                   <!-- 循环渲染Tag标签 -->
                <el-row>
                  <el-tag 
                    v-for="(item, i) in scope.row.attr_vals" 
                    :key="i" 
                    closable 
                    @close="handleClose(i, scope.row)"
                  >
                    {{item}}
                  </el-tag>
                    <!-- 输入的文本框 -->
                  <el-input 
                    class="input-new-tag" 
                    v-if="scope.row.inputVisible" 
                    v-model="scope.row.inputValue" 
                    ref="saveTagInput" 
                    size="small" 
                    @keyup.enter.native="handleInputConfirm(scope.row)" 
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button 
                    v-else 
                    class="button-new-tag" 
                    size="small" 
                    @click="showInput(scope.row)"
                  >
                    + New Tag
                  </el-button>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="primary" @click="showEditDialog(scope.row.attr_id)">
                  <el-icon :size="size" :color="color"><Edit /></el-icon>编辑
                </el-button>
                <el-button size="mini" type="danger"  @click="removeParams(scope.row.attr_id)">
                  <el-icon :size="size" :color="color"><delete /></el-icon>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
<!-- 添加参数的对话框 -->
<el-dialog
  v-model="addDialogVisible"
  :title="'修改' + titleText"
  width="30%"
  @close="addDialogClosed"
>
  <el-form 
    :model="addForm" 
    label-width="80px" 
    :rules="addFormRules"
    ref="addFormRef"
  >
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary"  @click="addParams">Confirm</el-button>
      </span>
  </template>
</el-dialog>
<!-- 修改 -->
 <el-dialog 
  :title="'修改' + titleText"  
  v-model="editDialogVisible" 
  width="30%" 
  @close="editDialogClosed"
>
  <el-form 
    :model="editForm" 
    :rules="editFormRules" 
    ref="editFormRef" 
    label-width="80px"
  >
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="editForm.attr_name"></el-input>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary"  @click="editParams">Confirm</el-button>
      </span>
    </template>
  </el-form>
 </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      catelist : [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签
      activeName : 'many',
      // 当前选中的项目的静态属性
      onlyTableData : [],
      // 当前选中的项目的动态参数
      manyTableData : [],
      // 添加对话框的显示
      addDialogVisible : false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 不能这样写，每一行都是不一样的，因此在下面切割字符串时再给每一行设置自己的value 和 bool
      // // 展开行中添加标签中的输入框显示
      // inputVisible : false,
      // // 文本框中的内容
      // inputValue : ''
    }
  },
  created() {
    this.getCateList();
  },
  methods : {
     // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('res.meta.msg');
      }
      this.catelist = res.data;
      console.log(this.catelist)
    },
    // 级联选择器的选择项发生变化时才会触发
    handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数,所以应当将获取参数的代码单独出来
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData()
    },
      // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params: { sel: this.activeName }
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }

      res.data.forEach(item => {
        // 如果数组为空还进行字符串分割会返回[""]，因此要判断一下，如果数组为空返回空字符串
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      });

      console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听添加对话框的关闭事件，关闭后应当清空表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }

        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
        this.getParamsData();
      })
    },
       // 点击按钮，展示修改的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    // 展开行
    // 文本框失去焦点，或摁下了 Enter 都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        // 失去焦点期间把文本框内容清空
        row.inputValue = '';
        // 失去焦点切换回标签
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row);
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      console.log(row);
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });

    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
     // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }

      this.$message.success(res.meta.msg);
    },
  },
  computed : {
    // 控制按钮是否被禁用
    isBtnDisabled() {
      // console.log(this.selectedCateKeys.length);
      return (this.selectedCateKeys.length !== 3);
    },
    // 当前选中的三级分类的Id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
     // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
 
  }
}
</script>

<style lang="less" scoped>
.cate_opt {
  margin: 15px;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
<!-- 
  问题1：expand会自动缩回去，当点击一下+tag或者往文本框里面输入一个字母时候
  问题2：当两个页签相互切换的时候，要点击第二次才会出现正确的数据
  问题3：突然间tag标签对不齐了，我可谢谢你
 -->