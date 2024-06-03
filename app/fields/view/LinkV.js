Ext.define('MrG.fields.view.LinkV', {
	extend: 'MrG.base.view.BaseFieldV',
	requires: [
		'MrG.fields.vm.LinkVM',
		'MrG.fields.ctrl.LinkC',
		
	],
	viewModel: {
		xclass: 'MrG.fields.vm.LinkVM'
	},
	controller: {
		xclass: 'MrG.fields.ctrl.LinkC'
	},

})