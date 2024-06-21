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
    width: 200,
    align: 'left',
  },
  {
    title: '积分奖励',
    dataIndex: 'point',
    width: 120,
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
    title: '备注',
    dataIndex: 'remark',
    align: 'left',
  }
];