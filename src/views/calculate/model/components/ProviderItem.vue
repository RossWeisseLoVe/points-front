<template>
    <div class="provider-item">
        <div>{{ item.propertyName }}</div>
        <div>{{ item.formItemName }}</div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'

const props = defineProps({
    item: Object
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}

// const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
// 	type: 'BOX',
// 	item: ()=>({
//     id: buildUUID(),
//     info: props.item
//   })
// }))


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