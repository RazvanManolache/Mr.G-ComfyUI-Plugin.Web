Ext.define('MrG.fields.view.NumberV', {
	extend: 'MrG.base.view.BaseFieldV',
	requires: [
		'MrG.fields.opt.num.NumberCombo',
		'MrG.fields.opt.num.NumberDefinedSequence',
		'MrG.fields.opt.num.NumberMinMax',
		'MrG.fields.opt.num.NumberMinMaxAdvanced',
		'MrG.fields.opt.num.NumberMinMaxSummary',
		'MrG.fields.opt.num.NumberSequence',
		'MrG.fields.opt.num.NumberSimple',
		'MrG.fields.opt.num.NumberWithDefinedSequenceAdvanced',
		'MrG.fields.opt.num.NumberWithDefinedSequenceSummary',
	],
	viewModel: {
		xclass: 'MrG.fields.vm.NumberVM'
	},
	controller: {
		xclass: 'MrG.fields.ctrl.NumberC'
	},
})