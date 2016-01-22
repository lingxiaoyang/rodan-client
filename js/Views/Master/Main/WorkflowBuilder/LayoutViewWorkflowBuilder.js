import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../../Configuration';
import Connection from '../../../../Models/Connection';
import Events from '../../../../Shared/Events';
import ViewWorkflow from '../Workflow/Individual/ViewWorkflow';
import LayoutViewJob from '../Job/LayoutViewJob';
import LayoutViewControlWorkflowJob from '../WorkflowJob/LayoutViewControlWorkflowJob';
import LayoutViewControlWorkflowJobGroup from '../WorkflowJobGroup/LayoutViewControlWorkflowJobGroup';
import WorkflowJob from '../../../../Models/WorkflowJob';
import InputPort from '../../../../Models/InputPort';
import OutputPort from '../../../../Models/OutputPort';

/**
 * This class represents the controller for editing a Workflow.
 */
class LayoutViewWorkflowEditor extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.addRegions({
            regionControlWorkflowUpperArea: '#region-main_workflowbuilder_control_workflow_upperarea',
            regionControlWorkflowLowerArea: '#region-main_workflowbuilder_control_workflow_lowerarea'
        });
        this._workflow = aParameters.workflow;
        this._workflowJob = null;
        this._initializeRadio();
        this._initializeViews(aParameters);

        // Clear timed events.
        this._rodanChannel.request(Events.REQUEST__CLEAR_TIMED_EVENT);

        // Load the full workflow.
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {'workflow': this._workflow});
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_DESTROY);
        this._rodanChannel.off(null, null, this);
        this._rodanChannel.stopReplying(null, null, this);
    }

    onBeforeShow()
    {
        this.regionControlWorkflowUpperArea.show(this.viewWorkflow);
        this.regionControlWorkflowLowerArea.show(this.viewControlJob);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, options => this._handleEventEditWorkflowJob(options), this);
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED, options => this._handleEventWorkflowJobGroupSelected(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_ADD, options => this._handleCommandAddWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_DELETE, options => this._handleCommandDeleteWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, options => this._handleCommandAddInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, options => this._handleCommandAddOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOW, aPass => this._handleCommandSaveWorkflow(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_SAVE, options => this._handleCommandSaveWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, () => this._handleCommandValidateWorkflow(), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView(), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, options => this._handleEventLoadWorkflow(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, options => this._handleRequestGetWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP, options => this._handleRequestGetWorkflowJobGroup(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, options => this._handleRequestGetInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT, options => this._handleRequestGetOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_CONNECTION, options => this._handleRequestGetConnection(options), this);
    }

    /**
     * Initialize views.
     */
    _initializeViews(options)
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: options.workflow});
        this.viewControlJob = new LayoutViewJob();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }

    /**
     * Handles success of workflow fetch.
     */
    _handleWorkflowLoadSuccess(workflow)
    {
        this._processWorkflow(workflow);
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(options)
    {
        this._createWorkflowJob(options.job, this._workflow);
    }

    /**
     * Handle command delete workflow job.
     */
    _handleCommandDeleteWorkflowJob(options)
    {
        this._deleteWorkflowJob(options.workflowjob);
    }

    /**
     * Handle add connection.
     */
    _handleCommandAddConnection(options)
    {
        var inputPort = this._handleRequestGetInputPort({'id': options.inputportid});
        var outputPort = this._handleRequestGetOutputPort({'id': options.outputportid});
        this._createConnection(outputPort, inputPort);
    }

    /**
     * Handle event edit workflow job.
     */
    _handleEventEditWorkflowJob(options)
    {
        this._workflowJob = this._handleRequestGetWorkflowJob(options);
        this.controlWorkflowJobView = new LayoutViewControlWorkflowJob({'workflowjob': this._workflowJob});
        this.regionControlWorkflowUpperArea.show(this.controlWorkflowJobView);
        this.regionControlWorkflowLowerArea.$el.hide();
    }

    /**
     * Handle event WorkflowJobGroup selected.
     */
    _handleEventWorkflowJobGroupSelected(options)
    {
        var workflowJobGroup = this._handleRequestGetWorkflowJobGroup(options);
        this.controlWorkflowJobGroupView = new LayoutViewControlWorkflowJobGroup({workflow: this._workflow, workflowjobgroup: workflowJobGroup});
        this.regionControlWorkflowUpperArea.show(this.controlWorkflowJobGroupView);
        this.regionControlWorkflowLowerArea.$el.hide();
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: this._workflow});
        this.viewControlJob = new LayoutViewJob();
        this.regionControlWorkflowUpperArea.show(this.viewWorkflow);
        this.regionControlWorkflowLowerArea.show(this.viewControlJob);
        this.regionControlWorkflowLowerArea.$el.show();
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        this._createInputPort(options.inputporttype, workflowJob);
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        var port = this._createOutputPort(options.outputporttype, workflowJob);
    }

    /**
     * Delete input port
     */
    _handleCommandDeleteInputPort(aPass)
    {
        this._deleteInputPort(aPass.inputport, this._workflowJob);
    }

    /**
     * Delete output port
     */
    _handleCommandDeleteOutputPort(aPass)
    {
        this._deleteOutputPort(aPass.outputport, this._workflowJob);
    }

    /**
     * Handle save workflow.
     */
    _handleCommandSaveWorkflow(aPass)
    {
        this._workflow.save(aPass, {patch: true, success: () => this._validateWorkflow(this._workflow)});
    }

    /**
     * Handle save workflowjob.
     */
    _handleCommandSaveWorkflowJob(options)
    {
        options.workflowjob.save(options.workflowjob.changed, {patch: true, success: () => this._validateWorkflow(this._workflow)});
    }

    /**
     * Handle request load Workflow.
     */
    _handleEventLoadWorkflow(options)
    {
        options.workflow.fetch({'success': (workflow) => this._handleWorkflowLoadSuccess(workflow)});
    }

    /**
     * Handle request get WorkflowJob.
     */
    _handleRequestGetWorkflowJob(options)
    {
        return this._workflow.get('workflow_jobs').get(options.id);
    }

    /**
     * Handle request get WorkflowJobGroup.
     */
    _handleRequestGetWorkflowJobGroup(options)
    {
        return this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP, {'id': options.id});
    }

    /**
     * Handle request get InputPort.
     */
    _handleRequestGetInputPort(options)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('input_ports').get(options.id);
            if (port)
            {
                return port;
            }
        }
        return null;
    }

    /**
     * Handle request get OutputPort.
     */
    _handleRequestGetOutputPort(options)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('output_ports').get(options.id);
            if (port)
            {
                return port;
            }
        }
        return null;
    }

    /**
     * Handle request get Connection.
     */
    _handleRequestGetConnection(options)
    {
        return this._workflow.get('connections').get(options.id);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowJob creation success.
     */
    _handleWorkflowJobCreationSuccess(model, workflow, addPorts, validate)
    {
        workflow.get('workflow_jobs').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: model});
        if (addPorts)
        {
            this._addRequiredPorts(model);
        }
        this._validateWorkflow(workflow);
    }

    /**
     * Handle InputPort creation success.
     */
    _handleInputPortCreationSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('input_ports').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: workflowJob, inputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort creation success.
     */
    _handleOutputPortCreationSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('output_ports').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: workflowJob, outputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handles success of Connection creation.
     */
    _handleConnectionCreationSuccess(model, workflow, inputPort, outputPort)
    {
        workflow.get('connections').add(model);
        inputPort.fetch(); // to get populated Connection array
        outputPort.fetch(); // to get populated Connection array
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: model, inputport: inputPort, outputport: outputPort});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle WorkflowJob deletion success.
     */
    _handleWorkflowJobDeletionSuccess(model, workflow)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, {workflowjob: model});
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle InputPort deletion success.
     */
    _handleInputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('output_ports').remove(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, {workflowjob: workflowJob, inputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort deletion success.
     */
    _handleOutputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('output_ports').remove(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, {workflowjob: workflowJob, outputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Attempts to validate Workflow.
     */
    _validateWorkflow(workflow)
    {
        workflow.save({valid: true}, {patch: true,
                                      error: (model) => this._handleValidationFailure(model),
                                      use_generic: false});
    }

    /**
     * Handle validation failure.
     */
    _handleValidationFailure(model)
    {
        model.set({'valid': false})
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create workflow job.
     *
     * If ports are to be automatically generated, we add a success function that adds them.
     */
    _createWorkflowJob(job, workflow)
    {
        var workflowJob = new WorkflowJob({job: job.get('url'), workflow: workflow.get('url')});
        var addPorts = this.ui.checkboxAddPorts.is(':checked');
        workflowJob.save({}, {success: (model) => this._handleWorkflowJobCreationSuccess(model, workflow, addPorts)});
    }

    /**
     * Create input port.
     */
    _createInputPort(inputPortType, workflowJob)
    {
        var port = new InputPort({input_port_type: inputPortType.get('url'), workflow_job: workflowJob.get('url')});
        port.save({}, {success: (model) => this._handleInputPortCreationSuccess(model, this._workflow, workflowJob)});
    }

    /**
     * Create input port.
     */
    _createOutputPort(outputPortType, workflowJob)
    {
        var port = new OutputPort({output_port_type: outputPortType.get('url'), workflow_job: workflowJob.get('url')});
        port.save({}, {success: (model) => this._handleOutputPortCreationSuccess(model, this._workflow, workflowJob)});
    }

    /**
     * Create connection.
     */
    _createConnection(outputPort, inputPort)
    {
        var connection = new Connection({input_port: inputPort.get('url'), output_port: outputPort.get('url')});
        connection.save({}, {success: (model) => this._handleConnectionCreationSuccess(model, this._workflow, inputPort, outputPort)});
    }

    /**
     * Delete WorkflowJob.
     */
    _deleteWorkflowJob(workflowJob)
    {
        workflowJob.destroy({success: (model) => this._handleWorkflowJobDeletionSuccess(model, this._workflow)});
    }

    /**
     * Delete input port.
     */
    _deleteInputPort(port, workflowJob)
    {
        try
        {
            port.destroy({success: (model) => this._handleInputPortDeletionSuccess(model, this._workflow, workflowJob)});
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(port, workflowJob)
    {
        try
        {
            port.destroy({success: (model) => this._handleOutputPortDeletionSuccess(model, this._workflow, workflowJob)});
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Given a WorkflowJob, adds ports that must be present.
     * This method assumes that the WorkflowJob has NO ports to begin with.
     */
    _addRequiredPorts(workflowJob)
    {
        var jobCollection = this._rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(workflowJob.getJobUuid());
        var outputPortTypes = job.get('output_port_types');
        var inputPortTypes = job.get('input_port_types');

        // Go through port collections.
        var that = this;
        inputPortTypes.forEach(function(inputPortType) 
        {
            for (var i = 0; i < inputPortType.get('minimum');i ++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: inputPortType, workflowjob: workflowJob});
            }
        });
        outputPortTypes.forEach(function(outputPortType) 
        {
            for (var i = 0; i < outputPortType.get('minimum'); i++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: outputPortType, workflowjob: workflowJob});
            }
        });
    }

    /**
     * Process workflow for GUI.
     */
    _processWorkflow(workflow)
    {
        // Process all WorkflowJobs and their associated ports.
        var connections = {};
        var workflowJobs = workflow.get('workflow_jobs');
        if (workflowJobs !== undefined)
        {
            for (var i = 0; i < workflowJobs.length; i++)
            {
                // Create WorkflowJob item then process connections.
                var workflowJob = workflowJobs.at(i);
                this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
                var tempConnections = this._processWorkflowJob(workflowJob);

                // For the connections returned, merge them into our master list.
                for (var connectionUrl in tempConnections)
                {
                    var connection = tempConnections[connectionUrl];
                    if (connections.hasOwnProperty(connectionUrl))
                    {
                        connections[connectionUrl].inputPort = 
                            connections[connectionUrl].inputPort === null ? connection.inputPort : connections[connectionUrl].inputPort;
                        connections[connectionUrl].outputPort = 
                            connections[connectionUrl].outputPort === null ? connection.outputPort : connections[connectionUrl].outputPort;
                    }
                    else
                    {
                        connections[connectionUrl] = connection;
                    }
                }
            }
        }

        // Process connections.
        for (var connectionUrl in connections)
        {
            var connection = connections[connectionUrl];
            var connectionModel = new Connection({input_port: connection.inputPort.get('url'), 
                                                  output_port: connection.outputPort.get('url')});
            workflow.get('connections').add(connection);
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connectionModel, 
                                                                                                inputport: connection.inputPort,
                                                                                                outputport: connection.outputPort});
        }

        // Finally inport the WorkflowJobGroups. 
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, {workflow: this._workflow});
    }

    /**
     * Process workflow job for GUI.
     */
    _processWorkflowJob(aModel)
    {
        // We want to keep track of what connections need to be made and return those.
        var connections = {};

        // Process input ports.
        var inputPorts = aModel.get('input_ports');
        if (inputPorts !== undefined)
        {
            for (var i = 0; i < inputPorts.length; i++)
            {
                var inputPort = inputPorts.at(i);
                this._processInputPort(inputPort, aModel);

                // Get connections.
                var inputPortConnections = inputPort.get('connections');
                for (var k = 0; k < inputPortConnections.length; k++)
                {
                    var connection = inputPortConnections[k];
                    connections[connection] = {'inputPort': inputPort, 'outputPort': null};
                }
            }
        }

        // Process output ports.
        var outputPorts = aModel.get('output_ports');
        if (outputPorts !== undefined)
        {
            for (var j = 0; j < outputPorts.length; j++)
            {
                var outputPort = outputPorts.at(j);
                this._processOutputPort(outputPort, aModel);

                // Get connections.
                var outputPortConnections = outputPort.get('connections');
                for (var k = 0; k < outputPortConnections.length; k++)
                {
                    var connection = outputPortConnections[k];
                    connections[connection] = {'inputPort': null, 'outputPort': outputPort};
                }
            }
        }

        return connections;
    }

    /**
     * Process input port for GUI.
     */
    _processInputPort(aModel, aWorkflowJob)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aModel});
    }

    /**
     * Process output port for GUI.
     */
    _processOutputPort(aModel, aWorkflowJob)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aModel});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewWorkflowEditor.prototype.template = '#template-main_workflowbuilder';
LayoutViewWorkflowEditor.prototype.ui = {
    buttonZoomIn: '#button-zoom_in',
    buttonZoomOut: '#button-zoom_out',
    buttonZoomReset: '#button-zoom_reset',
    checkboxAddPorts: '#checkbox-add_ports'
};
LayoutViewWorkflowEditor.prototype.events = {
    'click @ui.buttonZoomIn': '_handleButtonZoomIn',
    'click @ui.buttonZoomOut': '_handleButtonZoomOut',
    'click @ui.buttonZoomReset': '_handleButtonZoomReset'
};

export default LayoutViewWorkflowEditor;