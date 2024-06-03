Ext.define('MrG.grd.sel.col.Path', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "path",
	text: 'Path',
	flex: 2,
	bind: {
		hidden: '{hidePathColumn}'
	},
})