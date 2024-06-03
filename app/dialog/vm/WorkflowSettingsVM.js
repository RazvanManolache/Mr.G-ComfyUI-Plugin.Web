Ext.define('MrG.dialog.vm.WorkflowSettingsVM', {
	extend: 'MrG.base.vm.BasePanelVM',
	data: {
		workflowSettings: ['runMode', 'numberOfRuns', 'doRunsInSequence', 'infinite', 'askForNameEachRun', 'nameRun', 'tagsRun', 'numberOfSteps', "startFromCurrent"],

		runMode: 'q',
		startFromCurrent: false,
		numberOfRuns: 1,
		infinite: false,
		askForNameEachRun: false,
		nameRun: '',
		tagsRun: '',
		fields: [],
		numberOfSteps: 1,
		doRunsInSequence: true,
		
		origSettings: null

	},
	formulas: {
		stepsHidden: function (get) {
			return get('runMode') === 'q' || get('runMode') === 'qa';
		},
		numberRunsHidden: function (get) {
			return get('runMode') === 'lq';
		},
		startFromStartHidden: function (get) {
			return get('runMode') != 'qa';
		},
		saveDisabled: function (get) {
			return get('numberOfSteps') < 1 || get('numberOfRuns') < 1;
		}
    },
		
	

	


});