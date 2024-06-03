Ext.define('MrG.grd.sel.col.Description', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "description",
	editable: false,
	text: 'Description',
	flex: 2,
	bind: {
		hidden: '{hideDescriptionColumn}'
	},
})