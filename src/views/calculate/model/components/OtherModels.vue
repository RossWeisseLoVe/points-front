<!-- 其他已经定义好的模型 -->
<template>
    <div :ref="dragSource" class="tech-card">
        <div class="card-header">
            <h3 class="card-title">{{item.name}}</h3>
        </div>
        <span class="card-desc">{{ item.description }}</span>
        <div class="card-line"></div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { buildUUID } from '@/utils/uuid.ts'
import { ItemTypes} from "../data.ts"
import { cloneDeep } from "lodash-es"

const props = defineProps({
    item: Object
})


const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: ItemTypes.OTHERMODEL,
	item: ()=>({
    id: buildUUID(),
    info: {
      ...cloneDeep(props.item),
      type:ItemTypes.OTHERMODEL
    }
  }),
  end: (item, monitor) => {
    const { id: droppedId, originalIndex } = item
    const didDrop = monitor.didDrop()
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
  #ffc53d 0%,      /* 主色：琥珀黄 */
  #fadb14 50%,     /* 淡金色 */
  #e6a800 100%     /* 浅米黄 */
);
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  margin-bottom: 8px;
  transition: box-shadow 0.3s;
}

</style>