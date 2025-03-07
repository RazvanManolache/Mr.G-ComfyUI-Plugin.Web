Ext.define('MrG.main.ctrl.QueueC', {
	extend: 'MrG.base.ctrl.BasePanelC',	
	init: function () {
		this.callParent(arguments);

		var record = this.view._embedWorkflowModel;
		if (record) {
			this.initByRecord(record);
			return;
		} else {
			var uuid = this.view.uuid;
			if (uuid) {
				this.initByUuid(uuid);
			}
			else {
				console.log("shouldn't even get here");
				this.view.close();
				
			}
		}


	},
	initByRecord: function (record) {
		this.updateRecord(record);

	},
	updateRecord: function (record) {
		this.view.uuid = record.get("uuid");
		this.set("record", record);
	},
});
