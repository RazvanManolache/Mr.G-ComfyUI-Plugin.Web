Ext.define('MrG.fields.ctrl.ImageC', {
	extend: 'MrG.fields.ctrl.SelectionC',
	init: function () {
		this.callParent(arguments);
	},
	
	processSelectionResult: function (rows, replace) {
		var toSet = rows;
		if (!replace) {
			var filteredSelectedRecords = this.get("filteredSelectedRecords");
			var result = [].concat(filteredSelectedRecords);
			var existingItems = filteredSelectedRecords.map(a => a.get("uuid"));
			rows.forEach(function (row) {
				if (!existingItems.includes(row.get("uuid"))) {
					result.push(row);
				}
			});
			toSet = result;
			
		}
		this.set("filteredSelectedRecords", toSet);
		if (toSet.length > 1) {
			this.set("optionMode", "Advanced");
		} else {
			if (toSet.length == 1) {
				this.set("optionMode", "Simple");
				this.set("value", toSet[0].get("comfy_name"));
			}
		}

	},
});
