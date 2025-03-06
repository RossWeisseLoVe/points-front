<template>
    <div :ref="dragSource" class="tech-card">
        <div class="card-header">
            <h3 class="card-title">{{getClassName(item)}}</h3>
        </div>
        <span class="card-desc">{{ item.description }}</span>
        <div class="card-line"></div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import { ItemTypes} from "../data.ts"

const props = defineProps({
    item: Object
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}


const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: ItemTypes.CONVERT,
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

.tech-card{
  color: #fff;
  background: linear-gradient(
    135deg,
    #87d068 0%,
    #9ade7a 50%,
    #6fba54 100%
  );
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  margin-bottom: 8px;
  transition: box-shadow 0.3s;
}

</style>