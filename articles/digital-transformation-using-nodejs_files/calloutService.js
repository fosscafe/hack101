reportsApp.service("calloutService",function(){
    
	this.positions = [];
	
    /* renders the callout content */
	this.init = function(calloutCount,calloutContent,calloutFrom){
        for(i=0;i<calloutContent.length;i++){
			tmp = i+1;
            
			if(calloutContent[i].status === 'active')
			{
                $("#callout-popup" + tmp + " > heading-text").html("Callout from " + calloutFrom  +  "&nbsp;&nbsp;&nbsp;");
				$("#add-callout-innertext" +tmp).html(calloutContent[i].comment);
				$("#callout-popup" +tmp).show();
				
				try{
					if(typeof calloutContent[i].position !=='undefined' & calloutContent[i].position !==null){
						this.positions[tmp] = calloutContent[i].position;
					}
				
				}catch(e){
					console.log(JSON.stringify(e));
				}				

				//$('#callout-popup' + tmp).css('left',"83%");
				$("#limiterror" + tmp).hide();
				$("#add-callout-btn" +tmp).hide();
				$('#callout-close' +tmp).hide();
			}
		}

        return this.positions;
	}
});

