Ext.define('MrG.grd.sel.col.Select', {
	extend: 'Ext.grid.column.Check',
	dataIndex: "selected",
	hideable: false,

	bind: {
		hidden: '{hideSelectColumn}'
	},
	width: 30
})