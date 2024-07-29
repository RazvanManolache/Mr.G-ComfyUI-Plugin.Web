Ext.define('MrG.main.ctrl.LayoutC', {
	extend: 'MrG.base.ctrl.BaseTabPanelC',
	init: function () {
		this.callParent(arguments);

		this.getTemplatesData();

		this.getSetTheme();
		

		var themeMenu = this.lookup("themeMenu");
		MrgThemes.themes.forEach(function (theme) {
			themeMenu.getMenu().add({ text: theme.name, listeners: { click: 'setTheme' } })
		})
	},	
	openItem: function (itemName, groupName, record, focusOnNewTab) {
		var extraMenuItems = this.get("extraMenuItems");
		var group = extraMenuItems.find(a => a.title == groupName);
		if (!group) {
			return;
		}
		var item = group.items.find(a => a.title == itemName);
		if (!item) {
            return;
        }

		var tabPanel = this.view;
		var tab = tabPanel.add({
			title: record.get("name"),
			xclass: item.itemView,
			_itemModel: record,
			closable: true,
			listeners: {
				openWorkflow: 'openWorkflow',
				openItem: 'openItem',
			}
		});
		if (focusOnNewTab)
			tabPanel.setActiveItem(tab);
	},
	

	getSetTheme: function () {
		this.set("theme", MrgThemes.selectedTheme)
		this.set("materialName", MrgThemes.selectedColor)
		this.set("darkMode", MrgThemes.selectedDarkMode)
		this.set("isMaterial", MrgThemes.selectedColors)
		this.updateColorPalette();
		var platform = Ext.platformTags.desktop ? "Desktop" : "Mobile";
		this.updateSetting(platform, "Theme", this.getThemeObject())
	},
	updateColorPalette: function () {
		var colors = this.get("isMaterial")
		if (colors) {
			var paletteMenu = this.lookup("paletteMenu");
			var menu = paletteMenu.getMenu();
			menu.removeAll(true);
			colors.forEach(function (color) {
				menu.add({ text: color.text, listeners: { click: 'setColor' } })
			});
		}
	},
	
	setTheme: function (item) {		
		this.set("theme", item.getText());
		this.applyTheme();
	},
	setColor: function (item) {
		this.set("materialName", item.getText());
		this.applyTheme();
	},
	getThemeObject: function () {
		return {
			name: this.get("theme"),
			color: this.get("materialName"),
			darkMode: this.get("darkMode"),
		}
	},
	applyTheme: function () {
		MrgThemes.setTheme(this.getThemeObject());
		this.getSetTheme();
		
	},
	getTemplatesData: function () {
		var me = this;		
		var url = '/object_info';
		Ext.Ajax.request({
			url: url,
			useDefaultXhrHeader: false,
			success: function (response, opts) { me.templatesReceived(response, opts); },
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});
	},
    templatesReceived: function(response, opts) {
		_data = Ext.decode(response.responseText);
		//console.dir(_data);
		blocksInterpreter.processNodes(_data)
		
		this.vm.set("templatesReceived", true);
		this.checkLoaded();
	},
	checkLoaded: function () {
		var templatesReceived = this.vm.get("templatesReceived");
		if (templatesReceived) {

			//TODO: figure out what to do about the add node window
			selectNodeDialog = new MrG.dialog.view.SelectNodeV();
			//selectNodeDialog.show();
			//selectNodeDialog.hide();
			this.addTab();
			this.view.setMasked(false);
		}
			
	},
	addTab: function () {
		
		var tabPanel = this.view;
		var tab = tabPanel.add({
			xclass: 'MrG.main.view.ActionListV',
			closable: true,
			scollable: true,
			listeners: {
				openWorkflow: 'openWorkflow',
				openItem: 'openItem',
			}
		});
		tabPanel.setActiveItem(tab);
	},
	
	openWorkflowByUuid: function (uuid) {
		if (!uuid) return;
		if (this.findTabByUUid(uuid, true)) return;
		this.openWorkflow(uuid, null, true);
		
		console.log("openWorkflowByUuid",uuid);
	},
	findTabByUUid: function (uuid, focus) {
		var tabPanel = this.view;
		var items = tabPanel.items.items;
		var tab = null;
		items.forEach(function (item) {
            if (item.uuid == uuid) {
                tab = item;
                return false;
            }
		});
		if (focus && tab) {
			tabPanel.setActiveItem(tab);
		}

		return tab;


	},
	openWorkflow: function (record, category, focusOnNewTab) {
		var tabPanel = this.view;
		var tab = tabPanel.add({
			title: "Workflow",
			xclass: 'MrG.main.view.WorkflowV',
			_workflowModel: record,
			_categoryModel: category,
			closable: true,
			listeners: {
				openWorkflow: 'openWorkflow',
			}
		});
		//console.log("Workflow open",record);
		if (focusOnNewTab)
			tabPanel.setActiveItem(tab);
		
		
	},

	refreshAllSingletonStores: function () {
		for (var storeName in MrG.store.combo.singleton) {
			MrG.store.combo.singleton[storeName].reload();
		}
	}

});
