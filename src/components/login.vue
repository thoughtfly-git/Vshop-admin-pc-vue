<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-goods" v-model="loginForm.password" placeholder="password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="buts">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules:
          {
            username: [
              { required: true, message: '请输入账号', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password:
              [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
              ]
          }
    }
  },
  methods: {
    resetForm () {
      this.$refs.loginFormRef.resetForm().resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const { data: result } = await this.$http.post('login', this.loginForm)
          console.log(result)
          if (result.meta.status !== 200) {
            this.$message.error(result.meta.msg)
          } else {
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', result.data.token)
            this.$router.push('/home')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    box-shadow: 0 0 50px black;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avater_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .buts {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0px;
      box-sizing: border-box;
    }
  }
</style>
