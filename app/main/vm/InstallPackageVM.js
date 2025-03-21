Ext.define('MrG.main.vm.InstallPackageVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {
        record: null
    },
    formulas: {
        settings: function (get) {
            return JSON.parse(get('record').get("settings"));
        },
        workflows: function (get) {
            return get('settings').workflows ?? null;
        },
        apis: function (get) {
            return get('settings').apis ?? null;
        },
        jobs: function (get) {
            return get('settings').jobs ?? null;
        },
        hasWorkflows: function (get) {
            var workflows = get('workflows');
            return workflows && workflows.length > 0;
        },
        hasApis: function (get) {
            var apis = get('apis');
            return apis && apis.length > 0;
        },
        hasJobs: function (get) {
            var jobs = get('jobs');
            return jobs && jobs.length > 0;
        }

    },
    stores: {
        workflowStore: {
            model: 'MrG.model.WorkflowModel',
        },
        apiStore: {
            model: 'MrG.model.ApiModel',
        },
        jobsStore: {
            model: 'MrG.model.JobsModel',
        }
    }
});