<template>
    <BasicDrawer
      v-bind="$attrs"
      @register="registerDrawer"
      title="查看计算空间实例"
      width="100%"
      @ok="handleSubmit"
    >
      <BasicTable @register="registerTable" class="">
        <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '使用计算域',
                icon: 'ant-design:caret-right-outlined',
                onClick: handleUseRegion.bind(null, record),
                // auth: 'Calculate:'+PerEnum.QUERY,
              },
            ]"
          />
        </template>
      </template>
      </BasicTable>
      <RegionModal @register="registerModal"/>
    </BasicDrawer>
  </template>
  <script lang="ts" setup>
    import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
    import { getRegionInstanceModelListById } from "@/api/calculate/calculate"
    import { BasicTable, useTable, TableAction } from '@/components/Table';
    import { instanceRegionColumns } from '../calculate.data';
    import { ref } from "vue"
    import RegionModal from "./RegionModal.vue"
    import { useModal } from '@/components/Modal';

    defineOptions({ name: 'MenuDrawer' });
  
    const dataList = ref([])
    const emit = defineEmits(['success', 'register']);
    const [registerModal, { openModal, setModalProps }] = useModal();
    const [registerTable, { reload,setTableData,redoHeight }] = useTable({
        title: ()=>{
          return '计算域 共'+dataList.value.length+"个"
        },
        immediate: true,
        dataSource:dataList.value,
        columns:instanceRegionColumns,
        labelWidth: 120,
        scroll:{
          y:document.documentElement.clientHeight - 200
        },
        showAdvancedButton: false,
        showResetButton: false,
        autoSubmitOnEnter: true,
        pagination:false,
        canColDrag: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
        },
    });  
  
    const instanceId = ref(undefined)
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      setDrawerProps({ confirmLoading: false });
      // 获取到实例数据，要和模板数据融合在一起
      instanceId.value = data.id
      console.log("fuckmodel",data.model)
      dataList.value = data.model.template
      setTableData(data.model.template)
      redoHeight()
    });

    function handleUseRegion(record){
        console.log(record)
        openModal(true,{
            data: record.properties,
            typeName: record.className,
            regionId: record.id,
            modelId: record.modelId,
            instanceId: instanceId.value
        })
    }

    async function handleSubmit() {
      try {
        setDrawerProps({ confirmLoading: true });
        // TODO custom api
        closeDrawer();
        emit('success');
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }
  </script>

  <style scoped>

  </style>
  