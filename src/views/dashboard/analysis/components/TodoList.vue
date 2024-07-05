<template>
  <Card>
    <template #title>
      <div class="title-container">
        <span>我的待办</span>
        <Badge :count="data.length"  color="red" class="ml-2"/>
      </div>
    </template>
    <div ref="chartRef" :style="{height:'297px',overflowY: 'scroll'}" >
      <List item-layout="horizontal" :data-source="data" size="small">
        <template #renderItem="{ item }">
          <ListItem>
            <ListItemMeta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template #avatar>
                <Avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </ListItemMeta>
          </ListItem>
        </template>
      </List>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card,List,ListItem,ListItemMeta,Avatar,Badge } from 'ant-design-vue';

  const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
];
</script>

<style lang="less" scoped>
.title-container{
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>