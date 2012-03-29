var processingTree = false;
jQuery(function (){
  jQuery('.source-tree-link').live("click", reloadModule);
  jQuery('[data-show]').live("click", toggle_mezuro);
  showLoadingProcess(true);
  showProjectContent();
});

function showProjectContent() {
  callAction('project_state', {}, showProjectContentFor);
}

function toggle_mezuro(){
  var element = jQuery(this).attr('data-show');
  jQuery(element).toggle();
  return false;
}

function reloadModule(){
  var module_name = jQuery(this).attr('data-module-name');
  showLoadingProcess(false);
  processingTree = true;
  callAction('project_tree', {module_name: module_name }, showProjectTree);
  callAction('module_result', {module_name: module_name}, showModuleResult);
  return false;
}

function showProjectContentFor(state){
  if (state == 'ERROR')
    callAction('project_error', {}, showProjectResult);
  else if (state == 'READY') {
    callAction('project_result', {}, showProjectResult);
    callAction('project_tree', {}, showProjectTree);
    callAction('module_result', {}, showModuleResult);
  }
  else if (state.endsWith("ING"))
    showProjectContentAfter(20);
}

function showProjectContentAfter(seconds){
  if (seconds > 0){
    setTimeout(function() { showProjectContentAfter(seconds - 10);}, 10000);
  } else {
    showProjectContent();
  }
}

function showProjectResult(content) {
  jQuery('#project-result').html(content);
}

function showProjectTree(content){ 
  processingTree = false;
  jQuery('#project-tree').html(content);
	return false;
}

function showModuleResult(content){
  if (processingTree != true){ 
    jQuery('#module-result').html(content);
  }
  return false;
}

function callAction(action, params, callback){
  var profile = projectContentData('profile');
  var content = projectContentData('content');
  var endpoint = '/profile/' + profile + '/plugins/mezuro/' + action + '/' + content;
  jQuery.get(endpoint, params, callback);
}

function projectContentData(data){
  return jQuery('#project-result').attr('data-' + data);
}

function showLoadingProcess(firstLoad){
	if(firstLoad)	
  	showProjectResult("<img src='/images/loading-small.gif'/>");
	
  showProjectTree("<img src='/images/loading-small.gif'/>");
  showModuleResult("<img src='/images/loading-small.gif'/>");
} 
