Ext.define('MrG.dialog.ctrl.StepNavigationC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	init: function () {
		this.callParent(arguments);
		var sequenceFields = this.view._sequenceFields;
		var store = this.get("fieldsStore")
		var data = sequenceFields.filter(a => a.hasSequence).map(a => new MrG.model.FieldOptionsModel(a)).sort((a, b) => { return a.order - b.order }) ;
		store.loadData(data);
	},
	onDataChanged: function () {
		var fieldsStore = this.get("fieldsStore");
		var data = fieldsStore.getData().items;
		var combinations = 1;
		var randomFields = 0;
		var fixedFields = 0;
		var sequenceFields = 0;
		var transparentSequenceFields = 0;
		data.forEach(function (a) {
			var sequence = a.get("sequence");
			var transparentSequence = a.get("transparentSequence");
			switch (sequence) {
				case "fixed":
					fixedFields++;
					break;
				case "randomize":
					randomFields++;
					break;
				case "increment":
				case "decrement":
					if (transparentSequence) {
						transparentSequenceFields++;
					} else {
						sequenceFields++;

						if (a.get("sequenceTotalCnt") > 0)
							combinations *= a.get("sequenceTotalCnt");
					}
					
					break;
			}
		});

         
		this.set("combinations", combinations);
		this.set("randomFields", randomFields);
		this.set("fixedFields", fixedFields);
		this.set("transparentSequenceFields", transparentSequenceFields);
		this.set("sequenceFields", sequenceFields);

	},
	getSelections: function () {
		var grid = this.lookup('fieldsGrid');
	    return records = grid.getSelections();
	},
	onOk: function () {
		var store = this.get("fieldsStore");
		var data = store.getData().items.map(a=>a.getData());
		var i = 0;
		data.forEach(function (a) {
			a.order = i++;
		});
		var sequenceFields = this.view._sequenceFields;
		sequenceFields.forEach(function (a) {
            var field = data.find(b => b.nodeId == a.nodeId && b.fieldName == a.fieldName);
			if (!field) {
				a.order = i++;
				data.push(a);
            }
		});
		this.fireViewEventArgs("navigateStepsClosed", [data]);
		this.view.close();
	},
	onCancel: function () {
		this.view.close();
	},
	toStart: function () {
		this.getSelections().forEach(function (rec) {
			var sequenceTotalCnt = rec.get("sequenceTotalCnt");
			var sequencePosition = rec.get("sequencePosition");
			if (sequenceTotalCnt > 0) {
				rec.set("sequencePosition", 0);
			}
			else {
				rec.set("sequencePosition", -1);
			}

		});
	},
	toEnd: function () {
		this.getSelections().forEach(function (rec) {
			var sequenceTotalCnt = rec.get("sequenceTotalCnt");
            var sequencePosition = rec.get("sequencePosition");
            if (sequenceTotalCnt > 0) {
                rec.set("sequencePosition", sequenceTotalCnt - 1);
            }
            else {
                rec.set("sequencePosition", -1);
            }
		});
	},
	changeSequenceForRows: function (sequence) {
		this.getSelections().forEach(function (rec) {
			rec.set("sequence", sequence);
		});
	},
	toTransparent: function () {
		this.getSelections().forEach(function (rec) {
			rec.set("transparentSequence", true);
		});
	},
	toNonTransparent: function () {
		this.getSelections().forEach(function (rec) {
			rec.set("transparentSequence", false);
		});
	},
	toFixed: function () {
		this.changeSequenceForRows("fixed");
	},
	toRandom: function () {
		this.changeSequenceForRows("randomize");
	},
	toIncrement: function () {
		this.changeSequenceForRows("increment");
	},
	toDecrement: function () {
		this.changeSequenceForRows("decrement");
	},
	moveUp: function (grid, event) {
		var record = event.record;
		var store = this.get("fieldsStore");
		var data = store.getData().items;
		var index = data.indexOf(record);
		if (index > 0) {
            var temp = data[index];
            data[index] = data[index - 1];
            data[index - 1] = temp;
            store.loadData(data);
        }
	},
	moveDown: function (grid, event) {
		var record = event.record;
		var store = this.get("fieldsStore");
		var data = store.getData().items;
		var index = data.indexOf(record);
		if (index < data.length - 1) {
            var temp = data[index];
            data[index] = data[index + 1];
            data[index + 1] = temp;
            store.loadData(data);
        }
    }



});
