<% 
	import grails.plugin.scaffold.core.ScaffoldingHelper
%>
Ext.define('${appName}.view.${domainClass.propertyName}.ListSearch', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.${domainClass.propertyName.toLowerCase()}-listsearch',
    
    requires: [
        '${appName}.view.${domainClass.propertyName}.ListModel',
        '${appName}.view.${domainClass.propertyName}.ListController'
    ],
  
    componentCls: '${domainClass.propertyName.toLowerCase()}-listsearch',
    
    title:'Search',
    bodyPadding: '5 10',
    bbar:[{xtype:'button', text: Ext.i18n.MessageSource.getMsg('button.search'), handler:'onSearchClick'}],

    items: [{
    	xtype:'form',
    	reference: 'listSearchForm',
    	defaults: {
            //anchor: '95%',
            maxWidth: 400,
            margin:15,
            listeners : {
	       		specialkey : 'onSearchSpecialKey'
       	    }
        },
    	items: [
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
						renderSearchForProperty(p, domainClass)
					}
				}
				
				private renderSearchForProperty(property, owningClass, prefix = "") {
					boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
					boolean required = false
					if (hasHibernate) {
						cp = owningClass.constrainedProperties[property.name]
						required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
					}
				%>{
					fieldLabel: '${property.naturalName}',
					name:'${property.name}',\
					${renderSearchField(property)}
				},<% } %>               
				]
    }]
});



<%  
private renderSearchField( property ){
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
}
private renderEnumEditor(domainClass, property) {
	return """
					xtype : 'tagfield',
					store : ${(property.type.values()*.name()).collect{"'$it'"}}//EnumField
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
					xtype: 'tagfield',//ManyToOne
					store: {type:'${grails.util.GrailsNameUtils.getShortName(property.type).toLowerCase()}-liststore'},
					displayField: 'uniqueName',
					valueField: 'id'
		"""
    }else{
    	return "//renderManyToOne not association"
    }
}

private renderManyToMany(domainClass, property) {
	if(property.isOwningSide()){
		return 	""" 
					xtype : 'tagfield',//ManyToMany owning
					valueField: 'id',
					displayField: 'uniqueName',
					store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},//ManyToMany
				"""
	}else{
		return 	""" 
					xtype : 'tagfield',//ManyToMany not_owning
					valueField: 'id',
					displayField: 'uniqueName',
					store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},//ManyToMany not owningSide
				"""
	}
}

private renderOneToMany(domainClass, property) {
	return 	""" 
			 		xtype : 'tagfield',//OneToMany
			 		valueField: 'id',
					displayField: 'uniqueName',
					store: {type:'${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType()).toLowerCase()}-liststore'},//OneToMany
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
					multiSelect: true,
					store : []
		"""

}

%>
