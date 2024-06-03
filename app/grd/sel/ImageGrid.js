Ext.define('MrG.grd.sel.ImageGrid', {
	extend: 'MrG.grd.sel.BaseSelectGrid',
	columns: [
		{
			xclass: 'MrG.grd.sel.col.Delete'
		},
		{
			xclass: 'MrG.grd.sel.col.Select'
		},
		{
			xclass: 'MrG.grd.sel.col.Count'
		},
		{
			xclass: 'MrG.grd.sel.col.Image',
		},
		{
			xclass: 'MrG.grd.sel.col.Alias',
		},
		{
			xclass: 'MrG.grd.sel.col.Name',
		},
		{
			xclass: 'MrG.grd.sel.col.Folder',
		},
		{
			xclass: 'MrG.grd.sel.col.Tags',
		},
		{
			xclass: 'MrG.grd.sel.col.Description',
		},
		{
			xclass: 'MrG.grd.sel.col.Comments',
		},
		{
			xclass: 'MrG.grd.sel.col.Rating',
		},
		
	]
})