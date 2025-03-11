import {defHttp} from '/@/utils/http/axios';

enum Api {
    GetAllRules = '/flow/generate/class/getAllRules',
    GetPropertiesById = '/flow/generate/property/getPropertiesById',
    GetResult = '/flow/calculate/getResult',
    Reload  = '/flow/calculate/reload',
    GetAllRulesWithProperty = '/flow/generate/class/getAllRulesWithProperty',
    SaveModel  = '/flow/calculate/saveModel',
    GetModels = '/flow/calculate/getModels',
    GetModelById = '/flow/calculate/getModelById',
    NewInstance = '/flow/calculate/newInstance',
    GetInstancePageByModelId = '/flow/calculate/getInstancePageByModelId',
    GetRegionInstanceModelListById = '/flow/calculate/getRegionInstanceModelListById'
}


export const getAllRules = () =>
  defHttp.get({url: Api.GetAllRules});

  export const getPropertiesById = (params) =>
  defHttp.get({url: Api.GetPropertiesById+'/'+params.id});

export const getResult = (params) =>
  defHttp.post({url: Api.GetResult+'?typeName='+params.typeName , params: params.param});

export const reloadAll = () =>
  defHttp.post({url: Api.Reload});

export const saveModel = (params) =>
  defHttp.post({url: Api.SaveModel,params});

export const getAllRulesWithProperty = () =>
  defHttp.get({url: Api.GetAllRulesWithProperty});

export const getModelsPage = (params) => {
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
  const result = defHttp.post({url: Api.GetModels, params: param});
  return result;
};

export const getModelById = (id) =>
  defHttp.get({url: Api.GetModelById  + '/' + id});

export const newInstance = (params) =>
  defHttp.post({url: Api.NewInstance,params});

export const getInstancePageByModelId = (params) => {
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
  const result = defHttp.post({url: Api.GetInstancePageByModelId, params: param});
  return result;
}

export const getRegionInstanceModelListById = (id) =>
  defHttp.get({url: Api.GetRegionInstanceModelListById  + '/' + id});