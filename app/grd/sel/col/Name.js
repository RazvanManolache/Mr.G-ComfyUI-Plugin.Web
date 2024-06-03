Ext.define('MrG.grd.sel.col.Name', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "name",
	text: 'Name',
	flex: 2,
	bind: {
		hidden: '{hideNameColumn}'
	},
})