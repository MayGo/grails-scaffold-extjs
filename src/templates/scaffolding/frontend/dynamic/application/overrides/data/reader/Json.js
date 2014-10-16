Ext.override(Ext.data.reader.Json, {
	buildExtractors : function() {
	var me = this,
		metaProp = me.getMetaProperty(),
		root = me.getRootProperty();
	me.callParent(arguments)
	// Will only return true if we need to build

		if (root) {
			me.getRoot = function (data){
				var result = data[me.getRootProperty()]
				//If there is no root element, then object itself is root
				return (result)?result:data;
			};
		} else {
			me.getRoot = Ext.identityFn;
		}

		if (metaProp) {
			me.getMeta = me.createAccessor(metaProp);
		}

	}
})