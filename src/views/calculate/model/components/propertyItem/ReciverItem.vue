<template>
<Dropdown :trigger="['contextmenu']">
  
  <div :ref="drop" :class="isAnime ? 'anime provider-item' :'provider-item' ">
      <Tag color="#cd201f" class="count-badge" size="small" v-if="item.isForeign===1&&regionType!==ItemTypes.OTHERMODEL">外</Tag>
      <div class="mb-1">{{ item.propertyName }}</div>
      <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
      <div :class="rotateFlag ? 'rotate-line':''">
        <div class="dropped-item" v-if="droppedObj.objectId!==undefined" @click="findSource" v-click-outside="onClickOutside">
          <DeleteTwoTone two-tone-color="#eb2f96" class="remove-icon" @click.stop="deleteItem"/>
          <div class="mb-1">{{ droppedObj.info.propertyName }}</div>
          <div :style="{fontSize:'12px'}">{{ droppedObj.info.formItemName }}</div>
        </div>
      </div>
  </div>
  <template #overlay>
      <Menu v-if="regionType!==ItemTypes.OTHERMODEL">
        <MenuItem key="1" @click="setForeign">{{ item.isForeign === 1 ? "取消供外部使用" : "设置可供外部使用" }}</MenuItem>
      </Menu>
    </template>
</Dropdown>
</template>
<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { useCalculateStore } from "@/store/modules/calculate"
import { ref,computed,onMounted } from "vue"
import { Dropdown,Menu,MenuItem,Tag } from "ant-design-vue"
import vClickOutside from '@/directives/clickOutside';
import {
  DeleteTwoTone
} from '@ant-design/icons-vue';
import { ItemTypes } from '../../data';

const droppedObj = ref({} as any) 

const props = defineProps({
  item: Object,
  provider: Object,
  id:String,
  relation: Object,
  regionType:String
} as any)

function setForeign(){
  if(props.item.isForeign===1){
    props.item.isForeign = 0
    // 取消设置向外提供
    const data = {
      ...props.item,
      regionId:props.id,
      regionType:props.regionType
    }
    calculateStore.removeForeignProperties(data)
  }else{
    props.item.isForeign = 1
    // 设置向外提供
    const data = {
      ...props.item,
      regionId:props.id,
      regionType:props.regionType
    }
    calculateStore.setForeignProperties(data)

  }
}

onMounted(()=>{
  if(props.relation===undefined||props.relation===null){
    return
  }
  let name = props.item.propertyName
  if(props.regionType===ItemTypes.OTHERMODEL){
    name = props.item.propertyName + "_" + props.item.regionId
  }
  const dataList = props.relation[name]
  if(dataList===undefined||dataList===null){
    return
  }
  const info = {
    propertyName: dataList[0].sourcePropertyName,
    formItemName: dataList[0].sourceLabel
  }
  droppedObj.value.objectId = dataList[0].sourceObjId
  droppedObj.value.info = info
})

const calculateStore = useCalculateStore()

const isAnime = computed(()=>{
  if(calculateStore.activeType === props.item.propertyType&&calculateStore.activeId !== props.id){
    return true
  }else{
    return false
  }
})


const [collectedProps, drop] = useDrop(() => ({
	accept: props.item.propertyType,
  drop: dropFunc,
  canDrop(item){
    if(item.objectId === props.id){
      return false
    }else{
      return true
    }
  },
}))


const rotateFlag = computed(()=>{
  if(calculateStore.sourceObj=== undefined||droppedObj.value.objectId === undefined){
    return false
  }
  return calculateStore.sourceObj.objectId === droppedObj.value.objectId&&calculateStore.sourceObj.info.propertyName === droppedObj.value.info.propertyName
})
const findSource = ()=>{
  // 改变样式
  calculateStore.sourceObj = droppedObj.value
}

function onClickOutside(){
  calculateStore.sourceObj = undefined
}

// 以下代码用于处理relation

function dropFunc(obj){
  //props.item 是目标属性item
  //obj.info 是来源属性item
  console.log("fucku",obj)
  console.log("fuckm",props.item)
  if(droppedObj.value.objectId!==undefined){
    // 替换时清除之前的记录
    deleteItem()
  }
  droppedObj.value = obj
  if(props.regionType===ItemTypes.OTHERMODEL&&obj.info.regionType!==ItemTypes.OTHERMODEL){
    // 这种情况是一个非othermodel提供值给一个othermodel
    calculateStore.setRelationsU2O(obj.objectId,obj.info.propertyName,props.item.regionId,props.id,props.item.propertyName,props.item.formItemName,props.regionType)
    addRelationU2O(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName,props.item.regionId,obj.info.regionType)
  }else if(props.regionType!==ItemTypes.OTHERMODEL&&obj.info.regionType===ItemTypes.OTHERMODEL){
    // 这种情况是一个othermodel提供值给一个非othermodel
    calculateStore.setRelationsO2U(obj.objectId,obj.info.regionId,obj.info.propertyName,props.id,props.item.propertyName,props.item.formItemName,props.regionType)
    addRelationO2U(obj.info.regionId,obj.objectId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName,obj.info.regionType)
  }else if(props.regionType===ItemTypes.OTHERMODEL&&obj.info.regionType===ItemTypes.OTHERMODEL){
    // 这种情况是一个othermodel提供值给另一个othermodel
    calculateStore.setRelationsO2O(obj.objectId,obj.info.regionId,obj.info.propertyName,props.item.regionId,props.id,props.item.propertyName,props.item.formItemName,props.regionType)
    addRelationO2O(obj.objectId,obj.info.regionId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName,props.item.regionId,obj.info.regionType)
  }else{
    // 在拖拽源与放置目标上增加记录，需要记录的信息有，拖拽源的id、属性名，属性中文名,放置源的id、属性名,属性中文名
    calculateStore.setRelations(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.id,props.item.propertyName,props.item.formItemName,props.regionType)
    addRelation(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName,obj.info.regionType)
  }
}

function deleteItem(){
  const obj = droppedObj.value
  // 删去拖拽源与放置目标的记录
  if(props.regionType===ItemTypes.OTHERMODEL&&obj.info.regionType!==ItemTypes.OTHERMODEL){
    calculateStore.removeRelationsU2O(obj.objectId,obj.info.propertyName,props.item.regionId,props.id,props.item.propertyName)
    removeRelationU2O(obj.objectId,obj.info.propertyName,props.item.propertyName,props.item.regionId)
  }else if(props.regionType!==ItemTypes.OTHERMODEL&&obj.info.regionType===ItemTypes.OTHERMODEL){
    calculateStore.removeRelationsO2U(obj.objectId,obj.info.regionId,obj.info.propertyName,props.id,props.item.propertyName)
    removeRelationO2U(obj.objectId,obj.info.regionId,obj.info.propertyName,props.item.propertyName)
  }else if(props.regionType===ItemTypes.OTHERMODEL&&obj.info.regionType===ItemTypes.OTHERMODEL){
    calculateStore.removeRelationsO2O(obj.objectId,obj.info.regionId,obj.info.propertyName,props.item.regionId,props.id,props.item.propertyName)
    removeRelationO2O(obj.objectId,obj.info.regionId,obj.info.propertyName,props.item.propertyName,props.item.regionId)
  }else{
    calculateStore.removeRelations(obj.objectId,obj.info.propertyName,props.id,props.item.propertyName)
    removeRelation(obj.objectId,obj.info.propertyName,props.item.propertyName)
  }
  droppedObj.value = {}
}

function addRelation(sourceObjId,sourcePropertyName,sourceLabel,targetPropertyName,sourceRegionType){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  if(props.provider.relationIn[targetPropertyName]===undefined){
    props.provider.relationIn[targetPropertyName] = []
  }
  props.provider.relationIn[targetPropertyName].push({
    sourceObjId,sourcePropertyName,sourceLabel,sourceRegionType
  })
}

function removeRelation(sourceObjId,sourcePropertyName,targetPropertyName){
  if(props.provider.relationIn!==undefined){
    if(props.provider.relationIn[targetPropertyName]!==undefined){
      const list = props.provider.relationIn[targetPropertyName]
      const newList = list.filter(item=>{
        return !(item.sourceObjId === sourceObjId && item.sourcePropertyName === sourcePropertyName)
      })
      if(newList.length===0){
        delete props.provider.relationIn[targetPropertyName]
      }else{
        props.provider.relationIn[targetPropertyName] = newList
      }
    }
  }
}

function addRelationU2O(sourceObjId,sourcePropertyName,sourceLabel,targetPropertyName,targetRealRegionId,sourceRegionType){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  const key = targetPropertyName+"_"+targetRealRegionId
  if(props.provider.relationIn[key]===undefined){
    props.provider.relationIn[key] = []
  }
  props.provider.relationIn[key].push({
    sourceObjId,sourcePropertyName,sourceLabel,sourceRegionType
  })
}

function removeRelationU2O(sourceObjId,sourcePropertyName,targetPropertyName,targetRealRegionId){
  if(props.provider.relationIn!==undefined){
    const key = targetPropertyName+"_"+targetRealRegionId
    if(props.provider.relationIn[key]!==undefined){
      const list = props.provider.relationIn[key]
      const newList = list.filter(item=>{
        return !(item.sourceObjId === sourceObjId && item.sourcePropertyName === sourcePropertyName)
      })
      if(newList.length===0){
        delete props.provider.relationIn[key]
      }else{
        props.provider.relationIn[key] = newList
      }
    }
  }
}

function addRelationO2U(sourceObjId,sourceFatherRegionId,sourcePropertyName,sourceLabel,targetPropertyName,sourceRegionType){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  const key = targetPropertyName
  if(props.provider.relationIn[key]===undefined){
    props.provider.relationIn[key] = []
  }
  props.provider.relationIn[key].push({
    sourceObjId,sourceFatherRegionId,sourcePropertyName,sourceLabel,sourceRegionType
  })
}

function removeRelationO2U(sourceObjId,sourceFatherRegionId,sourcePropertyName,targetPropertyName){
  if(props.provider.relationIn!==undefined){
    const key = targetPropertyName
    if(props.provider.relationIn[key]!==undefined){
      const list = props.provider.relationIn[key]
      const newList = list.filter(item=>{
        return !(item.sourceObjId === sourceObjId && item.sourcePropertyName === sourcePropertyName &&item.sourceFatherRegionId === sourceFatherRegionId)
      })
      if(newList.length===0){
        delete props.provider.relationIn[key]
      }else{
        props.provider.relationIn[key] = newList
      }
    }
  }
}

function addRelationO2O(sourceObjId,sourceRealRegionId,sourcePropertyName,sourceLabel,targetPropertyName,targetObjId,sourceRegionType){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  const key = targetPropertyName+"_"+targetObjId
  if(props.provider.relationIn[key]===undefined){
    props.provider.relationIn[key] = []
  }
  props.provider.relationIn[key].push({
    sourceObjId,sourceRealRegionId,sourcePropertyName,sourceLabel,sourceRegionType
  })
}

function removeRelationO2O(sourceObjId,sourceRealRegionId,sourcePropertyName,targetPropertyName,targetObjId){
  if(props.provider.relationIn!==undefined){
    const key = targetPropertyName+"_"+targetObjId
    if(props.provider.relationIn[key]!==undefined){
      const list = props.provider.relationIn[key]
      const newList = list.filter(item=>{
        return !(item.sourceObjId === sourceObjId && item.sourceRealRegionId===sourceRealRegionId && item.sourcePropertyName === sourcePropertyName)
      })
      if(newList.length===0){
        delete props.provider.relationIn[key]
      }else{
        props.provider.relationIn[key] = newList
      }
    }
  }
}


</script>
<style scoped lang="less">

.provider-item{
  color: #fff;
  padding: 4px;
  width: 94%;
  margin: 4px;
  background-color: #1890ff;
  border-radius: 4px;
  position: relative;
  .count-badge{
    position: absolute;
    top: -3px;
    right: -12px;
    font-size: 12px;
  }
  .dropped-item{
    position: relative;
    margin-top: 4px;
    width: 100%;
    color: #fff;
    padding: 4px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #87d068;

    .remove-icon{
    position: absolute;
    top: 0;
    right: 0;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    }
    &:hover .remove-icon {
    opacity: 1;
    visibility: visible;
    }

  }

  // 转动的边框线(两条)
.rotate-line{
    --bRadius: 3px;
    .dropped-item{
        position: relative;
        margin-top: 4px;
        width: 100%;
        color: #fff;
        padding: 4px;
        border-radius: 4px;
        font-size: 12px;
        background-color: #87d068;
        border-radius: var(--bRadius);
        transition: all .3s;
        &::before, &::after {
            content: "";
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border: 2px solid #fff;
            transition: all .5s;
            border-radius: var(--bRadius);
            animation: clippath 3s infinite linear;
        }
        &::after {
            animation: clippath 3s infinite -1.5s linear;
        }
        @keyframes clippath {
            0%, 100% { clip-path: inset(0 0 98% 0); }
            25% { clip-path: inset(0 98% 0 0); }
            50% { clip-path: inset(98% 0 0 0); }
            75% { clip-path: inset(0 0 0 98%); }
        }

    }
}

}

.anime{
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>