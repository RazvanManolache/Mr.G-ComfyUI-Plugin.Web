Ext.define('MrG.grd.sel.col.Text', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "text",
	text: 'Text',
	editable: true,
	bind: {
		hidden: '{hideTextColumn}'		
	},
	flex: 2,
})