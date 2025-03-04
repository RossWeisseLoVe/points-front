<template>
  <div :ref="drop" :class="isAnime ? 'anime provider-item' :'provider-item' ">
      <div class="mb-1">{{ item.propertyName }}</div>
      <div :style="{fontSize:'12px'}">{{ item.formItemName }}</div>
  </div>
</template>
<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { useCalculateStore } from "@/store/modules/calculate"
import { ref,computed } from "vue"

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