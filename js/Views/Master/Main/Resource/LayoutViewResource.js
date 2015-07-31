import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerend.
 */
class LayoutViewResource extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._initializeRadio();
        this.addRegions({
            regionList: '#region-main_resource_list',
            regionItem: '#region-main_resource_item'
        });
        this.ui = {
            buttonAdd: '#button-main_resource_add',
            fileInput: '#file-main_resource_file'
        };
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd'
        };
        this.template = '#template-main_resource';
        this._project = aOptions.project;
    }

    /**
     * Show view in Resource list region.
     */
    showList(aView)
    {
        this.regionList.show(aView);
    }

    /**
     * Show view in Resource item region.
     */
    showItem(aView)
    {
        this.regionItem.show(aView);
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
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        var file = this.ui.fileInput[0].files[0];
        if (file === undefined)
        {
            alert('TODO -error');
            return;
        }
        this._rodanChannel.command(Events.COMMAND__RESOURCE_ADD, {project: this._project, file: file});
    }
}

export default LayoutViewResource;