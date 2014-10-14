Ext.define('${appName}.view.BaseListController', {
	extend : 'Ext.app.ViewController',
	
	 requires: [
        '${appName}.services.TabService'
    ],

    addItemHandler : function() {
		var grid = this.view;
		var store = grid.store;
		var plugin = grid.getPlugin('rowediting');
		var rec = Ext.create(store.model);
		
		//Set referencedPropertyName as default value
		var viewModel = grid.lookupViewModel()
		var property = viewModel.get('referencedPropertyName') 
		if(property){
			property = property.split(".")[0]
			var theDomainObject = viewModel.linkData.theDomainObject
			rec.set(property, theDomainObject.getId());
		}
		store.insert(0, rec);
		plugin.startEdit(0, 0);
	},
	
	onSearchSpecialKey: function(field, event, options) {
		// Enable submitting with enter in field
		if (event.getKey() == event.ENTER) {
			this.onSearchClick();
		}
	},
	
	deleteItemHandler : function() {
		var grid = this.view;
		var store = grid.store;
		var selection = grid.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			store.remove(selection);
			store.sync();
		}
	},

	onSelectionChangeListener : function(model, selection) {
		var grid = this.view;
		grid.down('#delete').setDisabled(selection.length === 0);
	},

	init : function() {

	},
	openDomainObjectInTab: function (view, rowIdx, colIdx, item, e, rec) {
		${appName}.services.TabService.openDomainDetailTab(rec);
    },
    
    onSearchClick: function(){
		var store = this.getViewModel().get('listStore');
		var formPanel = this.lookupReference('listSearchForm')
		var params = formPanel.getValues()
		store.load({
			params:params
		});
    }

});
