import {defHttp} from '/@/utils/http/axios';

enum Api {
  Page = '/flow/customer/client/page',
  Add = '/flow/customer/client/add',
  Update = '/flow/customer/client/update',
  Delete = '/flow/customer/client/deleteByIds',
  GetUserPointTopTen = '/flow/customer/client/getUserPointTopTen',
  GetUserPointUsedTopTen = '/flow/customer/client/getUserPointUsedTopTen'
}

export const getClientPage = (params) => {
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

export const add = (params) =>
  defHttp.post({url: Api.Add, params});

export const update = (params) =>
  defHttp.post({url: Api.Update, params});

export const deleteByIds = (params) =>
  defHttp.post({url: Api.Delete, params});

export const getUserPointTopTen = () =>
  defHttp.get({url: Api.GetUserPointTopTen});

export const getUserPointUsedTopTen = (status) =>
  defHttp.get({url: Api.GetUserPointUsedTopTen+'/'+status});