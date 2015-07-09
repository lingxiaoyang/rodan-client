import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../Shared/VISRC_Events';
import VISRC_ViewInputPortListItem from './VISRC_ViewInputPortListItem';

/**
 * This class represents a list of input ports.
 */
class VISRC_ViewInputPortList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowbuilder_control_inputport_list";
        this.childView = VISRC_ViewInputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = aParameters.workflowjob.get("input_ports");
    }
}

export default VISRC_ViewInputPortList;