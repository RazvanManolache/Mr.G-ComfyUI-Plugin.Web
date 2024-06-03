Ext.define('MrG.grd.sel.PresetGrid', {
	extend: 'MrG.grd.sel.BaseSelectGrid',
	columns: [
		{
			xclass: 'MrG.grd.sel.col.Delete'
		},		
		{
			xclass: 'MrG.grd.sel.col.Select'
		},
		{
			xclass: 'MrG.grd.sel.col.Alias'
		},
		{
			xclass: 'MrG.grd.sel.col.Tags',
		},
		{
			xclass: 'MrG.grd.sel.col.Description',
		},
		{
			xclass: 'MrG.grd.sel.col.Rating',
		}
	]
})