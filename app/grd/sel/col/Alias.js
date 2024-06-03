Ext.define('MrG.grd.sel.col.Alias', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "alias",	
	text: "Alias",
	flex: 2,
	bind: {
		hidden: '{hideAliasColumn}',
		editable: '{editableAliasColumn}'
	},
})