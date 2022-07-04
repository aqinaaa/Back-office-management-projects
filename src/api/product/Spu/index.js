// 引入封装的axios请求request
import request from "@/utils/request"
// 获取品牌基本信息
// /admin/product/{page}/{limit}  方式:get
// ??这里接口文档有点问题,或许基础数据,需要的参数除了以上两个,还需要category3Id,老师这里使用的是params参数携带id.后面遇到就多研究一下接口,多尝试一下,多问.
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, params: { category3Id }, method: 'get' });
// 添加spu保存接口
// POST /admin/product/saveSpuInfo
//修改spu保存接口:
// POST /admin/product/updateSpuInfo
// 参数
// #region
// {
//     "category3Id": 0,          //三级分类的id,-要确定加给谁
//     "tmId": 0                  //品牌id
//     "description": "",   //描述
//     "spuName": "string",       //spu名称，收集
//     "id": 0,                   //添加spu没有id
//     "spuImageList": [{
//         "id": 0,               //图片id,添加时没有
//         "imgName": "string",
//         "imgUrl": "string",
//         "spuId": 0             //spu属性Id，添加时还未生成，没有
//     }],
//     
//     "spuSaleAttrList": [{      //销售属性
//         "baseSaleAttrId": 0,
//         "id": 0,
//         "saleAttrName": "string",
//         "spuId": 0,
//         "spuSaleAttrValueList": [{
//             "baseSaleAttrId": 0,
//             "id": 0,
//             "isChecked": "string",
//             "saleAttrName": "string",
//             "saleAttrValueName": "string",
//             "spuId": 0
//         }]
//     }],
//     
// }
// #endregion
export const reqsaveSpuInfo = (spuInfo) => {
    if (spuInfo.id) {
        // 修改
        return request({ url: `/admin/product/updateSpuInfo`, data: spuInfo, method: 'post' });
    } else {
        // 添加
        return request({ url: `/admin/product/saveSpuInfo`, data: spuInfo, method: 'post' });
    }
};
// 品牌列表接口：
// get /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });
// 获取spu基本信息
// /admin/product/getSpuById/{spuId}   get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });
// 获取spu图片的信息
// GET /admin/product/spuImageList/{spuId}
export const reqspuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });
// 获取商品的销售属性
// GET /admin/product/baseSaleAttrList
export const reqSaleAttr = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' });
// 删除spu的接口请求
// /admin/product/deleteSpu/{spuId}   delete
export const reqdeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });

// ----------------------------------------------sku-------------------------------------------------------
//获取图片的接口
//  GET /admin/product/spuImageList/{spuId}
// export const reqspuImageList = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });
//获取销售属性的接口
// GET /admin/product/spuSaleAttrList/{spuId}
export const reqspuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });
// 平台属性
//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqattrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });
// 添加sku后保存sku接口
// /admin/product/saveSkuInfo
export const reqsaveSkuInfo = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, data: skuInfo, method: 'post' });
// 参数:
// #region
// {
//     skuName: "string",                          //sku名称
//     spuId: 0,                                   //点击spu的添加sku时候,row里面携带的id就是spuid
//     category3Id: 0,                             //3级id
//     "createTime": "2022-07-02T04:30:59.106Z",   //不要*
//     id: 0,                                      //不要*添加sku没有id,系统生成
//     isSale: 0,
//     price: 0,                                   //价格
//     weight: ""                                  //重量
//     skuAttrValueList: [                         //平台属性
//       {
//         "attrId": 0,
//         "attrName": "string",
//         "id": 0,
//         "skuId": 0,
//         "valueId": 0,
//         "valueName": "string"
//       }
//     ],
//     skuDefaultImg: "",                           //默认图片的url
//     skuDesc: "string",                           //规格描述
//     skuImageList: [                              //图片列表
//       {
//         id: 0,
//         imgName: "string",
//         imgUrl: "string",
//         isDefault: "string",
//         skuId: 0,
//         spuImgId: 0
//       }
//     ],
//     skuSaleAttrValueList: [                      //销售属性列表
//       {
//         id: 0,
//         saleAttrId: 0,
//         saleAttrName: "string",
//         saleAttrValueId: 0,
//         saleAttrValueName: "string",
//         skuId: 0,
//         spuId: 0
//       }
//     ],
//     tmId: 0,
//   }
// #endregion
// 获取sku列表的数据展示
// /admin/product/findBySpuId/{spuId}   get  参数：spuId
export const reqskuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });