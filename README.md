grails-scaffold-extjs
=====================
Grails plugin for generating working demo with ExtJS frontend and REST backend.

Creating demo
======
Need to override scaffolding config:
add to Config.groovy

grails.plugin.scaffold.core.folders = ['backend':'', 'frontendExtjs':'extjs/']

command: grails createDemo

Backend is generated with scaffold-angular plugin. So some manual edit is neccesary:
In BuildConfig.groovy, edit line: include(name: "angular/client/**"), replace  include(name: "extjs/client/**")
In bootstrap.groovy, change scaffold.InternalFrontendHelper.writeConfig('angular/client/') to scaffold.InternalFrontendHelper.writeConfig('extjs/')
In UrlMappings.groovy replace dirserveBase = 'angular/client' with dirserveBase = 'extjs/client' 

TODO
====
* Extjs filters to be sent as key/val map or convert it in serverside
* Display assasiation extra values in list/edit view.
* Use exlude in autocompletes.
* Displaying of serverside validation errors broken in extjs ver 5.0.3
* Add explanation how to go forward in building with sencha cmd.
* Add sencha licensing info
* Add config options to readme