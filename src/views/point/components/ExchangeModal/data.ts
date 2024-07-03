import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';

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

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
    align: 'left',
  },
  {
    title: '所需积分',
    dataIndex: 'point',
    width: 120,
    align: 'left',
  },
  {
    title: '库存',
    dataIndex: 'inventory',
    slots: { customRender: 'inventory' },
    width: 90,
    align: 'left',
  },
  {
    title: '类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
    width: 100,
    align: 'left',
  },
  {
    title: '单次可兑换次数',
    dataIndex: 'range',
    slots: { customRender: 'range' },
    width: 150,
    align: 'left',
  },
  {
    title: '每人可兑换次数',
    dataIndex: 'max',
    slots: { customRender: 'maxPerHead' },
    width: 120,
    align: 'left',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'left',
  }
];

export const rules = {
  instructions: [
    { required: true, message: '请填写积分获取说明', trigger: 'change' },
    { min: 5, max: 400, message: '字数介于5 - 400之间', trigger: 'blur' },
  ],
  num:[
    { required: true, message: '请填写兑换数量', trigger: 'blur' },
  ]
};