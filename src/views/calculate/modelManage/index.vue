<template>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
      <!-- <TypeList class="w-1/4 xl:w-1/7" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" /> -->
      <!-- <BasicTable @register="registerTable" class="w-3/4 xl:w-6/7"> -->
      <BasicTable @register="registerTable" class="">
        <template #toolbar>
          <Authority :value="'Calculate:'+PerEnum.PUBLISH" >
            <a-button type="primary" @click="addNewModel"> 新建模型</a-button>
          </Authority>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  tooltip: '编辑模型',
                  icon: 'clarity:note-edit-line',
                  onClick: handleEdit.bind(null, record),
                  auth: 'Calculate:'+PerEnum.QUERY,
                },
                {
                  tooltip: '计算空间管理',
                  icon: 'ant-design:read-outlined',
                  onClick: handleGoToSpace.bind(null, record),
                  auth: 'Calculate:'+PerEnum.ADD,
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </PageWrapper>
  </template>
  <script lang="ts" setup>
    import {  onMounted, ref } from 'vue';
    import { BasicTable, useTable, TableAction } from '@/components/Table';
    import { getModelsPage,newInstance } from "@/api/calculate/calculate"
    import { PageWrapper } from '@/components/Page';
    // import TypeList from '@/views/components/leftTree/TypeList.vue';
    import { useModal } from '@/components/Modal';
    import { dictionaryItemPageList } from '@/api/base/dictionary';
    import { modelColumns, searchFormSchema } from '../calculate.data';
    import { useMessage } from '@/hooks/web/useMessage';
    import { PerEnum } from '@/enums/perEnum';
    import { useGo } from '@/hooks/web/usePage';
    import InstanceInfoModal from '../instance/InstanceInfoModal.vue';
  
    const go = useGo()
    const { createMessage } = useMessage();
    const currentTreeNode = ref<String>("");
    const typeList = ref([])
    const [registerTable, { reload }] = useTable({
      title: '列表',
      api: getModelsPage,
      immediate: true,
      columns:modelColumns,
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

    function handleEdit(record){
        go('/calculatemodel/index?mid='+record.id)
    }
  
    function addNewModel(){
      go('/calculatemodel/index')
    }


  
    function handleSuccess(){

    }

    function handleGoToSpace(record){
      go('/calculatespace?mid='+record.id)
    }

  </script>