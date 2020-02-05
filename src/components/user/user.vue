<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryParam.query" clearable
                    @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="inputSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="openEditUserDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryParam.pagenum"
                     :page-sizes="[5, 10, 50, 100]"
                     :page-size="queryParam.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="增加用户" :visible.sync="dialogVisible" width="600px" @closed="closeDialog">
      <el-form ref="addUserForm" :model="userinfo" label-width="80px" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userinfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userinfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userinfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userinfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="dialogEditUserVisible" width="600px" @closed="closeDialog">
      <el-form ref="editUserForm" :model="userinfo" label-width="80px" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userinfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userinfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userinfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userinfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserlist()
  },
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (/^[\d-]{11,15}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确手机号'))
        }
      }, 1000)
    }
    return {
      queryParam: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      dialogEditUserVisible: false,
      userinfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules:
          {
            username: [
              { required: true, message: '请输入用户名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
            email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' }
            ],
            mobile: [
              { required: true, message: '不能为空', trigger: 'blur' },
              { validator: checkMobile, trigger: 'blur' }
            ]
          }
    }
  },
  methods:
      {
        async openEditUserDialog (id) {
          console.log(id)
          const { data: res } = await this.$http.get('users/' + id)
          if (res.meta.status !== 200) return this.$.message.error('获取用户信息错误')
          this.userinfo = res.data
          this.dialogEditUserVisible = true
        },
        addUserSubmit () {
          this.$refs.addUserForm.validate(async (valid) => {
            if (!valid) {
              return false
            }

            const { data: res } = await this.$http.post('users', this.userinfo)
            if (res.meta.status !== 201) return this.$.message.error('添加失败')
            this.getUserlist()
            this.dialogVisible = false
          })
        },
        closeDialog () {
          this.$refs.addUserForm.resetFields()
        },
        handleSizeChange (size) {
          this.queryParam.pagesize = size
          this.getUserlist()
        },
        handleCurrentChange (page) {
          this.queryParam.pagenum = page
          this.getUserlist()
        },
        async getUserlist () {
          const { data: res } = await
          this.$http.get('users', { params: this.queryParam })
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败')
          }
          this.userlist = res.data.users
          this.total = res.data.total
        },
        async changeStatus (userinfo) {
          console.log(userinfo)
          const { data: res } = await
          this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            userinfo.mg_state = !userinfo.mg_state
          } else {
            this.$message.success('修改成功')
          }
        },
        inputSearch () {
          this.queryParam.pagenum = 1
          this.getUserlist()
        }
      }
}
</script>

<style scoped>

</style>
