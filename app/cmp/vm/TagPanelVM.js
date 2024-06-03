Ext.define('MrG.cmp.vm.TagPanelVM', {
	extend: 'MrG.base.vm.BasePanelVM',
	data: {
		hideTagPanel: true,
		tags: '',
		tagOperation: 'AND',
		dataStore: null,
		hideShowAllButton: true
	},
	formulas: {

	},
	stores: {
		
		tagStore: {
			xtype: 'MrG.store.TagStore',
			sorters: ['name'],
			listeners: {
				datachanged: 'dataStoreDataChanged'
			}
		}
	}
});
