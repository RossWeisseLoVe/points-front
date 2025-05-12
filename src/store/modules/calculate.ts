
import { defineStore } from 'pinia';
import { saveModel,getModelById } from "@/api/calculate/calculate"
import { ItemTypes } from '@/views/calculate/model/data';


export const useCalculateStore = defineStore('calculate',{
  state: () => ({
    methods: {},
    activeType: undefined,//用于提示当前可以选择的drop
    activeId: undefined,
    sourceObj: undefined,
    reciverList: [],
    transformerList: [],
    providerList: [],
    modelId: undefined,
    description: undefined,
    modelName: undefined,
    properties: []
  }),
  getters: {

  },
  actions: {
    resetState(){
      this.method = {}
      this.activeType = undefined
      this.activeId = undefined
      this.sourceObj = undefined
      this.reciverList = []
      this.transformerList = []
      this.providerList = []
      this.modelId = undefined
      this.description = undefined
      this.modelName = undefined
      this.properties = []
    },
    async initState(id){
      if(id!==undefined){
        const res = await getModelById(id)
        this.modelId = res.id
        this.description = res.description
        this.modelName = res.name
        this.properties = res.properties
        for (const item of res.template) {
          if(item.type === "provider"){
            this.providerList.push(item)
          }else if(item.type === "transformer"){
            this.transformerList.push(item)
          }else if(item.type === "reciver"){
            this.reciverList.push(item)
          }
        }
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
    setRelations(sourceObjId,sourcePropertyName,sourceLabel,targetObjId,targetPropertyName,targetLabel,targetRegionType){
      //给拖拽源设置目标关系，给放置目标设置来源关系通过父子组件传值来做，提高效率
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut===undefined||source.relationOut===null){
        source.relationOut = {}
      }
      if(source.relationOut[sourcePropertyName]===undefined){
        source.relationOut[sourcePropertyName] = []
      }
      source.relationOut[sourcePropertyName].push({
        targetObjId,targetPropertyName,targetLabel,targetRegionType
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
    //普通region给othermodel赋值
    setRelationsU2O(sourceObjId,sourcePropertyName,targetObjId,targetFatherRegionId,targetPropertyName,targetLabel,targetRegionType){
      const key = sourcePropertyName
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut===undefined||source.relationOut===null){
        source.relationOut = {}
      }
      if(source.relationOut[key]===undefined){
        source.relationOut[key] = []
      }
      source.relationOut[key].push({
        targetObjId,targetFatherRegionId,targetPropertyName,targetLabel,targetRegionType
      })
    },
    removeRelationsU2O(sourceObjId,sourcePropertyName,targetObjId,targetFatherRegionId,targetPropertyName){
      const key = sourcePropertyName
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut!==undefined){
        if(source.relationOut[key]!==undefined){
          const list = source.relationOut[key]
          const newList = list.filter(item=>{
            return !(item.targetObjId === targetObjId && item.targetPropertyName === targetPropertyName&&item.targetFatherRegionId===targetFatherRegionId)
          })
          if(newList.length===0){
            delete source.relationOut[key]
          }else{
            source.relationOut[key] = newList
          }
        }
      }
    },
    setRelationsO2U(sourceObjId,realsourceObjId,sourcePropertyName,targetObjId,targetPropertyName,targetLabel,targetRegionType){
      const key = sourcePropertyName+"_"+realsourceObjId
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut===undefined||source.relationOut===null){
        source.relationOut = {}
      }
      if(source.relationOut[key]===undefined){
        source.relationOut[key] = []
      }
      source.relationOut[key].push({
        targetObjId,targetPropertyName,targetLabel,targetRegionType
      })
    },
    removeRelationsO2U(sourceObjId,realsourceObjId,sourcePropertyName,targetObjId,targetPropertyName){
      const key = sourcePropertyName+"_"+realsourceObjId
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut!==undefined){
        if(source.relationOut[key]!==undefined){
          const list = source.relationOut[key]
          const newList = list.filter(item=>{
            return !(item.targetObjId === targetObjId && item.targetPropertyName === targetPropertyName)
          })
          if(newList.length===0){
            delete source.relationOut[key]
          }else{
            source.relationOut[key] = newList
          }
        }
      }
    },
    setRelationsO2O(sourceObjId,realsourceObjId,sourcePropertyName,targetObjId,targetFatherRegionId,targetPropertyName,targetLabel,targetRegionType){
      const key = sourcePropertyName+"_"+realsourceObjId
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut===undefined||source.relationOut===null){
        source.relationOut = {}
      }
      if(source.relationOut[key]===undefined){
        source.relationOut[key] = []
      }
      source.relationOut[key].push({
        targetObjId,targetFatherRegionId,targetPropertyName,targetLabel,targetRegionType
      })
    },
    removeRelationsO2O(sourceObjId,realsourceObjId,sourcePropertyName,targetObjId,targetFatherRegionId,targetPropertyName){
      const key = sourcePropertyName+"_"+realsourceObjId
      const source = this.getSourceObj(sourceObjId)
      if(source.relationOut!==undefined){
        if(source.relationOut[key]!==undefined){
          const list = source.relationOut[key]
          const newList = list.filter(item=>{
            return !(item.targetObjId === targetObjId && item.targetPropertyName === targetPropertyName&&item.targetFatherRegionId===targetFatherRegionId)
          })
          if(newList.length===0){
            delete source.relationOut[key]
          }else{
            source.relationOut[key] = newList
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
          const info ={
            type:item.info.type,
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties,
          }
          if(item.info.type===ItemTypes.OTHERMODEL){
            info.sourceModelId = item.info.sourceModelId?item.info.sourceModelId:item.info.id

          }
          regionList.push({
            id:item.id,
            info,
            relationOut:item.relationOut,
            relationIn: item.relationIn,
            isGhost:item.isGhost,
            type:'provider'
          })
      }
      for (const item of this.transformerList) {
          const info ={
            type:item.info.type,
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties,
          }
          if(item.info.type===ItemTypes.OTHERMODEL){
            info.sourceModelId = item.info.sourceModelId?item.info.sourceModelId:item.info.id
          }
          regionList.push({
            id:item.id,
            info,
            relationOut:item.relationOut,
            relationIn: item.relationIn,
            isGhost:item.isGhost,
            type:'transformer'
          })
      }
      for (const item of this.reciverList) {
          const info ={
            type:item.info.type,
            className: item.info.className,
            description: item.info.description,
            properties: item.info.properties,
          }
          if(item.info.type===ItemTypes.OTHERMODEL){
            info.sourceModelId = item.info.sourceModelId?item.info.sourceModelId:item.info.id

          }
          regionList.push({
            id:item.id,
            info,
            relationOut:item.relationOut,
            relationIn: item.relationIn,
            isGhost:item.isGhost,
            type:'reciver'
          })
      }
      console.log("ssssssss",regionList)
      const res = await saveModel({
        template:regionList,
        id: this.modelId,
        name: this.modelName,
        description: this.description,
        properties:this.properties
      })
      this.modelId = res.id
      this.modelName = res.name
      this.description = res.description
      console.log("modelMessage",res)
    },
    setForeignProperties(item){
      this.properties.push(item)
    },
    removeForeignProperties(item){
      this.properties = this.properties.filter(data=>{
        return !(item.regionId===data.regionId&&item.id===data.id)
      })
    },
    setSourceRegionGhost(sourceObjId,status){
      const source = this.getSourceObj(sourceObjId) as any
      source.isGhost = status
    }
  },
});

