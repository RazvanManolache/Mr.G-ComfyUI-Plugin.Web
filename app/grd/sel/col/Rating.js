Ext.define('MrG.grd.sel.col.Rating', {
	extend: 'Ext.grid.column.Number',
	text: 'Rating',
	dataIndex: 'rating',
	format: '0',
	
	flex: 1,
	bind: {
		hidden: '{hideRatingColumn}',
		editable: '{editableRatingColumn}',
	},
	editor: {
		xtype: 'numberfield',
		minValue: 0,
		maxValue: 10,
		decimals: 0
	}
})