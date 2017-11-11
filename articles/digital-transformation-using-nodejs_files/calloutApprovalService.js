reportsApp.service("calloutApprovalService",['tjToast',function(tjToast){
	
    var parent = this;
    this.apiUrl = '';
    this.tenantId = '';
    this.tenantUserId = '';
    this.assetId = '';
    this.assetType = '';
    this.activeCommentId = 0;
    this.progressCount = 0;
    this.cacheUrl = "";
    this.commentSubmit = false;
    this.calloutContent = [];
    this.approvedCallouts = [];
    this.rejectedCallouts = [];
    
    this.setVals = function(obj,url,cacheUrl){
        parent.tenantId = parseInt(obj.tenantId);
    	parent.apiUrl = url;
        parent.tenantUserId = parseInt(obj.tenantUserId);
        parent.assetId = obj.assetId.toString().replace(/['"]+/g, '');
        parent.assetType = obj.assetType;
        parent.approvedCallouts =[];
        parent.rejectedCallouts = [];
        parent.activeCommentId = 0;
        parent.progressCount = 0;
        parent.saveApprovals = this.saveApprovals;
        parent.getPayload = this.getPayload;
        parent.isEmail = this.isEmail;
        parent.submitCheck = this.submitCheck;
        parent.mailTriggerCall = this.mailTriggerCall;
        parent.getmailTriggerPayload = this.getmailTriggerPayload;
        parent.cacheUrl = cacheUrl;
        
    }
    
    /* shows submit button on ready */
    this.submitShowCheck = function(){
        var showSubmit = false;
        if(parent.calloutContent.length > 0){
            for(i=0;i<parent.calloutContent.length;i++){
                var tmpStr = $('#apprej-wrapper' + (i+1)).text().trim().replace(/ /g,'');
                if(tmpStr.indexOf("Approve") > -1 &  tmpStr.indexOf("Reject") > -1){
                    showSubmit = true;
                }

            }
        }else{
            showSubmit = true;
        }
        
        return showSubmit;
    }
    
    /* initializes and renders the callout contents and onclicks */
	this.init = function(calloutCount,calloutContent,calloutFrom){

        parent.calloutContent = calloutContent;

        $('#submitall').click(function(){
                    if (confirm('Are you sure you want to notify?')) {
                        parent.mailTriggerCall();
                        $("#submitall").hide();
                        $(".btn-submit-all").hide();
                    }
                });
        
		$("#submitall").hide();
		var positions = [];
        
		for(i=0;i<calloutContent.length;i++){			

            if(calloutContent[i].status==='InProgress' | calloutContent[i].status==='active' | calloutContent[i].status==='inactive')
            {    
                
                tmp = i+1;  
                
                if(tmp > 5){
                    break;
                }
                
            
                
                if(typeof calloutContent[i].id !=='undefined'){
                	 $('#api-id-' +tmp).html(calloutContent[i].id);
                }
                
                if(typeof calloutContent[i].status !=='inactive'){
                     $('apprej-wrapper' +i).show();
                }

                

                
                
                
                $("#callout-popup" +tmp + " > heading-text").html("Callout from " + calloutFrom  +  "&nbsp;&nbsp;&nbsp;");
                
                $("#add-callout-innertext" +tmp).html(calloutContent[i].comment);
                $("#callout-popup" +tmp).show();
                
                
				
                try{
					if(typeof calloutContent[i].position !=='undefined' & calloutContent[i].position !==null){
						positions[tmp] = calloutContent[i].position;
					}
				
				}catch(e){
					console.log(JSON.stringify(e));
				}		
				
                //$("#callout-popup" +tmp).css('top',position + "px");
                $('#callout-popup' + tmp).css('left',"83%");
                $("#limiterror" + tmp).hide();
                if((calloutContent[i].status === 'InProgress')||(calloutContent[i].status === 'new')){
                    parent.progressCount++;
                	$("#apprej-wrapper" + tmp).show();
                }else{
	                	 $('#apprej-wrapper' + tmp).html(calloutContent[i].status);
	                	 if(calloutContent[i].reviewStatus === 'approved'){
	                		 parent.approvedCallouts.push(calloutContent[(tmp-1)]);
	                		 $('#apprej-wrapper' + tmp).html('Approved');
	                         $('#apprej-wrapper' + tmp).css('color','green');
	                         $('#apprej-wrapper' + tmp).show();
	                	 }else if(calloutContent[i].reviewStatus === 'rejected'){
  		
	                		 parent.rejectedCallouts.push(calloutContent[calloutContent[(tmp-1)]]);
	                		 $('#apprej-wrapper' + tmp).html('Rejected');
	                         $('#apprej-wrapper' + tmp).css('color','red');
	                         $('#apprej-wrapper' + tmp).show();
                	 }
                }
                
                $("#svedt5" + tmp).hide();
                $("#add-callout-btn" +tmp).hide();
                $('#callout-close' +tmp).hide();
                
                $('#approve-btn-' +tmp).click(function(){
                       var id =this.id;
                       tmpId = this.id.substr(id.length - 1);
            
                	if (confirm('Are you sure you want to approve this callout?')) {
                        var tmpr = calloutContent[(tmpId-1)];
                        tmpr.comment = [{'description':''}];   
                		parent.approvedCallouts.push(tmpr);
                        $('#apprej-wrapper' + tmpId).html('Approved');
                        $('#apprej-wrapper' + tmpId).css('color','green');
                        parent.saveApprovals('save',tmpId);
                        
                        if(!parent.submitShowCheck()){
                            $(".btn-submit-all").show();
                            $("#submitall").show();
                        }else{
                            $(".btn-submit-all").hide();
                            $("#submitall").hide();
                        }
                        
                	   } 
                		
                });



                $('#reject-btn-' +tmp).click(function(){
                    var id =this.id;
              		parent.activeCommentId = this.id.substr(id.length - 1);

                		$("#nerror").hide();
                    	$("#cerror").hide();
                    	$("#eerror").hide();
                        $('#comments').val("");
                });
                
               
             }
            
		}
		
        $('#saveall').click(function(){                    
                    parent.saveApprovals('save',0);
        });
        
        $('#comment-submit').click(function(){
                	
                	var hasError = false;
                	
                    var activeCommentId = parent.activeCommentId;
                    
                   // var name = $('#name').val();
                   // var email = $('#email').val();
                    var comments = $('#comments').val();
                    
                    /*
                    if(name.length < 2){
                    	$("#nerror").show();
                    	hasError = true;
                    }else{
                    	$("#nerror").hide();
                    }
                    */
                    
                    /*
                    if(!parent.isEmail(email)){
                    	$("#eerror").show();
                    	hasError = true;
                    }else{
                    	$("#eerror").hide();
                    }*/
                    
                    if(comments.length < 8){
                    	$("#cerror").show();
                    	hasError = true;
                    }else{
                    	$("#cerror").hide();
                    }
                    
                    if(hasError){
                    	return false;
                    }
                    
                    
					comments = comments.replace(/(\r\n|\n|\r)/gm," ").replace(/ +(?= )/g,'').replace(/'/gi, '"').replace(/"/gi, "\\\"");
					var tmpObj =JSON.parse('[{\"description\":\"' + comments + '\"}]');
                    calloutContent[(activeCommentId-1)].comment = tmpObj;  
                    parent.rejectedCallouts.push(calloutContent[(activeCommentId-1)]);
                    //parent.saveApprovals('save',activeCommentId);
                    $('#apprej-wrapper' + activeCommentId).html('Rejected');
                    $('#apprej-wrapper' + activeCommentId).css('color','red');                    
                    $('#myModal').modal('hide');
                    parent.commentSubmit = true;
                    parent.saveApprovals('save',activeCommentId);
                    
                   if(!parent.submitShowCheck()){
                        $(".btn-submit-all").show();
                        $("#submitall").show();
                    }else{
                        $(".btn-submit-all").hide();
                        $("#submitall").hide();
                    }
                
                });
        
        if(!parent.submitShowCheck()){
            $(".btn-submit-all").show();
            $("#submitall").show();
        }else{
            $(".btn-submit-all").hide();
            $("#submitall").hide();
        }
		
		return positions;
    
	}
    
    /* JSON change for API */
    this.fixJson = function(){
        
        for(i=0;i<parent.approvedCallouts.length;i++){
             
            var tmpr = parent.approvedCallouts[i];

            if(typeof tmpr !== 'undefined')
            {
                if(typeof tmpr.comment !== 'undefined' & tmpr.comment !==null & typeof tmpr.comment !=="object"){
                    tmpr.comment = [{'description':''}]; 
                    parent.approvedCallouts[i] = tmpr;
                }
            }
        }
        
        for(j=0;j<parent.rejectedCallouts.length;j++){            
            var tmpr = parent.rejectedCallouts[j];
            if(typeof tmpr !== 'undefined')
            { 
                if(typeof tmpr.comment !== 'undefined' & tmpr.comment !==null & typeof tmpr.comment !=="object"){
                    tmpr.comment = [{'description':''}];
                    parent.rejectedCallouts[j] = tmpr;
                }
            }
        }
       }
    
    /* save the approvals in the API */
    this.saveApprovals = function(operation,calloutNum){
    	parent.fixJson();
        var payload = parent.getPayload(operation);

        $.ajax({
        	  url: parent.apiUrl,
        	  type: 'PUT',
        	  data: payload,
        	  success: function(data) {
        	    
        	  }
        	});
    }
    
    /* Clears the DB cache by calling API */
    this.clearCache = function(){
		var cacheClearCount=1;
        var cPayload = {"assetArray":parent.tenantId.toString() + parent.tenantUserId + parent.assetId+parent.assetType};
        $.ajax({
        	  url: parent.cacheUrl,
        	  type: 'GET',
        	  data: cPayload,
        	  success: function(data) {
				  console.log(data);
				  
        	  },
			  error: function(data) { 
				if(cacheClearCount <= 5){
					cacheClearCount=cacheClearCount+1;
					parent.clearCache();
				}else{
					console.log(data);
				}
				
			  } 
        	});
    }
    
    
    /* Submits all the callouts */
    this.mailTriggerCall = function(){
        
        var payload = parent.getmailTriggerPayload();

        $.ajax({
        	  url: parent.apiUrl,
        	  type: 'PUT',
        	  data: payload,
        	  success: function(data) {
                  parent.clearCache();
        		  //alert("submitted");
                  tjToast.enqueue({
               		 level: 'success',
               		    text: 'Notified Successfully!',
               		    xclass: 'tjToast-3dc'
                      });
                      tjToast.now();
        	  }
        	});
    }
    
    /* Constructs payload for API call */
    this.getmailTriggerPayload = function(){
        
        var payload = {
                "type":"callout",
                "operation":"sendMailNotification",
                "assetInfo":{
                    "tenantId":parent.tenantId,
                    "tenantUserId":parent.tenantUserId,
                    "assetId":parent.assetId
                }
            };
        
        return payload;
        
    }
    
    /* diplays submit button when ready */
    this.submitCheck = function(){$("#submitall").show();
    	var progressCount = parent.progressCount;
    	var allCount = parent.approvedCallouts.length + parent.rejectedCallouts.length;

        if(progressCount > 0 & allCount > 0){
            $(".btn-submit-all").hide();     		
    	}else{
            $(".btn-submit-all").show();
        }
    }
    
    /* constructs the payload */
    this.getPayload = function(){
        
        var assetInfo = {
                                "tenantId": parent.tenantId,
                                "tenantUserId": parent.tenantUserId,
                                "assetId": parent.assetId
                };

        var apprsec = parent.approvedCallouts;
        
        if(parent.commentSubmit){
            apprsec = [];
            parent.commentSubmit = false;
        }
            
        var reviewContents = {"approvedSection":apprsec,"rejectedSection":parent.rejectedCallouts}
        
        var payload = { "type": "callout",
                "operation": "review",
                "assetInfo":assetInfo,
                "reviewContents":reviewContents  }
       

        return payload;
    }
    
    /* email validation */
     this.isEmail = function(email) {
    	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	  return regex.test(email);
    	}
}]);