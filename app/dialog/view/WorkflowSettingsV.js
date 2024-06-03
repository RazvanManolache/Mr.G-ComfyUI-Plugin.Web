Ext.define('MrG.dialog.view.WorkflowSettingsV', {
	requires: [
		'MrG.dialog.ctrl.WorkflowSettingsC',
        'MrG.dialog.vm.WorkflowSettingsVM'
	],
	extend: 'MrG.base.view.BasePanelV',
	layout: 'vbox',
	modal: true,
	controller: {
		xclass: 'MrG.dialog.ctrl.WorkflowSettingsC'
	},
	viewModel: {
		xclass: 'MrG.dialog.vm.WorkflowSettingsVM'
	},
	title: 'Workflow queue settings',
	width: '90%',
	margin: 20,
	maxWidth: 600,
	height: '90%',
	modal: true,
	floated: true,
	resizeable: true,
	centered: true,
	maximizable: true,
	scrollable: true,
	closable: true,

	items: [
		{
			xtype: 'container',
			bind: {
				hidden: '{numberRunsHidden}'
			},
			//title: {
			//	text: 'cnt',
			//	docked: 'left'
			//},
			layout: 'vbox',
			items: [
				{
					xtype: 'numberfield',
					label: 'Number of steps',
					bind: {
						value: '{numberOfSteps}',
						hidden: '{stepsHidden}'
					}
				},
				{
					xtype: 'numberfield',
					label: 'Number of runs',
					bind: {
						value: '{numberOfRuns}'
					}
				},
				{
					xtype: 'togglefield',
					label: 'Infinite',
					bind: {
						value: '{infinite}'
					}
				},
				{					
					xtype: 'label',
					html: 'Warning: setting to infinite means that this will be only be stopped by going to the queue and stopping it manually.',
					bind: {
						hidden: '{!infinite}'
					}
				},
				{
					xtype: 'togglefield',
					label: 'Do tuns in sequence',
					bind: {
						value: '{doRunsInSequence}',
						hidden: '{infinite || stepsHidden}'
					}
				},
				// idea that i had, not sure how it should work yet, so i skip for now
				{
					xtype: 'togglefield',
					label: 'Start from current',
					bind: {
						value: '{startFromCurrent}',
						hidden: true
					}
				},
			]
		},
		
		{
			xtype: 'container',
			layout: 'vbox',
			items: [
				{
					labelWidth: 'auto',
					xtype: 'togglefield',
					label: 'Ask for name each run',
					bind: {
						value: '{askForNameEachRun}'
					}
				},
				{
					xtype: 'textfield',
					label: 'Name of run',
					bind: {
						value: '{nameRun}'
					}
				},
				{
					xtype: 'textfield',
					label: 'Tags for run',
					bind: {
                        value: '{tagsRun}'
                    }
				},
			]
		},
		
		



	],
	bbar: [
		{
			xtype:'spacer',
		},
		{
			xtype: 'button',
			text: 'Save&Run',
			handler: 'saveAndRun',
			bind: {
                disabled: '{saveDisabled}'
            }
		},
		{
			xtype: 'button',
			text: 'Save',
			handler: 'save',
			bind: {
				disabled: '{saveDisabled}'
			}
		},
		{
			xtype: 'button',
			text: 'Cancel',
			handler: 'cancel'
		}
	]
});
