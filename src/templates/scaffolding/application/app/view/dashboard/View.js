Ext.define('${appName}.view.dashboard.View', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.dashboard',
	title : 'Dashboard',
	controller : 'dashboard',
	viewModel : {
		type : 'dashboard'
	},

	requires : [
	'${appName}.view.dashboard.Controller', 
	'${appName}.view.dashboard.Model', 
	'Ext.grid.column.Widget', 
	'Ext.form.field.Display',
	'Ext.layout.container.VBox', 
	'Ext.layout.container.Fit', 
	'Ext.layout.container.Border'],

	bodyPadding : 20,
	bodyCls : 'dashboard',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	items : [{
		xtype : 'component',
		margin : '10 0 20 0',
		cls : 'title',
		html : 'Select "list" from menu or seach objects instance'
	}]
});
