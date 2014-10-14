Ext.define('${appName}.view.BaseDetailView', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    
    bind: {
        title: '{theDomainObject.tabName}'
    },
    
    tbar: [{
        text: Ext.i18n.MessageSource.getMsg('button.save'),
        handler: 'onSaveClick',
        scale: 'medium',
		hidden: true,
    	 bind: {
             hidden: '{isReadOnly}',
             disabled : '{!status.dirty}'
         }
    },{
        text: Ext.i18n.MessageSource.getMsg('button.reset'),
        handler: 'onResetClick',
        scale: 'medium',
		hidden: true,
    	 bind: {
             hidden: '{isReadOnly}',
             disabled : '{!status.dirty}'
         }
    },{
        text: Ext.i18n.MessageSource.getMsg('button.edit'),
        handler: 'onEditClick',
        scale: 'medium',
    	 bind: {
             hidden: '{!isReadOnly}'
         }
    }]
});
