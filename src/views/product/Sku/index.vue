<template>
  <div>
    <div>allen又提交了一段代码</div>
    <!-- :data="tableData" -->
    <el-table border style="width: 100%;margin-top:20px;" :data="records">
      <el-table-column type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="skuName" label="名称">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述">
      </el-table-column>
      <el-table-column prop="address" label="默认图片">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量KG">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-if="row.isSale == 0" @click="upSale(row)">
          </el-button>
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuById(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器-->
    <div>aqinaaa开发了一行代码</div>
    <div>aqinaaa开发了一行代码</div>
    <el-pagination :current-page="page" :page-sizes="[5, 10, 15]" :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total" :total="400" align="center" style="margin:10px 0"
      @size-change="handleSizeChange" @current-change="getData">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="50%">
      <el-row style="margin-top:40px;">
        <el-col :span="5">名称</el-col>
        <el-col :span="16"> {{ SkuById.skuName }}</el-col>
      </el-row>
      <el-row style="margin-top:40px;">
        <el-col :span="5">描述</el-col>
        <el-col :span="16"> {{ SkuById.skuDesc }}</el-col>
      </el-row>
      <el-row style="margin-top:40px;">
        <el-col :span="5">价格</el-col>
        <el-col :span="16"> {{ SkuById.price }}</el-col>
      </el-row>
      <el-row style="margin-top:40px;">
        <el-col :span="5">平台属性</el-col>
        <template>
          <el-tag type="success" v-for="(tag, index) in SkuById.skuAttrValueList" :key="tag.id">{{ tag.attrName }}
          </el-tag>
        </template>
      </el-row>
      <el-row style="margin-top:40px;">
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16" class="block">
          <el-carousel height="350px">
            <el-carousel-item v-for="item in SkuById.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width:100%;height:100%;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 5,
      // sku展示列表数据获取
      records: [],
      // 抽屉数据获取
      SkuById: [],
      drawer: false,

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 显示数据和分页器的当前页修改
    async getData(pages = 1) {
      this.page = pages
      let result = await this.$API.sku.reqSku(this.page, this.limit)
      console.log(result)
      if (result.code == 200) {
        this.records = result.data.records
      }
    },
    // 分页器改变显示的条数
    handleSizeChange(val) {
      this.limit = val
      this.getData()
    },
    // 商品上架
    async upSale(row) {
      // console.log(row)
      let result = await this.$API.sku.reqonSale(row.id)
      // console.log(result)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '上架成功' })
        row.isSale = 1
      }
    },
    // 商品的下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqcancelSale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '下架成功' })
        row.isSale = 0
      }
    },
    // 点击编辑按钮的回调
    edit() {
      this.$message('正在开发中')
    },
    async getSkuById(row) {
      // 打开抽屉
      this.drawer = true
      let result = await this.$API.sku.reqSkuById(row.id)
      // console.log(result)
      if (result.code == 200) {
        this.SkuById = result.data
      }
    }
  }
}
</script>

<style>
.el-col-5 {
  font-size: 20px;
  text-align: right;
  margin-right: 16px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
}
</style>