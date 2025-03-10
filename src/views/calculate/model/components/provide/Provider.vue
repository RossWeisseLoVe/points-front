<template>
    <div :ref="drop" class="provider-container">
      <ProvideDrag 
      v-for="item in providerList" 
      :key="item.id" 
      :provider="item" 
      :id="item.id" 
      :findCard="findCard" 
      :moveCard="moveCard"
      :insertCard="insertCard"
      @hoverIndex="getHoverIndex"
      @deleteItem="deleteItem"
      />
    </div>
</template>
<script lang="ts" setup>
import { Avatar } from "ant-design-vue"
import { useDrop } from 'vue3-dnd'
import { ref,onMounted,onUnmounted } from "vue"
import {ItemTypes} from "../../data.ts"
import { useCalculateStore } from "@/store/modules/calculate"
import ProvideDrag from "./ProvideDrag.vue"

const calculateStore = useCalculateStore()
const providerList = calculateStore.providerList

const [collectedProps, drop] = useDrop(() => ({
	accept: ItemTypes.BOX,
  drop: dropFunc,
  hover(item,monitor){
    console.log("monitor.isOver()",monitor.isOver())
  }
}))

const nowHoverIndex = ref(0)

function getHoverIndex(index){
  nowHoverIndex.value = index
}

function dropFunc(obj,monitor){
  insertCard(obj,obj.id,nowHoverIndex.value)
  nowHoverIndex.value = providerList.length
  calculateStore.callMethod("deleteItem-transformer",obj.id)
  calculateStore.callMethod("deleteItem-reciver",obj.id)
}

function deleteItem(id: string){
  const { index } = findCard(id)
  if(index<0){
    return
  }
  providerList.splice(index, 1)
}

function findCard(id: string){
  const card = providerList.filter(c => `${c.id}` === id)[0]
  return {
    card,
    index: providerList.indexOf(card),
  }
}

function moveCard(id: string, atIndex: number){
  const { card, index } = findCard(id)
  providerList.splice(index, 1)
  providerList.splice(atIndex, 0, card)
  calculateStore.callMethod("deleteItem-transformer",id)
  calculateStore.callMethod("deleteItem-reciver",id)
}

function insertCard(card,id,atIndex){
  const res = findCard(id)
  if(res.index=== -1){
    // 如果没有这个卡片说明是第一移入，直接插到当前位置
    providerList.splice(atIndex, 0, card)
    // 为rules新增一个对象
  }else{
    // 如果不是第一次插入，就要把之前插入的删掉，再重新插入，才会有移动的视觉效果，也不会出现错误
    providerList.splice(res.index, 1)
    providerList.splice(atIndex, 0, card)
    calculateStore.callMethod("deleteItem-transformer",id)
    calculateStore.callMethod("deleteItem-reciver",id)
  }
}

onMounted(() => {
  calculateStore.registerMethod('deleteItem-provider', deleteItem);
});

</script>
<style scoped lang="less">
.provider-container{
  color: #8c8c8c;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  transition: box-shadow 0.3s;
 }


</style>