import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../Configuration';
import Events from '../../Shared/Events';
import ConnectionItem from './Items/ConnectionItem';
import InputPortItem from './Items/InputPortItem';
import LineItem from './Items/LineItem';
import OutputPortItem from './Items/OutputPortItem';
import WorkflowJobItem from './Items/WorkflowJobItem';

/**
 * Main WorkflowBuilder class.
 */
class WorkflowBuilder
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the workspace.
     * The element associated with the canvas ID MUST be available at this time.
     */
    initialize(aCanvasElementId)
    {
        this._STATES = {
            IDLE: 0,
            GRABBED_WORKFLOWJOBITEM: 1,
            CREATING_CONNECTION: 2
        };
        this._state = this._STATES.IDLE;
        this._selectedOutputPortItem = null;

        this._zoomMin = Configuration.WORKFLOWBUILDER.ZOOM_MIM;
        this._zoomMax = Configuration.WORKFLOWBUILDER.ZOOM_MAX;
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;

        paper.install(window);
        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleMouseEvent(aData);
        
        this._initializeGlobalMouseTool();
        this._initializeRadio();
        this._createSegments();

        this._line = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create segment definitions.
     */
    _createSegments()
    {
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var workflowJobItemWidth = paper.view.viewSize.width * Configuration.WORKFLOWBUILDER.WORKFLOWJOB_WIDTH;
        var workflowJobItemHeight = paper.view.viewSize.height * Configuration.WORKFLOWBUILDER.WORKFLOWJOB_HEIGHT;
        var portItemWidth = paper.view.viewSize.width * Configuration.WORKFLOWBUILDER.PORT_WIDTH;
        var portItemHeight = paper.view.viewSize.height * Configuration.WORKFLOWBUILDER.PORT_HEIGHT;
        this._segments = {
            workflowJobItem: [
                new paper.Point(0, 0), 
                new paper.Point(workflowJobItemWidth, 0), 
                new paper.Point(workflowJobItemWidth, workflowJobItemHeight), 
                new paper.Point(0, workflowJobItemHeight), 
                new paper.Point(0, 0)
            ],
            portItem: [
                new paper.Point(0, 0), 
                new paper.Point(portItemWidth, 0), 
                new paper.Point(portItemWidth, portItemHeight), 
                new paper.Point(0, portItemHeight), 
                new paper.Point(0, 0)
            ],
            connection: [new paper.Point(0, 0), new paper.Point(1, 0)]
        };
    }

    /**
     * Initialize global mouse tool.
     */
    _initializeGlobalMouseTool()
    {
        this._globalMouseTool = new Tool();
        this._mouseDelta = new paper.Point(0, 0);
        this._grabbedItem = null;
        this._globalMouseTool.onMouseMove = event => this._handleMouseEvent(event);
        this._globalMouseTool.onMouseUp = event => this._handleMouseEvent(event);
        this._globalMouseTool.onMouseDown = event => this._handleMouseEvent(event);
    }

    /**
     * Handle mouse event.
     */
    _handleMouseEvent(event)
    {
        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(event);
                break;
            }

            case this._STATES.GRABBED_WORKFLOWJOBITEM:
            {
                this._handleStateGrabbedWorkflowJobItem(event);
                break;
            }

            case this._STATES.CREATING_CONNECTION:
            {
                this._handleStateCreatingConnection(event);
                break;
            }

            default:
            {
                console.log('TODO - ERROR');
                break;
            }
        }
    }

    /**
     * Handle idle state.
     */
    _handleStateIdle(event)
    {
        if (event.type === 'mousedown')
        {
            if (event.target instanceof WorkflowJobItem)
            {
                this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOB_SELECTED, {workflowjob: event.target._associatedModel});
                this._grabbedItem = event.target;
                this._state = this._STATES.GRABBED_WORKFLOWJOBITEM;  
            }
            else if (event.target instanceof OutputPortItem)
            {
                this._selectedOutputPortItem = event.target;
                this._state = this._STATES.CREATING_CONNECTION; 
            }
            else
            {
                this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
            }
        }
    }

    /**
     * Handle grabbed workflowjobitem state.
     */
    _handleStateGrabbedWorkflowJobItem(event)
    {
        if (event.type === 'mousemove')
        {
            this._grabbedItem.move(event.delta);
        }
        else if (event.type === 'mouseup')
        {
            // We've let go, so go idle and save the position.
            this._state = this._STATES.IDLE;
            var object = {workflowjob: this._grabbedItem._associatedModel,
                          x: this._grabbedItem.position.x / paper.view.zoom / paper.view.size.width,
                          y: this._grabbedItem.position.y / paper.view.zoom / paper.view.size.height};
            this.rodanChannel.request(Events.COMMAND__WORKFLOWJOB_SAVE_COORDINATES, object);
        }
    }

    /**
     * Handle creating connection state.
     */
    _handleStateCreatingConnection(event)
    {
        if (event.type === 'mouseup')
        {
            if (event.target instanceof InputPortItem && !event.target.hasConnectionItem())
            {
                this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, {inputport: event.target._associatedModel, 
                                                                                           outputport: this._selectedOutputPortItem._associatedModel});
            }
            this._selectedOutputPortItem = null;
            this._state = this._STATES.IDLE;

            // Destroy our temp line.
            if (this._line)
            {
                this._line.remove();
                this._line = null;
            }
        }
        else if (event.type === 'mousemove')
        {
            // If line hasn't been created, create it.
            if (this._line === null)
            {
                var startPoint = new Point(this._selectedOutputPortItem.position.x, this._selectedOutputPortItem.bounds.bottom);
                this._line = new LineItem({segments: this._segments.connection, startPoint: startPoint});
                paper.view.draw();
            }

            // Update end point to one pixel ABOVE the mouse pointer. This ensures that the next click event does NOT register
            // the line as the target.
            var adjustedPoint = new Point(event.point.x, event.point.y - 1);
            this._line.setEndPoint(adjustedPoint);
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');

        // GUI commands.
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, options => this._handleCommandAddWorkflowJobItem(options));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, aReturn => this._handleCommandAddConnection(aReturn));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, aReturn => this._handleCommandAddInputPortItem(aReturn));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, aReturn => this._handleCommandAddOutputPortItem(aReturn));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, aReturn => this._handleCommandDeleteInputPortItem(aReturn));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, aReturn => this._handleCommandDeleteOutputPortItem(aReturn));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, options => this._handleCommandDeleteWorkflowJobItem(options));
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN, () => this._handleCommandZoomIn());
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT, () => this._handleCommandZoomOut());
        this.rodanChannel.reply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET, () => this._handleCommandZoomReset());
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(options)
    {
        var item = this._createWorkflowJobItem(options.workflowjob);

        // Set position if coordinates provided.
        var position = new paper.Point(paper.view.size.width / 2,
                                       paper.view.size.height / 2);
        if (options.hasOwnProperty('x'))
        {
            position.x = options.x * paper.view.size.width;
        }
        if (options.hasOwnProperty('y'))
        {
            position.y = options.y * paper.view.size.height;
        }
        item.setPosition(position);
        
        paper.view.draw();
    }

    /**
     * Handle add input port item.
     */
    _handleCommandAddInputPortItem(aReturn)
    {
        this._createInputPortItem(aReturn.workflowjob, aReturn.inputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle add output port item.
     */
    _handleCommandAddOutputPortItem(aReturn)
    {
        this._createOutputPortItem(aReturn.workflowjob, aReturn.outputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle delete input port item.
     */
    _handleCommandDeleteInputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteInputPortItem(aReturn.inputport.paperItem);
        aReturn.inputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle delete output port item.
     */
    _handleCommandDeleteOutputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteOutputPortItem(aReturn.outputport.paperItem);
        aReturn.outputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle delete WorkflowJobItem.
     */
    _handleCommandDeleteWorkflowJobItem(options)
    {
        options.workflowjob.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle connection add.
     */
    _handleCommandAddConnection(aReturn)
    {
        this._createConnectionItem(aReturn.connection, aReturn.inputport, aReturn.outputport);
        paper.view.draw();
    }

    /**
     * Handle zoom in.
     */
    _handleCommandZoomIn()
    {
        paper.view.zoom = paper.view.zoom + this._zoomRate < this._zoomMax ? paper.view.zoom + this._zoomRate : this._zoomMax;
        paper.view.draw();
    }

    /**
     * Handle zoom out.
     */
    _handleCommandZoomOut()
    {
        paper.view.zoom = paper.view.zoom - this._zoomRate > this._zoomMin ? paper.view.zoom - this._zoomRate : this._zoomMin;
        paper.view.draw();
    }

    /**
     * Handle zoom reset.
     */
    _handleCommandZoomReset()
    {
        paper.view.zoom = 1;
        paper.view.draw();
    }

    /**
     * Creates a workflow job item.
     */
    _createWorkflowJobItem(model)
    {
        model.paperItem = new WorkflowJobItem({segments: this._segments.workflowJobItem, model: model, text: true});
        model.paperItem.update();
        return model.paperItem;
    }

    /**
     * Creates an input port item for the associated workflow job.
     */
    _createInputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new InputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addInputPortItem(aModel.paperItem);
    }

    /**
     * Creates an output port item for the associated workflow job.
     */
    _createOutputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new OutputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addOutputPortItem(aModel.paperItem);
    }

    /**
     * Creates a connection.
     */
    _createConnectionItem(aModel, aInputPort, aOutputPort)
    {
        aModel.paperItem = new ConnectionItem({segments: this._segments.connection,
                                                     model: aModel, 
                                                     inputPort: aInputPort, 
                                                     outputPort: aOutputPort});

        // Associate the ports with the connection.
        aInputPort.paperItem.setConnectionItem(aModel.paperItem);
        aOutputPort.paperItem.addConnectionItem(aModel.paperItem);
    }
}

export default WorkflowBuilder;