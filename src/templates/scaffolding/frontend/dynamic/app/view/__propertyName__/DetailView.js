<% 
	import grails.plugin.scaffold.core.ScaffoldingHelper
%>

<%  
public String renderEditor(property){
	String output = ""
	if (property.type == Boolean || property.type == boolean)
	    output = renderBooleanEditor(domainClass, property)
	else if (property.type && Number.isAssignableFrom(property.type) || (property.type?.isPrimitive() && property.type != boolean))
	    output = renderNumberEditor(domainClass, property)
	else if (property.type == String)
	    output = renderStringEditor(domainClass, property)
	else if (property.type == Date || property.type == java.sql.Date || property.type == java.sql.Time || property.type == Calendar)
	    output = renderDateEditor(domainClass, property)
	else if (property.type == URL)
	    output = renderStringEditor(domainClass, property)
	else if (property.type && property.isEnum())
	    output = renderEnumEditor(domainClass, property)
	else if (property.type == TimeZone)
	    output = renderSelectTypeEditor("timeZone", domainClass, property)
	else if (property.type == Locale)
	    output = renderSelectTypeEditor("locale", domainClass, property)
	else if (property.type == Currency)
	    output = renderSelectTypeEditor("currency", domainClass, property)
	else if (property.type==([] as Byte[]).class) //TODO: Bug in groovy means i have to do this :(
	    output = renderByteArrayEditor(domainClass, property)
	else if (property.type==([] as byte[]).class) //TODO: Bug in groovy means i have to do this :(
	    output = renderByteArrayEditor(domainClass, property)
	else if (property.manyToOne || property.oneToOne)
	    output = renderManyToOne(domainClass, property)
	else if ((property.oneToMany && !property.bidirectional) || property.manyToMany) {
	    output = renderManyToMany(domainClass, property)
	}
	else if (property.oneToMany)
	    output = renderOneToMany(domainClass, property)
	else
		output = "//nothing"
	
	return output
}

private renderEnumEditor(domainClass, property) {
	return """
			xtype : 'combo',
			store : ${(property.type.values()*.name()).collect{"'$it'"}}
		"""
}

private String renderStringEditor(domainClass, property) {
	return """
			xtype : 'textfield'
	"""
}

private renderByteArrayEditor(domainClass, property) {
    return """
			xtype : 'filefield'
		"""
}

private String renderManyToOne(domainClass,property) {
    if (property.association) {
		return  """
			xtype : 'combo',//ManyToOne
			valueField: 'id',
			displayField: 'uniqueName',
			store: {type:'${grails.util.GrailsNameUtils.getShortName(property.type).toLowerCase()}-liststore'},
		"""
    }else{
    	return "//renderManyToOne not association"
    }
}

private renderManyToMany(domainClass, property) {
	return  """
	        xtype: 'tagfield',//ManyToMany
	        store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},
	        displayField: 'uniqueName',
	        valueField: 'id'
	/*	
	        xtype: 'multiselector',
	        title: 'Yksuss',
	        bind:{
	        	store:{
	                bindTo:'{theDomainObject.yksuss}',//Not binding
	                deep:true
	        	}
            },
	        fieldName: 'uniqueName',
	        viewConfig: {
	            deferEmptyText: false,
	            emptyText: 'No employees selected'
	        },
	        search: {
	            field: 'uniqueName',
	            store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},
	        }
	    */
		"""
}

private renderOneToMany(domainClass, property) {
	return  """
			xtype : 'combo',//OneToMany
			valueField: 'id',
			displayField: 'uniqueName',
			multiSelect: true,
			store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},
		"""
}

private renderNumberEditor(domainClass, property) {

	String editorStrBegin ="xtype : 'numberfield'"
	String editorStrBetween = ""
	
	if (!cp) {
		if (property.type == Byte) {
			editorStrBetween += ", minValue: -128, maxValue: 127"
		}
	} else {
		if (cp.range) {
			return "xtype : 'combo', store : ${cp.range.from..cp.range.to}"
		} else if (cp.inList) {
			return "xtype : 'combo', store : ${(domainClass.constraints."${property.name}".inList).collect{"'$it'"}} "
		} else {
			if (property.type in [float, double, Float, Double, BigDecimal]) {
				//formatStr = ", format:'0.00'"
			}
			if (cp.min != null) editorStrBetween += ", minValue: ${cp.min}"
			if (cp.max != null) editorStrBetween += ", maxValue: ${cp.max}"
		}
		
	}
	return  editorStrBegin + editorStrBetween 
 }

private renderBooleanEditor(domainClass, property) {
     return """
			xtype : 'checkbox'
		"""
}

private renderDateEditor(domainClass, property) {
     return """ 	
			xtype : 'datefield',
	 		format: 'Y-m-d',
		"""
}

private renderSelectTypeEditor(type, domainClass,property) {
	return """
			xtype : 'combo',
			store : []
		"""

}

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
                ${renderEditor(property)}\
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
