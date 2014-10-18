<%=packageName ? "package ${packageName}\n" : ''%>

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.rest.RestfulController
import grails.plugin.scaffold.core.ScaffoldCoreService

@Transactional(readOnly = true)
class ${className}Controller extends RestfulController{

    static responseFormats = ['json']
	
	${className}Controller() {
		super(${className}, false /* read-only */)
	}
	
	def index(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		
		// Parses params.query for dynamic search and uses params.offset/params.max for paging. Returns [list: results, total: results.totalCount] for paging grid.
		// This is here so running demo works right away. Should be replaced with own service, eg: ${domainClass.propertyName}Service.list(params)
		def listObject = ScaffoldCoreService.parseParamsAndRetrieveListAndCount(resource, params)
		respond listObject as Object
	}
}
