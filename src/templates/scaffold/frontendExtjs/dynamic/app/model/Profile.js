/**
 * This class is the base class for all entities in the application.
 */
Ext.define('${appName}.model.Profile', {
	extend : 'Ext.data.Model',

	fields : ['username','token'],
	
	store: new Ext.util.LocalStorage({ id: 'profile' }),
	
	setLoginData: function(data){
		var usernamePropertyName = '${(config.grails.plugin.springsecurity.rest.token.rendering.usernamePropertyName)?:"username"}'
		var tokenPropertyName = '${(config.grails.plugin.springsecurity.rest.token.rendering.tokenPropertyName)?:"access_token"}'
		var authoritiesPropertyName = '${(config.grails.plugin.springsecurity.rest.token.rendering.authoritiesPropertyName)?:"roles"}'
		
		this.set('username', data[usernamePropertyName]);
		this.set('token', data[tokenPropertyName]);
		
		this.setLoginDataToLocalStorage()
		this.setTokenToDefaultHeaders()
	},
	
	setLoginDataToLocalStorage: function(){
		// Set the localStorage values
		this.store.setItem("username", this.get('username'));
		this.store.setItem("token", this.get('token'));
	},
	
	setLoginDataFromLocalStorage: function(){
		this.set('username', this.store.getItem("username"));
		this.set('token', this.store.getItem("token"));
		this.setTokenToDefaultHeaders()
	},
	
	isLoggedIn: function(){
		return (this.get('token'))
	},
	
	setTokenToDefaultHeaders: function(){
		var headerName = '${(config.grails.plugin.springsecurity.rest.token.validation.headerName)?:"X-Auth-Token"}'
		var defaultHeaders=[];
		defaultHeaders[headerName] = this.get('token');
		Ext.Ajax.setDefaultHeaders(defaultHeaders);
	}
	
	/**
	 * @property {${appName}.model.${(config.grails.plugin.springsecurity.userLookup.userDomainClassName)?config.grails.plugin.springsecurity.userLookup.userDomainClassName.tokenize('.').last():'none'}} currentUser //
	 */

});
