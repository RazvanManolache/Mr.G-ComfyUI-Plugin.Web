Ext.define('MrG.grd.sel.col.Image', {
	extend: 'Ext.grid.column.Column',
	text: "Image",
	width: 100,
	renderer: function (val) { return '<img src="' + val + '">'; },
	dataIndex: "thumbnail",
	sortable: false,
	editable: false,
	bind: {
		hidden: '{hideImageColumn}'
	},
})