Ext.define('MrG.grd.sel.col.Delete', {
	extend: 'Ext.grid.column.Column',
	width: 35,
	hideable: false,
	cell: {
		tools: {
			decline: {
				iconCls: 'x-fa fa-ban red',
				handler: 'deleteSelectionRow'
			},
		}
	},
	bind: {		
		hidden: '{hideDeleteColumn||readOnlyWorkflow}'
	},
})