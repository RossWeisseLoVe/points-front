<template>
  <BasicModal v-bind="$attrs" @register="registerModal"  @ok="handleSubmit" >
    <div class="target-container" v-for="data in dataList" :key="data.id">
      <List item-layout="horizontal" :data-source="data.children">
        <template #header>
          <Avatar :style="{backgroundColor: getAvatarColor(data)}"  size="small">
            {{ getAvatar(data) }}
          </Avatar>
          <!-- <Tag color="#f56a00">聚合器</Tag> -->
          <span>{{ data.info.className }}</span>
          <div>{{ data.info.description }}</div>
        </template>
        <template #renderItem="{ item }">
          <ListItem>
            <template #actions>
              <InputNumber id="inputNumber" style="width: 10px!important;" v-model:value="item.count"  :precision="0" :min="0" :max="10" class="custom-input"/>
            </template>
            <ListItemMeta
              :description="item.info.description"
            >
              <template #title>
                {{ item.info.className }}
              </template>
              <template #avatar>
                <Avatar :style="{backgroundColor: getAvatarColor(item)}"  size="small">
                  {{ getAvatar(item) }}
                </Avatar>
              </template>
            </ListItemMeta>
          </ListItem>
        </template>
      </List>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { List,ListItemMeta,ListItem,Avatar,message,Tag,InputNumber } from "ant-design-vue"
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getRegionsByIds,setGhostInstance } from "@/api/calculate/calculate"
  import { ItemTypes } from '../model/data';

  const dataList = ref([])
  const instanceId = ref(undefined)
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    const regionIds = data.regionIds
    instanceId.value = data.instanceId
    const ids = regionIds.map(item=>item.id)
    const res = await getRegionsByIds(ids)
    const tree = buildTreeWithHash(res,regionIds)
    console.log("regions:",tree)
    dataList.value = tree
  });

  function buildTreeWithHash(items, links) {
    // 创建节点映射表
    const nodeMap = {};
    items.forEach(item => {
      nodeMap[item.id] = { ...item, children: [] };
    });
    
    // 构建树
    const rootNodes = [];
    links.forEach(link => {
      const { id, fid } = link;
      if (fid === null || fid === undefined) {
        rootNodes.push(nodeMap[id]);
      } else if (nodeMap[fid]) {
        nodeMap[fid].children.push(nodeMap[id]);
      }
    });
    
    return rootNodes;
  }

  const emits = defineEmits(['success'])

  function getAvatar(item){
    const list = item.info.className.split(".")
    const str = list[list.length-1]
    const result = str.slice(0, 2).replace(/^(.)(.)?/, (_, c1, c2) => 
      c1.toUpperCase() + (c2 ? c2.toLowerCase() : '')
    );
    return result
  }
  
  function getAvatarColor(region){
    if(region.info.type===ItemTypes.BOX){
      return "#2db7f5"
    }else if(region.info.type===ItemTypes.AGGREGATORS){
      return "#f56a00"
    }else if(region.info.type===ItemTypes.OTHERMODEL){
      return "#ffc53d"
    }
  }

  async function handleSubmit() {
    const param :Array<any> = []
    for (const item of dataList.value) {
      const data = {} as any
      data.targetRealRegionId = item.id
      data.instanceId = instanceId.value
      data.sourceRegionIds = []
      for (const source of item.children) {
        data.sourceRegionIds.push({
          regionId:source.id,
          count: source.count
        })
      }
      param.push(data)
    }
    console.log("fuck",param)
    await setGhostInstance(param)
    closeModal()
  }


</script>

<style lang="scss" scoped>
.target-container{
  width: 90%;
  margin: 0 auto;
}


</style>