Ext.define('Ext.ux.form.RestCombo', {
	extend: 'Ext.form.field.ComboBox',

	alias: 'widget.restcombo',

	listeners:{
		change: function() {
			//Load full object from store using objects id
			var customObj = this.getValue();
			if(Ext.isObject( customObj ) ){
				var id = customObj['id'];
				this.store.load({
					id: id,
					scope:this,
					addRecords:true,
					callback: function(records, operation, success){
						if(success && records.length == 1){
							this.setValue(records[0]);
							this.resetOriginalValue();
						}
					}
				});
			}
		}
	}
});