
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedRestList', {
	extend : '${appName}.view.${domainClass.propertyName}.RestList',
	xtype : '${domainClass.propertyName.toLowerCase()}-embedded-restlist',
	requires: [
	          '${appName}.view.${domainClass.propertyName}.EmbeddedListModel'
	],
	viewModel: {
		type: '${domainClass.propertyName.toLowerCase()}-embedded-listviewmodel'
	},
	initComponent: function() {
		Ext.each(this.columns, function(value) {
			 var property = this.lookupViewModel().get('referencedPropertyName') 
			 if(property){
				 if(property.split(".")[0] == value.dataIndex){
					 value.hidden = true
					 value.editor.disabled = true
				 }
			 }
		}, this);
	    this.callParent();
	},
});
