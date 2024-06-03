Ext.define('MrG.grd.sel.col.Comments', {
	extend: 'Ext.grid.column.Text',
	text: "Comments",
	dataIndex: "comments",
	
	flex: 2,
	bind: {
		hidden: '{hideCommentsColumn}',
		editable: '{editableCommentsColumn}',
	},
})