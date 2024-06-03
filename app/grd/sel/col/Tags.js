Ext.define('MrG.grd.sel.col.Tags', {
	extend: 'Ext.grid.column.Text',
	text: "Tags",
	dataIndex: "tags",
	flex: 1,
	bind: {
		hidden: '{hideTagsColumn}',
		editable: '{editableTagsColumn}'
	},
})