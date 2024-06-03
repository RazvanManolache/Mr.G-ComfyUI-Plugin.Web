Ext.define('MrG.main.ctrl.ActionListC', {
	extend: 'MrG.base.ctrl.BasePanelC',	
	init: function () {
		this.callParent(arguments);
		this.view.setMasked(true);

		var tree = this.lookup('treeCategories');

		var categoryStore = this.get("categoryStore");
		categoryStore.storeId = "categoryStore_"+crypto.randomUUID();
		Ext.StoreMgr.register(categoryStore);

		var workflowStore = this.get("workflowStore");
		workflowStore.storeId = "workflowStore_"+crypto.randomUUID();
		Ext.StoreMgr.register(workflowStore);

		var apiStore = this.get("apiStore");
		apiStore.storeId = "apiStore_"+crypto.randomUUID();
		Ext.StoreMgr.register(apiStore);

		var jobsStore = this.get("jobsStore");
		jobsStore.storeId = "jobsStore_"+crypto.randomUUID();
		Ext.StoreMgr.register(jobsStore);

		//this.vm.bind("{searchText}", function (val) { console.log(val) }, this);
		
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
	onSettingsExpand: function () {
		if (this.get("apisPressed")) {
			this.lookup("rightMenu").setActiveItem(this.lookup('apiGrid'));
			this.set("actionTitle", "APIs")
		}
			
		if (this.get("jobsPressed")) {
			this.lookup("rightMenu").setActiveItem(this.lookup('jobsGrid'));
			this.set("actionTitle", "Jobs")
		}
			
		console.log(arguments);
	},
	onQueueExpand: function () {
		console.log(arguments);
	},
	onToolsExpand: function () {
		console.log(arguments);
	},
	onOptionsClick: function () {
		this.set("optionsPressed", true);
        this.set("apisPressed", false);
		this.set("jobsPressed", false);		
		this.onSettingsExpand();
	},
	onApisClick: function () {
        this.set("optionsPressed", false);
        this.set("apisPressed", true);
		this.set("jobsPressed", false);
		this.onSettingsExpand();
	},
	onJobsClick: function () {
        this.set("optionsPressed", false);
        this.set("apisPressed", false);
		this.set("jobsPressed", true);
		this.onSettingsExpand();
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
	openGridItem: function (type, gridItem) {
		switch (type) {
			case "workflow":
				this.openWorkflowInternal(gridItem);
				break;
			case "api":
				this.openApiInternal(gridItem);
				break;
			case "jobs":
				this.openJobInternal(gridItem);
				break;
			default:
				console.log("Unknown type: " + type)
		}
	},
	openApiInternal: function (api) {
		var focusOnNewTab = this.vm.get("focusOnNewTab");
        this.fireViewEventArgs("openApi", [api.copy(), focusOnNewTab]);
        var closeActionsAfterOpen = this.vm.get("closeActionsAfterOpen");
        if (closeActionsAfterOpen) {
            this.view.close();
        }
	},
	openJobInternal: function (job) {
        var focusOnNewTab = this.vm.get("focusOnNewTab");
        this.fireViewEventArgs("openJob", [job.copy(), focusOnNewTab]);
        var closeActionsAfterOpen = this.vm.get("closeActionsAfterOpen");
        if (closeActionsAfterOpen) {
            this.view.close();
        }
    },
	newGridItem: function (type) {
		switch (type) {
			case "workflow":
				this.newWorkflow();
				break;
			case "api":
				this.newApi();
				break;
			case "jobs":
				this.newJob();
                break;
			default:
				console.log("Unknown type: " + type)
		}
	},
	newJob: function () {
		var newRecord = Ext.create('MrG.model.JobsModel', {
            uuid: crypto.randomUUID(),
			name: 'New job',
			cron: '0 0 0 * *',
        });
        this.openJobInternal(newRecord);
    },
	newApi: function () {
		var newRecord = Ext.create('MrG.model.ApiModel', {
            uuid: crypto.randomUUID(),
            name: 'New api'
        });
        this.openApiInternal(newRecord);
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
	openFileGridItem: function (type) {
		switch (type) {
			case "workflow":
				this.openFileWorkflow();
				break;
			case "api":
				this.openFileApi();
				break;
			case "job":
				this.openFileJob();
                break;
			default:
				console.log("Unknown type: " + type)
		}
	},
	openFileJob: function () {
        var me = this;
        var doc = document;
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = ".mrgj";
        fileInput.onchange = function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var contents = e.target.result;
                var data = JSON.parse(contents);
                data.uuid = crypto.randomUUID();
                var job = Ext.create('MrG.model.JobModel', data);
                me.openJobInternal(job);
                //remove file input
            }
            reader.readAsText(file);
        }
        fileInput.click();
    },
	openFileApi: function () {
        var me = this;
        var doc = document;
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = ".mrga";
        fileInput.onchange = function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var contents = e.target.result;
                var data = JSON.parse(contents);
                data.uuid = crypto.randomUUID();
                var api = Ext.create('MrG.model.ApiModel', data);
                me.openApiInternal(api);
                //remove file input
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
		store.getData().items.filter(a=>a.dirty).forEach(a=>a.save());
		if (store.getTotalCount() > 0)
			this.workflowStoreDataLoaded = true;
		this.checkAllStoresLoaded();
	},
	apiStoreDataChanged: function (store) {
		store.getData().items.filter(a=>a.dirty).forEach(a=>a.save())		
	},
	jobsStoreDataChanged: function (store) {
		store.getData().items.filter(a=>a.dirty).forEach(a=>a.save())
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
