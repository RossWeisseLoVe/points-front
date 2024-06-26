import {defHttp} from '/@/utils/http/axios';

enum Api {
  Save = '/flow/customer/orders/save',
  GetTimesRemain = '/flow/customer/orders/getTimesRemain',
  Page = '/flow/customer/orders/page'
}
/* 新增订单 */
export const save = (params) =>
  defHttp.post({url: Api.Save, params});

export const getTimesRemain = (params)=>
  defHttp.get({
    url: Api.GetTimesRemain + '/' + params.cid + '/' + params.addType
  })

export const getHistoryPage = (params) => {
  const query = {
    pageSize: params.pageSize,
    pageNum: params.pageNum
  }
  delete params.pageSize
  delete params.pageNum
  const param ={
    query,
    entity: params
  } 
  const result = defHttp.post({url: Api.Page, params: param});
  return result;
};