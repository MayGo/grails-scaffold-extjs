Ext.define('Ext.ux.form.JoinPropertyMultiselector', {
	extend: 'Ext.view.MultiSelector',

	alias: 'widget.joinproperty-multiselector',
	viewConfig: {
        deferEmptyText: false,
        emptyText: 'No items selected'
    },
     
    processRowEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
        if (e.type !== 'click') {
            return;
        }
        if (Ext.fly(cell).hasCls(Ext.baseCSSPrefix + 'multiselector-remove')) {
            this.store.remove(record);
            // Store binding does not work correctly. So adding to theDomainObject manually.
		    this.collectAndSetRelationData();
            if (this.searchPopup) {
                this.searchPopup.deselectRecords(record);
            }
        }
    },
    collectAndSetRelationData: function(){
    	var propertyName = this.relFieldName;
		var relationObjectName = this.itemId;
    	var listStore = this.getStore();
    	//Collect data to be sent to server
	    var recordArr = new Array();
	   
	    var domainObjId = this.lookupViewModel().get('theDomainObject.id');
	    listStore.each(function(record){
			var responseObj = {};
			if(!record.phantom) responseObj.id = record.id;
			responseObj.terminal = {'id':domainObjId};
			responseObj[propertyName] = {'id':record.data[propertyName].id};
			recordArr.push(responseObj);
		});
		    //set it to theDomainObject.terminalGrupid
		this.lookupViewModel().set('theDomainObject.'+relationObjectName, recordArr);
    },
    
    search: {
    	selectRecords: function(){},// No need to select items in searchbox
    	makeItems: function () {
 	        return [{
 	            xtype: 'grid',
 	            reference: 'searchGrid',
 	            trailingBufferZone: 2,
 	            leadingBufferZone: 2,
 	            viewConfig: {
 	                deferEmptyText: false,
 	                emptyText: 'No results.'
 	            },
 	            selModel: {
                     selType: 'cellmodel',
                     listeners: {
                         selectionchange: 'onSelectionChange'
                     }
                 }
 	        }];
 	    },
		onSelectionChange: function (selModel, selection) {
		    var owner = this.owner,
		    	listStore = owner.getStore(),
		        data = listStore.data,
		 	i, record;
		    //Just add selection to store
		    for (i = selection.length; i--; ) {
		        record = selection[i];
		        if (!data.containsKey(record.id)) {
		            if(record.store.getModel().$className != listStore.getModel().$className){
		            	// is searched model, that contains necessary data, that needs to be converted
		            	var obj = {}
		            	obj[owner.relFieldName] = record;
						listStore.add(listStore.getModel().create(obj));
					}else{// is correct model
						listStore.add(record);
					}
		        }
		    }
		    // Store binding does not work correctly. So adding to theDomainObject manually.
		    owner.collectAndSetRelationData();
		    
		},
    }
});