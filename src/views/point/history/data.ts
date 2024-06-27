import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '订单名称',
    dataIndex: 'oName',
    slots: { customRender: 'oName' },
    width: 100,
    align: 'left',
  },
  {
    title: '订单类型',
    dataIndex: 'oType',
    slots: { customRender: 'oType' },
    width: 100,
    align: 'left',
  },
  {
    title: '物品/活动类型',
    dataIndex: 'adType',
    slots: { customRender: 'adType' },
    width: 100,
    align: 'left',
  },
  {
    title: '订单状态',
    dataIndex: 'cancelFlag',
    slots: { customRender: 'cancelFlag' },
    width: 60,
    align: 'left',
  },
  {
    title: '客户',
    dataIndex: 'name',
    width: 80,
    align: 'left',
  },
  {
    title: '积分',
    dataIndex: 'point',
    width: 80,
    align: 'left',
  },
  {
    title: '操作人',
    dataIndex: 'creatorName',
    width: 80,
    align: 'left',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 100,
    align: 'left',
  },
  {
    title: '说明',
    dataIndex: 'instructions',
    width: 180,
    align: 'left',
  }
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
    },
    labelWidth: 60,
    colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  },
];

export const goodsTypeList =[
  {
    type: 1,
    color: 'blue',
    name: '积分获取'
  },
  {
    type: 2,
    color: 'green',
    name: '积分使用'
  },
  {
    type: 3,
    color: 'red',
    name: '积分过期清空'
  },
  {
    type: 4,
    color: 'gold',
    name: '积分过期清空'
  }
]

