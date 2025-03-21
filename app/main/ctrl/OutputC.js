Ext.define('MrG.main.ctrl.OutputC', {
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
	openWorkflow: function () {
		var record = this.get("record");
		var uuid = record.get("workflow_uuid");
		this.view.fireEventArgs("openWorkflowByUuid", [uuid]);
	},
	openWorkflowWithParams: function () {
		var record = this.get("record");
		var uuid = "output " +record.get("uuid");
		this.view.fireEventArgs("openWorkflowByUuid", [uuid]);
	}, 
	downloadOutput: function () {
		var record = this.get("record");
		if (record.get("isImage")) {
			var url = record.get("sourceUrl");
			var a = document.createElement('a');
			a.href = url;
			a.download = "output.png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			
		}
	}
});
