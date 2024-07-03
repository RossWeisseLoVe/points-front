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
                tooltip: '定时发布',
                icon: 'ant-design:field-time-outlined',
                onClick: handleTimed.bind(null, record,1),
                auth: 'Activity:'+PerEnum.UPDATE,
                ifShow: record.timedStatus === 0
              },
              {
                tooltip: '取消定时发布',
                icon: 'ant-design:field-time-outlined',
                onClick: handleTimed.bind(null, record,0),
                color: 'error',
                auth: 'Activity:'+PerEnum.UPDATE,
                ifShow: record.timedStatus === 1
              },
              {
                tooltip: '开始活动',
                icon: 'ant-design:caret-right-outlined',
                onClick: handleChangeStatus.bind(null, record,1),
                auth: 'Activity:'+PerEnum.PUBLISH,
                ifShow: record.status !== 1 
              },
              {
                tooltip: '停止活动',
                icon: 'ant-design:pause-outlined',
                color: 'error',
                onClick: handleChangeStatus.bind(null, record,2),
                auth: 'Activity:'+PerEnum.PUBLISH,
                ifShow: record.status === 1 
              },
              {
                tooltip: '兑换历史',
                icon: 'ant-design:read-outlined',
                onClick: pushToHistory.bind(null, record,1),
                auth: 'Activity:'+PerEnum.QUERY,
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
    <ActivityModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Tag,notification } from 'ant-design-vue'
  import {  onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getActivityPage,deleteActivityByIds,updateActivity,setTimedStatus } from "@/api/point/activity"
  import { PageWrapper } from '@/components/Page';
  import TypeList from '@/views/components/leftTree/TypeList.vue';
  import { useModal } from '@/components/Modal';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import ActivityModal from './ActivityModal.vue';
  import { columns, searchFormSchema } from './activity.data';
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

  async function handleTimed(record,status){
    await setTimedStatus({
      id:record.id,
      status
    })
    reload()
    if(status===1){
      openNotification('topRight',record.startTime,record.name)
    }
  }
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement,time,name) => {
        api.info({
          message: `活动开始提醒： ${name}`,
          description:
            '您已设定活动开始时间为：'+time+'届时该活动将自动开始',
          placement,
        });
      };
  async function handleChangeStatus(row,status){
    await updateActivity({
      id:row.id,
      status
    })
    reload()
  }

  function pushToHistory(record){
    go('/point/history?aid='+record.id+"&title="+record.name)
  }
</script>