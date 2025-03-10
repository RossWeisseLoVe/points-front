
import { defineStore } from 'pinia';
import { saveModel,getModelById } from "@/api/calculate/calculate"


export const useCalculateStore = defineStore('calculate',{
  state: () => ({
    methods: {},
    activeType: undefined,//用于提示当前可以选择的drop
    activeId: undefined,
    sourceObj: undefined,
    reciverList: [],
    transformerList: [],
    providerList: []
  }),
  getters: {

  },
  actions: {
    async initState(id){
      if(id!==undefined){
        const res = await getModelById(id)
      }
    },
    registerMethod(methodName, method) {
      this.methods[methodName] = method;
    },
    callMethod(methodName, ...args) {
      const method = this.methods[methodName];
      if (method && typeof method === 'function') {
        return method(...args);
      } else {
        console.warn(`Method ${methodName} not found in sharedMethods`);
      }
    },
    setRelations(sourceObjId,sourcePropertyName,targetObjId,targetPropertyName){
      //给拖拽源设置目标关系，给放置目标设置来源关系通过父子组件传值来做，提高效率
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut===undefined){
        source.relationOut = {}
      }
      if(source.relationOut[sourcePropertyName]===undefined){
        source.relationOut[sourcePropertyName] = []
      }
      source.relationOut[sourcePropertyName].push({
        targetObjId,targetPropertyName
      })
    },
    removeRelations(sourceObjId,sourcePropertyName,targetObjId,targetPropertyName){
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut!==undefined){
        if(source.relationOut[sourcePropertyName]!==undefined){
          const list = source.relationOut[sourcePropertyName]
          const newList = list.filter(item=>{
            return !(item.targetObjId === targetObjId && item.targetPropertyName === targetPropertyName)
          })
          if(newList.length===0){
            delete source.relationOut[sourcePropertyName]
          }else{
            source.relationOut[sourcePropertyName] = newList
          }
        }
      }
    },
    getSourceObj(id){
      for (const item of this.providerList) {
        if(item.id === id){
          return item
        }
      }
      for (const item of this.transformerList) {
        if(item.id === id){
          return item
        }
      }
    },
    async saveCalculateModel(){
      const regionList:Array<any> = []
      for (const item of this.providerList) {
        regionList.push({
          id:item.id,
          info: {
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties
          },
          relationOut:JSON.stringify(item.relationOut),
          relationIn: JSON.stringify(item.relationIn),
          type:'provider'
        })
      }
      for (const item of this.transformerList) {
        regionList.push({
          id:item.id,
          info: {
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties
          },
          relationOut:JSON.stringify(item.relationOut),
          relationIn: JSON.stringify(item.relationIn),
          type:'transformer'
        })
      }
      for (const item of this.providerList) {
        regionList.push({
          id:item.id,
          info: {
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties
          },
          relationOut:JSON.stringify(item.relationOut),
          relationIn: JSON.stringify(item.relationIn),
          type:'reciver'
        })
      }
      await saveModel({
        template:regionList
      })
    }
  },
});

