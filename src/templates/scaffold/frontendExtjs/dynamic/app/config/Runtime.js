Ext.define('${appName}.config.Runtime',{
	singleton : true,
	removeSlash : function(str){
		if(str.substr(0, 1) === '/' ){
			 str = str.substr(1);
		}
		return str;
	},
	
	appendSlash: function(str){
		if(str.substr(-1) !== '/' ){
			str += '/';
		}
		return str;
	},
		
		//Set defaults
	defaultConfig: {
		restUrl : '${appUrl}',
		loginUrl : '${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"api/login"}',
		logoutUrl : '${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"api/logout"}',
		validationUrl: '${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"api/validate"}',
		securityEnabled: ${(config.grails.plugin.springsecurity.active)?:false},
	},
	loadSuccess : function( data ) {
		if(data.responseText){
			this.defaultConfig = Ext.apply({}, this.defaultConfig, Ext.JSON.decode(data.responseText));
		}
	},

	constructor : function(){
		// Load external config
		Ext.Ajax.request({
		    url: 'config.json',
		    async: false,
		    scope: this,
		    success: this.loadSuccess,
		});
		
		// Return correct config
		var restUrl = this.appendSlash(this.defaultConfig.restUrl);
		var config = {
			restUrl : restUrl,
			loginUrl : restUrl + this.removeSlash(this.defaultConfig.loginUrl),
			logoutUrl : restUrl + this.removeSlash(this.defaultConfig.logoutUrl),
			validationUrl: restUrl + this.removeSlash(this.defaultConfig.validationUrl),
			securityEnabled : this.defaultConfig.securityEnabled,
		};
		this.initConfig(config);
	}
	
});
