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
    const [registerTable, { reload,setTableData }] = useTable({
        title: '列表',
        immediate: true,
        dataSource:dataList.value,
        columns:instanceRegionColumns,
        pagination: false,
        labelWidth: 120,
        showAdvancedButton: false,
        showResetButton: false,
        autoSubmitOnEnter: true,
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
  
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      setDrawerProps({ confirmLoading: false });
      const res = await getRegionInstanceModelListById(data.id)
      console.log("fuckmodel",data.model)
      setTableData(data.model.template)
    });
  
  
    function handleUseRegion(record){
        console.log(record)
        const list = record.className.split(".")
        openModal(true,{
            data: record.properties,
            typeName: list[list.length -1]
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
  