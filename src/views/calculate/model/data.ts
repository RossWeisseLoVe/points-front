export const ItemTypes = {
  BOX: 'box',
  SORTBOX:'sortbox',
  PROPERTY: 'property',
  CONVERT: 'convert',
  AGGREGATORS: 'Aggregators',
  OTHERMODEL: 'othermodel'
}


export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '全称',
    required: true,
    component: 'Input',
    rules: [
      {
        required: true,
        whitespace: true,
        message: '全称不能为空！',
      },
      {
        max: 64,
        message: '字符长度不能大于64！',
      },
    ],
    colProps: { span: 21 },
  },
  {
    field: 'description',
    label: '说明',
    required: true,
    component: 'InputTextArea',
    rules: [
      {
        required: true,
        whitespace: true,
        message: '简称不能为空！',
      },
      {
        max: 500,
        message: '字符长度不能大于500！',
      },
    ],
    colProps: { span: 21 },
  },
]


export const aggregatorsList = [
  {
    id: "aggregators0001",
    description: "求方差",
    className: "com.dragon.flow.model.aggregators.Variance",
    properties:[
      {
        id:123,
        formItemName: "输入列表",
        inputOrOutput: "input",
        propertyName: "list",
        propertyType: "Double",
      },
      {
        id:124,
        formItemName: "方差值",
        inputOrOutput: "output",
        propertyName: "result",
        propertyType: "Double",
      }
    ]
  },
  {
    id: "aggregators0002",
    description: "平均值",
    className: "com.dragon.flow.model.aggregators.Average",
    properties:[
      {
        id:125,
        formItemName: "输入列表",
        inputOrOutput: "input",
        propertyName: "list",
        propertyType: "Double",
      },
      {
        id:126,
        formItemName: "平均值",
        inputOrOutput: "output",
        propertyName: "result",
        propertyType: "Double",
      }
    ]
  }
]