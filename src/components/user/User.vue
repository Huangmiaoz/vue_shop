<template>
  <div>
    <h3>用户列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
  <el-card class="box-card">
    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="输入搜索内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
        <template #append>
          <el-button :icon="Search" @click="getUserList" />
        </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="clickAddUser">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="userList" border stripe style="width: 100%">
      <el-table-column type="index" label="#"/>
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="type" label="状态">
        <template #default="{row,$index}">
            <el-switch v-model="row.mg_state" @change="userStateChanged(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"
            
          >
            <el-button type="primary" :icon="Edit" size="mini" @click="clickEditUser(scope.row.id)" />
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
           
          >
            <el-button type="danger" :icon="Delete" size="mini"  @click="removeUserById(scope.row.id)"/>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
           
          >
            <el-button type="warning" :icon="Share" size="mini"  @click="setRole(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:currentPage="queryInfo.queryInfo"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 5, 10]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>

  <!-- 添加用户弹窗 -->
  <el-dialog
    v-model="addDialogVisible"
    title="添加用户"
    width="50%"
    :before-close="handleClose"
    @close="addDialogClosed"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="70px"
      :size="formSize"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary"  @click="addUser">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
<!-- 编辑用户信息弹窗 -->
  <el-dialog
    v-model="editDialogVisible"
    title="编辑用户信息"
    width="50%"
    :before-close="handleClose"
    
  >
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="70px"
      :size="formSize"
      status-icon
      @close="editDialogClosed"
    >
      <el-form-item label="用户名" prop="username" >
        <el-input v-model="editForm.username" disabled="false" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary"  @click="editUser">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 分配角色的对话框 -->
  <el-dialog
    v-model="setRoleDialogVisable"
    title="分配角色"
    width="50%"
    @close="setRoleDialogClosed"
  >
    <div>
      <p>当前用户：{{userInfo.username}}</p>
      <p>该用户的角色：{{userInfo.role_name}}</p>
      <p>分配新角色：
        <el-select 
          v-model="selectRolesId" 
          placeholder="Select" 
          size="large"
        >
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        />
      </el-select>
      </p>
    </div>
     <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary"  @click="saveRole()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkMobile = (rule,value,cb) => {
      let regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; 
      if(regMobile.test(value)) {
        return cb();
      }
      cb(new Error('请输入合法手机号'));
    }
    return {
      queryInfo: {
        query : '',
        // 当前页数
        pagenum : 1 ,
        // 每页显示多少条数据
        pagesize : 5 ,
        query : ''
      } ,
      userList : [],
      total : 0,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible : false,
      editDialogVisible : false,
      addForm : {
        username : '',
        password : '',
        email : '',
        mobile : ''
      },
      addFormRules : {
        username :[ {require : true, message : '请输入用户名',trigger : 'blur'},
                    {min : 3, max : 10, message : '用户名的长度应该在3-10之间',trigger : 'blur'}
                  ],
        password :[ {require : true, message : '请输入密码',trigger : 'blur'},
                    {min : 6, max : 16, message : '密码的长度应该在6-16之间',trigger : 'blur'}
                  ] ,
        email :[ {require : true, message : '请输入邮箱',trigger : 'blur'},
                 {type: 'email',message: '请输入正确的邮箱',trigger: ['blur', 'change'],
        }],
        mobile :[ {require : true, message : '请输入电话号码',trigger : 'blur'},
                  {validator : checkMobile, message : '请输入正确的手机格式',trigger : 'blur'}
                ],
      },
      editForm : {},
      editFormRules : {
        email :[ {require : true, message : '请输入邮箱',trigger : 'blur'},
                 {type: 'email',message: '请输入正确的邮箱',trigger: ['blur', 'change'],
        }],
        mobile :[ {require : true, message : '请输入电话号码',trigger : 'blur'},
                  {validator : checkMobile, message : '请输入正确的手机格式',trigger : 'blur'}
                ],
      },
      // 分配角色的对话框显示与隐藏
      setRoleDialogVisable : false,
      // 需要被分配权限的用户
      userInfo : {},
      // 所有角色的数据
      rolesList : [],
      // 已选中的角色ID值
      selectRolesId : ''
    } 
  },
  methods : {
    async getUserList() {
      const {data : res} = await this.$http.get('users',{params : this.queryInfo});
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.userList = res.data.users;
        this.total = res.data.total;
        console.log(this.userList);
      }
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    // 监听状态条的改变

    async userStateChanged(userInfo) {
      const {data : res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      console.log(res);
      if(res.meta.status !== 200) {
        // 如果更新失败不因该改变状态
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      } else {
        return this.$message.success(res.meta.msg);
      }
    },
    clickAddUser() {
      this.addDialogVisible = true;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return;
        const {data : res} = await this.$http.post('users',this.addForm);
        if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        } else {
          this.addDialogVisible = false;
          this.getUserList();
          return this.$message.success(res.meta.msg);
        }
      })
    },
    async clickEditUser(id) {
      const {data : res} = await this.$http.get('users/'+id);
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.editForm = res.data;
        this.editDialogVisible = true;

      }
    },
    editUser() {
      this.showDialogVisible = true;
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return;
        const {data : res} = await this.$http.put('users/' + this.editForm.id,
          {email : this.editForm.email , mobile : this.editForm.mobile});
        if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.editDialogVisible = false;
          this.getUserList();
          return this.$message.success(res.meta.msg);
        }
      })
    },
    editDialogClosed() {
      this.$refs.editDialogClosed.resetFields();
      
    },
    async removeUserById(id) {
      // 先弹框提问是否删除
      const confirmResult = await this.$confirm(
        '该操作不可逆，是否要继续?',
        '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {
          return this.$message.info('操作取消');
        })
      if(confirmResult === 'confirm') {
        const {data : res} = await this.$http.delete('users/'+id);
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        else {
          this.getUserList();
          return this.$message.success(res.meta.msg);
        }
      }
    },
    async setRole(userInfo) {
      console.log(userInfo);
      this.userInfo = userInfo;
      console.log('userInfo:' + this.userInfo);
      this.setRoleDialogVisable = true;

      // 获取所有角色的列表
      const {data : res} = await this.$http.get('/roles');
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        else {
          this.rolesList = res.data;
        }
    },
    async saveRole() {
      console.log(this.userInfo.id);
      console.log(this.selectRolesId);
      if(!this.selectRolesId) {
        return this.$message.error('请选择需要分配给该用户的角色');
      }
      const {data : res} = await this.$http.put(`/users/${this.userInfo.id}/role`,{rid : this.selectRolesId});
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.setRoleDialogVisable = false;
        this.getUserList();
        return this.$message.success(res.meta.msg);   
      }
    },
    setRoleDialogClosed() {
      this.selectRolesId = '',
      this.userInfo = {}
    }
  },
  
  created() {
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
}
</style>