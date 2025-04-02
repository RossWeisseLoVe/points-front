<template>
    <div :ref="node => drag(drop(node))" class="provider-box" >
      <DeleteTwoTone two-tone-color="#eb2f96" class="remove-icon" @click="deleteItem"/>
      <template v-if="provider.info.type===ItemTypes.BOX">
        <div class="provider-header">
          <Avatar style="background-color: #f56a00" size="small" class="class-avatar">
            {{ getAvatar(provider) }}
          </Avatar>
          <div>{{ provider.info.description }}</div>
        </div>
        <div class="item-container">
          <div v-for="item in provider.info.properties" :key="item.id">
            <ProviderItem v-if="item.inputOrOutput === 'output'" :item="item" :id="provider.id"/>
            <ReciverItem v-else :item="item" :id="provider.id" @addRelation="addRelation" @removeRelation="removeRelation" :relation="provider.relationIn"/>
          </div>
        </div>
      </template>
      <template v-else-if="provider.info.type===ItemTypes.AGGREGATORS">
        <div class="provider-header">
          <Avatar style="background-color: #cd201f" size="small" class="class-avatar">
            {{ getAvatar(provider) }}
          </Avatar>
          <div>{{ provider.info.description }}</div>
        </div>
        <div class="item-container">
          <div v-for="item in provider.info.properties" :key="item.id">
            <AggregatorsReceive v-if="item.inputOrOutput === 'input'" :item="item" :id="provider.id" @addRelation="addRelation" @removeRelation="removeRelation" :relation="provider.relationIn"/>
            <ProviderItem v-else-if="item.inputOrOutput === 'output'" :item="item" :id="provider.id"/>

          </div>
        </div>
      </template>

    </div>
</template>
<script lang="ts" setup>
import { Avatar } from "ant-design-vue"
import { useDrag,useDrop } from 'vue3-dnd'
import { ref,computed,toRefs } from "vue"
import ProviderItem from "../propertyItem/ProviderItem.vue"
import ReciverItem from "../propertyItem/ReciverItem.vue"
import AggregatorsReceive from "../propertyItem/AggregatorReceiveItem.vue"
import { ItemTypes } from '../../data.ts'
import {
  DeleteTwoTone
} from '@ant-design/icons-vue';
const props = defineProps({
  provider: Object,
  id: String,
  moveCard: Function,
  findCard: Function,
  insertCard: Function
})

const emits =defineEmits(['hoverIndex', 'deleteItem'])

const originalIndex = computed(() => props.findCard(props.id).index)

const [collect, drag, dragPreview] = useDrag(() => ({
	type: ItemTypes.SORTBOX,
	item: ()=>({
    //应该传入所属对象的id
    id: props.id,
    originalIndex: originalIndex.value,
    type:"transformer"
  }),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
  end: (item, monitor) => {
    const { id: droppedId, originalIndex } = item
    const didDrop = monitor.didDrop()
    if (!didDrop) {
      props.moveCard(droppedId, originalIndex)
    }
  },
}))
const hoverIndex = ref('')
const [, drop] = useDrop(() => ({
  accept: [ItemTypes.BOX,ItemTypes.SORTBOX,ItemTypes.CONVERT,ItemTypes.AGGREGATORS],
  hover(item,monitor) {
    const { id: draggedId,type } = item
    if(type === "reciver" || type ==="provider"){
      return
    }
    if(monitor.getItemType()===ItemTypes.SORTBOX){
      if (draggedId !== props.id) {
        const { index: overIndex } = props.findCard(props.id)
        props.moveCard(draggedId, overIndex)
      }
    }else{
      hoverIndex.value = draggedId
      const { index: overIndex } = props.findCard(props.id)
      props.insertCard(item,draggedId,overIndex)
      emits('hoverIndex',overIndex)
    }
  },
}))

function deleteItem(){
  emits('deleteItem',props.id)
}

function getAvatar(item){
const list = item.info.className.split(".")
const str = list[list.length-1]
const result = str.slice(0, 2).replace(/^(.)(.)?/, (_, c1, c2) => 
  c1.toUpperCase() + (c2 ? c2.toLowerCase() : '')
);
return result
}

function addRelation(sourceObjId,sourcePropertyName,sourceLabel,targetPropertyName){
  if(props.provider.relationIn===undefined||props.provider.relationIn===null){
    props.provider.relationIn = {}
  }
  if(props.provider.relationIn[targetPropertyName]===undefined){
    props.provider.relationIn[targetPropertyName] = []
  }
  props.provider.relationIn[targetPropertyName].push({
    sourceObjId,sourcePropertyName,sourceLabel
  })
}

function removeRelation(sourceObjId,sourcePropertyName,targetPropertyName){
  if(props.provider.relationIn!==undefined){
    if(props.provider.relationIn[targetPropertyName]!==undefined){
      const list = props.provider.relationIn[targetPropertyName]
      const newList = list.filter(item=>{
        return !(item.sourceObjId === sourceObjId && item.sourcePropertyName === sourcePropertyName)
      })
      if(newList.length===0){
        delete props.provider.relationIn[targetPropertyName]
      }else{
        props.provider.relationIn[targetPropertyName] = newList
      }
    }
  }
}

const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

</script>
<style scoped lang="less">

.provider-box{
  position: relative; 
  width: 160px;
  height: 240px;
  margin-right: 8px;
  margin-bottom: 8px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  cursor:move;
  transition: background 0.3s;
  .remove-icon{
    position: absolute;
    top: 0;
    right: 0;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }
  &:hover{
    background: #f2f2f2;
  }
  &:hover .remove-icon {
  opacity: 1;
  visibility: visible;
}
  &:active{
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  }

  .provider-header{
     display: flex;
     justify-content: left;
     gap: 4px;
     align-items: center;
     border-bottom: 1px solid #f0f0f0;
     padding-bottom: 8px;
     div{
       font-size: 14px;
     }
      .class-avatar{
      }

   }
   .item-container{
    overflow-y: auto;
    height: 190px;
   }
  }

</style>