<template>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
      <!-- <TypeList class="w-1/4 xl:w-1/7" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" /> -->
      <!-- <BasicTable @register="registerTable" class="w-3/4 xl:w-6/7"> -->
      <BasicTable @register="registerTable" class="">
        <template #toolbar>
          <Authority :value="'Calculate:'+PerEnum.PUBLISH" >
            <Button type="primary" @click="addNewSpace"> 新建计算空间</Button>
          </Authority>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  tooltip: '查看计算域',
                  icon: 'ant-design:rocket-outlined',
                  onClick: getRegionInstanceById.bind(null,record),
                  auth: 'Calculate:'+PerEnum.ADD,
                }
              ]"
            />
          </template>
        </template>
      </BasicTable>
      <InstanceDrawer @register="registerDrawer" />
    </PageWrapper>
  </template>
<script lang="ts" setup>
  import {  onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { PageWrapper } from '@/components/Page';
  // import TypeList from '@/views/components/leftTree/TypeList.vue';
  import { getInstancePageByModelId,getModelById } from "@/api/calculate/calculate"
  import { useModal } from '@/components/Modal';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import { instanceColumns, searchFormSchema } from '../calculate.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PerEnum } from '@/enums/perEnum';
  import { useGo } from '@/hooks/web/usePage';
  import { useRoute } from 'vue-router' 
  import InstanceDrawer from './InstanceDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import { Button } from "ant-design-vue"

  const route = useRoute()
  const modelData = ref({})
  const [registerDrawer, { openDrawer,setDrawerProps }] = useDrawer();
  const [registerModal, { openModal, setModalProps }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getInstancePageByModelId,
    immediate: true,
    columns:instanceColumns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      autoSubmitOnEnter: true,
    },
    beforeFetch:(params)=>{
      return {
        ...params,
        modelId: route.query.mid
      }
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
    const res = await getModelById(route.query.mid)
    for (const item of res.template) {
      item.className = item.info.className
      item.description = item.info.description
      item.properties = item.info.properties
      delete item.info
    }
    modelData.value = res
  })


  function addNewSpace(){
    // go('/calculatemodel/index')
  }  


  async function getRegionInstanceById(record){
    setDrawerProps({
        placement: "bottom",
        height:"100%",
        onClose:closeDrawer
    })
    openDrawer(true,{
        id:record.id,
        model: modelData.value
    }as any)
  }

  function closeDrawer(){

  }
</script>