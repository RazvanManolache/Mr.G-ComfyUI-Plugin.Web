Ext.define('MrG.fields.opt.SequenceButton', {	
	extend: 'Ext.SegmentedButton',	
	reference: 'sequenceControl',
	allowMultiple: true,
	minWidth: 160,
	maxWidth: 240,
	listeners: {
		initialize: 'onSequenceInitialize',
		destroy: 'onSequenceDestroy'
	},
	items: [
		{
			iconCls: 'x-fa fa-random',
			tooltip: 'Random',
			bind: {
				disabled: '{readOnlyWorkflow}',
				pressed: '{randomSelected}'
			}
		},
		{
			iconCls: 'x-fa fa-plus',
			tooltip: 'Increment',
			bind: {
				disabled: '{readOnlyWorkflow}',
				pressed: '{incrementSelected}'
			}
		},
		{
			iconCls: 'x-fa fa-minus',
			tooltip: 'Decrement',
			bind: {
				disabled: '{readOnlyWorkflow}',
				pressed: '{decrementSelected}'
			}
		},
		{
			iconCls: 'x-fa fa-equals',
			tooltip: 'Fixed',
			bind: {
				disabled: '{readOnlyWorkflow}',
				pressed: '{fixedSelected}'
			}
		},
		{
			iconCls: 'x-fa fa-sign-out-alt',
			ui: 'decline',
			tooltip: 'Transparent sequence, moves along with each run, without waiting for its turn',
			bind: {
				disabled: '{readOnlyWorkflow}',
				pressed: '{transparentSequence}',
				hidden: '{hideTransparentSequence}'
			}
		},
	]
})