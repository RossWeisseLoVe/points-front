export const formSchema = [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      show: false,
    },
    {
      field: 'modelId',
      label: 'ModelId',
      component: 'Input',
      show: false,
    },
    {
      field: 'name',
      label: '名称',
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

  export const instanceColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
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
      title: '说明',
      dataIndex: 'description',
      width: 100,
      align: 'left',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slots: { customRender: 'status' },
      width: 100,
      align: 'left',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      align: 'left',
    }
  ]

  export const searchFormSchema = [
    {
      field: 'name',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
      },
      labelWidth: 60,
      colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
    },
  ];