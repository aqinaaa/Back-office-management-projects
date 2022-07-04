<template>
  <div>
    <!-- {{ unSelectSaleAttr }} -->
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <!-- v-model="formInline.region" -->
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <!-- :value="shanghai" value是将来要收集的数据，这里需要收集的是品牌的id 
          -->
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in Trademark" :key="tm.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- v-model="formInline.region" -->
        <!-- value="shanghai" -->
        <el-input type="textarea" label="区域一" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- upload:action是图片上传地址；list-type ：文件列表的类型；on-preview：图片预览的时候会触发；on-remove：当删除图片的时候会触发
       :file-list 上传的文件列表
       图片要成功显示，:file-list绑定的列表无比要有name和url字段，如果数据对象中没有这两个字段，在图片无法正常显示
       :on-remove="handleRemove"
       :on-preview="handlePictureCardPreview"-->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList"
          :on-remove="handleRemove" :on-preview="handlePictureCardPreview" :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- v-model="formInline.region" -->
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrId">
          <!-- value="shanghai" -->
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="attrId == ''" @click="addAttr">添加销售属性</el-button>
      </el-form-item>
      <!-- :data="tableData" -->
      <el-form-item>
        <el-table border style="width:100%;" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="180">
          </el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
            <template slot-scope="{row,$index}">
              <!-- @close="handleClose(tag)" 
              @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"-->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                :disable-transitions="false" @close="handleClose(row, index)" ref="index">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm(row)" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                @blur="handleInputConfirm(row)" @keyup.enter.native="$event.target.blur" :ref="$index" size="small">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row, $index)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdate">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>

export default {
  props: ['category3Id'],
  data() {
    return {
      formLabelAlign: {},
      // 照片墙
      dialogImageUrl: '',
      dialogVisible: false,
      // 添加|保存spu数据收集:spu初始化的时候是一个空的对象，在修改spu的时候，会向服务器发请求，返回spu信息（对象），
      // 添加spu，如果是添加spu的时候并没有向服务器发请求，数据收集到哪里，收集的数据有哪些字段，看文档。
      spu: {
        // 通过v-model双向绑定收集的数据
        spuName: "",       //spu名称，收集
        description: "",   //描述
        category3Id: 0,          //三级分类的id,-要确定加给谁
        // id: 0,                 //新增spu没有id
        spuImageList: [
          // {
          //   id: 0,               //图片id,添加时没有
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0             //spu属性Id，添加时还未生成，没有
          // }
        ],
        tmId: '',                 //品牌id:初始化为一个字符串，这样默认显示的格式不会是一个数字
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {      //销售属性
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: "string",
          // spuId: 0,
          // spuSaleAttrValueList: [{
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0
          // }
        ],

      },
      attrId: '',
      Trademark: [],
      spuImageList: [],
      SaleAttr: [],
      // tag标签
      inputVisible: false,
      inputValue: ''
    }
  },

  computed: {
    // 计算出不在当前spu中的销售属性的数组
    unSelectSaleAttr() {
      let result = this.SaleAttr.filter(item => {
        // every数组的方法,会返回一个布尔值,[真,假的]
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName;
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙回调
    // 删除功能的回调
    // file是删除的那个图片的数据， fileList是删除之后剩余的图片的数据
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // 将删除之后剩余的数据数组传给spuImageList
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      // 将图片地址赋值给了这个属性dialogImageUrl
      this.dialogImageUrl = file.url;
      // dialogVisible修改为真，让当大的图片dialog显示处理
      this.dialogVisible = true;
    },
    // 照片墙上传成功之后的回调
    // response：是图片上传成功之后服务器返回的信息：
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      // 将上传成功之后的数组列表赋值给spuImageList
      this.spuImageList = fileList
    },
    // 取消按钮的回调
    cancle() {
      this.$emit('changeScene', { scene: 0 })
      // 清空spu，解决数据回显问题
      // Object.assign es6中新增的方法可以合并对象
      // 组件实例this._data,可以操作data当中响应式数据；this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    },
    // 获取初始化数据
    // spu数据
    async getInitData(row) {
      console.log(row)
      let spu = await this.$API.spu.reqSpu(row.id)
      if (spu.code == 200) {
        this.spu = spu.data
      }
      // 品牌展示数据
      let Trademark = await this.$API.spu.reqTrademarkList()
      if (Trademark.code == 200) {
        this.Trademark = Trademark.data
      }
      //spu图片列表
      let spuImageList = await this.$API.spu.reqspuImageList(row.id)
      if (spuImageList.code == 200) {
        let arrList = spuImageList.data
        arrList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        });
        this.spuImageList = arrList
      }
      // 销售属性
      let reqSaleAttr = await this.$API.spu.reqSaleAttr()
      if (reqSaleAttr.code == 200) {
        this.SaleAttr = reqSaleAttr.data
      }

      // 在点击修改按钮的时候为每一个销售属性值添加一个字段inputVisible=false
      // this.$nextTick(() => {
      //   console.log(this.spu.spuSaleAttrList.spuSaleAttrValueList)
      //   this.spu.spuSaleAttrList.spuSaleAttrValueList.forEach(item => {
      //     // 数组结构嵌套，复杂，响应式添加到vue property
      //     this.$set(item, inputVisible, false)
      //   })
      // })
    },
    // 当父组件spu点击了添加spu之后调用的spuform组件的方法
    async addSpu(category3Id) {
      // 收集spu的category3Id数值
      this.spu.category3Id = category3Id
      // 清空之前保存的数据
      this.spuImageList = [];
      // 发请求：收集品牌的数据和销售属性的数据
      // 品牌展示数据
      let Trademark = await this.$API.spu.reqTrademarkList()
      if (Trademark.code == 200) {
        this.Trademark = Trademark.data
      }
      // 销售属性
      let reqSaleAttr = await this.$API.spu.reqSaleAttr()
      if (reqSaleAttr.code == 200) {
        this.SaleAttr = reqSaleAttr.data
      }
    },
    // 表单销售属性值tag的回调（element-ui)
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },

    showInput(row, index) {
      // console.log(row)
      // 添加控制显示隐藏的按钮，inputVisible
      this.$set(row, 'inputVisible', true)     //要添加的销售属性值字段需要加引号
      // 添加一个控制存放销售属性值的字段inputValue,初始值为一个空串
      this.$set(row, 'inputValue', '')
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // tag添加和输入确认：blur和enter事件
    handleInputConfirm(row) {
      // 显示span,隐藏input
      row.inputVisible = false;
      // 新增的tab需要显示出来，将添加的row.value  根据结构需要的字段push到tag数组当中。
      // 如果输入的是空值，怎返回并提示输入有效字段
      if (row.inputValue.trim() == '') {
        this.$message('请输入一个有效字段')
        return;
      }
      // 判断重复:如果新输入的flag与之前的重复，则返回并提示
      let result = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName == row.inputValue
      })
      if (result) {
        this.$message('已存在该属性值，请重新输入')
        return
      }
      console.log(result)
      // 解构参数：
      const { baseSaleAttrId, inputValue } = row
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })

    },
    // 添加销售属性回调
    addAttr() {
      // 整理参数：销售属性是一个对象{baseSaleAttrId：saleAttrName:"",spuSaleAttrValueList}
      // 把收集道德数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':');
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 添加以后清空输入框中中选中的属性值名称
      this.attrId = '';
    },
    // 保存添加spu和修改spu的回调函数
    async addOrUpdate() {
      // 整理参数、发请求、页面跳转到spu列表展示页面
      // (1)整理参数：spu.spuImageList携带给服务器的参数必须携带imgUrl和imgName字段，而对于新添加的图片对象只有name和url,没有imgUrl和imgName
      // 需要注意：新添加的图片对象里面的url是本地图片，所以应该采用的是response里面的data路径，如果没有response则表示是之前的图片对象，应该使用url就可以
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        }
      })
      // 发请求：
      let result = await this.$API.spu.reqsaveSpuInfo(this.spu)
      // console.log(result)
      // 显示保存成功并页面场景切换
      this.$message({ type: 'success', message: '保存成功' })
      this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      // 清空数据
      Object.assign(this._data, this.$options.data())
    }
  }


}

</script>

<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
