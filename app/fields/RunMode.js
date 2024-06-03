Ext.define('MrG.fields.RunMode', {
	extend: 'Ext.field.Select',
	reference: 'runMode',
	autoSelect: true,
	width: '100px',
	
	store: {
		xclass: 'MrG.store.RunModeStore'
	}
});