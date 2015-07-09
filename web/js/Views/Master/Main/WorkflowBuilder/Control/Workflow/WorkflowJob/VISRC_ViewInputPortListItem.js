import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view of an individual input port list item.
 */
class VISRC_ViewInputPortListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ("initialize" doesn't seem to work.)
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.ui = {
            buttonDelete: '#button-delete'
        }
        this.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
        this.template = "#template-main_workflowbuilder_control_inputport_list_item";
        this.tagName = 'tr';

        super(aParameters);
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

    /**
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, {inputport: this.model});
    }
}

export default VISRC_ViewInputPortListItem;