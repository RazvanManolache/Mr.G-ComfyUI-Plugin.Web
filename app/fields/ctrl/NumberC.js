Ext.define('MrG.fields.ctrl.NumberC', {
	extend: 'MrG.base.ctrl.BaseFieldC',
	init: function () {
		this.callParent(arguments);
		this.vm.bind("{stripCharsRe}", this.stripCharsReChanged, this);

	},

	//this is to fix bug that probably extjs has about bind round value
	onNumberInitialize: function (cmp) {
		cmp.setDecimals(this.get("roundValue"));
	},
	
	
	updateField: function () {
		var view = this.getView();
		var vc = view._configField;
		var vm = this.getViewModel();
		var sequence = vm.get("sequence");
		if (!vc.options) {
			if (sequence && sequence != "fixed") {
				vm.set("options.settings", "advanced");
			}
		}
	},
	getFieldValues: function (include) {
		var val = this.callSuper([include]);
		var vm = this.getViewModel();
		val.maxValue = vm.get("maxValue");
		val.minValue = vm.get("minValue");
		val.stepValue = vm.get("stepValue");

		val.maxValueInterval = vm.get("_maxValueInterval");
		if (val.maxValueInterval == null) delete val.maxValueInterval;
		val.minValueInterval = vm.get("_minValueInterval");
		if (val.minValueInterval == null) delete val.minValueInterval;
		val.stepValueInterval = vm.get("_stepValueInterval");
		if (val.stepValueInterval == null) delete val.stepValueInterval;

		return val;
	},

	textAreaClicked: function (ctrl) {
		if(this.get("readOnlyWorkflow")) return;
		var textAreaNumbers = this.lookup("textAreaNumbers");
		var me = this;
		setTimeout(function () {
			var sel = textAreaNumbers.getTextSelection();
			if (sel[0] == sel[1]) {
				var text = textAreaNumbers.getValue();
				if (text) {
					var begin = sel[0] - 1;
					var end = sel[0];
					while (begin >= 0 && text[begin] != ',') begin--;
					while (end <= text.length) {
						end++;
						if (text[end - 1] == ',') {
							break;
						}
					}
					if (begin + 1 != end - 1) {
						var sub = text.substring(begin + 1, end - 1);
						me.set("value", Number(sub));
					}
				}
			}			
		}, 50);
		
	},
	selectListStoreDataChanged: function () {

	},

	// #region Number input handling
	//in order to use the same logic for both types of fields
	afterModeChange: function () {
		this.stripCharsReChanged(this.get("stripCharsRe"));
	},
	stripCharsReChanged: function (value) {
		var ctrl = this.lookup("textAreaNumbers");
		if (ctrl) {
			ctrl.stripCharsRe = value;
		}
	},
	// #endregion
	// #region Number selection
	openDialogSelectNumbers: function () {
		var me = this;
		var dialog = new MrG.dialog.view.SelectListV({
			_mrgOptions: {
				type: {
					name: 'number',
				},
				fieldType: this.vm.get("fieldType"),
				fieldName: this.vm.get("fieldName"),
				nodeType: this.vm.get("nodeType"),
				mode: 'dialog',
				caller: this,
				value: this.vm.get("valuesComboText")
			},
			listeners: {
				selectionDone: function () { me.processSelectionResult(...arguments); }
			}
		});
		dialog.show();
	},
	processSelectionResult: function (rows) {				
		var fieldType = this.get("fieldType");
		rows.forEach(function (row) {
			var value = row.get("text");
			if (fieldType == "INT") {
				var values = splitText(value, ',');
				//parse each value as int and join them back with comma
				value = values.map(function (v) {
					return parseInt(v);
				}).join(',');
            }
			this.set("valuesComboText", value);
		}, this)
		
	},
	// #endregion
	
});
