Ext.define('${appName}.view.login.Login',{
	extend: 'Ext.window.Window',
	xtype: 'login',

	requires: [ 
	     '${appName}.view.login.LoginController',
	     'Ext.form.Panel'
    ],

   	controller : 'login',
	title : 'Login Window',
	frame:true,
	closable : false,
	autoShow : true,

	items : {
		xtype : 'form',
		reference : 'form',
		bodyPadding: 15,
		jsonSubmit : true,
		defaults : {
			listeners : {
				specialkey : function(field, event, options) {
					// Enable submitting with enter in field
					if (event.getKey() == event.ENTER) {
						var loginBtn = field.up('form').down('button#loginBtn');
						if (loginBtn.disabled == false)
							loginBtn.fireHandler();
					}
				}
			}
		},
		items : [ {
			xtype : 'textfield',
			name : 'username',
			fieldLabel : 'Username',
			emptyText: 'username',
			allowBlank : false
		}, {
			xtype : 'textfield',
			name : 'password',
			inputType : 'password',
			fieldLabel : 'Password',
			emptyText: 'password',
			allowBlank : false
		}],
		buttons : [ {
			text : 'Login',
			itemId : 'loginBtn',
			formBind : true,
			handler : 'onLogin'
		} ],
		
	}
});