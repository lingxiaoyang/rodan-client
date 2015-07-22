import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view (and controller) for a resource type item.
 */
class ViewResourceTypeListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_resource_individual_resourcetype_list_item';
        this.tagName = 'option';

        super(aParameters);
    }

    /**
     * Set the value of the 'option.value'.
     */
    onRender()
    {
        this.$el.attr('value', this.model.get('url'));
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
}

export default ViewResourceTypeListItem;