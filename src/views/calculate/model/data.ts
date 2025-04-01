export const ItemTypes = {
  BOX: 'box',
  SORTBOX:'sortbox',
  PROPERTY: 'property',
  CONVERT: 'convert',
  AGGREGATORS: 'Aggregators'
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
    id: "1231231",
    description: "求方差",
    className: "com.dragon.flow.model.test.Variance",
    properties:[
      {
        id:123,
        formItemName: "输入值",
        inputOrOutput: "input",
        propertyName: "in",
        propertyType: "Double",
      },
      {
        id:124,
        formItemName: "输出值",
        inputOrOutput: "output",
        propertyName: "out",
        propertyType: "Double",
      }
    ]
  },
  {
    id: "1231232",
    description: "求平方",
    className: "com.dragon.flow.model.test.Square",
    properties:[
      {
        id:123,
        formItemName: "输入值",
        inputOrOutput: "input",
        propertyName: "in",
        propertyType: "Double",
      },
      {
        id:124,
        formItemName: "输出值",
        inputOrOutput: "output",
        propertyName: "out",
        propertyType: "Double",
      }
    ]
  }
]