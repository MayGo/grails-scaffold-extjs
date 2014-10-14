/**
 * This class is the base class for all entities in the application.
 */
Ext.define('${appName}.model.Base', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'uniqueName',
		type : 'string',
		convert : function(newValue, model) {
			return (model.get('id')?model.getDomainName() + " " + model.get('id'):model.toString());
		},
		depends: ['id']
	}, {
		name : 'tabName',
		type : 'string',
		convert : function(newValue, model) {
			var isNewStr = (Ext.isNumeric(model.get('id')))?'':' [new]';
			return model.getDomainName() + isNewStr +  " - " + model.get('uniqueName');
		},
		depends: ['uniqueName']
	}
	],
	
	schema : {
		namespace : '${appName}.model',

		proxy : {
			type : 'rest',
			
			url : ${appName}.config.Runtime.getApplicationUrl() +'/{entityName:lowercase}s',
			reader: {
			    rootProperty : 'list',
			    totalProperty  : 'total'
			},
			startParam:'offset',
			limitParam:'max'
		}
	},
	
	getDomainName:function(){
		return Ext.getDisplayName(this).split(".").pop();
	},
	
	toString:function(){
		var text = "";
		var data = this.getData({persist:true});
		Ext.iterate(data, function(key, value) {
		 if(Ext.isObject(value)){
			 if(Ext.isDefined(value['class']) && Ext.isDefined(value.id)){
				 text += value['class'].split(".").pop()
				 text += "-"+value.id
				 text += " "
			 }
		 }else if(key == 'class'){
			 
		 }else if(value){
			 text += key + ":" + value
			 text += " "
		 }
		
		});
		return (text)?"["+text+"]":''
	},
	
	proxy : {
		listeners:{
			exception :function(proxy, type, operation){
				if(operation.request._records && operation.request._records[0].id && operation.responseData && operation.responseData.errors){ 
					var recordId = operation.request._records[0].id;
				
					var tabView = Ext.getCmp('myTabpanel').getActiveTab();
				
					if(tabView instanceof ${appName}.view.BaseRestGrid){
						var view = tabView.getView();
						var instance = view.getRecord(recordId);
						var editor = tabView.getPlugin('rowediting');
						editor.startEdit(tabView.store.indexOfId(recordId), 0);
	
						Ext.each(operation.responseData.errors, function(error, index) {
							editor.editor.down("[name=" + error.field + "]").markInvalid(error.message);
						});	
					}
				}else{
					Ext.MessageBox.show({
						title : 'Remote Exception',
                        msg : operation.responseText?operation.responseText:operation.getError().statusText,
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			}
		}
	}

});
