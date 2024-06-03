Ext.define('MrG.fields.opt.LinkCombo', {
	extend: 'Ext.field.Select',
	queryMode: 'local',
	picker: 'auto',
	clearable: true,
	flex: 1,
	queryMode: 'local',
	displayField: 'display',
	valueField: 'display',
	reference: 'linkCombo',
	listeners: {
		initialize: {
			//buffer: 300,
			fn: 'onLinkInitialize'
		},
		destroy: {			
			fn: 'onLinkDestroy'
		}
	},	
})