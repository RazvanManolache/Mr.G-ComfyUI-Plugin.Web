
function startUI() {
	Ext.Loader.setConfig({
		enabled: true,
		disableCaching: false
	});
	Ext.application({
		requires: [
			'MrG.main.view.LayoutV',
			'MrG.main.vm.LayoutVM',
			'MrG.main.ctrl.LayoutC',

			'MrG.main.view.ActionListV',
			'MrG.main.ctrl.ActionListC',
			'MrG.main.vm.ActionListVM',

			'MrG.main.view.ActionPanelV',
			'MrG.main.ctrl.ActionPanelC',
			'MrG.main.vm.ActionPanelVM',

			
			'MrG.dialog.view.SelectNodeV',
			'MrG.dialog.ctrl.SelectNodeC',
			'MrG.dialog.vm.SelectNodeVM',

			'MrG.model.ApiModel',
			'MrG.model.JobsModel',
			'MrG.model.RunModeModel',
			'MrG.model.ConnectorModel',
			'MrG.model.SelectListModel',
			'MrG.model.SimpleModel',
			'MrG.model.WorkflowModel',
			'MrG.model.SettingsModel',
			'MrG.model.CategoryModel',
			'MrG.model.WorkflowConfigureModel',
			'MrG.model.FieldSelectionModel',
			'MrG.model.PackageModel',
			'MrG.model.PackageRepositoryModel',

			
			'MrG.store.RunModeStore',
			'MrG.store.ConnectorStore',
			'MrG.store.SimpleStore',
			'MrG.store.SelectListStore',
			'MrG.store.SelectListMemoryStore',
			'MrG.store.CategoryStore',
			'MrG.store.WorkflowStore',
			'MrG.store.ApiStore',
			'MrG.store.JobsStore',
			'MrG.store.SettingsStore',
			'MrG.store.SelectTypeStore',
			'MrG.store.WorkflowConfigureStore',
			'MrG.store.FieldSelectionStore',
			'MrG.store.PackagesStore',
			'MrG.store.PackageRepositoryStore',
			

			
			'MrG.fields.TextArea',
			'MrG.grd.sel.NumberGrid',
			'MrG.grd.sel.TextGrid',
			'MrG.grd.sel.ListGrid',

			
			'MrG.cmp.ctrl.TagPanelC',
			'MrG.cmp.vm.TagPanelVM',
			'MrG.cmp.view.TagPanelV',
			'MrG.main.ctrl.BaseEmbedWorkflowC',			
			'MrG.main.vm.BaseEmbedWorkflowVM',
			'MrG.main.view.BaseEmbedWorkflowV',
			'MrG.main.ctrl.ApiC',
			'MrG.main.vm.ApiVM',
			'MrG.main.view.ApiV',
			'MrG.main.ctrl.JobC',
			'MrG.main.vm.JobVM',
			'MrG.main.view.JobV',

			'MrG.dialog.view.SelectWorkflowV',
			'MrG.dialog.vm.SelectWorkflowVM',
			'MrG.dialog.ctrl.SelectWorkflowC',

			'MrG.dialog.view.WorkflowSettingsV',
			'MrG.dialog.vm.WorkflowSettingsVM',
			'MrG.dialog.ctrl.WorkflowSettingsC',

			'MrG.dialog.view.StepNavigationV',
			'MrG.dialog.vm.StepNavigationVM',
			'MrG.dialog.ctrl.StepNavigationC',

			'MrG.base.view.BaseActionGridV',
			'MrG.base.vm.BaseActionGridVM',
			'MrG.base.ctrl.BaseActionGridC',

			'MrG.model.FieldOptionsModel',



			'MrG.grd.act.ctrl.WorkflowGridC',
			'MrG.grd.act.view.WorkflowGridV',
			'MrG.grd.act.vm.WorkflowGridVM',
			'MrG.grd.act.ctrl.ApiGridC',
			'MrG.grd.act.view.ApiGridV',
			'MrG.grd.act.vm.ApiGridVM',
			'MrG.grd.act.view.JobsGridV',
			'MrG.grd.act.vm.JobsGridVM',
			'MrG.grd.act.ctrl.JobsGridC',
			'MrG.grd.act.view.SettingsGridV',
			'MrG.grd.act.vm.SettingsGridVM',
			'MrG.grd.act.ctrl.SettingsGridC',
			'MrG.grd.act.view.OutputGridV',
			'MrG.grd.act.vm.OutputGridVM',
			'MrG.grd.act.ctrl.OutputGridC',
			'MrG.grd.act.view.QueueGridV',
			'MrG.grd.act.vm.QueueGridVM',
			'MrG.grd.act.ctrl.QueueGridC',
			'MrG.grd.act.view.PackagesGridV',
			'MrG.grd.act.vm.PackagesGridVM',
			'MrG.grd.act.ctrl.PackagesGridC',
			'MrG.grd.act.view.PackageRepositoriesGridV',
			'MrG.grd.act.vm.PackageRepositoriesGridVM',
			'MrG.grd.act.ctrl.PackageRepositoriesGridC',

			
			'MrG.base.view.BaseNodeV',
			'MrG.base.vm.BaseNodeVM',
			'MrG.base.ctrl.BaseNodeC',

			'MrG.main.view.WorkflowV',
			'MrG.main.vm.WorkflowVM',
			'MrG.main.ctrl.WorkflowC',

			'MrG.dialog.view.SelectListV',
			'MrG.dialog.vm.SelectListVM',
			'MrG.dialog.ctrl.SelectListC',

			'MrG.node.view.Note',
			'MrG.node.vm.NoteVM',
			'MrG.node.ctrl.NoteC',

			'MrG.node.view.Reroute',
			'MrG.node.vm.RerouteVM',
			'MrG.node.ctrl.RerouteC',

			'MrG.node.view.PrimitiveNode',
			'MrG.node.vm.PrimitiveNodeVM',
			'MrG.node.ctrl.PrimitiveNodeC',
			
		],
		name: 'MrG',
		mainView: 'MrG.main.view.LayoutV',
		paths: {
			//MrG: 'MrG'
		},
		quickTips: true,
		launch: function () {
			try {
				//console.log("Done");


			} catch (e) {
			}
		}
	});
	
}

