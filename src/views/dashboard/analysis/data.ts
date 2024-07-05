import { BasicColumn } from '@/components/Table';

export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string;
  action: string;
  totalLabel?: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: '本月积分发放量',
    icon: 'visit-count|svg',
    value: 0,
    total: 0,
    color: 'green',
    action: '月',
    totalLabel: "历史积分发放量"
  },
  {
    title: '本月积分兑换量',
    icon: 'total-sales|svg',
    value: 0,
    total: 0,
    color: 'blue',
    action: '月',
    totalLabel: "历史积分兑换量"
  },
];

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
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
    title: '地址',
    dataIndex: 'address',
    width: 100,
    align: 'left',
  },
  // {
  //   title: '所在公司',
  //   dataIndex: 'company',
  //   width: 100,
  //   align: 'left',
  // },
  // {
  //   title: '行业',
  //   dataIndex: 'industry',
  //   width: 70,
  //   align: 'left',
  // },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 120,
    align: 'left',
  },
];
