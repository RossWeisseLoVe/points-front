<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- <TypeList class="w-1/4 xl:w-1/7" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" /> -->
    <!-- <BasicTable @register="registerTable" class="w-3/4 xl:w-6/7"> -->
    <BasicTable @register="registerTable" class="">
      <template #toolbar>
        <Authority :value="'Calculate:'+PerEnum.PUBLISH" >
          <a-button type="primary" @click="handleRefresh"> 重载规则</a-button>
        </Authority>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '试用',
                icon: 'ant-design:caret-right-outlined',
                onClick: handleTest.bind(null, record),
                auth: 'Calculate:'+PerEnum.QUERY,
              },
            ]"
          />
        </template>
      </template>
      <template #type="{record}">
        <Tag :color="getColor(record)">{{ getType(record) }}</Tag>
      </template>
      <template #maxPerHead="{record}">
        <Tag color="green">最多{{ record.max }}次</Tag>
      </template>
      <template #inventory="{record}">
        <Tag v-if="record.inventory===0" color="red" >{{ record.inventory }}</Tag>
        <Tag color="green" v-else>{{ record.inventory }}</Tag>
      </template>
      <template #status="{record}">
        <Tag color="#ffb74e" v-if="record.status === 0">未开始</Tag>
        <Tag color="#2097f3" v-if="record.status === 1">已开始</Tag>
        <Tag color="#4b4b4b" v-if="record.status === 2">已结束</Tag>
      </template>
      <template #time="{record}">
        <Tag color="green" v-if="record.timedStatus===1">{{ record.startTime }} 至 {{ record.endTime }}</Tag>
        <Tag color="default" v-else>{{ record.startTime }} 至 {{ record.endTime }}</Tag>
      </template>
    </BasicTable>
    <contextHolder />
   <TestModal @register="registerModal" @success="handleSuccess" /> 
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag,notification } from 'ant-design-vue'
  import {  onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getActivityPage,deleteActivityByIds,updateActivity,setTimedStatus } from "@/api/point/activity"
  import { getAllRules,getPropertiesById } from "@/api/calculate/calculate"
  import { PageWrapper } from '@/components/Page';
  // import TypeList from '@/views/components/leftTree/TypeList.vue';
  import { useModal } from '@/components/Modal';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import TestModal from './TestModal.vue';
  import { columns, searchFormSchema } from './calculate.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PerEnum } from '@/enums/perEnum';
  import { useGo } from '@/hooks/web/usePage';

const go = useGo()
  const { createMessage } = useMessage();
  const [registerModal, { openModal, setModalProps }] = useModal();
  const currentTreeNode = ref<String>("");
  const typeList = ref([])
  const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getAllRules,
    immediate: true,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      autoSubmitOnEnter: true,
    },
    canColDrag: true,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "01b78d610662800b6af6f8b8d04d73ee"
    })
    typeList.value = res.rows
  })

  async function handleTest(record) {
    const res = await getPropertiesById({
      id: record.id
    })
    console.log("fuck you",res)
    setModalProps({title: record.description});
    const list = record.className.split(".")
    openModal(true, {
      data: res,
      typeName: list[list.length -1]
    });
  }


  function handleSelect(key:String) {
    currentTreeNode.value = key;
    let searchInfo = {
      type: key,
      keyword:''};
    reload({ searchInfo });
  }

  function handleSuccess(){

  }

  function handleRefresh(){
    
  }

  function getType(row){
    for (const item of typeList.value) {
      if(item.id === row.type){
        return item.cname
      }      
    }
  }

  function getColor(row){
    for (const item of typeList.value) {
      if(item.id === row.type){
        return item.color
      }      
    }
  }

</script>