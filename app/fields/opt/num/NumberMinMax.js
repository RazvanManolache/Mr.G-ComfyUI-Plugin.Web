Ext.define('MrG.fields.opt.num.NumberMinMax', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [{
		xclass: 'Ext.field.Spinner',
		label: 'Min',

		bind: {
			readOnly: '{readOnlyWorkflow}',
			maxValue: '{maxValueInterval}',
			value: '{minValueInterval}',
			minValue: '{minValue}',
		},
		flex: 1
	},
	{
		xclass: 'Ext.field.Spinner',
		label: 'Max',

		bind: {
			readOnly: '{readOnlyWorkflow}',
			minValue: '{minValueInterval}',
			maxValue: '{maxValue}',
			value: '{maxValueInterval}'
		},
		flex: 1
	},
	{
		xclass: 'Ext.field.Spinner',
		label: 'Step',
		bind: {
			readOnly: '{readOnlyWorkflow}',
			maxValue: '{maxValueInterval - minValueInterval}',
			minValue: 0,
			value: '{stepValueInterval}'
		},
		flex: 1
	}]
})