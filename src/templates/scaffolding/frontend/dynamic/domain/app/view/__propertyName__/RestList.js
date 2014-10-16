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
	else if ((property.oneToMany && !property.bidirectional) || (property.manyToMany && property.isOwningSide())) {
	    def str = renderManyToMany(domainClass, property)
	    if (str != null) {
	        output = str
	    }
	}
	else if (property.oneToMany)
	    output = renderOneToMany(domainClass, property)
	    
	return output
}

private renderEnumEditor(domainClass, property) {
	return """
		renderer: function (value, metaData) {
			return (value)?value.name:'';
		},
		editor : {
			xtype : 'combo',
			store : ${(property.type.values()*.name()).collect{"'$it'"}}
		}
		"""
}

private String renderStringEditor(domainClass, property) {
	return """
	editor : {
		xtype : 'textfield'
	}
	"""
}

private renderByteArrayEditor(domainClass, property) {
    return """
		editor : {
			xtype : 'filefield'
		}
		"""
}

private String renderManyToOne(domainClass,property) {
    if (property.association) {
		return  """
		  renderer: function (value, metaData) {
				return (value)?'Object id: ' +value.id:'';
		  },
		  editor : {
			  xtype : 'combo',
			  valueField: 'id',
			  displayField: 'uniqueName',
			  store: {type:'${grails.util.GrailsNameUtils.getShortName(property.type).toLowerCase()}-liststore'},
		  }
		"""
    }
}

private renderManyToMany(domainClass, property) {
	return "//ManyToMany"
}

private renderOneToMany(domainClass, property) {
   return "//OneToMany"
}

private renderNumberEditor(domainClass, property) {
	String cellStr = " xtype: 'numbercolumn'"
	String cellStrBetween = ""
	String editorStrBegin =",editor : { xtype : 'numberfield'"
	String editorStrBetween = ""
	String editorStrEnd ="}"
	String formatStr = ", format:'0'"
	
	
	if (!cp) {
		if (property.type == Byte) {
			editorStrBetween += ", minValue: -128, maxValue: 127"
		}
	} else {
		if (cp.range) {
			return cellStr+", editor : { xtype : 'combo', store : ${cp.range.from..cp.range.to}	}"
		} else if (cp.inList) {
			return cellStr+", editor : { xtype : 'combo', store : ${(domainClass.constraints."${property.name}".inList).collect{"'$it'"}}   }"
		} else {
			if (property.type in [float, double, Float, Double, BigDecimal]) {
				formatStr = ", format:'0.00'"
			}
			if (cp.min != null) editorStrBetween += ", minValue: ${cp.min}"
			if (cp.max != null) editorStrBetween += ", maxValue: ${cp.max}"
		}
		
	}
	return cellStr + cellStrBetween + formatStr + editorStrBegin + editorStrBetween + editorStrEnd
 }

private renderBooleanEditor(domainClass, property) {
     return """
	 	xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
		editor : {
			xtype : 'checkbox'
		}
		"""
}

private renderDateEditor(domainClass, property) {
     return """
	 	xtype: 'datecolumn',   
	 	format:'Y-m-d',
		editor : {
			xtype : 'datefield',
	 		format: 'Y-m-d',
		}
		"""
}

private renderSelectTypeEditor(type, domainClass,property) {
	return """
		editor : {
			xtype : 'combo',
			store : []
		}
		"""

}

%>


Ext.define('${appName}.view.${domainClass.propertyName}.RestList', {
	extend : '${appName}.view.BaseRestGrid',
	xtype : '${domainClass.propertyName.toLowerCase()}-restlist',
	requires : ['${appName}.view.${domainClass.propertyName}.ListController'],
	controller : '${domainClass.propertyName.toLowerCase()}-listcontroller',

	bind:{
		store: '{listStore}'
	},

	initComponent: function() {
    	this.columns = this.defaultColumns.concat(this.columns);
        this.callParent();
    },
    
	columns : [
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
	
	private renderFieldForProperty(p, owningClass, prefix = "") {
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
		boolean required = false
		if (hasHibernate) {
			cp = owningClass.constrainedProperties[p.name]
			required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
		}
		if(!p.oneToMany && !p.manyToMany){
		%>
		{
			text : '${p.naturalName}',
			sortable : true,
			dataIndex : '${p.name}',
			groupable : true,
			flex: 1,
			${renderEditor(p)}
			
		},
<% } } %>
	]
});
