import {defHttp} from '/@/utils/http/axios';

enum Api {
  Page = '/flow/customer/goods/page',
  Add = '/flow/customer/goods/add',
  Update = '/flow/customer/goods/update'
}
/* 新增奖品 */
export const add = (params) =>
  defHttp.post({url: Api.Add, params});

/* 编辑奖品 */
export const updateReward = (params) =>
  defHttp.post({url: Api.Update, params});

/* 查询列表 */
export const getRewardPage = (params) => {
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

/* 删除奖品 */
export const deleteRewardByIds = (params) =>
  defHttp.post({url: Api.Add, params});