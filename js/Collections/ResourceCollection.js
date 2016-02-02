import BaseCollection from './BaseCollection';
import Resource from '../Models/Resource';

/**
 * Collection of Resource models.
 */
class ResourceCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Resource;
        this.route = 'resources';
    }
}

export default ResourceCollection;