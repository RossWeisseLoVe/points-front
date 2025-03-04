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

const props = defineProps({
    item: Object,
    id:String
})


const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: props.item.propertyType,
	item: ()=>({
    //应该传入所属对象的id
    id: props.id,
    info: props.item
  })
}))


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