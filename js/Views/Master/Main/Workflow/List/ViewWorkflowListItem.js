import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * View for Workflow list.
 */
export default class ViewWorkflowListItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }
}
ViewWorkflowListItem.prototype.template = '#template-main_workflow_list_item';
ViewWorkflowListItem.prototype.tagName = 'tr';
ViewWorkflowListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};