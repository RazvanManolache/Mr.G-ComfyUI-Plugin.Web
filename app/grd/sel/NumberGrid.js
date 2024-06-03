Ext.define('MrG.grd.sel.NumberGrid', {
	extend: 'MrG.grd.sel.BaseSelectGrid',	
	columns: [		
		{
			xclass: 'MrG.grd.sel.col.Delete'
		},
		{
			xclass: 'MrG.grd.sel.col.Edit'
		},
		{
			xclass: 'MrG.grd.sel.col.Select'
		},
		{
			xclass: 'MrG.grd.sel.col.Alias'
		},
		{
			xclass: 'MrG.grd.sel.col.Text',
		},
		{
			xclass: 'MrG.grd.sel.col.Tags',
		},
		{
			xclass: 'MrG.grd.sel.col.Comments',
		},
		{
			xclass: 'MrG.grd.sel.col.Rating',
		}
	]
})