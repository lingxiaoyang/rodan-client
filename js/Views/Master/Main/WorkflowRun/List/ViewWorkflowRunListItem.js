import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * WorkflowRun list item view.
 */
export default class ViewWorkflowRunListItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWRUN_SELECTED, {workflowrun: this.model});
    }
}
ViewWorkflowRunListItem.prototype.template = '#template-main_workflowrun_list_item';
ViewWorkflowRunListItem.prototype.tagName = 'tr';
ViewWorkflowRunListItem.prototype.events = {
    'dblclick': '_handleDoubleClick'
};