export const formSchema = [
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