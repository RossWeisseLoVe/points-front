<template>
    <div :ref="dragSource" class="tech-card">
        <div class="card-header">
            <h3 class="card-title">{{getClassName(item)}}</h3>
        </div>
        <p class="card-desc">{{ item.description }}</p>
        <div class="card-line"></div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import{ ItemTypes} from "../data.ts"

const props = defineProps({
    item: Object
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}


const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: ItemTypes.BOX,
	item: ()=>({
    id: buildUUID(),
    info: props.item
  }),
  end: (item, monitor) => {
    const { id: droppedId, originalIndex } = item
    const didDrop = monitor.didDrop()
    console.log('didDrop', didDrop)
    if (!didDrop) {

      }
  },
}))


</script>
<style scoped lang="less">



</style>