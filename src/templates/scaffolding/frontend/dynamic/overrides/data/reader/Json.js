Ext.override(Ext.data.reader.Json, {
	
	//inherit docs
    getResponseData: function(response) {
        try {
            var json = Ext.decode(response.responseText);
            
            // Add header parameter 'total' as response item
            var total = response.getResponseHeader('total');
            if(total) json.total = total;
            
            return json
        } catch (ex) {
            Ext.Logger.warn('Unable to parse the JSON returned by the server');
            return this.createReadError(ex.message);   
        }
    },
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