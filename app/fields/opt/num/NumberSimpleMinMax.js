Ext.define('MrG.fields.opt.num.NumberSimpleMinMax', {
	extend: 'Ext.field.Spinner',
	bind: {
		minValue: '{minValueInterval}',
		maxValue: '{maxValueInterval}',
		stepValue: '{stepValueInterval}',
		value: '{value}'
	}
})