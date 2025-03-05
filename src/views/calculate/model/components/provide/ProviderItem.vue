<template>
  <div :class="rotateFlag ? 'rotate-line':''">
    <div :ref="dragSource" class="provider-item" @click="setSourceObj" v-click-outside="onClickOutside">
        <div class="mb-1">{{ item.propertyName }}</div>
        <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import { ItemTypes } from '../../data.ts'
import { useCalculateStore } from "@/store/modules/calculate"
import { watch ,computed} from 'vue'
import vClickOutside from '@/directives/clickOutside';
import { toRefs } from '@vueuse/core'
const calculateStore = useCalculateStore()

const props = defineProps({
    item: Object, 
    id:String
})


const rotateFlag = computed(()=>{
  if(calculateStore.sourceObj=== undefined){
    return false
  }
  return calculateStore.sourceObj.objectId === props.id&&calculateStore.sourceObj.info.propertyName === props.item.propertyName
})

const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: props.item.propertyType,
	item: ()=>({
    //应该传入所属对象的id
        objectId: props.id,
        info: props.item
    }),
    collect: monitor => ({
        dragging: monitor.isDragging()
    }),
}))
const { dragging } = toRefs(collectedProps)

watch(dragging,(value)=>{
    if(value){
        calculateStore.activeType = props.item.propertyType
        calculateStore.activeId = props.id
    }else{
        calculateStore.activeType = undefined
        calculateStore.activeId = undefined
    }
})


function setSourceObj(){
  calculateStore.sourceObj = {
    objectId: props.id,
    info: props.item
  }
}

function onClickOutside(){
  calculateStore.sourceObj = undefined
}
</script>
<style scoped lang="less">

.provider-item{
    color: #fff;
    padding: 4px;
    width: 95%;
    margin: 4px;
    background-color: #87d068;
    border-radius: 4px;
}

  // 转动的边框线(两条)
  .rotate-line{
    --bRadius: 3px;
    .provider-item{
        position: relative;
        background-color: #87d068;
        border-radius: var(--bRadius);
        transition: all .3s;
        &::before, &::after {
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid #87d068;
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
</style>