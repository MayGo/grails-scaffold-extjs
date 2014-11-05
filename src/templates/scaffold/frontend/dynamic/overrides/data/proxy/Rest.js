Ext.override(Ext.data.proxy.Rest, {
    setException: function(operation, response){
        console.log("REST Exception");
		
        operation.response = response;
        operation.responseText = response.responseText;
        try{
            operation.responseData = Ext.JSON.decode(operation.responseText); 
        }catch(ex){

        }
        operation.setException({
            status: response.status,
            statusText: (response.statusText)?response.statusText:"Error getting response from server."
        });
    }
});