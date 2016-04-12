import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ViewInputPortList from '../../InputPort/ViewInputPortList';
import ViewInputPortListItem from './ViewInputPortListItem';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortList from './ViewOutputPortList';
import ViewOutputPortTypeList from './ViewOutputPortTypeList';

/**
 * This class represents the view for editing ports.
 */
class LayoutViewControlPorts extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize(options)
    {
        this._initializeRadio();
        this.addRegions({
            regionControlInputPortTypes: '#region-main_inputporttypes',
            regionControlInputPorts: '#region-main_inputports',
            regionControlOutputPortTypes: '#region-main_outputporttypes',
            regionControlOutputPorts: '#region-main_outputports'
        });
        this._workflowJob = options.workflowjob;
        this._initializeViews(options);
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
        this.regionControlInputPortTypes.show(this._inputPortTypeListView);
        this.regionControlInputPorts.show(this._inputPortListView);
        this.regionControlOutputPortTypes.show(this._outputPortTypeListView);
        this.regionControlOutputPorts.show(this._outputPortListView);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflowjob selection.
     */
    _initializeViews(options)
    {                                             
        this._inputPortListView = new ViewInputPortList({collection: options.workflowjob.get('input_ports'),
                                                         template: '#template-main_inputport_list',
                                                         childView: ViewInputPortListItem,
                                                         childViewOptions: options});
        this._outputPortListView = new ViewOutputPortList({collection: options.workflowjob.get('output_ports'),
                                                           childViewOptions: options});
        this._inputPortTypeListView = new ViewInputPortTypeList({workflowjob: options.workflowjob,
                                                                 childViewOptions: options});
        this._outputPortTypeListView = new ViewOutputPortTypeList({workflowjob: options.workflowjob,
                                                                   childViewOptions: options});
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewControlPorts.prototype.template = '#template-main_workflowjob_ports';

export default LayoutViewControlPorts;