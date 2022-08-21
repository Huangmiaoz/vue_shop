<template>
  <el-container class="home-container">
    <el-header>
      <span>后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          active-text-color="#409Eff"
          background-color="#333744"
          text-color="#fff"  
          unique-opened ="true"
          :collapse = "isCollapse"
          collapse-transition = "false"
        >
          <el-sub-menu :index="item.id + ''" v-for="item in muneList" :key="item.id">
            <template #title text-color=#fff>
              <!-- <el-icon><location /></el-icon> -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
             <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
             
              <template #title text-color=#fff><el-icon><Grid /></el-icon>{{subItem.authName}}</template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>

export default {
  data() {
    return {
      muneList : [],
      iconsObj : {
        '125' : 'iconfont icon-user',
        '103' : 'iconfont icon-tijikongjian',
        '101' : 'iconfont icon-shangpin',
        '102' : 'iconfont icon-danju',
        '145' : 'iconfont icon-baobiao'
      },
      isCollapse : false
    }
  },
  created() {
    this.getMuneList();
  },
  methods : {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMuneList() {
      const res = await this.$http.get('menus');
      console.log(res);
      if( res.data.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.muneList = res.data.data;
    },
    // 菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  // 竖直方向居中
  align-items: center;
  // 字体颜色
  color: #fff;
  font-size: 20px;

}
.el-aside {
  background-color: #333744;
  .el-menu {
    // 不然菜单展开时边框会对不齐
    border-right: none;
  }
}
.el-container {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标移上去是小手的形式
  cursor: pointer; 
}
</style>