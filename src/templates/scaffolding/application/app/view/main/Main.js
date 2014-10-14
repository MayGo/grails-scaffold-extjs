Ext.define('${appName}.view.main.Main', {
    extend: 'Ext.container.Container',
    plugins : 'viewport',
    requires:[
		'Ext.layout.container.Border',
		'${appName}.view.main.MainController',
		'${appName}.view.main.MainModel',
		'${appName}.view.menu.TopMenu',
		'${appName}.view.menu.TopMenuController',
		'${appName}.view.dashboard.View',
		'${appName}.view.BaseForm',
	<%
	for(d in domainClasses){%>
		'${appName}.view.${d.propertyName}.ListView',
		'${appName}.view.${d.propertyName}.EmbeddedRestList',
		'${appName}.view.${d.propertyName}.DetailView',
	<%}
	%>
	],

	xtype: 'app-main',
    controller: 'main',
    layout: {
        type: 'border',
        align : 'stretch'
    },

	bodyBorder: false,
	
	defaults: {
	        collapsible: false,
	        split: false,
	        bodyPadding: 1
    },
	
	items: [
	{
		xtype: 'panel',
		region: 'north',
	    layout: {
	    	type: 'hbox',
	        pack: 'start',
	        align: 'stretch'
		},
		autoScroll:true,
	    items: [
	        {
		    	xtype:'top-menu'
		    },
		    {
		    	type:'component', 
		    	flex: 1
		    },
		    {
				xtype: 'combo',
				margin: '3 10',
		    	width: 200,
                store: {type:'${domainClasses.first().getShortName().toLowerCase()}-liststore'},//TODO: Add it from ViewModel
				displayField: 'uniqueName',
				itemId: 'mainSearch',
				minChars: 1,
				
				listConfig: {
				    loadingText: 'Searching...',
				    emptyText: 'No matching results found.',
				},
				listeners:{
					select:'onSearchSelect' 
				}
			},
		    {
		    	type:'component', 
		    	layout:'fit',
		    	items:[{ xtype: 'button', text: Ext.i18n.MessageSource.getMsg('button.logout'), handler: 'onLogout', scale: 'medium'}]
		    }
	
	    ]
	},{
	        
	        xtype: 'tabpanel',
	        id: 'myTabpanel',
	        reference: 'main',
	        region: 'center',
	        items:[
			{
			    xtype: 'dashboard',
			    closable: false
			}
		]
    },{
	    title: 'Ver. 0.1. Build: 2.23234.1',
	    region: 'south',
	    height: 100,
	    collapsed:true,
	    collapsible: true,
	    html: '<p>Information about application</p>'
	}]
});
