/**
 * This class is the ViewModel for the asset details view.
 */
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedListModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.${domainClass.propertyName.toLowerCase()}-embedded-listviewmodel',
   
    stores:{
    	listStore:{
            type:'${domainClass.getShortName().toLowerCase()}-liststore',
            filters: [{
                property: '{referencedPropertyName}',
                value: '{theDomainObject.id}'
            }],
            autoLoad: '{!isNew}'
        }	
	}
});
