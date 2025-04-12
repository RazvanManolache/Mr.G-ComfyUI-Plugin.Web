Ext.define('MrG.main.vm.InstallPackageVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {
        installing: false,
        fieldsValid:false,
        record: null,
        hideModifying: true,
        fieldsSelection: false,
        failureGettingStatus: 0,
        //don't really need it, but otherwise the options won't hide
        readOnlyWorkflow: false,
        progress: {
            downloadedFile: "",
            downloadFileSize: 0,
            downloadedFileSize: 0,
            totalDownloadedFiles: 0,
            totalFiles: 0,
            status: "Installing",
            error: ""
        }
    },
    formulas: {
        finishedInstalling: function (get) {
            var progress = get('progress');
            var failureGettingStatus = get("failureGettingStatus");
            if (progress.status == "Installed") return true;
            if (progress.error) return true;
            if (failureGettingStatus > 3) return true;
            return false;
        },
      
        fileDownloadPercentage: function (get) {
            var progress = get('progress');
            if(progress.downloadFileSize == 0) return 0;
            return progress.downloadedFileSize / progress.downloadFileSize;
        },
        hasFilesToDownload: function (get) {
            var progress = get('progress');
            return progress.totalFiles > 0;
        },
        fileDownloadText: function (get) {
            var progress = get('progress');            
            return progress.downloadedFile + " (" + formatSize(progress.downloadedFileSize) + "/" + formatSize(progress.downloadFileSize) + ")";
        },
        installStatus: function (get) {
            var progress = get('progress');
            if (progress.status && progress.status != "running") {
                return progress.status;
            }
            if (progress.totalFiles > progress.totalDownloadedFiles) { 
                return "Downloading files " + (progress.totalDownloadedFiles) + "/" + progress.totalFiles;
            }
            return progress.totalDownloadedFiles+ " files downloaded."
        },
        parameters: function (get) {
            return JSON.parse(get('record').get("parameters"));
        },
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