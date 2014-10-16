Ext.define('${appName}.view.BaseRestGrid', {
	extend : 'Ext.grid.Panel',
	requires : 'Ext.grid.filters.Filters',
	columnLines : true,
	autoScroll:true,
	height:100,
	minHeight:300,
	width:'100%',
	multiColumnSort : true,
	multiSelect : true,
	
	selModel : {
		pruneRemoved : false,
		listeners : {
			selectionchange : 'onSelectionChangeListener'
		}
	},

	defaultColumns : [{
		xtype : 'rownumberer',
		width : 40,
		sortable : false
	},  {
        xtype: 'actioncolumn',
        width: 25,
        items: [{
            tooltip: 'Open domain object',
            handler: 'openDomainObjectInTab',
            icon: 'resources/images/eye.png'
        }]
    }, {
		text : 'ID',
		width : 50,
		sortable : true,
		dataIndex : 'id',
		renderer : function(v, meta, rec) {
			return rec.phantom ? '' : v;
		}
	}],
	
	dockedItems: [{
		dock : 'top',
		xtype : 'toolbar',
		items : ['->', {
			text : 'Add',
			glyph: 0xf055,
			handler : 'addItemHandler'
		}, '-', {
			itemId : 'delete',
			text : 'Delete',
			glyph: 0xf056,
			disabled : true,
			handler : 'deleteItemHandler'
		}]
	},{
		xtype : 'pagingtoolbar',
		reference: 'pagingtoolbar',
		bind:{
			store: '{listStore}'
		},
		dock : 'bottom',
		displayInfo : true
	}],

	
	listeners:{
		afterrender: function( self){
			// pagingtoolbar bind store not working properly
			// Bug  EXTJS-14469 fixed in 5.0.2.
			// As a workaround delay refresh
			var task = new Ext.util.DelayedTask(function(){
				var paging = this.lookupReference('pagingtoolbar');
				if(paging && paging.store.autoLoad) paging.doRefresh();
			}, this);
			task.delay(500);
		}
	},
    
	viewConfig : {
		stripeRows : true
	},
	plugins : [{
		ptype : 'rowediting',
		pluginId : 'rowediting',
		listeners:{
			edit: function(editor, e) {
			    e.store.sync();
			}
		}
	}]
});
