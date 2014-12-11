Ext.define('${appName}.config.Runtime',{
	singleton : true,
	config : {
		applicationUrl : '${appUrl}',
		loginUrl : '${appUrl}${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"/api/login"}',
		logoutUrl : '${appUrl}${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"/api/logout"}',
		validationUrl:  '${appUrl}${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"/api/validate"}',
		securityEnabled : ${(config.grails.plugin.springsecurity.rest.login.active)?:false}
	},
	constructor : function(config){
		this.initConfig(config);
	}
});
