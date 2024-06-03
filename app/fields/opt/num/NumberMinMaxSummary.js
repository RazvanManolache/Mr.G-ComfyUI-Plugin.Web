Ext.define('MrG.fields.opt.num.NumberMinMaxSummary', {
	extend: 'Ext.Container',
	layout: {
		type: 'hbox',
		align: 'middle'
	}, 
	items: [
		{
			xtype: 'label',
			bind: {
				html: ' {minValueInterval} < '
			}
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.num.NumberSimpleMinMax',
		},
		{
			xtype: 'label',
			bind: {
				html: ' < {maxValueInterval} '
			}
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.SequenceButton',
		}
	]
});