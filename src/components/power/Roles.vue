<template>
  <div>
    <h3>Roles</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="this.addRoleDialogVisible = true">
          <el-icon><Search /></el-icon>
          添加角色
        </el-button>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-row 
              v-for="(item1,i1) in scope.row.children " 
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable  @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <el-icon><CaretRight /></el-icon>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row 
                  v-for="(item2, i2) in item1.children" 
                  :key="item2.id"
                  :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
                > 
                  <el-col :span="6">
                    <el-tag type="success" closable  @close="removeById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <el-icon><CaretRight /></el-icon>
                  </el-col>
                  <!-- 3级权限 -->
                  <el-col :span="13">
                    <el-tag type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeById(scope.row,item3.id)"
                    >
                    {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="250px"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="250px"></el-table-column>
        <el-table-column label="操作" prop="expand" width="300px">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="showEditRole(scope.row)">
              <el-icon :size="size" :color="color"><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteRole(scope.row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)">
              <el-icon><Setting /></el-icon>
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      v-model="settionDialogVisible"
      title="分配权限"
      width="50%"
      :before-close="handleClose"
    >
      <span>
        <!-- 树形组件 -->
         <el-tree 
          :data="rightsList" 
          :props="treeProps" 
          @node-click="handleNodeClick" 
          show-checkbox node-key="id"
          default-expand-all
          :default-checked-keys="defKeys" 
          ref="treeRef"
        />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settionDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="allocateRights">Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 新增角色的对话框 -->
    <el-dialog
      v-model="addRoleDialogVisible"
      title="添加角色"
      width="50%"
      @close="addDialogClosed"
    >
        <el-form 
          :model="addRoleForm" 
          label-width="120px" 
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc" />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">Cancel</el-button>
            <el-button type="primary"  @click="editRole(scope.row)">Confirm</el-button>
          </span>
      </template>
    </el-dialog>

        <!-- 新增角色的对话框 -->
    <el-dialog
      v-model="editRoleDialogVisible"
      title="编辑角色"
      width="50%"
    >
        <el-form 
          :model="editRoleForm" 
          label-width="120px" 
          :rules="editRoleFormRules"
          ref="editRoleFormRef"
        >
          <el-form-item label="角色ID" prop="id" >
            <el-input v-model="editRoleForm.roleId" disabled="false" />
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc" />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">Cancel</el-button>
            <el-button type="primary"  @click="editRole()">Confirm</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
 
</template>

<script>
export default {
  data() {
    return {
      // 所有角色的列表
      rolesList : [],
      // 控制对话框的显示和隐藏
      settionDialogVisible : false,
      // 所有权限的控制
      rightsList : [],
      // 树形控件的属性绑定对象
      treeProps : {
        label : 'authName',
        children : 'children'
      },
      // 默认选中的结点的Id值数组
      defKeys : [],
      treeRef : [],
      // 当前操作的id
      roleId : '',
      // 新增角色
      addRoleForm : {},
      addRoleDialogVisible : false,
      addRoleFormRules : {
        roleName : [{require : true, message : '请输入角色名称',trigger : 'blur'} ]
      },
      editRoleForm : {},
      editRoleDialogVisible : false,
      editRoleFormRules : {
        roleName : [{require : true, message : '请输入角色名称',trigger : 'blur'} ]
      },
    }
  },
  created() {
    this.getRolesList();
  },
  methods : {
    async getRolesList() {
      const {data : res} = await this.$http.get('/roles');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.rolesList = res.data;
        // console.log(this.rolesList);
      }
    },
    // 根据ID删除对应的Id
    async removeById(role,rightsId) {
      const confirmResult = await this.$confirm(
        '该操作不可逆，是否要继续?',
        '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {
          return this.$message.info('操作取消');
        })
        console.log(confirmResult);
      if(confirmResult === 'confirm') {
        const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`);
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        else {
          // this.getRolesList(); 不建议重新刷新，直接把返回的数据重新渲染上去即可
          role.children = res.data;
          return this.$message.success(res.meta.msg);
        }
      }
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const {data : res} = await this.$http.get('/rights/tree');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.rightsList = res.data;
        console.log(this.rightsList);
      }
      // 应该先清空
      this.defKeys = [];
      // 获取当前角色拥有的角色
      // console.log(role,this.defKeys);
      this.getLeaveKeys(role,this.defKeys)
      // console.log(this.defKeys);
      this.settionDialogVisible = true;
    },
    // 递归获得角色下所有三级权限的id
    getLeaveKeys(node,arr) {
      if(!node.children) {
        // 如果当前节点不包含children属性，则是三级节点
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeaveKeys(item,arr));
    },
    // getCheckedNodes & getHalfCheckedNodes
    async allocateRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedNodes(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      console.log(keys);
      // 我这里输出的不是数组是一个代理对象，所以传参处有问题，传入了一堆object，会导致更新失败
      // let num = [];
      // for(let i = 0; i < keys.length; i++) {
      //   num.push(keys[i].id);
      //   for(let j = 0; j < keys[i].children.length; j++) {
      //     num.push(keys[i].children[j].id);
      //   }
      // }
      console.log(num);
      const idStr = keys.join(',');
      console.log(idStr);
      const {data : res} = await this.$http.post(`/roles/${this.roleId}/rights`,{rids : idStr});
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        console.log(res);
        this.getRolesList();
        this.settionDialogVisible = false;
        this.$message.success(res.meta.msg);
      }
     
    },
    // 点击添加角色的按钮
    async addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if(!valid) return;
        const {data : res} = await this.$http.post('roles',this.addRoleForm);
        if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        } else {
          this.addRoleDialogVisible = false;
          this.getRolesList();
          return this.$message.success(res.meta.msg);
        }
      })
    },
    // 关闭添加角色的窗口触发
    addDialogClosed() {
      this.addRoleForm = {};
    },
    // 删除角色
    async deleteRole(role) {
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
        const {data : res} = await this.$http.delete('roles/'+role.id);
        if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.getRolesList();
          return this.$message.success(res.meta.msg);
        }
      }
    },
    // 编辑角色
    async showEditRole(role) {
      console.log(role);
      const {data : res} = await this.$http.get('roles/'+role.id);
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      else {
        this.editRoleForm = res.data;
        this.editRoleDialogVisible = true;

      }
    },
    async editRole(role) {
      console.log(role);
      this.$refs.editRoleFormRef.validate(async valid => {
        if(!valid) return;
        const {data : res} = await this.$http.put('roles/'+this.editRoleForm.roleId,
          { roleName : this.editRoleForm.roleName,
            roleDesc : this.editRoleForm.roleDesc 
          });
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        else {
          this.$message.success(res.meta.msg);
          this.getRolesList();
          this.editRoleDialogVisible = false;

        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>