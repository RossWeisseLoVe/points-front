import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Rule } from '@/components/Form/src/types/form';
export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 180,
    align: 'left',
  },
  {
    title: '积分余额',
    dataIndex: 'point',
    width: 100,
    align: 'left',
  },
  {
    title: '电话',
    dataIndex: 'mobile',
    width: 110,
    align: 'left',
  },
  {
    title: '客户类型',
    dataIndex: 'type',
    width: 100,
    align: 'left',
    slots: { customRender: 'type' },
  },
  {
    title: '客户联系人',
    dataIndex: 'representativeName',
    width: 100,
    align: 'left',
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 200,
    align: 'left',
  },
  {
    title: '所在公司',
    dataIndex: 'company',
    width: 100,
    align: 'left',
  },
  {
    title: '行业',
    dataIndex: 'industry',
    width: 100,
    align: 'left',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 120,
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
  },
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

export const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入名称' }],
  mobile: [{ required: true, message: '请输入手机号' }, {
    pattern: new RegExp(/^1[3|4|5|7|8][0-9]{9}$/),
    type: 'string',
    message: '请输入正确的手机号 ！',
  },],
  representative: [{ required: true, message: '请选择客户联系人' }],
  type: [{ required: true, message: '请选择类型' }],
  email: [{ required: true, message: '请输入邮箱' }],
  address: [{ required: true, message: '请输入地址' }],
  company: [{ required: true, message: '请输入公司' }],
  industry: [{ required: true, message: '请输入行业' }],
};

export const accountColumns: BasicColumn[] = [
  // {
  //   title: '头像',
  //   dataIndex: 'image',
  //   width: 80,
  //   align: 'center',
  // },
  // {
  //   title: '用户名',
  //   dataIndex: 'username',
  //   width: 100,
  //   align: 'left',
  // },
  {
    title: '姓名',
    dataIndex: 'realName',
    width: 100,
    align: 'left',
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    width: 120,
    align: 'left',
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    width: 120,
    align: 'left',
  },
  // {
  //   title: '邮箱',
  //   dataIndex: 'email',
  //   width: 120,
  //   align: 'left',
  // },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 50,
    customRender: ({ record }) => {
      const status = record.sex;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '男' : '女';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '所属组',
    dataIndex: 'groups',
    align: 'left',
    customRender: ({ record }) => {
      const groups = record.groups;
      const color = 'green';

      const tags = groups&&groups.map(item=>{
        return h(Tag, { color: color, style: {marginRight:'5px'} }, () => item.name);
      })||[];

      return tags;
    },
  }
];
