Ext.define('MrG.main.ctrl.JobC', {
	extend: 'MrG.main.ctrl.BaseEmbedWorkflowC',
	init: function () {
		this.callParent(arguments);
	},
	newRecord: function () {
		return new MrG.model.JobModel({
			uuid: crypto.randomUUID(),
			name: 'New API',
			enabled: true
		});
	},
	initByUuid: function (uuid) {
		var url = '/mrg/job?uuid=' + uuid;
		var me = this;
		Ext.Ajax.request({
			url: url,
			useDefaultXhrHeader: false,
			success: function (response, opts) {
				var data = Ext.decode(response.responseText);
				record = new MrG.model.JobModel(data);
				me.view._embedWorkflowModel = record;
				me.initByRecord(record);
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		})
	},
});
