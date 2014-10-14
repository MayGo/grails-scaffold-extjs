
Ext.define('${appName}.view.${domainClass.propertyName}.ListView', {
	extend: 'Ext.panel.Panel',
	xtype : '${domainClass.propertyName.toLowerCase()}-listview',
	title : '${className}',
	requires : [
	            '${appName}.view.${domainClass.propertyName}.RestList',
	            '${appName}.view.${domainClass.propertyName}.ListSearch',
	            '${appName}.view.${domainClass.propertyName}.ListController'
	            ],
	controller : '${domainClass.propertyName.toLowerCase()}-listcontroller',
	viewModel: {
        type: '${domainClass.propertyName.toLowerCase()}-listviewmodel'
    },
    layout: {
        type: 'border',
        align: 'stretch'
    },
    overflowY:'auto',
	defaults: {
	        collapsible: true,
	        split: true
	      
	},
    items: [
            {xtype:'${domainClass.propertyName.toLowerCase()}-listsearch', region:'north', collapsed:true},
            {xtype:'${domainClass.propertyName.toLowerCase()}-restlist', region:'center', collapsible: false}
	
	]
	
});
