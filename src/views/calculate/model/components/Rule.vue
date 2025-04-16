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
import { useCalculateStore } from "@/store/modules/calculate"
import { cloneDeep } from 'lodash-es'

const calculateStore = useCalculateStore()

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
    info: {
      ...cloneDeep(props.item),
      type:ItemTypes.BOX
    }
  }),
  end: (item, monitor) => {
    const { id: droppedId, originalIndex } = item
    const didDrop = monitor.didDrop()
    const result = monitor.getDropResult()
    console.log("cnm",result)
    if (result === null) {
      calculateStore.callMethod("deleteItem-provider",droppedId)
      calculateStore.callMethod("deleteItem-reciver",droppedId)
      calculateStore.callMethod("deleteItem-transformer",droppedId)
    }
  },
}))


</script>
<style scoped lang="less">

.tech-card{
  color: #fff;
  background: linear-gradient(
    135deg,
    #2db7f5 0%,
    #47c1f7 50%,
    #1aa3e3 100%
  );
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  margin-bottom: 8px;
  transition: box-shadow 0.3s;
}

</style>