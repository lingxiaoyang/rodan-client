import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Workflow summary.
 */
class ViewWorkflow extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this._initializeRadio();
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
    }

    /**
     * Handle button run workflow.
     */
    _handleButtonRunWorkflow()
    {
        if (!this.model.get('valid'))
        {
            alert('The workflow must be valid prior to run.');
        }
        else
        {
            this._rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, {workflow: this.model});
        }
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        var confirmation = confirm('Are you sure you want to delete "' + this.model.get('name') + '"?');
        if (confirmation)
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOW_DELETE, {workflow: this.model});
        }
    }

    /**
     * Handle button edit workflow.
     */
    _handleButtonEditWorkflow()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button copy workflow.
     */
    _handleButtonCopyWorkflow()
    {
        alert('not yet implemented');
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.model.set({name: this.ui.textName.val(), description: this.ui.textDescription.val()});
        this._rodanChannel.request(Events.REQUEST__WORKFLOW_SAVE, {workflow: this.model});
    }

    /**
     * Handle validate button.
     */
    _handleButtonValidate()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW);
    }

    /**
     * Handle run button.
     */
    _handleButtonRun()
    {
        if (!this.model.get('valid'))
        {
            alert('The workflow must be valid prior to run.');
        }
        else
        {
            this._rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, {workflow: this.model});
        }
    }

    /**
     * Handle button group.
     */
    _handleButtonGroup()
    {
        var workflowJobIDs = this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS);
        if (workflowJobIDs.length < 2)
        {
            alert('At least two WorkflowJobs must be selected.');
        }
        else
        {
            var workflowJobs = [];
            for (var i in workflowJobIDs)
            {
                var workflowJobID = workflowJobIDs[i];
                var workflowJob = this.model.get('workflow_jobs').get(workflowJobID);
                workflowJobs.push(workflowJob);
            }
            this._workflowJobGroup = this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, {workflowjobs: workflowJobs, workflow: this.model});
        }
    }

    _handleTest()
    {
        debugger;
        this._rodanChannel.request(Events.REQUEST_WORKFLOW_IMPORT, {'target': this.model, 'origin': 'http://132.206.14.136/workflow/c7ea8746-1b52-419c-a0cc-ba15b17e2cca/'});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflow.prototype.modelEvents = {
            'all': 'render'
        };
ViewWorkflow.prototype.ui = {
    runWorkflowButton: '#button-run_workflow',
    deleteWorkflowButton: '#button-delete_workflow',
    copyWorkflowButton: '#button-copy_workflow',
    editWorkflowButton: '#button-edit_workflow',
    buttonSaveData: '#button-save_workflow_data',
    buttonSave: '#button-save_workflow',
    buttonValidate: '#button-validate_workflow',
    buttonRun: '#button-run_workflow',
    textName: '#text-workflow_name',
    textDescription: '#text-workflow_description',
    buttonGroup: '#button-group_workflow',



    buttonTest: '#button-test_workflow'
        };
ViewWorkflow.prototype.events = {
    'click @ui.runWorkflowButton': '_handleButtonRunWorkflow',
    'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow',
    'click @ui.editWorkflowButton': '_handleButtonEditWorkflow',
    'click @ui.copyWorkflowButton': '_handleButtonCopyWorkflow',
    'click @ui.buttonSaveData': '_handleButtonSave',
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonValidate': '_handleButtonValidate',
    'click @ui.buttonRun': '_handleButtonRun',
    'click @ui.buttonGroup': '_handleButtonGroup',


    'click @ui.buttonTest': '_handleTest'
        };
ViewWorkflow.prototype.template = '#template-main_workflow_individual';

export default ViewWorkflow;