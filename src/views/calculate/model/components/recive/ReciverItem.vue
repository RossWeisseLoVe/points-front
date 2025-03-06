<template>
  <div :ref="drop" :class="isAnime ? 'anime provider-item' :'provider-item' ">
      <div class="mb-1">{{ item.propertyName }}</div>
      <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
      <div :class="rotateFlag ? 'rotate-line':''">
        <div class="dropped-item" v-if="droppedObj.objectId!==undefined" @click="findSource" v-click-outside="onClickOutside">
          <div class="mb-1">{{ droppedObj.info.propertyName }}</div>
          <div :style="{fontSize:'12px'}">{{ droppedObj.info.formItemName }}</div>
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { useCalculateStore } from "@/store/modules/calculate"
import { ref,computed } from "vue"
import vClickOutside from '@/directives/clickOutside';

const droppedObj = ref({})

const props = defineProps({
  item: Object,
  id:String
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

function dropFunc(obj){
  console.log("dropped:", obj)
  droppedObj.value = obj
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


</script>
<style scoped lang="less">

.provider-item{
  color: #fff;
  padding: 4px;
  width: 94%;
  margin-left: 5px;
  margin-bottom: 4px;
  background-color: #1890ff;
  border-radius: 4px;
  .dropped-item{
    margin-top: 4px;
    width: 100%;
    color: #fff;
    padding: 4px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #87d068;
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