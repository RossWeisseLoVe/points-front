<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <TypeList class="w-1/4 xl:w-1/7" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-6/7">
      <template #toolbar>
        <Authority :value="'Activity:'+PerEnum.ADD" >
          <a-button type="primary" @click="handleCreate"> 新增</a-button>
        </Authority>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '修改',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                auth: 'Activity:'+PerEnum.UPDATE,
              },
              {
                tooltip: '删除',
                icon: 'ant-design:delete-outlined',
                auth: 'Activity:'+PerEnum.DELETE,
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
      <template #type="{record}">
        <Tag :color="getColor(record)">{{ getType(record) }}</Tag>
      </template>
      <template #maxPerHead="{record}">
        <Tag color="green">最多{{ record.max }}次</Tag>
      </template>
    </BasicTable>
    <ActivityModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue'
  import {  onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getActivityPage,deleteActivityByIds } from "@/api/point/activity"
  import { PageWrapper } from '@/components/Page';
  import TypeList from '@/views/components/leftTree/TypeList.vue';
  import { useModal } from '@/components/Modal';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import ActivityModal from './ActivityModal.vue';
  import { columns, searchFormSchema } from './activity.data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PerEnum } from '@/enums/perEnum';
  const { createMessage } = useMessage();
  const [registerModal, { openModal, setModalProps }] = useModal();
  const currentTreeNode = ref<String>("");
  const typeList = ref([])
  const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getActivityPage,
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

  onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "01b78d610662800b6af6f8b8d04d73ee"
    })
    typeList.value = res.rows
  })

  function handleCreate() {
    if(!currentTreeNode.value||currentTreeNode.value===""){
      createMessage.warning("请选择分类！", 2)
      return;
    }
    setModalProps({title: '新增活动'});
    openModal(true, {
      record:{type: currentTreeNode.value},
      isUpdate: false,
      typeList:typeList.value
    });
  }

  function handleEdit(record: Recordable) {
    setModalProps({title: '修改活动'});
    openModal(true, {
      record,
      isUpdate: true,
      typeList:typeList.value
    });
  }

  function handleDelete(record: Recordable) {
    deleteActivityByIds([record.id]).then(() => {
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
./activity.data