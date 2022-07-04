<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <!-- v-model="cForm.Category1Id" 确定收集到的数据保存到哪里 -->
        <el-select v-model="cForm.Category1Id" placeholder="请选择" @change="handler1" :show="show != 0">
          <!-- :value  收集数据,因为这里category2需要category11id,所以这里收集具体选项的值 -->
          <el-option :label="c1.name" v-for="(c1, index) in list1" :key="c1.id" :value="c1.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.Category2Id" placeholder="请选择" @change="handler2" :show="show != 0">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.Category3Id" placeholder="请选择" @change="handler3" :show="show != 0">
          <el-option :value="c3.id" v-for="(c3, index) in list3" :key="c3.id" :label="c3.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ['show'],
  data() {
    return {
      // 暂放,后替换
      formInline: {
        user: '',
        region: ''
      },
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        Category1Id: '',
        Category2Id: '',
        Category3Id: '',
      }
    }
  },
  mounted() {
    this.getCategoryList()
    console.log(this.show)
  },
  methods: {
    //向服务器发请求获取category1id的数据
    async getCategoryList() {

      // 向服务器请求数据
      // console.log(this.$API)
      let result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code == 200) {
        this.list1 = result.data.slice(0, 10)
      }
    },
    //向服务器发请求 收集category2数据
    async handler1() {
      // 操作了1,首先清空历史2和3
      this.list2 = []
      this.list3 = []
      this.cForm.Category2Id = '';
      this.cForm.Category3Id = '';
      const { Category1Id } = this.cForm
      // 派发自定义函数:发送id到父组件
      this.$emit('getCategoryId', { CategoryId: Category1Id, level: 1 })
      // 发请求
      let result = await this.$API.attr.reqCategory2List(Category1Id)
      console.log(result)
      if (result.code == 200) {
        this.list2 = result.data.slice(0, 10)
      }
    },
    // 向服务器发请求获取category3数据
    async handler2() {
      // 操作了2,先清空3
      this.list3 = [];
      this.cForm.Category3Id = '';
      const { Category2Id } = this.cForm
      // 自定义函数向父组件传递id
      this.$emit('getCategoryId', { CategoryId: Category2Id, level: 2 })

      let result = await this.$API.attr.reqCategory3List(Category2Id)
      // console.log(result)
      if (result.code == 200) {
        this.list3 = result.data.slice(0, 10)
      }
    },
    handler3() {
      const { Category3Id } = this.cForm

      // 向父组件发送自定义事件
      this.$emit('getCategoryId', { CategoryId: Category3Id, level: 3 })

    }
  }
}
</script>

<style>
.demo-form-inline {
  /* margin: 20px 0; */
}
</style>
