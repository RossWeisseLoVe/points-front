<template>
    <div :ref="dragSource" class="provider-item">
        <div class="mb-1">{{ item.propertyName }}</div>
        <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import { ItemTypes } from '../../data.ts'
import { useCalculateStore } from "@/store/modules/calculate"
import { watch } from 'vue'
import { toRefs } from '@vueuse/core'
const calculateStore = useCalculateStore()

const props = defineProps({
    item: Object,
    id:String
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


</script>
<style scoped lang="less">

.provider-item{
    color: #fff;
    padding: 4px;
    width: 100%;
    margin-bottom: 4px;
    background-color: #87d068;
    border-radius: 4px;
}


</style>