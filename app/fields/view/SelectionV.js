Ext.define('MrG.fields.view.SelectionV', {
	extend: 'MrG.base.view.BaseFieldV',
	viewModel: {
		xclass: 'MrG.fields.vm.SelectionVM'
	},
	controller: {
		xclass: 'MrG.fields.ctrl.SelectionC'
	},
	requires: [
		'Ext.grid.rowedit.Plugin'
	],

})