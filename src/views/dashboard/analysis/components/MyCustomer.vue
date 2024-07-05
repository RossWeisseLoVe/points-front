<template>
  <Card title="我的客户" class="!pt-0">
    <div :style="{height:'506px'}">
      <BasicTable @register="registerTable" >
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
                tooltip: '兑换奖品',
                icon: 'ant-design:transaction-outlined',
                onClick: handleExchange.bind(null, record),
                auth: 'Client:'+PerEnum.UPDATE,
              },
              {
                tooltip: '积分历史',
                icon: 'ant-design:read-outlined',
                onClick: handlePushToHistory.bind(null, record),
                auth: 'Client:'+PerEnum.QUERY,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    </div>
  </Card>
  <GetInActivityModal @register="registerModal" @success="reloadList" @pushTo="pushToHistory"/>
    <ExchageModal @register="registerExModal" @success="reloadList" @pushTo="pushToHistory"/>
</template>
<script lang="ts" setup>
  import { ref,onMounted } from 'vue';
  import { Card,Tag } from 'ant-design-vue';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import { getClientPage } from "@/api/point/client"
  import { columns,searchFormSchema } from '../data'
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { PerEnum } from '@/enums/perEnum';
  import GetInActivityModal from '@/views/point/components/GetInActivityModal/index.vue'
  import ExchageModal from '@/views/point/components/ExchangeModal/index.vue'
import { useUserStore } from '@/store/modules/user';

  const userInfo = useUserStore().getUserInfo
  const go = useGo()
  const [registerModal, { openModal, setModalProps }] = useModal();
  const [registerExModal, { openModal:openExModal, setModalProps: setExModalProps }] = useModal();
  const typeList = ref([])
  const [registerTable, { reload }] = useTable({
    api: getClientPage,
    immediate: true,
    columns,
    useSearchForm:false,
    canColDrag: true,
    maxHeight: 420,
    bordered: true,
    size: 'small',
    searchInfo:{
      representative: userInfo.id
    },
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });
  onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "5ffaaf2c64cc95e43da9009c9627e0c0"
    })
    typeList.value = res.rows
  })

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

  function handleExchange(record){
    setExModalProps({
      title: record.name + '：兑换奖品',
      width: '1200px'
    });
    openExModal(true, {
      record,
      tagColor:getColor(record),
      type: getType(record)
    });
  }

  function pushToHistory(record){
    go('/point/history?cid='+record.id+"&title="+record.name)
  }
  function reloadList(){
    reload()
  }

  function handlePushToHistory(record){
    go('/point/history?cid='+record.id+"&title="+record.name)
  }
</script>
