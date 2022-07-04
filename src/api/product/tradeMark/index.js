import request from '@/utils/request'
// 获取品牌管理数据接口
// /admin/product/baseTrademark/{page}/{limit}   get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: "get" });

// 新增品牌的接口:POST /admin/product/baseTrademark/save   参数:"logoUrl": "string","tmName": "string"
// -----切记:对于新增的品牌,给服务器传递数据,不需要传递id,id是服务器生成

//修改品牌列表的接口   PUT /admin/product/baseTrademark/update   { "id": 0,"logoUrl": "string","tmName": "string"}
// -----切记,对于修改某一个品牌的操作,前端谢丹的参数需要带上id,你需要告诉服务器修改的是哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // 如果带有id,说明是修改品牌的接口
        return request({ url: `/admin/product/baseTrademark/update`, data: tradeMark, method: "put" });
    } else {
        // 如果不带id,是新增接口
        return request({ url: `/admin/product/baseTrademark/save`, data: tradeMark, method: "post" });
    }
};
// 删除品牌接口  /admin/product/baseTrademark/remove/{id}  method:delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: "delete" });