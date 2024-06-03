Ext.define('MrG.fields.opt.num.NumberCombo', {
	extend: 'Ext.field.ComboBox',
	displayField: 'uuid',
	valueField: 'text',
	queryMode: 'local',
	bind: {
		value: '{value}',
		store: '{comboListStore}',
	}
})