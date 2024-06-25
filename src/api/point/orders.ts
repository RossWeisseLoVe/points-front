import {defHttp} from '/@/utils/http/axios';

enum Api {
  Save = '/flow/customer/orders/save',
  GetTimesRemain = '/flow/customer/orders/getTimesRemain'
}
/* 新增订单 */
export const save = (params) =>
  defHttp.post({url: Api.Save, params});

export const getTimesRemain = (params)=>
  defHttp.get({
    url: Api.GetTimesRemain + '/' + params.cid + '/' + params.addType
  })