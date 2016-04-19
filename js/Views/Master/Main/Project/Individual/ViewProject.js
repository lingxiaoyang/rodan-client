import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Project view.
 */
export default class ViewProject extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_DELETE, {project: this.model});
    }

    /**
     * Handle RunJob button.
     */
    _handleButtonRunJobs()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RUNJOB_SELECTED_COLLECTION, {project: this.model});
    }

    /**
     * Handle click resource count.
     */
    _handleClickResourceCount()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_SELECTED_COLLECTION, {project: this.model});
    }

    /**
     * Handle click workflow count.
     */
    _handleClickWorkflowCount()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOW_SELECTED_COLLECTION, {project: this.model});
    }
}
ViewProject.prototype.modelEvents = {
            'all': 'render'
        };
ViewProject.prototype.ui = {
            buttonSave: '#button-save_project',
            buttonDelete: '#button-delete_project',
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count',
            buttonRunJobs: '#button-runjobs',
            textName: '#text-project_name',
            textDescription: '#text-project_description'
        };
ViewProject.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonDelete': '_handleButtonDelete',
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount',
            'click @ui.buttonRunJobs': '_handleButtonRunJobs'
        };
ViewProject.prototype.template = '#template-main_project_individual';