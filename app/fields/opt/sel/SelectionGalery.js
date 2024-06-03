Ext.define('MrG.fields.opt.sel.SelectionGalery', {
	extend: 'Ext.dataview.DataView',
	width: '100%',
	maxHeight: 300,
	//itemTpl: [
	//	'<tpl for=".">',
	//	'<div class="x-boundlist-item">',
	//	'<p>{name}</p>',
	//	'<img style="max-height: 150px;max-width: 150px;" src="http://127.0.0.1:8188/view?filename={name}&type=input&subfolder=&rand="/>{abbr}',
	//	'</div>',
	//	'</tpl>'
	//],
	inline: true,
	ui: 'default',
	reference: 'dataview',
	itemTpl: '<div class="dataview-multisort-item">' +
		'<img style="max-height: 100px;max-width: 100px;" draggable="false" src="{photoSmall}" />' +
		//'<h3>{alias}</h3>' +
		'</div>',
	queryMode: 'local',
	displayField: 'alias',
	valueField: 'uuid',
	bind: {	
		store: '{selectListStore}',
	},
	listeners: {
		childTap: 'galeryItemTap'
	}
})