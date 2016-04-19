import bootstrap from 'twbs/bootstrap';
import 'twbs/bootstrap/css/bootstrap.css!';
import _ from 'underscore';
import $ from 'jquery';
import Marionette from 'backbone.marionette';
import moment from 'moment';
import Radio from 'backbone.radio';

import BehaviorTable from './Behaviors/BehaviorTable';
import ControllerAuthentication from './Controllers/ControllerAuthentication';
import ControllerModal from './Controllers/ControllerModal';
import ControllerProject from './Controllers/ControllerProject';
import ControllerResource from './Controllers/ControllerResource';
import ControllerRunJob from './Controllers/ControllerRunJob';
import ControllerServer from './Controllers/ControllerServer';
import ControllerWorkflow from './Controllers/ControllerWorkflow';
import ControllerWorkflowBuilder from './Controllers/ControllerWorkflowBuilder';
import ControllerWorkflowJob from './Controllers/ControllerWorkflowJob';
import ControllerWorkflowJobGroup from './Controllers/ControllerWorkflowJobGroup';
import ControllerWorkflowRun from './Controllers/ControllerWorkflowRun';
import Configuration from './Configuration';
import ErrorHandler from './Shared/ErrorHandler';
import RODAN_EVENTS from './Shared/RODAN_EVENTS';
import EventTimer from './Shared/EventTimer';
import GlobalInputPortTypeCollection from './Collections/Global/GlobalInputPortTypeCollection';
import GlobalJobCollection from './Collections/Global/GlobalJobCollection';
import GlobalOutputPortTypeCollection from './Collections/Global/GlobalOutputPortTypeCollection';
import GlobalProjectCollection from './Collections/Global/GlobalProjectCollection';
import GlobalResourceTypeCollection from './Collections/Global/GlobalResourceTypeCollection';
import LayoutViewMaster from './Views/Master/LayoutViewMaster';
import Plugins from './Plugins';
import RadioManager from './Managers/RadioManager';
import TransferManager from './Managers/TransferManager';

/**
 * Main application class.
 */
export default class Application extends Marionette.Application
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Called on Marionette.Application.start(). This will load the configuration from the host.
     */
    onStart()
    {
        Configuration.load('configuration.json', () => this._startUp());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Application start-up
     */
    _startUp()
    {
        Configuration.load('info.json');
        this.addRegions({
            regionMaster: '#region-master'
        });

        // Non-network and non-GUI inits. Do these first.
        this._initializeBehaviors();
        this._initializeDateTimeFormatter();
        this._initializeRadio();
        this._initializeCollections();
        this._initializeManagers();

        this._initializeAjaxPrefilters();
        this._initializeViews();
        this._initializeControllers();
        this._errorHandler = new ErrorHandler();
        this._eventTimer = new EventTimer({frequency: Configuration.EVENT_TIMER_FREQUENCY});
        
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_LOAD_ROUTES);

    }

    /**
     * Initialize managers.
     */
    _initializeManagers()
    {
        this._transferManager = new TransferManager();
        this._radioManager = new RadioManager();
    }

    /**
     * Initializes various helpers.
     */
    _initializeDateTimeFormatter()
    {
        moment.defaultFormat = Configuration.DATETIME_FORMAT;
        _.formatFromUTC = function(dateTime)
        {
            // TODO - see https://github.com/DDMAL/rodan-client/issues/59
            try
            {
                return moment(dateTime).format();
            }
            catch(error)
            {
                return moment.moment(dateTime).format();
            }
        };
    }

    /**
     * Initialize behaviors.
     */
    _initializeBehaviors()
    {
        Marionette.Behaviors.behaviorsLookup = function()
        {
            return {'Table': BehaviorTable};
        };
    }

    /**
     * Set event binding.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__SERVER_ROUTESLOADED, () => this._handleEventRoutesLoaded());
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGIN_SUCCESS, () => this._handleAuthenticationSuccess());
    }

    /**
     * Initialize controllers. These are not used for viewing; rather, they are server/auth control.
     */
    _initializeControllers()
    {
        this._controllerServer = new ControllerServer();
        this._controllerAuthentication = new ControllerAuthentication(this._controllerServer);
        this._modalController = new ControllerModal();
        this._projectController = new ControllerProject();
        this._resourceController = new ControllerResource();
        this._runJobController = new ControllerRunJob();
        this._workflowController = new ControllerWorkflow();
        this._workflowRunController = new ControllerWorkflowRun();
        this._workflowBuilderController = new ControllerWorkflowBuilder();
        this._workflowJobController = new ControllerWorkflowJob();
        this._workflowJobGroupController = new ControllerWorkflowJobGroup();
    }

    /**
     * Initialize AJAX prefilters. This allows the application a lower level of request monitoring (if desired).
     */
    _initializeAjaxPrefilters()
    {
        var that = this;
        $.ajaxPrefilter(function(options)
        {
            that._controllerAuthentication.ajaxPrefilter(options);
        });
    }

    /**
     * Initialize collections.
     */
    _initializeCollections()
    {
        this._jobCollection = new GlobalJobCollection();
        this._resourceTypeCollection = new GlobalResourceTypeCollection();
        this._inputPortTypeCollection = new GlobalInputPortTypeCollection();
        this._outputPortTypeCollection = new GlobalOutputPortTypeCollection();
        this._projectCollection = new GlobalProjectCollection();
    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this._layoutViewMaster = new LayoutViewMaster();
    }

    /**
     * Handle EVENT__SERVER_ROUTESLOADED.
     */
    _handleEventRoutesLoaded()
    {
        // Render layout views.
        /** @ignore */
        this.regionMaster.show(this._layoutViewMaster);

        // Check authentication.
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        var user = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_USER);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_LOAD_ROUTE_OPTIONS);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECTS_LOAD, {data: {user: user.get('uuid')}});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_INPUTPORTTYPES_LOAD);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_RESOURCETYPES_LOAD);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_JOBS_LOAD, {data: {enabled: 'True'}});
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SELECTED_COLLECTION); 
    }
}
