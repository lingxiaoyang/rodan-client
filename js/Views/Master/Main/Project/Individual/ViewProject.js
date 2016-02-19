import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from '../../WorkflowRun/List/ViewWorkflowRunListItem';

/**
 * Project view.
 */
class ViewProject extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
    }

    /**
     * Destroy callback.
     */
    onDestroy()
    {
        this.collection = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_DELETE, {project: this.model});
    }

    /**
     * Handle click resource count.
     */
    _handleClickResourceCount()
    {
        this.rodanChannel.trigger(Events.EVENT__RESOURCES_SELECTED, {project: this.model});
    }

    /**
     * Handle click workflow count.
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWS_SELECTED, {project: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProject.prototype.modelEvents = {
            'all': 'render'
        };
ViewProject.prototype.ui = {
            buttonSave: '#button-save_project',
            buttonDelete: '#button-delete_project',
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count',
            textName: '#text-project_name',
            textDescription: '#text-project_description'
        };
ViewProject.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonDelete': '_handleButtonDelete',
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
ViewProject.prototype.template = '#template-main_project_individual';
ViewProject.prototype.childView = ViewWorkflowRunListItem;
ViewProject.prototype.childViewContainer = 'tbody';
ViewProject.prototype.behaviors = {Table: {'table': '#table-workflowruns'}};

export default ViewProject;