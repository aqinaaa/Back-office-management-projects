<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0;" @click="showDialog">添加
    </el-button>
    <!-- 表单 -->
    <!-- :data="tableData" 绑定数据 -->
    <el-table :data="records" border style="width: 100%">
      <el-table-column type="index" label="序号" width="180">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称">
      </el-table-column>
      <el-table-column prop="address" label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!--修改显示数据的回调函数   -->
    <!-- style="text-align:center"  行内样式，可以让分页器居中显示 -->
    <el-pagination :current-page="pageNo" :page-sizes="[3, 5, 10]" :page-size="limit"
      layout="prev, pager, next, jumper, ->,sizes,total" :total="total" style="text-align:center;margin:20px"
      @current-change="getTradeMarkList" @size-change="handleSizeChange">
    </el-pagination>
    <!-- dialog添加/修改平台数据 -->
    <!-- :visible.sync  控制对话框的显示与隐藏 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" center :visible.sync="dialogFormVisible" width="32%">
      <!-- form表单 :model 属性,这个属性的作用是,把表单的数据收集到哪个对象的身上,将来表单验证,也需要这个属性 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
      <el-form :model="tmForm" :rules="rules" ref="roleForm">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <!--  -->
          <el-input autocomplete="off" v-model="tmForm.tmName" style="width:400px"></el-input>
        </el-form-item>
        <!-- v-model="form.region" -->
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <!-- 上传图片：品牌LOGO -->
          <!--action="https://jsonplaceholder.typicode.com/posts/" 图片上传地址,里面放的是图片上传的接口,如果有配置也需要单独配置.
            :show-file-list="false"是否显示图片列表,如果选true就是照片墙
            :src="tmForm.logoUrl"照片上传地址-->
          <!-- 这里收集数据不能使用v-model,因为不是表单元素 -->
          <!-- on-success:可以检测到图片上传成功,当图片上传成功,会执行一次
          :before-upload  可以在上传图片之前,会执行一次 -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 放在upload里面,注意结构位置,element里面的结构也是在upload里面,才能生效 -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatedTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      limit: 3,
      total: null,
      records: [],
      // dialog:手机的对象身上的属性,不能瞎写,胡写,需要根据后台服务器发请求的参数确定.
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          // required表示必须校验,trigger触发的事件
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌LOGO验证规则
        logoUrl: [
          { required: true, message: '请选择品牌图片' }   //upload的事件change可以去掉,trigger: 'change'是表单事件
        ],
      }

    }
  },
  mounted() {
    // 组件挂载完毕之后请求品牌列表数据 ，因为此函数的调用不能只请求一次，所以封装一个请求函数，在mounted中先调用一次
    this.getTradeMarkList()
  },
  methods: {
    // 获取品牌管理列表数据展示
    async getTradeMarkList(pages = 1) {       //这里将分页器的切换页面函数和获取品牌数据的接口函数混合在一起使用。
      // 解构数据
      this.pageNo = pages
      const { pageNo, limit } = this
      // console.log(this.$API)
      let result = await this.$API.trademark.reqTradeMarkList(pageNo, limit)
      console.log(result)
      if (result.code == 200) {        //错误：注意这里的是result.code 而不是result.data,虽然知道，但是还是写错了两次，导致数据没有保存上去，需要留意
        this.records = result.data.records
        this.total = result.data.total
        this.size = result.data.size
      }
    },
    // 修改分页器中的显示数目
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val
      // 调用品牌数据列表数据请求函数
      this.getTradeMarkList()
    },
    // 添加按钮的回调:显示dialog对话框
    showDialog() {
      this.dialogFormVisible = true;
      // 显示dialog之后清空之前输入的数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    updateTradeMark(row) {
      // 显示dialog对话框
      this.dialogFormVisible = true;
      // 将点击修改的那条数据row显示到dialog对话框中,因为不能一点击就修改,否则取消之后会发现数据也被修改了,所以这里使用浅拷贝
      // 而且这里row里面是有id的,所以浅拷贝之后,也会把原来tmForm里面没有的拷贝进去.
      this.tmForm = { ...row }
    },
    // dialog图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回前端数据,使用res就够了
      // file:上传成功之后服务器返回前端数据
      // console.log(file) 
      // 收集品牌图片的数据
      this.tmForm.logoUrl = res.data
    },
    //  dialog图片上传之前的回调函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 添加按钮(添加品牌|修改品牌)
    addOrUpdatedTradeMark() {
      //添加dialog  form表单的验证规则
      this.$refs.roleForm.validate(async (success) => {
        // 隐藏对话框
        // console.log(success)
        this.dialogFormVisible = false;
        // 派发请求
        let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
        if (result.code == 200) {
          // 显示提示信息:$message是饿了么ui的组件
          this.$message({ message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功', type: 'success' })
          // 添加或者修改成功之后,获取列表数据进行展示:如果是修改品牌,需要留在当前页,如果是添加品牌,需要去第一页
          this.getTradeMarkList(this.tmForm.id ? this.pageNo : 1)
        }
      })
    },
    // 删除品牌
    deleteTrademark(row) {
      console.log(row)
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(row.id)
        // 派发删除的接口请求函数
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code == 200) {
          // 删除成功后显示提示信息
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          // 获取品牌列表:如果删除成功,当前页数据大于1,则留在当前页,数据小于等于1则跳到上一页
          this.getTradeMarkList(this.records.length > 1 ? this.pageNo : this.pageNo - 1)
        }
      },
      ).catch(() => {
        // 取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
}
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
