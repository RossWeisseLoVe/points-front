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
  {
    title: '下载数',
    icon: 'download-count|svg',
    value: 8000,
    total: 120000,
    color: 'orange',
    action: '周',
  },
  {
    title: '成交数',
    icon: 'transaction|svg',
    value: 5000,
    total: 50000,
    color: 'purple',
    action: '年',
  },
];
