// 引入封装的axios请求request
import request from "@/utils/request"
// 获取sku页面展示数据的接口请求
// /admin/product/list/{page}/{limit}
export const reqSku = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });
// sku商品上架的接口请求
// GET /admin/product/onSale/{skuId}
export const reqonSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });
// sku商品下架的接口请求
// GET /admin/product/cancelSale/{skuId}
export const reqcancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });
// sku抽屉显示效果
// /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });