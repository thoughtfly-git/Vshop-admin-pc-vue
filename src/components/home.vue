<template>
  <el-container>
    <el-header>
      <div class="header_div">
        <img class="header_logo" src="../assets/logo.png" alt="">
        <span>后台系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="istogger_collapse ? '64px' : '230px'">
        <div class="toggle-button" @click="togger_collapse">|||</div>
        <el-menu
          background-color="#302f2d"
          text-color="#fff"
          active-text-color="#ffd04b" unique-opened  :collapse = 'istogger_collapse' :collapse-transition = 'false' router
          :default-active="$route.path"
        >
          <el-submenu :index="menu.id+''" v-for="menu in menulist" :key="menu.id">
            <template slot="title">
              <i :class="iconObjects[menu.path]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <div style="padding-left: 30px">
              <el-menu-item :index="'/'+submenu.path" v-for="submenu in menu.children" :key="submenu.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{submenu.authName}}</span>
                </template>
              </el-menu-item>
            </div>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      istogger_collapse: false,
      menulist: [],
      iconObjects:
          {
            'users': 'el-icon-user-solid',
            'rights': 'el-icon-s-check',
            'goods': 'el-icon-s-platform',
            'orders': 'el-icon-s-order',
            'reports': 'el-icon-s-data'
          }
    }
  },
  created () {
    this.getMenulist()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenulist () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    togger_collapse () {
      this.istogger_collapse = !this.istogger_collapse
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #2d2c2a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      img {
        height: 40px;
        border: 1px solid white;
        border-radius: 50%;
        background-color: white;
      }
      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #302f2d;
    .el-menu{
      border-right: 0px;
    }
  }

  .el-main {
    background-color: #d4d3cf;
  }
  .toggle-button{
    background-color: #616060;
    color: #fff;
    letter-spacing: 0.2em;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
  }
</style>
