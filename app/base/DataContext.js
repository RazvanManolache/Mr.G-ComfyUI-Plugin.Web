(function (global, $data, undefined) {

    function registerEdmTypes() {

        function Edm_Boolean() { };
        $data.Container.registerType('Edm.Boolean', Edm_Boolean);
        $data.Container.mapType(Edm_Boolean, $data.Boolean);

        function Edm_Binary() { };
        $data.Container.registerType('Edm.Binary', Edm_Binary);
        $data.Container.mapType(Edm_Binary, $data.Blob);

        function Edm_DateTime() { };
        $data.Container.registerType('Edm.DateTime', Edm_DateTime);
        $data.Container.mapType(Edm_DateTime, $data.Date);

        function Edm_DateTimeOffset() { };
        $data.Container.registerType('Edm.DateTimeOffset', Edm_DateTimeOffset);
        $data.Container.mapType(Edm_DateTimeOffset, $data.Integer);

        function Edm_Time() { };
        $data.Container.registerType('Edm.Time', Edm_Time);
        $data.Container.mapType(Edm_Time, $data.Integer);

        function Edm_Decimal() { };
        $data.Container.registerType('Edm.Decimal', Edm_Decimal);
        $data.Container.mapType(Edm_Decimal, $data.Number);

        function Edm_Single() { };
        $data.Container.registerType('Edm.Single', Edm_Single);
        $data.Container.mapType(Edm_Single, $data.Number);

        function Edm_Double() { };
        $data.Container.registerType('Edm.Double', Edm_Double);
        $data.Container.mapType(Edm_Double, $data.Number);

        function Edm_Guid() { };
        $data.Container.registerType('Edm.Guid', Edm_Guid);
        $data.Container.mapType(Edm_Guid, $data.String);

        function Edm_Int16() { };
        $data.Container.registerType('Edm.Int16', Edm_Int16);
        $data.Container.mapType(Edm_Int16, $data.Integer);

        function Edm_Int32() { };
        $data.Container.registerType('Edm.Int32', Edm_Int32);
        $data.Container.mapType(Edm_Int32, $data.Integer);

        function Edm_Int64() { };
        $data.Container.registerType('Edm.Int64', Edm_Int64);
        $data.Container.mapType(Edm_Int64, $data.Integer);

        function Edm_Byte() { };
        $data.Container.registerType('Edm.Byte', Edm_Byte);
        $data.Container.mapType(Edm_Byte, $data.Integer);

        function Edm_String() { };
        $data.Container.registerType('Edm.String', Edm_String);
        $data.Container.mapType(Edm_String, $data.String);

    };
    registerEdmTypes();
    var nameSpace = '$data.Entities.';
  

    $data.Entity.extend(nameSpace + 'BaseModel', {
        'Uuid': { 'nullable': false, 'required': true, 'key': true, 'type': 'Edm.String' },
        'CreateDate': { 'nullable': false, 'required': true, 'type': 'Edm.DateTime' },
        'UpdateDate': { 'nullable': false, 'required': true, 'type': 'Edm.DateTime' },
    });


    $data.Entities.BaseModel.extend(nameSpace + 'NamedObject', {
        'Name': { 'nullable': false, 'required': true, 'type': 'Edm.String' },
        'Description': { 'type': 'Edm.String' },
        'Tags': { 'type': 'Edm.String' },
    });

    $data.Entities.NamedObject.extend(nameSpace + 'PackageRepositories', {
        'Url': { 'type': 'Edm.String' },
        'System': { 'nullable': false, 'required': true, 'type': 'Edm.Boolean' },
        'Packages': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Packages', 'inverseProperty': 'PackageRepository' }, // Packages PackageRepository PackageRepositoryUuid - PackageRepositories PackageRepositories Uuid 		
    });
    

    $data.Entities.NamedObject.extend(nameSpace + 'Packages', {
        'Version': { 'type': 'Edm.String' },
        'Repository': { 'type': 'Edm.String' },
        'Branch': { 'type': 'Edm.String' },
        'Commit': { 'type': 'Edm.String' },
        'Parameters': { 'type': 'Edm.String' },
        'Settings': { 'type': 'Edm.String' },
        'PackageRepositoryUuid': { 'type': 'Edm.String' },
        'PackageRepository': { 'type': nameSpace + 'PackageRepositories', 'inverseProperty': 'Packages' }, // Packages PackageRepository PackageRepositoryUuid - PackageRepositories PackageRepositories Uuid 		
        'Workflows': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Workflows' },
        'Jobs': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Jobs' },
        'Apis': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Api' },
    });


    $data.Entities.NamedObject.extend(nameSpace + 'Categories', {
        'Icon': { 'type': 'Edm.String' },
        'System': { 'nullable': false, 'required': true, 'type': 'Edm.Boolean' },
        'Order': { 'nullable': false, 'required': true, 'type': 'Edm.Int32' },
        'ParentUuid': { 'type': 'Edm.String' },
        'Parent': { 'type': nameSpace + 'Categories', 'inverseProperty': 'Children' }, // Categories Parent ParentUuid - Categories Categories Uuid 		
        'Children': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Categories' },
        'Workflows': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Workflows' },
    });

    $data.Entities.NamedObject.extend(nameSpace + 'Workflows', {
        'Rating': { 'type': 'Edm.Int16' },
        'Order': { 'type': 'Edm.Int32' },
        'Favourite': { 'type': 'Edm.Boolean' },
        'Hidden': { 'type': 'Edm.Boolean' },
        'System': { 'type': 'Edm.Boolean' },
        'TimesUsed': { 'type': 'Edm.Int32' },
        'Contents': { 'type': 'Edm.String' },
        'NodesValues': { 'type': 'Edm.String' },
        'Settings': { 'type': 'Edm.String' },
        'RunValues': { 'type': 'Edm.String' },
        'PackageUuid': { 'type': 'Edm.String' },
        'Package': { 'type': nameSpace + 'Packages', 'inverseProperty': 'Workflows' }, // Workflows Package PackageUuid - Packages Packages Uuid 		
        'CategoryUuid': { 'type': 'Edm.String' },
        'Category': { 'type': nameSpace + 'Categories', 'inverseProperty': 'Workflows' }, // Workflows Category CategoryUuid - Categories Categories Uuid 		
        'QueueRuns': { 'type': $data.EntitySet, 'elementType': nameSpace + 'QueueRuns' },

    });
    


    $data.Entities.BaseModel.extend(nameSpace + 'QueueSteps', {
        'QueuedRunUuid': { 'type': 'Edm.String' },
        'RunValue': { 'type': 'Edm.String' },
        'Status': { 'type': 'Edm.String' },
        'Step': { 'type': 'Edm.Int32' },
        'Server': { 'type': 'Edm.Int32' },
        'Retry': { 'type': 'Edm.Int32' },
        'Error': { 'type': 'Edm.String' },
        'StartDate': { 'type': 'Edm.DateTime' },
        'EndDate': { 'type': 'Edm.DateTime' },
        'QueuedRun': { 'type': nameSpace + 'QueueRuns', 'inverseProperty': 'QueueSteps' }, // QueueSteps QueuedRun QueuedRunUuid - QueueRuns QueueRuns Uuid 		
        'Outputs': { 'type': $data.EntitySet, 'elementType': nameSpace + 'Outputs' },
    });


    $data.Entities.BaseModel.extend(nameSpace + 'QueueRuns', {
        'WorkflowUuid': { 'type': 'Edm.String' },
        'ApiUuid': { 'type': 'Edm.String' },
        'JobUuid': { 'type': 'Edm.String' },
        'SecondaryUuid': { 'type': 'Edm.String' },
        'ClientId': { 'type': 'Edm.String' },
        'RunSettings': { 'type': 'Edm.String' },
        'Total': { 'type': 'Edm.Int32' },
        'Contents': { 'type': 'Edm.String' },
        'RunType': { 'type': 'Edm.String' },
        'Current': { 'type': 'Edm.Int32' },
        'Order': { 'type': 'Edm.Int64' },
        'Status': { 'type': 'Edm.String' },
        'StartDate': { 'type': 'Edm.DateTime' },
        'EndDate': { 'type': 'Edm.DateTime' },
        'NodesValues': { 'type': 'Edm.String' },
        'RunValues': { 'type': 'Edm.String' },
        'CurrentValues': { 'type': 'Edm.String' },
        'Workflow': { 'type': nameSpace + 'Workflows', 'inverseProperty': 'QueueRuns' }, // QueueRuns Workflow WorkflowUuid - Workflows Workflows Uuid 		
        'Api': { 'type': nameSpace + 'Api', 'inverseProperty': 'QueueRuns' }, // QueueRuns Api ApiUuid - Api Api Uuid 		
        'Job': { 'type': nameSpace + 'Jobs', 'inverseProperty': 'QueueRuns' }, // QueueRuns Job JobUuid - Jobs Jobs Uuid 		
        'QueueSteps': { 'type': $data.EntitySet, 'elementType': nameSpace + 'QueueSteps' },
    });

    $data.Entities.BaseModel.extend(nameSpace + 'Outputs', {
        'Value': { 'type': 'Edm.String' },
        'Order': { 'type': 'Edm.Int32' },
        'NodeId': { 'type': 'Edm.Int32' },
        'OutputType': { 'type': 'Edm.String' },
        'Rating': { 'type': 'Edm.Int16' },
        'QueueStepUuid': { 'type': 'Edm.String' },
        'QueueStep': { 'type': nameSpace + 'QueueSteps', 'inverseProperty': 'Outputs' }, // Outputs QueueStep QueueStepUuid - QueueSteps QueueSteps Uuid 		
        'OutputLinks': { 'type': $data.EntitySet, 'elementType': nameSpace + 'OutputLinks' },
    });


    $data.Entities.BaseModel.extend(nameSpace + 'OutputLinks', {
        'OutputUuid': { 'type': 'Edm.String' },
        'Output': { 'type': nameSpace + 'Outputs', 'inverseProperty': 'OutputLinks' }, // OutputLinks Output OutputUuid - Outputs Outputs Uuid 		
        'SelectionItemUuid': { 'type': 'Edm.String' },
        'SelectionItem': { 'type': nameSpace + 'SelectionItems', 'inverseProperty': 'OutputLinks' }, // OutputLinks SelectionItem SelectionItemUuid - SelectionItems SelectionItems Uuid 		
    });

    $data.Entities.NamedObject.extend(nameSpace + 'Settings', {
        'SettingType': { 'type': 'Edm.String' },
        'Value': { 'type': 'Edm.String' },
        'ValueType': { 'type': 'Edm.String' },
        'ValueTypeOptions': { 'type': 'Edm.String' },
    });

    $data.Entity.extend(nameSpace + 'NamedPackageObject', {
        'PackageUuid': { 'type': 'Edm.String' },
        'CategoryUuid': { 'type': 'Edm.String' },
    });


    $data.Entities.NamedPackageObject.extend(nameSpace + 'WorkflowExtenders', {
        'Workflows': { 'type': 'Edm.String' },
        'Enabled': { 'type': 'Edm.Boolean' },
        'Runs': { 'type': 'Edm.Int32' },
    });

    $data.Entities.WorkflowExtenders.extend(nameSpace + 'Jobs', {
        'Cron': { 'nullable': false, 'required': true, 'type': 'Edm.String' },
        'Package': { 'type': nameSpace + 'Packages', 'inverseProperty': 'Jobs' }, // Jobs Package PackageUuid - Packages Packages Uuid 		
        'QueueRuns': { 'type': $data.EntitySet, 'elementType': nameSpace + 'QueueRuns' },
    });


    $data.Entities.WorkflowExtenders.extend(nameSpace + 'Api', {
        'Endpoint': { 'nullable': false, 'required': true, 'type': 'Edm.String' },
        'Parameters': { 'type': 'Edm.String' },
        'Package': { 'type': nameSpace + 'Packages', 'inverseProperty': 'Apis' }, // Api Package PackageUuid - Packages Packages Uuid 		
        'QueueRuns': { 'type': $data.EntitySet, 'elementType': nameSpace + 'QueueRuns' },
    });


    $data.Entities.NamedObject.extend(nameSpace + 'SelectionItems', {
        'Alias': { 'nullable': false, 'required': true, 'type': 'Edm.String' },
        'ComfyName': { 'type': 'Edm.String' },
        'Comments': { 'type': 'Edm.String' },
        'TimesUsed': { 'type': 'Edm.Int32' },
        'Rating': { 'type': 'Edm.Int16' },
        'Text': { 'type': 'Edm.String' },
        'Hidden': { 'type': 'Edm.Boolean' },
        'Favorite': { 'type': 'Edm.Boolean' },
        'Field': { 'type': 'Edm.String' },
        'FieldType': { 'type': 'Edm.String' },
        'NodeType': { 'type': 'Edm.String' },
        'Path': { 'type': 'Edm.String' },
        'Image': { 'type': 'Edm.String' },
        'Thumbnail': { 'type': 'Edm.String' },
        'OutputLinks': { 'type': $data.EntitySet, 'elementType': nameSpace + 'OutputLinks' },
    });



	$data.EntityContext.extend('$data.Default.Container', {        
        'OutputLinks': { type: $data.EntitySet, elementType: $data.Entities.OutputLinks },
        'SelectionItems': { type: $data.EntitySet, elementType: $data.Entities.SelectionItems },
        'Api': { type: $data.EntitySet, elementType: $data.Entities.Api },
        'Jobs': { type: $data.EntitySet, elementType: $data.Entities.Jobs },
        'WorkflowExtenders': { type: $data.EntitySet, elementType: $data.Entities.WorkflowExtenders },
        'NamedPackageObject': { type: $data.EntitySet, elementType: $data.Entities.NamedPackageObject },
        'Settings': { type: $data.EntitySet, elementType: $data.Entities.Settings },
        'OutputLinks': { type: $data.EntitySet, elementType: $data.Entities.OutputLinks },
        'QueueRuns': { type: $data.EntitySet, elementType: $data.Entities.QueueRuns },
        'QueueSteps': { type: $data.EntitySet, elementType: $data.Entities.QueueSteps },
        'Workflows': { type: $data.EntitySet, elementType: $data.Entities.Workflows },
        'Categories': { type: $data.EntitySet, elementType: $data.Entities.Categories },
        'Packages': { type: $data.EntitySet, elementType: $data.Entities.Packages },
        'PackageRepositories': { type: $data.EntitySet, elementType: $data.Entities.PackageRepositories },
        'NamedObject': { type: $data.EntitySet, elementType: $data.Entities.NamedObject },
        'BaseModel': { type: $data.EntitySet, elementType: $data.Entities.BaseModel },


		
	});

	$data.generatedContexts = $data.generatedContexts || [];
	$data.generatedContexts.push($data.Default.Container);
})(this, $data);

function newContext() {
    var ctx = new $data.Default.Container({ name: 'oData', oDataServiceHost: "/mrgdata" });
    ctx.trackChanges = true;
    return ctx;
}

ctx = newContext()