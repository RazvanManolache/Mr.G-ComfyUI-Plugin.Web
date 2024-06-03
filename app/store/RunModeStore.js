Ext.define('MrG.store.RunModeStore', {
	singleton: true,
	storeId:'MrG.store.RunModeStore',
	extend: 'Ext.data.Store',
	model: 'MrG.model.RunModeModel',
	data: [{
		text: 'Queue',
		value: 'q'
	}, {
		text: 'Queue&Step',
		value: 'qs'
	}, {
		text: 'Loop queue',
		value: 'lq'
	}, {
		text: 'Queue all',
		value: 'qa'
	}]
});