Ext.define('${appName}.view.BaseDetailController', {
	extend : 'Ext.app.ViewController',

	requires : ['Ext.window.Toast'],

	onSaveClick : function() {
		var form = this.lookupReference('baseform'), rec;
		if (form.isValid()) {
            rec = this.getViewModel().getData().theDomainObject;
			// TODO: implement isolated sessions
			Ext.Msg.wait('Saving', 'Saving ...');
			rec.save({
				scope : this,
				success : this.onSuccess,
				failure : this.onFailure
			});
		}
	},
	onResetClick : function() {
		var rec = this.getViewModel().getData().theDomainObject;
		rec.reject();
	},
	onEditClick : function() {
		this.getViewModel().set('isReadOnly', false);
	},
	

	onSuccess : function(list, operation) {
		Ext.Msg.hide();
		var record = operation.getRecords()[0]
		var name = operation.action;
		var verb = Ext.i18n.MessageSource.getMsg('operation.' + name);

		Ext.toast({
			html : Ext.String.format("{0} {1}", verb, record.get('uniqueName')),
			align : 't',
			bodyPadding : 10
		});
		
	},
	
	onFailure : function(obj, operation) {
		this.getViewModel().set('dataHasChanged', true);
		Ext.Msg.hide();
		var form = this.lookupReference('baseform');
		var error = operation.getError(), msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
		var errors = [];
		
		if(operation.responseData){
			
			var isArrayPattern = /(.*)(?=.*\\[.*\\])/g;
			var relationsErrors = new Ext.util.HashMap();
			Ext.each(operation.responseData.errors, function(error, index) {
				var field = error.field;
				//Search if error contains relation error e.g: user.role[0].name
				var isArrayMatch = field.match(isArrayPattern);
				if(isArrayMatch && isArrayMatch.length > 0){
					var relationName = isArrayMatch[0];
					var relationFieldName = field.substr(field.indexOf(".")+1);
					
					//Hold all relations field errors
					var fieldErrors = relationsErrors.get(relationName);
					if (!fieldErrors) {
						fieldErrors = new Ext.util.HashMap();
					}
					fieldErrors.add(relationFieldName, error.message);
					relationsErrors.add(relationName, fieldErrors);
				}else{
					errors.push({id:field, msg:error.message});
				}
			});
			relationsErrors.each(
				function(key, value, length){
				    errors.push({id:key, msg:value});
				}
			);
		}
		
		if(errors.length>0){
			//form.getForm().markInvalid(errors);
			//in ver 5.0.1 markInvalid on form doesn't work. So add separatelly
			Ext.each(errors, function(error, index) {
				form.down('#'+error.id).markInvalid(error.msg);
			});
		}else{
			Ext.MessageBox.show({
				title : 'Save Failed',
				msg : msg,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
		}
		
	}
});
