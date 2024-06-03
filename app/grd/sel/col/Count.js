Ext.define('MrG.grd.sel.col.Count', {
	extend: 'Ext.grid.column.Number',
	text: "#",
	dataIndex: "count",
	hideable: false,
	format: '0',
	editable: true,
	width: 70,
	bind: {
		hidden: '{hideSelectCountColumn}'
	},
})