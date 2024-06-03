Ext.define('MrG.fields.opt.str.TextCombo', {
	extend: 'Ext.field.ComboBox',
	displayField: 'text',
	valueField: 'text',
	queryMode: 'local',
	width: '100%',
	bind: {		
		value: '{value}',
		store: '{selectListStore}',

	}
})