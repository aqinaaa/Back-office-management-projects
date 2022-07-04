// 引入封装的axios请求request
import request from "@/utils/request"

// ----------------三级联动的接口--------------------
// 一级分类:
// /admin/product/get/category1/{id}  get  参数:商品id
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, methods: 'get' });
// 二级分类接口请求:
// /admin/product/getCategory2/{category1Id}  methods:get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, methods: 'get' });
// 三级分类接口请求:
// /admin/product/getCategory3/{category2Id}  methods:get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, methods: 'get' });
// ----------------attr---------------------------------
// 获取商品基础属性:
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  methods:get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, methods: 'get' });
// 添加商品属性|修改商品属性的接口
// /admin/product/saveAttrInfo   post
// #region
// 参数
// 参数清洗:1 -添加一个属性是没有参数id的,id由服务器后台生成;删掉了属性和属性值列表的id;
// {
//   "attrName": "",      //属性名
//   "attrValueList": [         //属性名中的属性值,因为属性值有多个,因此需要是数组
//     {
//       "attrId": 0,           //属性的id
//       "valueName": ""  //属性值
//     }
//   ],
//   "categoryId": 0,      //三级分类id
//   "categoryLevel": 3,  //三级分类的level,其实就是3
// }
//#endregion
export const reqsaveAttrInfo = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data }); //这里的data可以kv一致省略v,也可以写为data:data