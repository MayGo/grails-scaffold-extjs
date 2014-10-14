<% 
	import grails.plugin.scaffold.core.ScaffoldingHelper
%>
Ext.define('${appName}.view.${domainClass.propertyName}.DetailView', {
    extend: '${appName}.view.BaseDetailView',
    alias: 'widget.${domainClass.propertyName.toLowerCase()}-detailview',
    
    requires: [
        '${appName}.view.${domainClass.propertyName}.DetailModel',
        '${appName}.view.${domainClass.propertyName}.DetailController'
    ],
  
    componentCls: '${domainClass.propertyName.toLowerCase()}-detail',
    
    controller: '${domainClass.propertyName.toLowerCase()}-detailcontroller',
    viewModel: {
        type: '${domainClass.propertyName.toLowerCase()}-detailviewmodel'
    },
    
    overflowY:'auto',
    
    items: [{
        xtype: 'base-form',
        reference: 'baseform',
        modelValidation: true,
        bodyPadding: 20,
        defaults: {
            anchor: '95%',
            maxWidth: 400
        },
        items: [\
		<%  
		ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
		props = sh.getProps()
		
		
		for (p in props) {
			if (p.embedded) {
				def embeddedPropNames = p.component.persistentProperties*.name
				def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
				Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
				//NOT USED
			} else {
				renderFieldForProperty(p, domainClass)
			}
		}
		
		private renderFieldForProperty(property, owningClass, prefix = "") {
			boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
			boolean required = false
			if (hasHibernate) {
				cp = owningClass.constrainedProperties[property.name]
				required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
			}
			%>
			{
        		fieldLabel: '${property.naturalName}',
        		itemId: '${property.name}',
                bind: '{theDomainObject.${property.name}}',\
                ${renderEditor(property, true)}\
			},
		<%  } %>        
		]
    }
    <%
    relationsProps = sh.findRelationsProps(domainClasses as List)
    relationsProps.each{property, domainCl->%>
    	,{
    		xtype: '${domainCl.getShortName().toLowerCase()}-embedded-restlist',//Has property in other domainClass
    		viewModel:{
    			data:{
    				referencedPropertyName:'${property.name}.id'
    			},
    			stores:{
    		    	listStore:{
    		            autoLoad: false
    		        }	
    			}
    		},
    		title: "${property.naturalName} in ${domainCl.getName()}s",
    		margin: '1 0 0 0',
    		hidden: true,
    		bind: {
    			hidden:'{isNew}'
    		},
    		listeners:{
    			expand: function(panel, eOpts){
    				panel.store.reload();
    			}
    		},
    		collapsible:true,
    		collapsed:true
    	}
    <%}
    %>
    
    ]
});
