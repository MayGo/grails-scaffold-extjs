Ext.define('${appName}.view.login.LoginController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.login',

	views : [ 'main.Main' ],

	onLogin:function(loginBtn) {
		var form = loginBtn.up('form').getForm();
		// Can't use form.submit({..}), because rest login succes does not return success:true parameter
		Ext.Ajax.request({
            url: ${appName}.config.Runtime.getLoginUrl(),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            params : Ext.JSON.encode(form.getValues()),
            success: function(response, options) {
                var result = Ext.JSON.decode(response.responseText); 
				
				
				var profile = Ext.create('${appName}.model.Profile');
				profile.setLoginData(result);

				// Remove Login Window
				this.getView().destroy();

				// Add the main view to the viewport
				Ext.widget('app-main');
             
            },
            failure: function(response, options) {
				if(response.status == 401){
					Ext.Msg.alert('Login Failed!',	response.statusText);
				}else {
				    var txt = (response.responseText)?response.responseText:response.statusText
				    Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + txt);
				}
				// login.getForm().reset();
            },
            scope:this
        });
	}
});
