Ext.define('MrG.node.view.Reroute', {
    extend: 'MrG.base.view.BaseNodeV',
    _nodeDefinition: {
        nodeTitle: 'Reroute',
        className: 'Reroute',
        comfyCategory: 'utils',
        fieldReferences: ["fld-In", "fld-Out"]

    },
    //TODO: make reroute have restrictions, if one side is connected the other one has to be connected to same type
    _nodeConfig: {

    },
    viewModel: {
        xclass: 'MrG.node.vm.RerouteVM'
    },
    controller: {
        xclass: 'MrG.node.ctrl.RerouteC'
    },
    items: [
        blocksInterpreter.createField('In', ['*'], 'Reroute'),
        blocksInterpreter.createField('Out', ['*', 'output'], 'Reroute'),
    ]
});