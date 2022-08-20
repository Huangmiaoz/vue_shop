<template>
<el-icon><House /></el-icon>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form :model="loginForm" 
        label-width="60px" 
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"> 
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type ="primary" @click="login">登录</el-button>
          <el-button type ="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      loginForm :{
        username : '',
        password : ''
      },
      loginFormRules : {
        // 验证账号是否合法
        username : [
          { required: true, message: '请输入登陆账户', trigger: 'blur' },
        ],
        // 验证密码是否合法
        password : [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min : 6, max : 15, message : '密码长度应该在6-15位', trigger: 'blur' }
        ]
      }
    }
  },
  methods : {
    resetLoginForm() {
      console.log(this);
      // this.resetFields();
      // console.log(this.$refs);
      // ref值得引用就是组件得实例对象
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单的预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if(!valid) return;
        const {data : result} = await this.$http.post('login',this.loginForm);
        console.log(result);
        if(result.meta.status !== 200) {
          return this.$message.error(result.meta.msg);
        } else {
          console.log(result.data.token);
          // 窗口关闭即被清除
          window.sessionStorage.setItem('token',result.data.token);
          this.$router.push('/home');
          return this.$message.success(result.meta.msg); 
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color : #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 居中
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px;
      position: absolute;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;

      }
    }
    .login_form {
      position: absolute;
      // 距离底部对其
      bottom: 0;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      .btns {
        // 按钮居右对齐
        display: flex;
        justify-content: flex-end;
      }
    }
    
  }
}
</style>