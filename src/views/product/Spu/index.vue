<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="currentShow" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <!--1 品牌列表 -->
      <div v-show="currentShow == 0">
        <!-- @click="addSpu" -->
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="category3Id == ''">添加SPU</el-button>
        <!-- tabel表单 -->
        <!-- :data="tableData" -->
        <el-table border :data="records" style="width: 100%">
          <el-table-column type="index" label="序号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称">
          </el-table-column>
          <el-table-column prop="description" label="spu描述">
          </el-table-column>
          <el-table-column prop="address" label="操作" width="280">
            <template slot-scope="{row,$index}">
              <!-- 这里的el-button需要用到title提示，这个功能可以使用封装的组件来实现，也可以直接使用el-button,然后加一个title属性 -->
              <el-button type="primary" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="upDataSpu(row)"
                ref="info"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="getsku(row)">
              </el-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <!-- @click="deleteSpu(row)" -->
                <el-button type="danger" slot="reference" style="margin-left:10px" icon="el-icon-delete" size="mini"
                  title="删除spu">
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!-- @current-change="handleCurrentChange"  @size-change="handleSizeChange"-->
        <el-pagination :page-sizes="[3, 5, 10]" :page-size="limit" :current-page="page"
          layout="prev, pager, next, jumper,->,sizes,total" :total="total" style="margin:20px 0" align='center'
          @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <!--2 添加spu -->
      <div v-show="currentShow == 1">
        <spuForm @changeScene="changeScene" :category3Id="category3Id" ref="spu"></spuForm>
      </div>
      <!--3 添加sku -->
      <div v-show="currentShow == 2">
        <skuForm @changeScene="changeScene" ref="sku"></skuForm>
      </div>
      <!-- 点击查看spu的sku列表 -->
      <el-dialog :title="`${Spu.spuName}`" :visible.sync="dialogTableVisible" :before-close="handleClose">
        <el-table :data="skuList" border v-loading="loading">
          <el-table-column property="skuName" label="名称" width="150"></el-table-column>
          <el-table-column property="price" label="价格" width="200"></el-table-column>
          <el-table-column property="weight" label="重量"></el-table-column>
          <el-table-column property="address" label="默认图片">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { done } from 'nprogress';
import skuForm from './skuForm'
import spuForm from './spuForm'
export default {
  data() {
    return {
      page: 1,
      limit: 3,
      isShow: true,
      records: [],
      total: 99,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 显示组件切换
      currentShow: 0,
      skuList: [],
      dialogTableVisible: false,
      Spu: {},
      loading: true
    }
  },
  components: {
    skuForm,
    spuForm
  },
  methods: {
    //  获取三级id数据
    async getCategoryId(data) {
      // console.log(data)
      if (data.level == 1) {
        // 如果拿到了新的1,则先检查清空2和3
        this.category2Id = '';
        this.category3Id = '';
        this.category1Id = data.CategoryId
      } else if (data.level == 2) {
        // 如果拿到了新的2,则先检查清空3
        this.category3Id = '';
        this.category2Id = data.CategoryId
      } else if (data.level == 3) {
        this.category3Id = data.CategoryId
        // 获取spu类的方法进行展示
        this.getSpuList()
      }
    },
    // 获取spuInfolist数据的函数
    async getSpuList() {
      // 派发请求,获取attrInfoList数据列表
      const { category3Id, page, limit } = this
      // console.log(category3Id, page, limit)
      // console.log(this.$API)
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      // console.log(result)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 跳转页码的回调
    handleCurrentChange(pages) {
      this.page = pages
      this.getSpuList()
    },
    // 分页器跳转每页显示多少条数据的回调
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    addSpu() {
      this.currentShow = 1
      this.$refs.spu.addSpu(this.category3Id)
    },
    // 子组件spuform的自定义事件：
    // 注意事项：参数是一个{}对象，接受的时候也应该是一个对象接受
    changeScene({ scene, flag }) {
      // alert(111)
      this.currentShow = scene    //参数scene是一个对象，所以这里用scene.scene结构出值
      // console.log(this.currentShow)
      // 刷新页面，重新展示:如果是修改，则保留当前页，如果是添加，则回到第一页
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.page = 1    //让数据中保存的页码为1
        this.getSpuList()
      }
    },
    // 点击修改spu和添加spu之后的回调
    upDataSpu(row) {
      this.currentShow = 1
      this.$refs.spu.getInitData(row)
    },
    // 删除spu
    async deleteSpu(row) {
      // console.log(row)
      //  发请求
      let result = await this.$API.spu.reqdeleteSpu(row.id)
      // console.log(result)
      if (result.code == 200) {
        // 重新获取列表数据进行展示
        this.$message({ type: 'success', message: '删除成功' })
        // 判断页面的数据条数，如果大于1条，则删除之后停留在当前页面，如果小于等于1条，则删除之后页码回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    //添加sku
    addSku(row) {
      // 切换显示场景
      this.currentShow = 2
      // 调用子组件的数据接口请求函数
      this.$refs.sku.getData(row, this.category1Id, this.category2Id)
    },
    // 查看当前spu的sku列表数据展示
    async getsku(row) {
      // console.log(row)
      this.Spu = row
      this.dialogTableVisible = true
      let result = await this.$API.spu.reqskuList(row.id)
      if (result.code == 200) {
        this.skuList = result.data
        // 当成功请求到数据之后关闭loading效果
        this.loading = false
      }
    },
    // 关闭对话框之前的回调
    handleClose(done) {
      //  打开下一次展示的loading
      this.loading = true
      // 清空之前的数据，解决数据回显
      this.skuList = []
      done()
    }
  }
}
</script>

<style>
</style>