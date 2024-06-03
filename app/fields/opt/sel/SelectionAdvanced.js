Ext.define('MrG.fields.opt.sel.SelectionAdvanced', {
	extend: 'Ext.Container',
	layout: 'vbox',
	
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.sel.SelectionSequence',
		},
		{
			xclass: 'Ext.Container',
			layout: 'hbox',
			items: [
				{
					xclass: 'Ext.field.ComboBox',
					flex: 1,
					queryMode: 'local',
					multiSelect: true,
					picker: 'auto',
					displayField: 'alias',
					valueField: 'uuid',
					
					bind: {
						value: '{filteredSelectedUUIDs}',
						store: '{globalDataStore}',
					}
				},
				{
					xclass: 'MrG.fields.opt.NegateButton'					
				}
			]
		}
		
	]
});