Ext.define('MrG.fields.opt.num.NumberDefinedSequence', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [
		{
			xclass: 'Ext.field.TextArea',
			reference: 'textAreaNumbers',
			flex: 1,
			stripCharsRe: /[^0-9.,]/g,
			bind: {
				value: '{valuesComboText}',
				readOnly: '{readOnlyWorkflow}'
			},
			listeners: {
				mousedown: 'textAreaClicked'
			}
			
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-search',
			handler: 'openDialogSelectNumbers',
			bind: {
				hidden: '{readOnlyWorkflow}'
			},
			width: 40,
			tooltip: 'Use predefined lists',
		},
	]
})