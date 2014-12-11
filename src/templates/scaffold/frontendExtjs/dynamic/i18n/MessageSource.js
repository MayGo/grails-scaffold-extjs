Ext.define('Ext.i18n.MessageSource', {
	singleton: true,
	//Require all available locales
	requires:['Ext.i18n.Messages_et'],
	config: {
      
		/**
		 * @cfg bundle {String} bundle name for properties file. Default to message
		 */
		bundle: 'Messages',
	},

	constructor: function(config){
		var config = this.initConfig(config);

		var me = this;
		var baseLanguage = me.getBaseLanguageCode( me.guessLanguage() )
		var	language = me.formatLanguageCode( me.guessLanguage());
	
		if(Ext.ClassManager.isCreated(me.buildClassName(language))){// e.g en-US, can be also en
			me.messages = Ext.create(me.buildClassName(language));
		}else if(Ext.ClassManager.isCreated(me.buildClassName(baseLanguage))){ // e.g. en
			me.messages = Ext.create(me.buildClassName(baseLanguage));
		}else{
			me.messages = Ext.create("Ext.i18n.Messages");
		}
	
		if(me.messages){
			this.translations = this.getTranslationsMap(me.messages.__proto__.translations);		
		}else{
			console.log("No i18n messages found.")
		}
		
	},
	
	/**
	 * @method: getMsg
	 * Returns the content associated with the bundle key or {bundle key}.undefined if it is not specified.
	 * @param: key {String} Bundle key.
     * @param: values {Mixed...} if the bundle key contains any placeholder then you can add any number of values
     * that will be replaced in the placeholder token.
	 * @return: {String} The bundle key content.
	 */
	getMsg: function(key /*values...*/){
        var values = [].splice.call(arguments, 1),
            decoded = key + '.undefined',
            args;

		var text;
        if(this.translations.containsKey(key)){
			text = this.translations.get(key);	
            decoded = Ext.util.Format.htmlDecode(text);

            if(values){
                args = [decoded].concat(values);
                decoded = Ext.String.format.apply(null, args);
            }
        }

        return decoded;
	},
	
	/**
	 * @private
	 */
	guessLanguage: function(){
		return (navigator.language || navigator.browserLanguage || navigator.userLanguage || this.defaultLanguage);
	},

	
	
	/**
	 * @private
	 */
	getTranslationsMap: function (obj, parent) {
 	
        function traverse(obj, parentPath){
			var map = new Ext.util.HashMap();
			var key;
            for (key in obj){
                if(obj.hasOwnProperty(key)){
                    var path = (parentPath ? parentPath + '.' : '') + key;
                    if(Ext.isObject(obj[key])){
						traverse(obj[key], path).each(function(key, value, length){
							map.add(key, value);
						});
					}else{
						map.add(path, obj[key]);
					}
                }
            }

			return map;
        }
		return traverse(obj, '');

    },


	/**
	 * @private
	 */
	buildClassName: function(language){
		var url = 'Ext.i18n.';
		url+=this.config.bundle;
		if (language) url+= '_'+language;

		return url;
	},

	/**
	 * @private
	 */
	formatLanguageCode: function(lang){
		var langCodes = lang.split('-'),
            primary, second;
		primary = (langCodes[0]) ? langCodes[0].toLowerCase() : '';
		second = (langCodes[1]) ? langCodes[1].toUpperCase() : '';

        return langCodes.length > 1 ? [primary, second].join('_') : primary;
	},
	/**
	 * @private
	 */
	getBaseLanguageCode: function(lang){
		var langCodes = lang.split('-'),
            primary, second;
		primary = (langCodes[0]) ? langCodes[0].toLowerCase() : '';

        return  primary;
	}


});