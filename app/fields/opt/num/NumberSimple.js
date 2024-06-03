Ext.define('MrG.fields.opt.num.NumberSimple', {
	extend: 'Ext.field.Spinner',
	cycle: true,
	listeners: {
		initialize: {
			fn: 'onNumberInitialize'
		},
		
	},	
	bind: {
		readOnly:'{readOnlyWorkflow}',
		minValue: '{minValue}',
		maxValue: '{maxValue}',
		stepValue: '{stepValue}',
		value: '{value}',
	}
})