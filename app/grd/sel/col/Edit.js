Ext.define('MrG.grd.sel.col.Edit', {
	extend: 'Ext.grid.column.Column',
	width: 35,
	hideable: false,
	cell: {
		tools: {
			edit: {
				iconCls: 'x-fa fa-pen',
				handler: 'editSelectionRow'
			}
		}
	},
	bind: {
		hidden: '{hideEditColumn}'
	},
})