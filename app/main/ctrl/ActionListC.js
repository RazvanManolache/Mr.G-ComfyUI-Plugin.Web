Ext.define('MrG.main.ctrl.ActionListC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	init: function () {
		this.callParent(arguments);
		this.view.setMasked(true);

		var tree = this.lookup('treeCategories');

		var categoryStore = this.get("categoryStore");
		categoryStore.storeId = "categoryStore_" + crypto.randomUUID();
		Ext.StoreMgr.register(categoryStore);

		var workflowStore = this.get("workflowStore");
		workflowStore.storeId = "workflowStore_" + crypto.randomUUID();
		Ext.StoreMgr.register(workflowStore);



		//this.vm.bind("{searchText}", function (val) { console.log(val) }, this);

		this.get("extraMenuItems").forEach(function (group) {
			this.addMenuGroup(group);
			group.items.forEach(function (item) {
				this.addMenuItem(group.title, item);
			}, this);
		}, this);

	},
	addMenuItem: function (groupName, item) {
		var reference = this.getMenuGroupItemReference(groupName, item.title);
		var menuItem = this.lookup(reference);
		if (!menuItem) {
			var menuGroup = this.lookup(this.getMenuGroupReference(groupName));
			menuItem = {
				xtype: 'button',
				width: '100%',
				text: item.title,
				reference: reference,
				handler: 'onMenuItemClick',
			}
			menuItem = menuGroup.add(menuItem);
		}
		var referencePanel = this.getActionPanelReference(groupName);
		var actionPanel = this.lookup(referencePanel);
		if (item.store && item.storeName) {
			if (!this.vm.getStore(item.storeName)) {
				if (item.storeSingleton) {
					
				}
				else {
					this.vm.createStore(item.storeName,
						{
							xclass: item.store
						},
						{
							genericStoreDataChanged: 'genericStoreDataChanged'
						}
					);
				}
				
				var store = this.get(item.storeName);
				if (item.model) {
					var storeIdStart = Ext.create(item.model).storeIdStart;
					store.storeId = storeIdStart + crypto.randomUUID();
					Ext.StoreMgr.register(store);
				}

			}

		}
		actionPanel.getController().addSubPanel(item.title, item.xclass);

	},
	// #region Categories
	onExpandAllCategoriesClick: function () {
		var tree = this.lookup('treeCategories')
		var toolbar = this.lookup('tbar');
		toolbar.disable();

		tree.expandAll(function () {
			toolbar.enable();
		});
	},

	onCollapseAllCategoriesClick: function () {
		var tree = this.lookup('treeCategories')
		var toolbar = this.lookup('tbar');
		toolbar.disable();
		tree.collapseAll(function () {
			toolbar.enable();
		});
	},

	onAddCategoryClick: function () {
		var leftMenu = this.lookup("leftMenu");
		var editCategory = this.lookup("editCategoryForm");



		var category = this.get("selectedCategory");
		parent_uuid = null;
		var categoryStore = this.get("categoryStore");
		var children = categoryStore.getRootNode().childNodes;

		if (category) {
			parent_uuid = category.get("uuid");
			if (parent_uuid) {
				children = categoryStore.findRecord("uuid", parent_uuid).get("children");
			}

		}
		var order = children.length + 1;
		var newCategory = Ext.create('MrG.model.CategoryModel', {
			uuid: crypto.randomUUID(),
			order: order,
			system: false,
			parent_uuid: parent_uuid
		})
		this.set("editCategory", newCategory);

		leftMenu.setActiveItem(editCategory);
	},
	onEditCategoryClick: function () {
		var leftMenu = this.lookup("leftMenu");
		var editCategory = this.lookup("editCategoryForm");
		this.clearEditCategory();
		var category = this.get("selectedCategory");
		this.set("editCategory", category.clone());


		console.log("onAddCategoryClick", arguments);

		leftMenu.setActiveItem(editCategory);
	},
	cancelEditCategory: function () {
		var leftMenu = this.lookup("leftMenu");
		var editCategory = this.lookup("menuPanel");
		this.clearEditCategory();
		leftMenu.setActiveItem(editCategory);
	},
	clearEditCategory: function () {
		this.set("editCategory", null);
	},
	saveCategory: function (ctr, silent) {
		var store = this.get("categoryStore");
		var me = this;
		var ob = this.get("editCategory");
		if (ctr && ctr.$className == 'MrG.model.CategoryModel')
			ob = ctr;
		ob.save({
			success: function () {
				if (!silent)
					store.reload();
				me.cancelEditCategory();
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Could not save category.');
			},
		});

	},

	onDeleteCategoryClick: function () {
		var me = this;
		var category = this.get("selectedCategory");
		var text = category.get("name");
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete the ' + text + ' category ?',
			function (answer) {
				if (answer == 'yes') {
					me.deleteCategoryInternal(category);
				}
			});

	},
	deleteCategoryInternal: function (category) {
		var store = this.get("categoryStore");
		category.erase({
			success: function () {
				store.reload();
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Could not delete category.');
			},
		});


	},
	assignWorkflowToCategory: function (targetNode, draggedData, targetRecord) {
		var category_uuid = targetRecord.get('uuid');
		draggedData.records.forEach(function (record) {
			record.set("category_uuid", category_uuid);
			record.save();
		});
		var workflowStore = this.get("workflowStore");
		workflowStore.reload();
	},



	activeCategoryChangedInternal: function () {
		var row = this.get("selectedCategory");
		if (row) {
			var categoryId = row.get("uuid");
			if (categoryId == "" || categoryId == "00000000-0002-0000-0000-000000000000") {
				this.vm.set("categoryFilter", null);
			}
			else if (categoryId == "00000000-0001-0000-0000-000000000000") {
				this.vm.set("categoryFilter", function (record) {
					return record.get("favourite");
				});
			}
			else if (categoryId == "00000000-0003-0000-0000-000000000000") {
				this.vm.set("categoryFilter", function (record) {
					return !record.get("category_uuid");
				});
			}
			else {
				var categories = this.getAllCategoryIds(categoryId);
				this.vm.set("categoryFilter", function (record) {
					return categories.indexOf(record.get("category_uuid")) >= 0;
				});
			}

			this.lookup('workflowGrid').getController().applyFilters();
		}

	},
	activeCategoryChanged: function (ctrl, rows) {
		var row = rows[0];
		this.vm.set("selectedCategory", row);
		this.activeCategoryChangedInternal();
	},
	getAllCategoryIds: function (categoryId) {
		var me = this;
		var categories = [categoryId];

		var categoryStore = this.vm.get("categoryStore");
		categoryStore.getData().items.forEach(function (rec) {
			if (!categoryId || rec.get("parent_uuid") == categoryId) {
				var uuid = rec.get("uuid");
				if (!uuid) return;
				var subCategories = me.getAllCategoryIds(rec.get("uuid"));
				categories = categories.concat(subCategories);
			}
		});
		return categories;
	},
	categoryStoreDataLoaded: false,
	categoryStoreDataChanged: function (store) {

		if (store.getTotalCount() > 0)
			this.categoryStoreDataLoaded = true;
		var tree = this.lookup("treeCategories");
		if (this.categoryStoreDataLoaded) {
			var root = store.getRootNode();
			this.checkOrderCategories(root);
		}

		this.checkAllStoresLoaded();
	},
	checkOrderCategories: function (node) {
		var i = 1;
		var me = this;
		var changed = false;
		//TODO: fix bug about dragging above system items, right now i can't
		node.childNodes.forEach(function (child) {
			if (child.get("order") != i && child.get("uuid").indexOf("00000000") != 0) {
				child.set("order", i)
				me.saveCategory(child, true);
				changed = true;
			}
			me.checkOrderCategories(child);
			i++;
		})
		if (changed) {
			var store = this.get("categoryStore");
			store.reload();
		}

	},
	// #endregion

	prevSearchFilter: null,
	prevCategoryFilter: null,



	onCategoriesExpand: function () {
		this.lookup("rightMenu").setActiveItem(this.lookup('workflowGrid'));
		this.set("actionTitle", "Workflows");
	},
	onOtherMenuExpand: function (menu) {
		var title = menu.getTitle();
		var rightMenu = this.lookup("rightMenu");
		var reference = this.getActionPanelReference(title);
		rightMenu.setActiveItem(this.lookup(reference));
	},
	setActiveItem: function (reference, title) {
		this.lookup("rightMenu").setActiveItem(this.lookup(reference));
		this.set("actionTitle", title)
	},



	getActionPanelReference: function (name) {
		return name + "_ActionPanel";
	},
	getMenuGroupReference: function (name) {
		return name + "_MenuGroup";
	},
	getMenuGroupItemReference: function (groupName, name) {
		return groupName + "_" + name + "_MenuItem";
	},
	addMenuGroup: function (group) {
		var name = group.title;
		var reference = this.getMenuGroupReference(name);
		var menuGroup = this.lookup(reference);
		if (!menuGroup) {
			menuGroup = {
				xtype: 'panel',
				reference: reference,
				title: name,
				listeners: {
					expand: 'onOtherMenuExpand'
				},
				items: []
			}
			menuGroup = this.lookup("menuPanel").add(menuGroup);
		}
		var referencePanel = this.getActionPanelReference(name);
		var actionPanel = this.lookup(referencePanel);
		if (!actionPanel) {
			actionPanel = {
				xclass: 'MrG.main.view.ActionPanelV',
				reference: referencePanel,
				title: name,
				listeners: {
					activeNavigationItemChanged: 'onActiveNavigationItemChanged',
					newGridItem: 'newGridItem',
					openFileGridItem: 'openFileGridItem',
					openGridItem: 'openGridItem',

				}
			}
			actionPanel = this.lookup("rightMenu").add(actionPanel);
		}

		return menuGroup;
	},
	onActiveNavigationItemChanged: function (groupName, itemItlte) {
		var reference = this.getMenuGroupItemReference(groupName, itemItlte);
		var menuItem = this.lookup(reference);
		var menuGroup = this.lookup(this.getMenuGroupReference(groupName));
		menuGroup.items.items.forEach(function (item) {
			if (item.xtype == 'button') {
				item.setPressed(false);
			}
		});
		if (menuItem) {
			menuItem.setPressed(true);
		}
	},

	onMenuItemClick: function (btn) {
		var groupName = btn.up().getTitle();
		var referencePanel = this.getActionPanelReference(groupName);
		var actionPanel = this.lookup(referencePanel);
		actionPanel.getController().setActiveSubPanel(btn.getText());
	},
	openWorkflowInternal: function (workflow) {
		if (!workflow) return;
		var focusOnNewTab = this.vm.get("focusOnNewTab");
		var categoryStore = this.get("categoryStore");
		var category = categoryStore.findRecord("uuid", workflow.get("category_uuid"));
		this.fireViewEventArgs("openWorkflow", [workflow.copy(), category, focusOnNewTab]);
		var closeActionsAfterOpen = this.vm.get("closeActionsAfterOpen");
		if (closeActionsAfterOpen) {
			this.view.close();
		}
	},
	openGridItem: function (type, groupType, gridItem) {
		if (type == "workflow") {
			this.openWorkflowInternal(gridItem);
			return;
		}
		this.openItemInternal(type, groupType, gridItem)
	},
	openItemInternal: function (type, groupType, object) {
		var focusOnNewTab = this.vm.get("focusOnNewTab");
		this.fireViewEventArgs("openItem", [type, groupType, object.copy(), focusOnNewTab]);
		var closeActionsAfterOpen = this.vm.get("closeActionsAfterOpen");
		if (closeActionsAfterOpen) {
			this.view.close();
		}
	},
	getConfigForType: function (type, group) {
		var group = this.get("extraMenuItems").find(a => a.title == group);
		if (!group) return null;
		var item = group.items.find(a => a.title == type);
		return item;
	},
	newGridItem: function (internalType, type, groupType) {
		if (!type) return;
		if (internalType == "workflow") {
			this.newWorkflow();
			return;
		}
		var conf = this.getConfigForType(type, groupType);
		if (!conf) {
			console.log("Unknown type: " + type, groupType);
		}

		if (!this.newItem(type, groupType, conf.model, conf.newItem)) {
			console.log("Unknown type: " + type)
		}

	},
	newItem: function (type, groupType, model, newTemplate) {
		newTemplate.uuid = crypto.randomUUID();
		var newRecord = Ext.create(model, newTemplate);
		this.openItemInternal(type, groupType, newRecord)
	},
	newWorkflow: function () {
		var selectedCategory = this.get("selectedCategory");
		var selectedCategory_uuid = selectedCategory ? selectedCategory.get("uuid") : null;
		var newRecord = Ext.create('MrG.model.WorkflowModel', {
			uuid: crypto.randomUUID(),
			name: 'New workflow',
			category_uuid: selectedCategory_uuid,
			times_used: 0,
			contents: null,
		});
		this.openWorkflowInternal(newRecord);
	},
	openFileGridItem: function (internalType, type, groupType) {
		if (internalType == "workflow") {
			this.openFileWorkflow();
			return;
		}
		var conf = this.getConfigForType(type, groupType)
		if (!conf) {
			console.log("Unknown type: " + type, groupType);
		}

		this.openFileItem(type, groupType, conf.extension, conf.model);
		
	},
	openFileItem: function (type, groupType, extension, model) {
		var me = this;
		var doc = document;
		var fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = extension;
		fileInput.onchange = function () {
			var file = fileInput.files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				var contents = e.target.result;
				var data = JSON.parse(contents);
				data.uuid = crypto.randomUUID();
				var item = Ext.create(model, data);
				me.openItemInternal(type, groupType, item);
			}
			reader.readAsText(file);
		}
		fileInput.click();
	},

	openFileWorkflow: function () {
		var selectedCategory = this.get("selectedCategory");
		var selectedCategory_uuid = selectedCategory ? selectedCategory.get("uuid") : null;
		
		var me = this;
		var doc = document;
		var fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = ".mrgw";
		fileInput.onchange = function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
				var contents = e.target.result;
				var data = JSON.parse(contents);
				data.category_uuid = selectedCategory_uuid;
				data.uuid = crypto.randomUUID();
                var workflow = Ext.create('MrG.model.WorkflowModel', data);
				me.openWorkflowInternal(workflow);
				//remove file input
				
            }
            reader.readAsText(file);
		}
		fileInput.click();
	},
	
	
	workflowStoreDataLoaded: false,
	workflowStoreDataChanged: function (store) {
		store.getData().items.filter(a => a.dirty).forEach(a => a.save());
		this.workflowStoreDataLoaded = true;
		this.checkAllStoresLoaded();
	},
	genericStoreDataChanged: function (store) {
		store.getData().items.filter(a=>a.dirty).forEach(a=>a.save());
	},


	
	checkAllStoresLoaded: function () {
		if (this.workflowStoreDataLoaded && this.categoryStoreDataLoaded) {
			this.view.setMasked(false);
			//this.updateTags();
			
			
			////for testing
			//var me = this;
			//setTimeout(function () {
			//	var store = me.get("workflowStore");
			//	me.openWorkflowInternal(store.first());
			//},100)

			var me = this;
			//setTimeout(function () {
			//	var store = me.get("workflowStore");
			//	me.newApi();
			//},100)
		}
			
	}
});
