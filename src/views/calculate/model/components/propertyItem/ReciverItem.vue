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

const droppedObj = ref({})

const props = defineProps({
  item: Object,
  provider: Object,
  id:String,
  relation: Object,
  regionType:String
})

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
  const dataList = props.relation[props.item.propertyName]
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

const emits = defineEmits(['removeRelation','addRelation','addRelationForOtherModel','removeRelationForOtherModel'])

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

function dropFunc(obj){
  console.log("fucku",obj)
  if(droppedObj.value.objectId!==undefined){
    // 替换时清除之前的记录
    deleteItem()
  }
  droppedObj.value = obj
  if(props.regionType===ItemTypes.OTHERMODEL&&obj.info.regionType!==ItemTypes.){
    calculateStore.setRelationsForOtherModel(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.id,props.item.propertyName,props.item.formItemName,props.item.regionId)
    addRelationForOtherModel(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName,props.item.regionId)
  }else{
    // 在拖拽源与放置目标上增加记录，需要记录的信息有，拖拽源的id、属性名，属性中文名,放置源的id、属性名,属性中文名
    calculateStore.setRelations(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.id,props.item.propertyName,props.item.formItemName)
    addRelation(obj.objectId,obj.info.propertyName,obj.info.formItemName,props.item.propertyName)
  }
}

function deleteItem(){
  // 删去拖拽源与放置目标的记录
  if(props.regionType===ItemTypes.OTHERMODEL){
    calculateStore.removeRelationsForOtherModel(droppedObj.value.objectId,droppedObj.value.info.propertyName,props.id,props.item.propertyName,props.item.regionId)
    removeRelationForOtherModel(droppedObj.value.objectId,droppedObj.value.info.propertyName,props.item.propertyName,props.item.regionId)
  }else{
    calculateStore.removeRelations(droppedObj.value.objectId,droppedObj.value.info.propertyName,props.id,props.item.propertyName)
    removeRelation(droppedObj.value.objectId,droppedObj.value.info.propertyName,props.item.propertyName)
  }
  droppedObj.value = {}
}


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

function addRelation(sourceObjId,sourcePropertyName,sourceLabel,targetPropertyName){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  if(props.provider.relationIn[targetPropertyName]===undefined){
    props.provider.relationIn[targetPropertyName] = []
  }
  props.provider.relationIn[targetPropertyName].push({
    sourceObjId,sourcePropertyName,sourceLabel
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

function addRelationForOtherModel(sourceObjId,sourcePropertyName,sourceLabel,targetPropertyName,targetRealRegionId){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  const key = targetPropertyName+"_"+targetRealRegionId
  if(props.provider.relationIn[key]===undefined){
    props.provider.relationIn[key] = []
  }
  props.provider.relationIn[key].push({
    sourceObjId,sourcePropertyName,sourceLabel
  })
}

function removeRelationForOtherModel(sourceObjId,sourcePropertyName,targetPropertyName,targetRealRegionId){
  if(props.provider.relationIn!==undefined){
    const key = targetPropertyName+"_"+targetRealRegionId
    alert(key)
    if(props.provider.relationIn[key]!==undefined){
      const list = props.provider.relationIn[key]
      alert(321)
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