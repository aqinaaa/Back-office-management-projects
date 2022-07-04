<template>
  <div>
    <el-form :model="sku" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <!-- v-model="form.name" -->
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="sku.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="sku.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="sku.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item :label="attr.attrName" style="margin-left:5px;" v-for="(attr, index) in attrInfoList"
            :key="attr.id">
            <!--  v-model="value" filterable-->
            <!-- attr.attrIdAddValueId 是给attr自动添加了一个attrIdAddValueI属性,原理里面没有这个字段-->
            <el-select placeholder="请选择" clearable v-model="attr.attrIdAddValueId">
              <!--  :value="item.value" -->
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item :label="SaleAttr.saleAttrName" style="margin-left:5px;"
            v-for="(SaleAttr, index) in spuSaleAttrList" :key="SaleAttr.id">
            <!--  v-model="value" -->
            <el-select filterable placeholder="请选择" v-model="SaleAttr.AttrIdAddAttrValueId">
              <el-option v-for="SaleAttrValue in SaleAttr.spuSaleAttrValueList" :key="SaleAttrValue.id"
                :label="SaleAttrValue.saleAttrValueName" :value="`${SaleAttr.id}:${SaleAttrValue.id}`">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 表单 -->
        <!-- :data="tableData" 
        selection-change="handleSelectionChange":选框选中触发的事件-->
        <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="100">
          </el-table-column>
          <el-table-column prop="name" label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认
              </el-button>
              <span style="color:green;" v-else>默认</span>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item style="margin:20px 0 30px 0">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancle">取消</el-button>
        </el-form-item>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
      },
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      changeButton: true,
      // 收集sku信息
      sku: {
        // 第一类:父组件给的数据
        spuId: 0,                                   //点击spu的添加sku时候,row里面携带的id就是spuId
        tmId: 0,                                    //品牌id
        category3Id: 0,                             //3级id
        // 第二类:通过双向绑定收集的
        skuName: "",                                //sku名称
        price: 0,                                   //价格
        weight: "",                                 //重量
        skuDesc: "",                                //规格描述
        // 第三类:需要自己书写代码收集的数据
        // 收集平台属性
        skuAttrValueList: [                         //平台属性
          // {
          //   "attrId": 0,
          //   "attrName": "string",
          //   "id": 0,
          //   "skuId": 0,
          //   "valueId": 0,
          //   "valueName": "string"
          // }
        ],
        // 默认图片的收集
        skuDefaultImg: "",                           //默认图片的url  
        // 收集图片
        skuImageList: [                              //图片列表
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // 收集销售属性
        skuSaleAttrValueList: [                      //销售属性列表
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],

      },
      spu: {},
      imgList: []
    }
  },
  methods: {
    // 取消按钮的回调
    cancle() {
      // 切换场景
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 数据回显问题，清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 初始化数据,获取页面数据获取请求
    async getData(row, category1Id, category2Id) {
      // alert(123)
      //  收集父组件给与的数据
      this.sku.spuId = row.id
      this.sku.tmId = row.tmId
      this.sku.category3Id = row.category3Id
      this.spu = row
      // console.log(row, category1Id, category2Id, category3Id)
      // console.log(row)
      // 获取spu图片列表:因为保存时给服务器的字段有一个isDefault，所以在获取到数据的时候加这个字段进去
      let result1 = await this.$API.spu.reqspuImageList(row.id)
      if (result1.code == 200) {
        let arr = result1.data;
        arr.forEach(element => {
          element.isDefault = 0
        });
        this.spuImageList = arr
      }
      // 获取销售属性
      let result2 = await this.$API.spu.reqspuSaleAttrList(row.id)
      if (result2.code == 200) {
        this.spuSaleAttrList = result2.data
      }
      // 获取平台属性
      const { category3Id } = row
      let result3 = await this.$API.spu.reqattrInfoList(category1Id, category2Id, category3Id)
      if (result3.code == 200) {
        this.attrInfoList = result3.data
      }
      // }
    },
    // 图片选框选中和修改图片的回调
    handleSelectionChange(params) {
      // console.log(params)
      this.imgList = params
    },
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.sku.skuDefaultImg = row.imgUrl
    },
    // 保存按钮
    async save() {
      // 整理参数
      // (1)平台属性参数整理
      // 方法1：
      const { attrInfoList, spuSaleAttrList, sku, imgList } = this     //解构出需要整理的参数
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAddValueId) {
      //     const [attrId, valueId] = item.attrIdAddValueId.split(':');
      //     let obj = { attrId, valueId };
      //     this.sku.skuAttrValueList.push(obj)
      //   }
      //   // 注意事项：解构的时候接收的必须是一个数组，不能时一个对象，const [attrId, valueId]，如果是一个对象，则接受到的属性值为underfined
      // })
      // 方法2：reduce
      let result = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAddValueId) {
          const [attrId, valueId] = item.attrIdAddValueId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      this.sku.skuAttrValueList = result
      //  (2)销售属性参数整理
      this.sku.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.AttrIdAddAttrValueId) {
          const [saleAttrId, saleAttrValueId] = item.AttrIdAddAttrValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev;
      }, [])
      //  (3)图片参数整理
      sku.skuImageList = imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 派发请求：
      let result1 = await this.$API.spu.reqsaveSkuInfo(this.sku)
      // console.log(result1)
      if (result1.code == 200) {
        // 信息提示保存成功
        this.$message({ type: 'success', message: '保存成功' })
        // 页面跳转：派发自定义事件，让父组件修改页面的显示场景   
        this.$emit('changeScene', { scene: 0, flag: '' })
      }
      // 数据回显问题，清除数据
      Object.assign(this._data, this.$options.data());
    }
  }
}
</script>

<style>
</style>