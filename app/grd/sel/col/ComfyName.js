Ext.define('MrG.grd.sel.col.ComfyName', {
	extend: 'Ext.grid.column.Text',
	dataIndex: "comfy",
	editable: false,
	text: 'Comfy name',
	flex: 2,
	bind: {
		hidden: '{hideComfyNameColumn}'
	},
})