var VISRC_Events = {

///////////////////////////////////////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__GET_ROUTES: 'COMMAND__GET_ROUTES',

    COMMAND__LOAD_JOBS: 'COMMAND__LOAD_JOBS', // Instructs loading of jobs. Takes object containing various query IDs.
    COMMAND__LOAD_PROJECTS: 'COMMAND__LOAD_PROJECTS', // Instructs loading of projects. Takes object containing various query IDs.
    COMMAND__LOAD_RESOURCES: 'COMMAND__LOAD_RESOURCES', // Instructs loading of resources. Takes object containing various query IDs.
    COMMAND__LOAD_RUNJOBS: 'COMMAND__LOAD_RUNJOBS', // Instructs loading of run jobs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWRUNS: 'COMMAND__LOAD_WORKFLOWRUNS', // Instructs loading of workflow runs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWS: 'COMMAND__LOAD_WORKFLOWS', // Instructs loading of workflows. Takes object containing various query IDs.

    COMMAND__AUTHENTICATION_LOGIN: 'COMMAND__AUTHENTICATION_LOGIN',
    COMMAND__LAYOUTVIEW_SHOW: 'COMMAND__LAYOUTVIEW_SHOW',

    // Workflow builder commands. These are sent to the workflow builder controller. They will (most often) trigger a command to the workspace.
    COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW: 'EVENT__WORKFLOWBUILDER_ADD_WORKFLOW',  // Called when Workflow needs to be created. No pass.
    COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB: 'EVENT__WORKFLOWBUILDER_ADD_WORKFLOWJOB',   // Called when Workflow needs to be created. Passes {job: VISRC_Job}.

    // Workspace commands. These events tell the workspace what needs to be done. The WorkflowBuilder sends these commands.
    COMMAND__WORKSPACE_ADD_ITEM_WORKFLOW: 'COMMAND__WORKSPACE_ADD_ITEM_WORKFLOW', // Called when Workflow needs to be added to workspace. Passes {workflow: VISRC_Workflow}.
    COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB: 'COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB', // Called when WorkflowJob needs to be added to workspace. Passes {workflowJob: VISRC_WorkflowJob}.

///////////////////////////////////////////////////////////////////////////////////////
// EVENTS
///////////////////////////////////////////////////////////////////////////////////////

    // Application events.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',   // Called when app is ready. No pass.

    // Authentication events.
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400', // Called on error 400. No pass.
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401', // Called on error 401. No pass.
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403', // Called on error 403. No pass.
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL', // Called on error null. No pass.
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN', // Called on error unknown. No pass.
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__SUCCESS_AUTHENTICATION', // Called on success of authentication check. Passes {user: VISRC_User}.

    // Connection events.
    EVENT__ROUTESLOADED: 'EVENT__ROUTESLOADED', // Called when routes loaded. No pass.

    // Connection events.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY', // Called on server disconnect. No pass.

    // Model/collection selected events.
    EVENT__JOB_SELECTED: 'EVENT__JOB_SELECTED', // Called on job selection. No pass.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED', // Called on project selection. No pass.
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED', // Called on project selection. Passes {project: VISRC_Project}.
    EVENT__RESOURCES_SELECTED: 'EVENT__RESOURCES_SELECTED', // Called on resources selection. No pass.
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED', // Called on workflow selection. Passes {workflow: VISRC_Workflow}.
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED', // Called on workflows selection. No pass.
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED', // Called on workflow run selection. Passes {project: VISRC_WorkflowRun}.

    // WorkflowBuilder events.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED', // Called on workflow builder opening. Passes {workflow: VISRC_Workflow}. May be null if new workflow needed.


///////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////

    // Collection request.
    REQUEST__COLLECTION_JOB: 'REQUEST__COLLECTION_JOB',
    REQUEST__COLLECTION_PROJECT: 'REQUEST__COLLECTION_PROJECT',
    REQUEST__COLLECTION_RUNJOB: 'REQUEST__COLLECTION_RUNJOB',
    REQUEST__COLLECTION_RESOURCE: 'REQUEST__COLLECTION_RESOURCE',
    REQUEST__COLLECTION_WORKFLOW: 'REQUEST__COLLECTION_WORKFLOW',
    REQUEST__COLLECTION_WORKFLOWRUN: 'REQUEST__COLLECTION_WORKFLOWRUN',

    REQUEST__WORKFLOW_NEW: 'REQUEST__WORKFLOW_NEW', // Returns new workflow not yet saved to server.
    REQUEST__WORKFLOWJOB_NEW: 'REQUEST__WORKFLOWJOB_NEW', // Returns new WorkflowJob not yet saved to server.

    REQUEST__APPLICATION: 'REQUEST_APPLICATION',
    REQUEST__USER: 'REQUEST__USER',
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE'
};

export default VISRC_Events;