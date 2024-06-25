<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <TypeList class="w-1/4 xl:w-1/7" @select="handleSelect" title="客户分类" mainId="5ffaaf2c64cc95e43da9009c9627e0c0"/>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-6/7">
      <template #toolbar>
        <Authority :value="'Client:'+PerEnum.ADD" >
          <a-button type="primary" @click="handleCreate"> 新增</a-button>
        </Authority>
      </template>
      <template #type="{record}">
        <Tag :color="getColor(record)">{{ getType(record) }}</Tag>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '积分获取',
                icon: 'ant-design:account-book-outlined',
                onClick: handleIncrease.bind(null, record),
                auth: 'Client:'+PerEnum.UPDATE,
              },
              {
                tooltip: '修改',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                auth: 'Client:'+PerEnum.UPDATE,
              },
              {
                tooltip: '删除',
                icon: 'ant-design:delete-outlined',
                auth: 'Client:'+PerEnum.DELETE,
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                  placement: 'left'
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ClientDrawer ref="drawer" @handleSuccess="reloadList"/>
    <GetInActivityModal @register="registerModal" @success="reloadList" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue'
  import {  onMounted, ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getClientPage,deleteByIds } from "@/api/point/client"
  import { PageWrapper } from '@/components/Page';
  import TypeList from '@/views/components/leftTree/TypeList.vue';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import ClientDrawer from './ClientDrawer.vue';
  import { columns, searchFormSchema } from './client.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import { PerEnum } from '@/enums/perEnum';
  import GetInActivityModal from '@/views/point/components/GetInActivityModal/index.vue'
  const { createMessage } = useMessage();
  const currentTreeNode = ref<String>("");
  const typeList = ref([])
  const drawer = ref()
  const [registerModal, { openModal, setModalProps }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getClientPage,
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
      width: 160,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  function reloadList(){
    reload()
  }

  onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "5ffaaf2c64cc95e43da9009c9627e0c0"
    })
    typeList.value = res.rows
  })

  function handleCreate() {
    drawer.value.showDrawer({
      typeList: typeList.value,
      isUpdate: false
    })
  }

  function handleEdit(record) {
    drawer.value.showDrawer({
      typeList: typeList.value,
      record: record,
      isUpdate: true
    })
  }

  function handleIncrease(record){
    setModalProps({
      title: record.name + '：获取积分',
      width: '1200px'
    });
    openModal(true, {
      record,
      tagColor:getColor(record),
      type: getType(record)
    });
  }

  function handleDelete(record: Recordable) {
    deleteByIds([record.id]).then(() => {
      reload();
    });
  }

  function handleSuccess() {
    setTimeout(()=>{
      handleSelect(currentTreeNode.value);
    }, 200);
  }

  function handleSelect(key:String) {
    currentTreeNode.value = key;
    let searchInfo = {
      type: key,
      keyword:''};
    reload({ searchInfo });
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