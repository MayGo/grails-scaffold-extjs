<% 
	import grails.plugin.scaffold.core.ScaffoldingHelper
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
