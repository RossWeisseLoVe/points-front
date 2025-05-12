<template>
    <BasicDrawer
      v-bind="$attrs"
      @register="registerDrawer"
      title="查看计算空间实例"
      width="100%"
      @ok="handleSubmit"
    >
      <BasicTable @register="registerTable" class="">
        <template #status="{record}">
          <Tag color="#000000" :style="{marginRight:'2px'}" v-if="getIsAnyTime(record)">即时</Tag>
          <Tag color="#2db7f5" v-if="record.type===ItemTypes.BOX">计算域</Tag>
          <Tag color="#f56a00" v-else-if="record.type===ItemTypes.AGGREGATORS">聚合器</Tag>
          <Tag color="#ffc53d" v-else-if="record.type===ItemTypes.OTHERMODEL">子计算空间</Tag>
        </template>
        <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '使用计算域',
                icon: 'ant-design:caret-right-outlined',
                onClick: handleUseRegion.bind(null, record),
                ifShow: record.type!=='othermodel'
                // auth: 'Calculate:'+PerEnum.QUERY,
              },
              {
                tooltip: '添加幽灵实例',
                icon: 'ant-design:plus-circle-outlined',
                onClick: handleAddGhost.bind(null, record),
                ifShow: getIsAnyTime(record)
                // auth: 'Calculate:'+PerEnum.QUERY,
              },
            ]"
          />
        </template>
      </template>
      </BasicTable>
      <RegionModal @register="registerModal"/>
      <GhostModal @register="registerGhostModal" @handleSuccess="getData(id)"/>
    </BasicDrawer>
  </template>
  <script lang="ts" setup>
    import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
    import { getRegionInstanceModelListById } from "@/api/calculate/calculate"
    import { BasicTable, useTable, TableAction } from '@/components/Table';
    import { instanceRegionColumns } from '../calculate.data';
    import { ref } from "vue"
    import RegionModal from "./RegionModal.vue"
    import GhostModal from "./GhostModal.vue"
    import { useModal } from '@/components/Modal';
    import { Tag } from "ant-design-vue"
    import { ItemTypes } from "../model/data"

    defineOptions({ name: 'MenuDrawer' });
  
    const dataList = ref([])
    const emit = defineEmits(['success', 'register','updateList']);
    const [registerModal, { openModal, setModalProps }] = useModal();
    const [registerGhostModal, { openModal:openGhostModal, setModalProps:setGhostModalProps }] = useModal();
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
    
    const id = ref(undefined)
    async function getData(id){
      const res = await getRegionInstanceModelListById(id)
      console.log("res:",res)
      dataList.value = res
      setTableData(res)
      emit('updateList')
    }

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      setDrawerProps({ confirmLoading: false });
      // 获取到实例数据，要和模板数据融合在一起
      id.value = data.id
      await getData(data.id)
      redoHeight()
    });

    function handleUseRegion(record){
        console.log(record)
        openModal(true,{
            instance:record
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

    function getIsAnyTime(record){
      for (const item of record.properties) {
        if(item.isAnyTime===1){
          return true
        }
      }
      return false
    }

    function handleAddGhost(record){
      //record的relationIn已经发生改变，所以发生错误，所以需要把region查出来
      const relationIn = record.ghostRelationIn
      const keyList = Object.keys(relationIn)
      const regionIds:Array<any> = []
      for(const item of keyList){
        const s = item.split("_")
        let fid
        if(s[0]==="list"){
          if(s[1]){
            fid = s[1]
          }else{
            fid = record.regionId
          }
          regionIds.push({
              id:fid,
              fid:null
            })
          for(const relation of relationIn[item]){
            if(relation.sourceFatherRegionId){
              regionIds.push({
                fid,
                id:relation.sourceFatherRegionId
              })
            }else{
              regionIds.push({
                fid,
                id:relation.sourceObjId,
                regionType:record.type
              })
            }

          }
        }
      }
      setGhostModalProps({
        title:"新增幽灵实例",
        width:800,
        minHeight:400
      })
      openGhostModal(true,{
        regionIds,
        instanceId:record.instanceId,
        id:record.id,
        regionType:record.type,
        regionId: record.regionId
      })
    }

  </script>

  <style scoped>

  </style>
  