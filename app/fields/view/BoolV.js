Ext.define('MrG.fields.view.BoolV', {
	extend: 'MrG.base.view.BaseFieldV',
	viewModel: {
		xclass: 'MrG.fields.vm.BoolVM'
	},
	controller: {
		xclass: 'MrG.fields.ctrl.BoolC'
	},
	
})