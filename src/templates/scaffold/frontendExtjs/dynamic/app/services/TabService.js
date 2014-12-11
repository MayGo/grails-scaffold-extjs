
Ext.define('${appName}.services.TabService', {
   singleton: true,
   
   createTab: function (prefix, rec, cfg) {
        var tabs = Ext.getCmp('myTabpanel');
        var  id = prefix + "_tab";
        if(rec) id =prefix + '_' + rec.getId();
        var  tab = tabs.items.getByKey(id);


        if (!tab) {
            cfg.itemId = id;
            cfg.closable = true;
            if(rec) cfg.title = rec.get('uniqueName');
            tab = tabs.add(cfg);
        }

        tabs.setActiveTab(tab);
        return tab;
    },
    openDomainDetailTab: function(rec, isNew){
		var domain = rec.getDomainName();
    	var xtype = this.domainDetailXtype(domain);
    	var domainObject = rec
    	var isReadOnly = true
    	if(isNew){
    		isReadOnly = false
    		domainObject = {
    			type: domain,
    			create:true
    		}
    	}else{
    		isNew = false
    	}
    	var tab = this.createTab(domain, rec, {
            xtype: xtype,
            viewModel:{
            	data:{
            		isReadOnly: isReadOnly,
            		isNew: isNew
            	},
            	links: {
        			theDomainObject: domainObject
            	}
            }
        });
	},
	domainListXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "-listview";
	},	
	
	domainDetailXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "-detailview";
	}
	
});
