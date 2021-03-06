import grails.plugin.scaffold.core.ConfigUtility

class ScaffoldExtjsGrailsPlugin {
    def version = "0.7"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.4 > *"

	def dependsOn = [scaffoldCore: "* > 0.1"]
	def loadAfter = ['scaffoldCore']
	
    def title = "Scaffold Extjs Plugin" 
    def author = "Maigo Erit"
    def authorEmail = "maigo.erit@gmail.com"
    def description = '''\
Grails plugin for generating working demo with ExtJS frontend and REST backend.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/scaffold-extjs"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Online location of the plugin's browseable source code.
    def scm = [ url: "https://github.com/MayGo/grails-scaffold-extjs" ]


    def doWithSpring = {
		ConfigUtility.mergeDefaultConfig(application, 'ScaffoldExtjsDefaultConfig')
		extjsTemplatesLocator(grails.plugin.scaffold.core.DefaultTemplatesLocator, "scaffold-extjs")
	}

}
