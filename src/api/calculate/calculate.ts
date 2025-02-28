import {defHttp} from '/@/utils/http/axios';

enum Api {
    GetAllRules = '/flow/generate/class/getAllRules',
    GetPropertiesById = '/flow/generate/property/getPropertiesById',
    GetResult = '/flow/test/calculate/getResult'
}


export const getAllRules = () =>
  defHttp.get({url: Api.GetAllRules});

  export const getPropertiesById = (params) =>
  defHttp.get({url: Api.GetPropertiesById+'/'+params.id});

export const getResult = (params) =>
  defHttp.post({url: Api.GetResult+'?typeName='+params.typeName , params: params.param});

// export const deleteActivityByIds = (params) =>
//   defHttp.post({url: Api.DeleteActivityByIds, params});

