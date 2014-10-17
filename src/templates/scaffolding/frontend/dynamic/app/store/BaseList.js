Ext.define('${appName}.store.BaseList', {
	extend : 'Ext.data.Store',
	requires : [ 'Ext.data.proxy.Rest' ],
	autoLoad : false,
	autoSync : false,
	pageSize : 50,
	remoteFilter : true,
	remoteSort:true,
	
	listeners : {
		write : function(store, operation, eOpts) {
			var record = operation.getRecords()[0]
			var name = operation.action;

			var verb = Ext.i18n.MessageSource.getMsg('operation.' + name);
			Ext.toast({
				html : Ext.String.format("{0} {1}", verb, record.get('uniqueName')),
				align : 't',
				bodyPadding : 10
			});
		}
	}

});
