<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="isShow"></CategorySelect>
    </el-card>
    <el-card>
      <!-- attr列表数据展示 -->
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="!category3Id">添加属性</el-button>
        <!-- 表单
      :data="tableData" -->
        <!-- 列对齐方式不用使用行内样式style,而是用align属性 -->
        <el-table border style="width: 100%" :data="attrInfoList">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(value, index) in row.attrValueList" :key="value.id" style="margin:0 5px">{{
                  value.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|修改 -->
      <div v-show="!isShow">
        <!-- :model="" 收集数据 -->
        <el-form :model="attrInfo" label-width="80px" ref="form" class="form">
          <el-form-item label="属性名" style="margin:0 0 20px -25px">
            <el-input v-model="attrInfo.attrName" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>
        <el-button>取消</el-button>
        <!-- :data="tableData" table表格收集数据是使用:data-->
        <el-table border style="width: 100%;margin:20px 0 20px 0px" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input type="text" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                @blur="toLook(row)" @keyup.native.enter="toLook(row)" style="height:30px;width:100%" :ref="$index">
              </el-input>
              <!-- style="display:block"可以让span标签显示为一个行内块元素,不设置样式的话随内容自适应,点击空白区域无法切换
              给span设置一个高度:可以避免span内容为空值时,没有撑开盒子,导致无法点击后切换flag -->
              <span v-else @click="toEdit(row, $index)" style="display:block;height: 30px;">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <!-- Popconfirm确认框 -->
              <!-- 注意事项:在<>内部写{} 是单括号
              @onConfirm事件是写在el-popconfirm上面,而不是button上面-->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrInfoList: [],
      isShow: 0,
      // 收集绑定添加||修改的参数
      attrInfo: {
        attrName: "",      //属性名
        attrValueList: [         //属性名中的属性值,因为属性值有多个,因此需要是数组
          // { //其实状态下不显示,点击添加属性值以后才显示
          // attrId: 0,           //属性的id
          // valueName: ""  //属性值
          // }
        ],
        categoryId: 0,      //三级分类id
        categoryLevel: 3,  //三级分类的level,其实就是3
      }
    }
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
        // 当获取到三级id的时候调用获取attr列表的请求函数
        this.getAttrInfoList()
      }
    },
    // 获取attrInfolist数据的函数
    async getAttrInfoList() {
      // 派发请求,获取attrInfoList数据列表
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      // console.log(result)
      if (result.code == 200) {
        this.attrInfoList = result.data
      }
    },
    // 添加属性按钮的回调
    addAttr() {
      // (1)首先让三级联动选项框不可选择
      // (2)让添加||修改的dom组件显示出来,之前显示列表的页面隐藏
      this.isShow = false
      // (3)点击添加按钮以后处理数据回显的问题
      this.attrInfo = {
        attrName: "",      //属性名
        attrValueList: [         //属性名中的属性值,因为属性值有多个,因此需要是数组
          // { //其实状态下不显示,点击添加属性值以后才显示
          // attrId: 0,           //属性的id
          // valueName: ""  //属性值
          // }
        ],
        categoryId: this.category3Id,      //三级分类id
        categoryLevel: 3,  //三级分类的level,其实就是3
      }
      // (4)添加按钮中收集category3id--3已完成
    },
    // 编辑按钮的回调
    updateAttr(row) {
      // (1)首先让三级联动选项框不可选择
      this.isShow = false
      // (2)让已经存在的数据显示出来
      // 第一种方案:如果使用浅拷贝,取消未保存后第一层数据不会修改,但是第二层还是会被修改掉,因此这里数据结构当中存在对象里面套数组,数组里面有套对象
      // 因此需要使用深拷贝解决则这类问题
      // this.attrInfo = { ...row } 
      // 第二种方案:(采用方案)深拷贝
      this.attrInfo = cloneDeep(row);
      // 向数组里面添加一个响应式属性值,如果使用普通的添加方法: value['sex'] = 'men',虽然flag已经添加到数组中每个对象身上,但是此时添加的
      //  flag不是响应式的,vue无法监测到.
      // 所以需要使用$set将属性值添加到property,Vue.set( target, propertyName/index, value )
      // 它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
      this.attrInfo.attrValueList.forEach((item, index) => {
        this.$set(item, 'flag', false)
      })
    },
    // 添加|修改页面的取消按钮的回调
    cancle() {
      // 让attr列表显示出来
      this.isShow = true
    },
    // 添加属性值的回调
    addAttrValue() {
      // alert(111)
      // 注意:这里的添加属性值有两种场景,一种是在添加属性之下,还有一种是在修改属性之下,如果是修改属性下的添加属性值,则应该给每个属性值添加一个attrId
      // 这个id值已经是存在到attrInfo里面的,在我们点击update修改属性的回调函数里面使用了深拷贝,已经将里面的结构拷贝到attrinfo里面,所以此时已经包含有attId
      // 如果是新增状态下的添加属性值,则this.attrInfo.id找不到id,会生成为underfined
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,     //属性值的id,添加状态下还没有属性值,所以这里写成undefined
        valueName: "",  //属性值
        flag: true,
        // flag属性:给每一个属性值添加一个标记flag,用户切换查看模式与编辑模式,好处-每一个属性值可以控制自己的模式切换
      })
      // 页面渲染完毕之后自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // input模式切换span模式
    toLook(row) {
      // (1)判断输入的内容不能为空,如果为空则返回去让用户继续输入
      console.log(row)
      if (row.valueName.trim() == '') {
        this.$message('请输入一个有效的属性值')
        return
      }
      // (2)用户输入的属性值不能和已有的属性值重复
      let repeat = this.attrInfo.attrValueList.some(item => {
        // 因为新添加的row时attrValueList的最后一个元素,所以必然存在相等的情况,因此使用row != item排除了item里面row元素本身.
        // 判断attrValueList的其余元素 item是否和新增加的row属性值相同,如果相同,则返回一个tue,表示重复,赋值给repeat
        if (row != item) {
          return item.valueName == row.valueName
        }
      })
      // 如果重复则返回用户继续操作
      if (repeat) {
        this.$message('属性值已存在,请重新输入')
        return;
      }
      // row.flag属性修改为false,显示span模式
      row.flag = false
    },
    // 切换编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 点击span的时候,切换为编辑模式,获取点击的input让input自动聚焦,但是需要注意的是,点击之后页面才开始渲染input,这个时候同时去获取input,
      // 会出现underfined,需要使用this.$nextTick()回调函数,这个$nextTick()函数会在页面渲染完毕之后,执行一次.
      this.$nextTick(() => {
        // 获取相应的表单元素实现聚焦:页面渲染完毕之后或者对应index的input实现自动聚焦.
        this.$refs[index].focus();
      })
    },
    //气泡确认框的回调: 删除属性值的回调
    deleteAttrValue(index) {

      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存修改或者添加属性操作
    async saveAttr() {
      // 向服务器发送请求
      // 整理参数:
      // this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName != '') {
          delete item.flag;
          return true;
        }
      })
      // 向服务器派发保存修改或者添加的请求
      try {
        let result = await this.$API.attr.reqsaveAttrInfo(this.attrInfo)
        // console.log(result)
        // 切换显示页面
        this.$message({ type: 'success', message: '保存成功' })
        this.isShow = true
        this.getAttrInfoList()
      } catch (error) {
        this.$message('保存失败')
      }

    }
  }
}
</script>

<style>
.form {
  margin: 0;
  padding: 0;
}
</style>