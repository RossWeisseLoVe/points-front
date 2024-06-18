import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
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
    width: 150,
    align: 'left',
  },
  {
    title: '类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
    width: 200,
    align: 'left',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    align: 'left',
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    width: 100,
    align: 'left',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'left',
  },
  {
    title: '修改人',
    dataIndex: 'updatorName',
    width: 100,
    align: 'left',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 150,
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

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    show: true,
    rules: [{
        required: true,
        whitespace: true,
        message: '名称不能为空！',
      },
      {
        max: 20,
        message: '字符长度不能大于20！',
      }],
    colProps: { span: 22 },
  },
  {
    field: 'point',
    label: '积分',
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 22 },
    rules:[
      {
        pattern: new RegExp('^[1-9]\\d{0,6}$'),
        type: 'string',
        message: '请输入正整数，不超过9999999 ！',
      },
    ]
  },
  {
    field: 'type',
    label: '类型',
    required: false,
    component: 'Input',
    show: false,
    dynamicDisabled: true,
    colProps: { span: 22 },
  },
  {
    field: 'typeName',
    label: '类型',
    required: false,
    component: 'Input',
    show: true,
    dynamicDisabled: true,
    colProps: { span: 22 },
  },
  {
    field: 'remark',
    label: '备注',
    required: false,
    component: 'InputTextArea',
    show: true,
    colProps: { span: 22 },
  },
];
