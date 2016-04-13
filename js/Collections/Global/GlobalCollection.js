import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * Global Collections that should be loaded on startup. These are not expected to change during the lifetime of a session. They are also customized to get non-paginated results.
 */
export default class GlobalCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options initialization parameters for Backbone.Collection
     */
     initialize(options)
     {
        super.initialize(options);
        this._allowPagination = false;
     }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(this.loadCommand, options => this._retrieveList(options));
        Radio.channel('rodan').reply(this.requestCommand, () => this._handleRequestInstance());
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }

    /**
     * Retrieves list.
     */
    _retrieveList(options)
    {
        options = options ? options : {};
        this.reset();
        var data = options.hasOwnProperty('data') ? options.data : {};
        if (!this._allowPagination)
        {
            data.disable_pagination = true;
        }
        options.data = data;
        options = this._applyResponseHandlers(options);
        /** @ignore */
        this.url = Radio.channel('rodan').request(Events.REQUEST__SERVER_GET_ROUTE, this.route);
        this.fetch(options);
    }
}