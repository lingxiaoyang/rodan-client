import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';
import ViewInputPortListItem from './ViewInputPortListItem';

/**
 * This class represents a list of input ports.
 */
class ViewInputPortList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowrun_newworkflowrun_inputport_list";
        this.childView = ViewInputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_INPUTPORT);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_INPUTPORTS, {workflow: aParameters.workflow.id});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default ViewInputPortList;