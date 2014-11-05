<% 
	import grails.plugin.scaffold.core.ScaffoldingHelper
%>
Ext.define('${appName}.model.${className}', {
	extend : '${appName}.model.Base',
	fields : [\
<%  ScaffoldingHelper sh = new ScaffoldingHelper(domainClass, pluginManager, comparator, getClass().classLoader)
	props = sh.getProps()
	Map useDisplaynames=[:]
	for (p in props) {
		if (p.embedded) {
			def embeddedPropNames = p.component.persistentProperties*.name
			def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
			Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
			//NOT USED
		} else {
			renderFieldForProperty(p, domainClass)
		}
		List defaultDisplayNames = config.grails.plugin.scaffold.core.defaultDisplayNames
		if(p.name in defaultDisplayNames){
			useDisplaynames[p.name]=null
		}
		
	}
	Map displayNames = config.grails.plugin.scaffold.core.displayNames
	if(displayNames.containsKey(className)){
		useDisplaynames << displayNames[className]
	}
	String useDisplaynamesStr = useDisplaynames.collect{key, value->"'" + key + "'"}.join(",")
%>\
<% 
// Generate uniqueName convert function based on displayNames config
if(useDisplaynames.size()>0){%>\
		{
			name : 'uniqueName',
			type : 'string',
			convert : function(newValue, model) {
				var name = "";\
	<% useDisplaynames.each{ baseNameKey, baseNameValue-> %>\
		<% if(baseNameValue){%>\
				var field = model.get('${baseNameKey}')
			  <% baseNameValue.each{subBasename-> %>\
				if(field.\$className){// is class
					name += field.get('${subBasename}');
				}else{// is map 
					name += field['${subBasename}'];
				}
				name += ' ';
			 <%}%>\
		<% }else{ %>
				name += model.get('${baseNameKey}');
				name += ' ';
		<%}%>\
	<%}%>\
				return name;
			},
			depends: [${useDisplaynamesStr}]
		}\
<%}%>\
<%
private renderFieldForProperty(property, owningClass, prefix = "") {
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	boolean required = false
	String type = ""
	String andMore = ""
	if (hasHibernate) {
		cp = owningClass.constrainedProperties[property.name]
		required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
		
		if(cp?.propertyType in [boolean, Boolean]){
			 type = "boolean"
		}else if(cp?.propertyType in [int, Integer, long, Long]){
			 type = "int"
		}else if(Number.isAssignableFrom(property.type) || (property.type?.isPrimitive() && property.type != boolean)){
			 type = "number"
		}else if(property.type == Date || property.type == java.sql.Date || property.type == java.sql.Time || property.type == Calendar){
			 type = "date"
			andMore=",dateWriteFormat: 'Y-m-d H:i:s.uO'"
		}else if(property.type == String){
			 type = "string"
		}
	}
	
	%>
	{
		name : '${property.name}',
		type: '${type}'${andMore}\
	<% if ((property.oneToMany && !property.bidirectional) || property.manyToMany) { %>
		,mapping: function(data) {
	    	var list = new Array();
			Ext.each(data.${property.name}, function(value) {
				 list.push(Ext.create('${appName}.model.${grails.util.GrailsNameUtils.getShortName(property.getReferencedPropertyType())}',   value));
			});
	        return list;
		},
		<% } %>
	},
<%  } %>
],
validators:{<%
for (p in props) {
	if (p.embedded) {
		def embeddedPropNames = p.component.persistentProperties*.name
		def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
		Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
		//NOT USED
	} else {
		renderFieldValidationForProperty(p, domainClass)
	}

}            
%>}
});

<%
private renderFieldValidationForProperty(property, owningClass, prefix = "") {
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	boolean required = false
	String validators = ""
	if (hasHibernate) {
		cp = owningClass.constrainedProperties[property.name]
		
		if(cp){
			required =  !(cp.propertyType in [boolean, Boolean]) && !cp.nullable 
			if(required || !cp.blank) validators += "{type:'presence'},"
			//if(cp.creditCard) validators += "{type:'presence'},"
			if(property.type == String && cp.email) validators += "{type:'email'},"
			def inList = (domainClass.constraints."${property.name}".inList).collect{"'$it'"}
			if(cp.inList) validators += "{type:'inclusion',list:$inList},"
			if(cp.max) validators += "{type:'range', max:${cp.max}},"
			if(cp.maxSize) validators += "{type:'length', max:${cp.maxSize}},"
			if(cp.min) validators += "{type:'range', min:${cp.min}},"
			if(cp.minSize) validators += "{type:'length', min:${cp.minSize}},"
			//if(cp.notEqual) validators += "{type:'presence'},"
			if(cp.range) validators += "{type:'range', min:${cp.range.from}, max:${cp.range.to}},"
			//if(cp.scale) validators += "{type:'presence'},"
			//if(cp.size) validators += "{type:'presence'},"
			//if(cp.unique) validators += "{type:'presence'},"
			//if(cp.url) validators += "{type:'presence'},"
		}
		
		
	}
	
	%>
	${property.name}:[
	     $validators
	],
<%  } %>
