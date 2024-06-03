Ext.define("MrG.base.cmp.TagDataView", {
	extend: 'Ext.dataview.DataView',
	layout: 'hbox',
	privates: {
		getItemElementConfig: function (index, data, store) {
			return {
				xclass: 'Ext.Button',
				reference: 'tag-' + index,
				text: data.name,
				badgeText: data.badge,
				enableToggle: true,
				handler: 'applyFilters'
			}
		}
	}
	

});
