import {defHttp} from '/@/utils/http/axios';

enum Api {
  Page = '/flow/customer/activity/page',
  AddActivity = '/flow/customer/activity/addActivity',
  UpdateActivity = '/flow/customer/activity/updateActivity',
  DeleteActivityByIds = '/flow/customer/activity/deleteActivityByIds',
  SetTimedStatus = '/flow/customer/activity/setTimedStatus',
}

export const getActivityPage = (params) => {
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

export const addActivity = (params) =>
  defHttp.post({url: Api.AddActivity, params});

export const updateActivity = (params) =>
  defHttp.post({url: Api.UpdateActivity, params});

export const deleteActivityByIds = (params) =>
  defHttp.post({url: Api.DeleteActivityByIds, params});

  // 设置定时发布
  export const setTimedStatus = (params) =>
  defHttp.get({url: Api.SetTimedStatus+'/'+params.id+'/'+params.status});