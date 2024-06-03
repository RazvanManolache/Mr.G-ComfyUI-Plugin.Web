Ext.define('MrG.grd.sel.BaseSelectGrid', {
	extend: 'Ext.grid.Grid',
	reference: 'itemsGrid',
	
	selectable: {
		rows: true,
	},
	bind: {
		store: '{selectListStore}'
	},
	flex: 1,
	listeners: {
		select: 'rowListSelected'
	},
	
})