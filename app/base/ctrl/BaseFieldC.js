Ext.define('MrG.base.ctrl.BaseFieldC', {
	extend: 'MrG.base.ctrl.BaseContainerC',
	optionsMenu: null,
	checkAutoSaveInternal: function (eventName, args) {
		if (this.fieldInitiated)
			this.view.parent.getController().checkAutoSave(eventName, args, "field");
	},
	onLabelClick: function () {
		this.fireViewEventArgs("fieldLabelClicked", [this]);
		var usedInDescription = this.get("usedInDescription");
		this.set("usedInDescription", !usedInDescription);
	},
	fieldInitiated: false,
	onFieldInitiated: function () {
		this.fieldInitiated = true
	},
	init: function () {
		//bind to fieldInitiated event to know when field is initiated
		this.view.on("fieldInitiated", this.onFieldInitiated, this);
		
		this.callParent(arguments);

		var me = this;
		var vc = this.view._configField;
		
		this.setFieldValues(vc);


		if (this.initField) {
			this.initField();
		}

		//for mobile compatibility might have to do the stuff below
		this.optionsMenu = clone(this.view.optionsMenu);
		this.makeOptionsMenu(this.optionsMenu);
		var optionsMenuBtn = this.lookup("optionsMenuBtn");
		if (optionsMenuBtn) {
			if (Ext.platformTags.desktop) {
				optionsMenuBtn.setMenu(this.optionsMenu);
			}
			else {
				optionsMenuBtn.on('tap', function () {
					me.mobileMenu = me.showMenuMobile("right", me.optionsMenu);

					me.mobileMenu.on("hide", function () {
						me.mobileMenu = null;
					})
				}, this)
			}
		}
		// events to update field based on options. no view events
		this.vm.bind("{optionSelected}", this.updateMode, this);
		this.vm.bind("{optionMode}", this.updateMode, this);
		this.vm.bind("{forceHideFields}", this.updateMode, this);

		// to send event to notify comfy of updates
		this.vm.bind("{value}", this.fieldValueChanged, this);
		this.vm.bind("{sequence}", this.fieldValueChanged, this);
		//method that monitors that happens to link value and actually sends good events
		this.vm.bind("{linkValue}", this.linkValueChanged, this);

		
		// this is used for field that can convert to links and can change type
		this.vm.bind("{fieldType}", this.linkFieldChanged, this);
		this.vm.bind("{linkField}", this.linkFieldChanged, this);

		//events to update workflow on field changes
		this.vm.bind(["{value}", "{linkValue}", "{sequenceTotalCnt}", "{sequencePosition}", "{fieldSelected}",
			"{hasSequence}", "{sequence}"], this.fieldChanged, this);

		//TODO: this one overlaps big time with the one above, need to find a way to merge, generates event sequenceChanged
		this.vm.bind("{sequenceTotalCnt}", this.onSequenceChange, this);
		this.vm.bind("{transparentSequence}", this.onSequenceChange, this);
		this.vm.bind("{sequencePosition}", this.onSequenceChange, this);
		this.vm.bind("{sequence}", this.onSequenceChange, this);
		
		if (!this.getDefaultLayout()) {
			this.setLayoutAsDefault();
		}
		
		this.fireViewEventArgs("fieldInitiated", [this]);


		var mandatoryFields = this.get("mandatoryFields");
		mandatoryFields = mandatoryFields.map(a => "{" + a + "}");
		this.vm.bind(mandatoryFields, function (data) {
			this.checkAutoSaveInternal("dataChanged", [this, data]);
		}, this);
	},
	selectField: function (selected) {
		if (selected === undefined) selected = true;
		this.set("fieldSelected", selected);
	},
	fieldLinkConvert: function (fieldName, link) {
		if (this.isThisFieldName(fieldName)) {
			var fieldModes = this.get("fieldModes");
			if (fieldModes) {
				var linkOption = fieldModes.find(a => !!a.isLink== link);
				if (linkOption) {
					this.set("optionSelected", linkOption.name);
					this.updateMode();
				}
			}
		}
	},
	linkFieldChanged: function () {
		this.set("errorMessage", "");
		var linkField = this.get("linkField");
		//if (!linkField) {
		//	this.linkValueChanged(null, this.get("linkValue"));
		//}
		//	//this.set("linkValue", null);
		this.fireViewEventArgs("linkFieldStateChanged", [this, this.getFieldName(), linkField, this.get("isInField"), this.get("fieldType") ]);
		
	},
	fieldChanged: function (newValue, oldValue, obj) {
		this.set("errorMessage", "");
		var fieldValues = this.getFieldValues(["sequenceTotalCnt", "sequencePosition"]);
		this.fireViewEventArgs("fieldChanged", [this, fieldValues, false]);
	},
	//when field is destroyed it's a good idea to also remove it from everything else
	onFieldDestroy: function () {
		
		var fieldValues = this.getFieldValues(["sequenceTotalCnt", "sequencePosition"]);
		this.fireViewEventArgs("fieldChanged", [this, fieldValues, true]);
	},
	// method to update config of the field, has optional exclude parameter to exclude fields from being updated
	setValueAndPos: function (value, pos) {
		if (this.get("sequencePosition") != pos) {
			console.log(this.get("fieldName"), " - ", this.get("sequencePosition"), " - ", pos, " - ", value);
			this.set("sequencePosition", pos);
			
		};
		if (this.get("value") != value) {
			this.set("value", value);
		}
		
	},
	showError: function (error) {
		this.set("errorMessage", error);
	},
	notifyField: function (msg) {
		if (msg == "refresh" && this.updateFieldAfterRun)
			this.updateFieldAfterRun();
	},
	updateFieldAfterRun: function () {
		this.set("sequencePosition", this.get("nextSequencePosition"));
	},
	
	getLabel: function () {
		return this.get("label");
	},
	checkIfSetAndCopy: function (conf, name) {
		if (conf && conf[name] !== undefined) {
			this.setVMValue(name, conf[name]);
			return true;
		}
		return false;
	},
	setFieldValue: function (fieldName, field, val) {
		if (this.isThisFieldName(fieldName)) {
			return this.setVMValue(field, val);
		}	
	},
	getFieldName: function () {
		return this.get("fieldName");
	},
	setHiddenByNode: function (value) {
		this.set("hiddenByNode", value);
	},
	setFieldValues: function (conf, exclude) {

		this.get("typeSpecificFields").forEach(function (field) {
			if (exclude && exclude.indexOf(field) != -1) return;
			this.checkIfSetAndCopy(conf, field);
		}, this);
		this.get("mandatoryFields").forEach(function (field) {
			if (exclude && exclude.indexOf(field) != -1) return;
			this.checkIfSetAndCopy(conf, field);
		}, this);
	},
	getFieldValues: function (include) {
		var ret = {};
		this.get("mandatoryFields").forEach(function (field) {
			ret[field] = this.get(field);
		}, this);
		this.get("typeSpecificFields").forEach(function (field) {
			ret[field] = this.get(field);
		}, this);
		if (include) {
            include.forEach(function (field) {
				ret[field] = this.get(field);
            }, this);
        }
		return ret;
	},
	
	setVMValue: function (name, val) {
		var changed = this.set(name, val)
		if (changed && this.updateField) {
			this.updateField();
		}
		return changed;
	},

	fieldValueChanged: function (newValue, prevValue) {
		if (prevValue === undefined && newValue === null) return;

		this.fireViewEvent("fieldValueChanged", [this, newValue]);

	},
	setLayoutAsDefault: function () {
		var values = this.getFieldValues();
		var settingName = this.getSettingName();
		if (settingName) {
			this.updateSetting(settingName, "FieldDefaults", values);
		}

	},
	getDefaultLayout: function () {
		var settingName = this.getSettingName();
		return this.getSetting(settingName, "FieldDefaults");
	},
	getSettingName: function () {
		return this.get("nodeType") + "|" + this.get("fieldName");
	},
	loadDefaultLayout: function () {
		var setting = this.getDefaultLayout();
		if (setting) {
			var layoutText = setting.get("value")
			var layoutObj = JSON.parse(layoutText);
			var exclude = ["value", "linkValue"]
			var linkField = this.get("linkField");
			this.setFieldValues(layoutObj, linkField? exclude:null);
		}

	},
	makeOptionsMenu: function (optionsMenu) {
		var fieldModes = this.get("fieldModes");
		if (!fieldModes) return;
		var i = 0;
		var hasAdvanced = false;
		var optionSelected = this.get("optionSelected");

		fieldModes.forEach(function (option) {
			if (option.advanced) {
				hasAdvanced = true;
			}
			var def = {
				xtype: 'button',
				text: option.name,
				mrgOption: true,
				bind: {
					pressed: '{optionSelected == "' + option.name + '"}',
				},
				handler: 'optionSelected',
				enableToggle: true,
			}
			if (option.isLink) {
				def.bind.hidden = '{hideLinkOption}'
			}
			optionsMenu.items.splice(i++, 0, def);
		});

		var optionMode = this.get("optionMode");
		if (hasAdvanced) {
			var sep = {
				separator: true,
				disabled: true,
				height: 20
			};
			var smp = {
				xtype: 'button',
				text: 'Basic',
				mrgMode: true,
				handler: 'basicSelected',
				bind: {
					pressed: "{optionModeBasic}"
				},
				enableToggle: true,
			};
			var adv = {
				xtype: 'button',
				text: 'Advanced',
				mrgMode: true,
				bind: {
					pressed: "{optionModeAdvanced}"
				},
				handler: 'advancedSelected',
				enableToggle: true,
			};

			optionsMenu.items.splice(i++, 0, sep);
			optionsMenu.items.splice(i++, 0, smp);
			optionsMenu.items.splice(i++, 0, adv);


		}
		var me = this;
		optionsMenu.items.forEach(function (item) {
			item.scope = me;
		})
	},

	setOptionButtonDisabled: function (name, type, value) {
		var btn = this.getOptionButton(name, type);
		if (btn) {
			if (btn.setDisabled) {
				btn.setDisabled(value);
			}
			else {
				btn.disabled = value;
			}
		}
	},
	basicSelected: function (menuitem) {
		menuitem.setPressed(true);
		this.set("optionMode", "Basic");
	},

	advancedSelected: function (menuitem) {
		menuitem.setPressed(true);
		this.set("optionMode", "Advanced");
	},
	optionSelected: function (menuitem) {
		menuitem.setPressed(true);
		this.set("optionSelected", menuitem.getText())
	},
	//TODO: optimize this code, this was written before i knew how to link vm to mobile menu
	updateMode: function () {
		var forceHideFields = this.get("forceHideFields");
		if(forceHideFields) return;
		var fieldModes = this.get("fieldModes");
		if (!fieldModes) return;
		var me = this;
		var optionSelected = this.get("optionSelected");
		var optionMode = this.get("optionMode");
		var xclass = null;
		var currentXclass = this.get("xclassField");
		fieldModes.forEach(function (option) {
			if (option.name == optionSelected) {
				xclass = option.xclass;
				me.set("linkField", !!option.isLink);
				me.setOptionButtonDisabled("Advanced", "mrgMode", !option.advanced);
				me.setOptionButtonDisabled("Basic", "mrgMode", !option.advanced);
				if (optionMode == "Advanced" && option.advanced) {
					xclass = option.advanced.xclass;
				}
				//if nothing configured better be in advanced more from the start
				if (optionMode == "Basic" && option.goAdvanced && option.goAdvanced(me)
					&& option.advanced && currentXclass != option.advanced.xclass) {
					xclass = null;
					me.set("optionMode", "Advanced");
				}
				if (currentXclass == xclass) {
					xclass = null;
				}
			}
		});

		if (xclass) {
			this.set("xclassField", xclass)
			var controlContainer = this.lookup("controlContainer");
			controlContainer.removeAll(true);
			var control = controlContainer.add({
					xclass: xclass
			});
			if (this.afterModeChange)
				this.afterModeChange(control);
			
			//if (xclass == "MrG.fields.opt.LinkCombo")
			//	console.log(xclass, control);
		}
	},
	getOptionButton: function (name, option) {
		if (!option) option = "mrgOption";
		var menu = this.lookup("optionsMenuBtn").getMenu();
		var buttons = [];
		var items = this.optionsMenu.items;
		if (menu) {
			items = menu.getItems().items;
			buttons = items.filter(a => a[option] && a.getText() == name);
		} else if (this.mobileMenu) {
			items = this.mobileMenu.getItems().items;
			buttons = items.filter(a => a[option] && a.getText() == name);

		} else {
			buttons = items.filter(a => a[option] && a.text == name);
		}
		if (buttons.length > 0) {
			return buttons[0];
		}
		return null;
	},
	isThisFieldName: function (fieldName) {
		return fieldName == this.getFieldName();
	},
	removeFromLinkField: function (fieldName, row, otherNodeId, isInField) {
		if (this.isThisFieldName(fieldName) && this.get("isInField") == isInField) {
			var changed = false;
			if (!row) {
				var record = this.get("linkedRecord");
				var newVal = null;
				if (record) {
					if (Array.isArray(record)) {
						newVal = record.map(a => a.get("display"));
					}
					else {
						newVal = record.get("display");
					}
				}
				this.set("linkValue", newVal);
				return;
			}

			var value = row.get("display");
			var selected = this.get("linkValue");
			var newVal = clone(selected);
			var isInField = this.get("isInField");
			if (isInField) {
				if (newVal == value) {
					newVal = null;
                    changed = true;
				}
			}
			else {
				if (Array.isArray(newVal)) {
                    if (newVal.indexOf(value) != -1) {
                        newVal = removeItemAll(newVal, value);
                        if (newVal.length == 0) newVal = [];
                        changed = true;
                    }

                } else if (newVal) {
                    if (newVal == value) {
                        newVal = [];
                        changed = true;
                    }
                }
			}
			
			if (changed) {
				this.set("linkValue", newVal);
			}

		}
	},
	addToLinkField: function (fieldName, row, isInField) {
		if (this.isThisFieldName(fieldName) && this.get("isInField") == isInField) {
			var changed = false;
			var value = row.get("display");
			if (!value) return;
			var selected = this.get("linkValue");
			var newVal = clone(selected);
			var isInField = this.get("isInField");
			if (isInField) {
				if (newVal != value) {
					newVal = value;
					changed = true;
				}
			}
			else {
				if (Array.isArray(newVal)) {
					if (newVal.indexOf(value) == -1) {
						newVal.push(value);
						changed = true;
					}
					
				} else {
					if (newVal != value) {
						if (newVal) {
							newVal = [newVal, value];
						} else {
							newVal = [value];
						}
						changed = true;
					}
					
				}
			}
			
			if (changed) {
				MrGlogger("add: ", fieldName, " - val:", newVal, " - prev value: ",selected);
				this.set("linkValue", newVal);
			}

		}
	},
	linkValueChanged: function (newValue, prevValue) {
		
		if ((!newValue || (Array.isArray(newValue) && !newValue.length))
			&& (!prevValue || (Array.isArray(prevValue) && !prevValue.length)))
			return;
		//MrGlogger("cng: ", this.get("fieldName"), " - val:", newValue, " - prev value: ", prevValue);
		var store = this.get("linkStore");
		if (store) {

			var rows = store.queryBy(function (row) {
				var val = row.get("display");
				return newValue &&
					(
						newValue == val ||
						(Array.isArray(newValue) && newValue.indexOf(val) != -1)
					)
			}).items;
			var prevRows = store.queryBy(function (row) {
				var val = row.get("display");
				return prevValue &&
					(
						prevValue == val ||
						(Array.isArray(prevValue) && prevValue.indexOf(val) != -1)
					)
			}).items;
			var removed = prevRows.filter(x => !rows.includes(x));
			removed.forEach(function (diff) {
				//MrGlogger("rmv: ", this.get("fieldName"), " - val:", newValue, " - prev value: ", prevValue);
				this.fireViewEventArgs("fieldLinkRemoved", [this, diff, this.get("isInField"), this.get("fieldName")]);
			}, this);

			var added = rows.filter(x => !prevRows.includes(x));
			added.forEach(function (diff) {
				//MrGlogger("add: ", this.get("fieldName"), " - val:", newValue, " - prev value: ", prevValue);
				this.fireViewEventArgs("fieldLinkAdded", [this, diff, this.get("isInField"), this.get("fieldName")]);
			}, this)
		}

	},

	setAsInput: function (name) {
		if (this.isThisFieldName(name)) {
			var option = this.optionsMenu.filter(a => a.isLink);
			if (option.length > 0) {
				this.set("optionSelected", this.name);
				this.updateMode();
			}
		}
	},

	getLinkData: function () {
		return {
			type: this.get("fieldType"),
			name: this.get("fieldName"),
			input: this.get("isInField"),
			value: this.get("linkValue"),
			//not happy with this solution, but it's the only way to get the store
			fieldC: this
		};
	},
	onLinkInitialize: function (cmp) {
		cmp.setBind({ store: '{linkStore}' });
		cmp.setBind({ multiSelect: '{!isInField}' });
		cmp.setBind({ value: '{linkValue}' });
		this.fireLinkInitialize();
	},
	
	fireLinkInitialize: function () {
		this.fireViewEventArgs("fieldLinkInitialized", [this, this.getLinkData()]);
	},
	onLinkDestroy: function () {
		this.fireViewEventArgs("fieldLinkDestroyed", [this, this.getLinkData()]);
	},
	setFieldAlias: function () {
		var currentLabel = this.get("label");
		var currentAlias = this.get("alias");
		var me = this;
		var defText = currentLabel;
		var promptText = 'Set alias for '+ currentLabel ;
		if (currentAlias) {
            defText = currentAlias;
			promptText = 'Change alias for ' + currentAlias + '(' + currentLabel + ')';
        }
		Ext.Msg.prompt(promptText, 'Please enter a text:', function(btn, text) {
			if (btn === 'ok') {
				text = text.trim();
				if(text==currentLabel) text = '';
				me.set('alias', text);
			}
		}, null, false, defText); 
	},

	// #region Sequence

	updateSequenceField: function (fieldSequence) {
		if (fieldSequence.fieldName == this.get("fieldName") && fieldSequence.sequence) {
			this.set("sequence", fieldSequence.sequence);
			this.set("transparentSequence", fieldSequence.transparentSequence);
			if (Object.hasOwn(fieldSequence, "sequencePosition")) {
				var sequencePosition = this.get("sequencePosition");
				if (sequencePosition != fieldSequence.sequencePosition) {
					this.set("sequencePosition", fieldSequence.sequencePosition);
				}
			}
			
		}

	},
	
	
	onSequenceInitialize: function () {
		if (!this.get("linkField")) {
			this.set("hasSequence", true);
			this.fireViewEventArgs("sequenceChanged", [this.getSequenceObject({ hasSequence: true })]);
		}
		else {
			console.log("shouldn't be possible");
			debugger;
		}
	},
	onSequenceDestroy: function () {
		if (!this.get("linkField")) {
			this.set("hasSequence", false);
			this.fireViewEventArgs("sequenceChanged", [this.getSequenceObject({ hasSequence: false })]);
		}
		else {
			console.log("shouldn't be possible");
			debugger;
		}
	},
	onSequenceChange: function () {
		if (!this.get("linkField")) {
			this.fireViewEventArgs("sequenceChanged", [this.getSequenceObject()]);
		}
		
	},
	getSequenceObject: function (override) {
		var eventObj = {
			fieldName: this.get("fieldName"),
			sequence: this.get("sequence"),
			hasSequence: this.get("hasSequence"),
			sequenceTotalCnt: this.get("sequenceTotalCnt"),
			sequencePosition: this.get("sequencePosition"),
			transparentSequence: this.get("transparentSequence"),
		
		};
		if (override) {
            Object.assign(eventObj, override);
		}
		return eventObj;
	}

	// #endregion Sequence
});
