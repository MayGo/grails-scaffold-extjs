Ext.define('${appName}.view.menu.TopMenu', {
    extend: 'Ext.container.Container',
    requires:[
		'Ext.layout.container.Border',
	],

	xtype: 'top-menu',
	controller: 'topmenu',
	items:[{
        xtype: 'segmentedbutton',
        defaults:{
			scale: 'medium',
			height:30,
			handler: function() {
				this.showMenu();
			}
        },
        allowToggle: false,
        items: [{
        		glyph: 0xf015,
                text: '<b>${appName}</b>'
            },\
            <%
            def charList = new ArrayList(61506..61802)
            Collections.shuffle(charList)
            int i = 0
            if(domainClasses.size() < 8){
	            for(d in domainClasses){%>
	            	{
	            		xtype: 'splitbutton',
	            		text: '${d.getShortName()}',
	            		value: '${d.getShortName()}',
	            		glyph: ${charList[i]},
	            		handler: 'onClickMenuItem',
	                    menu: [
	                        { 
	                        	text: Ext.i18n.MessageSource.getMsg('button.quicksearch'),
	                        	handler: 'onOpenSearch',
	                        	value: '${d.getShortName()}',
	                        	glyph: 0xf002
	                        },
	                        { 
	                        	text: Ext.i18n.MessageSource.getMsg('button.create'),
	                        	handler: 'onCreateDomainObject',
	                        	value: '${d.getShortName()}',
	                        	glyph: 0xf067 
	                        }
	                    ]
	            	},\
	            <%
	            i++
	            }
            }else{//Group menu items based on package name
            	Map groupedDomainClasses = domainClasses.groupBy([{it.packageName}])
            	groupedDomainClasses.each{packageName, domainClasses->
            	i++
            	%>
	            	{
	            		xtype: 'splitbutton',
	            		text: '${packageName.tokenize('.').last()}',
	            		glyph: ${charList[i]},
	                    menu:[
	                    <% domainClasses.each{d->
	                    i++
	                    %>
		            		{
			            		text: '${d.getShortName()}',
			            		value: '${d.getShortName()}',
			            		handler: 'onClickMenuItem',
			            		glyph: ${charList[i]},
		                    	menu: [
			                        { 
			                        	text: Ext.i18n.MessageSource.getMsg('button.quicksearch'),
			                        	handler: 'onOpenSearch',
			                        	value: '${d.getShortName()}',
			                        	glyph: 0xf002
			                        },
			                        { 
			                        	text: Ext.i18n.MessageSource.getMsg('button.create'),
			                        	handler: 'onCreateDomainObject',
			                        	value: '${d.getShortName()}',
			                        	glyph: 0xf067 
			                        }
			                    ]
		            		},
	                    <%
	                   
	                    }%>
	                    ]
	            	},\
            	<%
            	 
            	}
            }
	           %>]
    }]		
});
