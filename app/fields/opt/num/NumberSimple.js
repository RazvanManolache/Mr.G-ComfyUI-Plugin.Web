Ext.define('MrG.fields.opt.num.NumberSimple', {
	extend: 'Ext.field.Spinner',
	cycle: true,
	listeners: {
		initialize: {
			fn: 'onNumberInitialize'
		},
		change: function (field) {
			var vm = null;
			var parent = field;
			while(parent && !vm) {
                vm = parent.getViewModel();
                parent = parent.up();
            }
			if(vm)
				vm.set('isValid', field.isValid());
		}
	},	
	bind: {
		readOnly:'{readOnlyWorkflow}',
		minValue: '{minValue}',
		maxValue: '{maxValue}',
		stepValue: '{stepValue}',
		value: '{value}',
	}
})