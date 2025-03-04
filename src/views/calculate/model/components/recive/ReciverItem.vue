<template>
  <div :ref="drop" class="provider-item">
      <div class="mb-1">{{ item.propertyName }}</div>
      <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
  </div>
</template>
<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import { ItemTypes } from '../../data.ts'

const props = defineProps({
  item: Object,
  id:String
})

const [collectedProps, drop] = useDrop(() => ({
	accept: props.item.propertyType,
  drop: dropFunc
}))

function dropFunc(obj){

}


</script>
<style scoped lang="less">

.provider-item{
  color: #fff;
  padding: 4px;
  width: 100%;
  margin-bottom: 4px;
  background-color: #1890ff;
  border-radius: 4px;
}


</style>