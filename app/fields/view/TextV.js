Ext.define('MrG.fields.view.TextV', {
	extend: 'MrG.base.view.BaseFieldV',
	viewModel: {
		xclass: 'MrG.fields.vm.TextVM'
	},
	controller: {
		xclass: 'MrG.fields.ctrl.TextC'
	},
	requires: [
		'Ext.grid.rowedit.Plugin'
	],
	
})