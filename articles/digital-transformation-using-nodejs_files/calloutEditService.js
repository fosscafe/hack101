reportsApp.service("calloutEditService",['tjToast',function(tjToast){
    
    var parent = this;
    /*this.booleanIdVal=false;*/
    this.offsetTop = 0;
    this.footerHeight = 44;
    this.numChar = 300;
    this.called = false;
    this.base64 = '';
    this.base64_1 = '';
    this.base64_2 = '';
    this.base64_3 = '';
    this.base64_4 = '';
    this.gposx = 0;
    this.gpoxy = 0;
    this.parentid = false;
    this.currParentId = false;
    this.activeCallouts = [];
    this.activeCalloutps = [];
    this.calloutpIds = [];
    this.calloutNum = 1;
    this.tenantId = 2;
    this.tenantUserId = 1;
    this.assetId = '';
    this.apiUrl = '';
    this.assetType = 'reports';
    this.localCallouts = [];
    this.calloutCount
    this.calloutContent = [];
    this.reviewComments = [];
    this.calloutFrom = '';
    this.keywords = [];
    this.rejectTracking = [];
    this.allCallouts = 0;

    /* return the available callout */
    this.getActiveCount = function(){
        var count = 0;
         for(i=0;i<parent.activeCallouts.length;i++){
             if(parent.activeCallouts[i]){
                 count++;
             }
         }
        
        return count;
    }
    
    /* shows the submit button when ready */
    this.showSubmitCheck = function(){        
        var activeCount = parent.getActiveCount();
        //if(activeCount === parent.calloutCount){
        if(activeCount > 0){
            $("#submitall").show();
        }else{
            $("#submitall").hide();
        }
    }
    
    /* Setting values from report controller */
    this.setVals = function(obj,url,numCallouts,calloutContent,calloutFrom,reviewComments){
        
        parent.tenantId = parseInt(obj.tenantId);
        parent.calloutCount = numCallouts;
        parent.apiUrl = url;
        parent.tenantUserId = parseInt(obj.tenantUserId);
        parent.assetId = obj.assetId.toString().replace(/['"]+/g, '');
        parent.assetType = obj.assetType;
        parent.calloutContent = calloutContent;
        parent.calloutFrom = calloutFrom;
        
        for(k=0;k<numCallouts;k++){
            parent.activeCallouts.push(false);
        }
        
        for(j=0;j<reviewComments.length;j++){
            if(Object.prototype.toString.call( reviewComments[j] ) === '[object Object]'){
                
                var myObj = reviewComments[j];
                
                if(typeof myObj.calloutId !=='undefined' & typeof myObj.reviewComment !=='undefined' & myObj.reviewComment !==null & myObj.reviewComment !==''){  
                    
                    var y =1;
                    for(y=0;y<calloutContent.length;y++){
                        var ytmp = y+1;
                        var objCallout =calloutContent[y]; 
                        if(objCallout.id === reviewComments[j].calloutId){ //not sure
                            parent.reviewComments[reviewComments[j].calloutId] = myObj.reviewComment;
                        }
                    }
                }
            }else{
                    
            }
            
            
        }
        
  }
    
    
    /* returns true if old IE version */
    this.oldIE = function(){
        
        if ($('html').is('.lt-ie7, .lt-ie8, .lt-ie9')) {
            return true;
        }else{
            return false;
        }
        
    }
    
     /* return the callout div which is free */ 
    this.getAvailableCallout = function(){
        
        for (i = 0; i < parent.activeCallouts.length;i++) {
            var tmp = i+1;
            if(parent.activeCallouts[i]===false){
                return tmp;
            }
        }
        
        return false;
    };
    /* limits the char of the editor to 300 */
    this.limitChars = function(instanceName,calloutNum){
        
        numChar = 300;
        if(typeof CKEDITOR.instances[instanceName] !== 'undefined'){
            
            
        }
    }
    
    /* gets the parent calloutp div used for the selection */
    this.getSelectionParentElement = function () {
        var parentEl = null, sel;
        try{
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    parentEl = sel.getRangeAt(0).commonAncestorContainer;
                    if (parentEl.nodeType != 1) {
                        parentEl = parentEl.parentNode;
                    }
                }
            } else if ( (sel = document.selection) && sel.type != "Control") {
                parentEl = sel.createRange().parentElement();
            }
        }catch(e){
                    console.log(JSON.stringify(e));
            }
        
        try {
            
            while(parentEl !== null &  parentEl.tagName !== null & typeof parentEl.tagName !== 'undefined' & parentEl.tagName !== 'CALLOUTP' & parentEl.tagName !== 'CALLOUTP1'){
                parentEl = parentEl.parentElement;
            }

          } catch (e) {
            return  document.getElementsByClassName("content-wrapper");
          }

        return parentEl;
    }
    
    /* NOT USED FOR NOW : gets the base 64 of the uploaded image */
    this.readFile = function () {
        var lastChar = this.id.substr(this.id.length - 1);
          if (this.files && this.files[0]) {
             var tmp;
                var FR= new FileReader();
                FR.onload = function(e) {

                    switch(parseInt(lastChar)) {
                        case 1:
                            parent.base64_1 = e.target.result;
                            break;
                        case 2:
                            parent.base64_2 = e.target.result;
                        break;
                        case 3:
                            parent.base64_3 = e.target.result;
                        break;
                        case 4:
                            parent.base64_4 = e.target.result;
                        break;
                        default:
                            parent.base64 = e.target.result;
                    }
                      
                    return e.target.result;
                };       
                var FRdata = FR.readAsDataURL( this.files[0] );
                
              }
    }
    
    this.EL = function (id) { return document.getElementById(id); } 
    
   /* saves callouts in DB */
    this.saveCallouts = function(operation,calloutNum){
       // alert("in save calloutrs");
        if(calloutNum > 0 ){
            var myParent = parent.currParentId.toString().replace(/['"]+/g, '');    
            parent.activeCalloutps.push(myParent);
            parent.calloutpIds[calloutNum-1] = myParent;
            parent.activeCallouts[calloutNum-1] = true; 
            parent.activeCalloutps.push(parent.parentid);
        }
        // alert("done condition");
        // alert(operation);
        var payload = parent.getPayload(operation);
        //alert("payload done");
        for(index =0; index < parent.calloutContent.length; index++){
            if(parent.calloutContent.status == 'delete'){
                payload.calloutContent.push(parent.calloutContent[index]);
                payload.reresubmittedIds.push(parent.calloutContent[index].id);
            }
        }
        // alert("done for");
        $.ajax({
              url: parent.apiUrl,
              type: 'PUT',
              data: payload,
              success: function(data) {
                  var coContent = data.calloutContent;
                  for(k=0;k<coContent.length;k++){
                      if(typeof coContent !=='undefined'){
                         var divId = k+1;
                         var tempra = $("#api-id-" + divId).html(coContent[k].id);
                         
                         if($("#api-id-" + divId).html().length > 0 && coContent[k].status == "new"){
                             $("#callout-close" + divId).show();
                         } else if(operation == 'submit' && (coContent[k].reviewStatus == 'InProgress' || coContent[k].reviewStatus == 'approved')){
                             $("#edit-btn-" + divId).hide();
                             $("#apprej-wrapper" + divId).html(parent.toCamelCase(coContent[k].reviewStatus));
                             $('#plusminus' + divId).hide();
                             if(coContent[k].reviewStatus == 'InProgress'){
                                 $("#apprej-wrapper" + divId).css('color','red');
                             }
                             if(coContent[k].reviewStatus == 'approved'){
                                 $("#apprej-wrapper" + divId).css('color','green');
                             }
                             /*if(coContent[k].status == 'delete'){
                                 $("#apprej-wrapper" + divId).css('color','green');
                             }*/
                             $("#apprej-wrapper" + divId).show(); /*Rajesh*/

                         }else  if(coContent[k].reviewStatus == 'rejected'){
                                 $("#edit-btn-" + divId).show();
                             }
                        
                      }
                      
                      
                  }
                  parent.clearLocalCallouts();
                  parent.calloutContent=data.calloutContent;
                    if(operation==='save'){
                        //alert('saved');
                        tjToast.enqueue({
                         level: 'success',
                            text: 'Saved Successfully!',
                            xclass: 'tjToast-3dc'
                          });
                          tjToast.now();
                    }else{
                        //alert('submitted');
                        tjToast.enqueue({
                             level: 'success',
                                text: 'Successfully Sent for Approval!',
                                xclass: 'tjToast-3dc'
                             });
                             tjToast.now();
                    }
              }

            });
    
    }
    
    /* clears all the local callouts */
    this.clearLocalCallouts = function(){
        
        for(k=1;k<=5;k++){ 
            
            var tmp = localStorage.getItem("localCallouts"+k + parent.assetId);
              if(typeof tmp !=='undefined' & tmp !== null){
                 localStorage.removeItem("localCallouts"+k + parent.assetId);
              }
          }
    }
    
    /* constructs the payload to be sent to the API */
    this.getPayload = function(operation){
        
        var data = parent.getSubmitData();
       // alert("data in get payload");
        var calloutSection = [];

        var reresubmittedIds = [];
         for (i = 0; i < data.length;i++) { 
             
             if(typeof data[i] !=='undefined'){
                //console.log(data[i]);
                 var parentId = data[i].parentId;
                 var calloutText =  data[i].calloutText;
                 var apiId = data[i].apiId;
                 var top = data[i].top;
                 var keyword = data[i].keyword;
                    
                // alert(data[i]);

                 var tmp = {
                             "keyWord": keyword,
                             "title"  : parent.calloutFrom,                              
                             "comment": calloutText,
                             "position": {id:parentId,top:top},  
                 }
                 
                 if(data[i].approved){
                     tmp.reviewStatus = "approved";
                     tmp.status = "active";
                 }
                 
                 if(data[i].rejected){
                     tmp.reviewStatus = "rejected";
                     tmp.status = "inactive";
                 }
                 
                 if(apiId.length > 0){
                     tmp.id = apiId;
                 }
                 if(operation=='save'){
                   
                    if(data[i].InProgress){
                        tmp.reviewStatus = "InProgress";
                        tmp.status = "InProgress";
                    }
                 }
                // alert("paylaod done");
                 calloutSection.push(tmp);
             }
         }
        
        var rejectedVal = false;     
        
        
         for(k=1;k<=5;k++){
             
             rejectedVal = false;
             
             if(typeof parent.rejectTracking[k] !== 'undefined' & parent.rejectTracking[k] !=null){
                rejectedVal = parent.rejectTracking[k];
             }
             
             var tempra = $("#api-id-" +k).html();
             if(tempra.length > 0 & !rejectedVal){
                 reresubmittedIds.push(tempra);
             }
         }
         
         
        var payload = {
            "type":"callout",
            "operation":operation,
            "assetInfo":{
                "tenantId":this.tenantId,
                "tenantUserId":this.tenantUserId,
                "assetId":this.assetId
            },"calloutContent":calloutSection,
            "reresubmittedIds":reresubmittedIds
        };
        
        return payload;
    
    }
    

    /* gets the data of each callout */
    this.getCalloutData = function(calloutNum){
        
        //var myParent = parent.calloutpIds[calloutNum-1];
       // alert(calloutNum);
        var myParent=$('#calloutSelectedTextId'+calloutNum).val().toString().replace(/['"]+/g, '');
        //alert("myParent : "+myParent);
        var calloutText = CKEDITOR.instances['editor' +calloutNum].getData();
       // alert(calloutText);
        var apiId = $("#api-id-" +calloutNum).html();

        var APICallouts=JSON.parse(localStorage.getItem("calloutFromAPI"));
        
        var keyword = "";
        if(myParent ==null || myParent==undefined || myParent=='false'){
            if(calloutNum <=APICallouts.length){
                myParent=APICallouts[calloutNum-1].position.id;
                keyword=APICallouts[calloutNum-1].keyWord;
            }
        }
       
        
        var approved = false;
        var rejected = false;
        var InProgress=false;
       
            try{
                    var top = $('#callout-popup' + calloutNum).offset().top;
                    
                    keyword = parent.keywords[calloutNum];    
                    
                    
                    
            }catch(e){
                console.log(JSON.stringify(e));
            }
        
        try{            
             if($('#apprej-wrapper' + calloutNum).text() === 'Approved'){
                 approved = true;
             }
             if($('#apprej-wrapper' + calloutNum).text() === 'InProgress'){
                 InProgress = true;
             }
        }catch(e){
                console.log(JSON.stringify(e));
            }
        
        
       try{ 
            if(typeof parent.rejectTracking[calloutNum] !=='undefined' & parent.rejectTracking[calloutNum] !==null){
                if(parent.rejectTracking[calloutNum]){
                    rejected = true;
                }
            }
        }catch(e){
                console.log(JSON.stringify(e));
            }

            
        //var inputName = document.getElementById('uploadFile' +calloutNum);
        //var img_base64 = '';
        
        var resData = {};
        
       
        if(typeof calloutText !== 'undefined' & calloutText != null){
          calloutText = calloutText.replace(/'/g, "&#39;");  
        }
        
        if(typeof keyword !== 'undefined' & keyword != null){
            keyword = keyword.replace(/'/g, "&#39;");
            
        }else{

            keyword=APICallouts[calloutNum-1].keyWord;
        }
        
        resData = {'calloutText':calloutText,'parentId':myParent,'apiId':apiId,'top':top,"keyword":keyword,"approved":approved,"rejected":rejected,"InProgress":InProgress};
        
        return resData;
    
    }
    
    /* get the data of all the callouts */
    this.getSubmitData = function(){
       // alert("in get submit data");
        var data = [];
        //alert("parent.activeCallouts.length "+parent.activeCallouts.length);
       // parent.activeCallouts;
        var k =0;
        for (i = 0; i < parent.activeCallouts.length;i++) { 
            var tmp = i+1;
            
            if(i > 4 ){
                break;
            }
            
            if(parent.activeCallouts[i]===true){
               // console.log("");
                data[k++]=parent.getCalloutData(tmp);
            }
            //console.log("exit");
        }
       //alert("executed for"+data);
        return data;
    }
    
    /* initializes the onclicks */
    this.init = function(){
        
        /*$('.content-wrapper > img').click(function(e){
             //e.stopPropagation();
           alert('test'); 
           
        });*/
        //alert('test');
        var parentId='';
        $('body').on('click', '.image-click', function(){
            
            calloutNum = parent.getAvailableCallout();
            
            if(!calloutNum){
                return false;
            }
                        
            parentEl = this;
            
            try {
            
            while(parentEl !== null &  parentEl.tagName !== null & typeof parentEl.tagName !== 'undefined' & parentEl.tagName !== 'CALLOUTP' & parentEl.tagName !== 'CALLOUTP1'){
                parentEl = parentEl.parentElement;
            }

            } catch (e) {
                parentEl =  document.getElementsByClassName("content-wrapper");
            }
            
            var titleId = $(this).attr("titleid");
            
            parent.text = $("#" + titleId).text();
            offsetTop = $(this).offset().top+30;
            parent.offsetTop = offsetTop;
            parent.currParentId = parentEl.id;
			parentId=parentEl.id;
			
            posx = "30%";
            
            
            $('.callout-highlight-menu').hide().css({top:offsetTop, left:posx}).fadeIn();
            
        });
        
        //select text on mouse move
        //$('.report-description-wrapper').on('mousedown', '.image-click', function(){
        $('.report-description-wrapper, .report-image').mousedown(function(e){ 
           // parent.gposx = e.clientX + window.pageXOffset - 10 +'px'; //Left Position of Mouse Pointer
           // parent.gposy = e.clientY + window.pageYOffset - 60 +'px'; //Top Position of Mouse Pointer
            parent.gposx = e.pageX - 15+'px'; //Left Position of Mouse Pointer
            parent.gposy = e.pageY - 60+'px'; //Top Position of Mouse Pointer
        });
        //$('.report-description-wrapper').on('mouseup', '.image-click', function(){
        $('.report-description-wrapper, .report-image').mouseup(function(e){   
            
            calloutNum = parent.getAvailableCallout();
            
            if(!calloutNum){
                return false;
            }
            
            var htmlTagRe = /<\/?calloutp+>/gi;
            
            //$('.add-callout-wrapper').hide();
            
            var posx = parent.gposx; //e.clientX + window.pageXOffset - 40+'px'; //Left Position of Mouse Pointer
            var posy = parent.gposy; //e.clientY + window.pageYOffset - 60 +'px'; //Top Position of Mouse Pointer

            var body = document.body,html = document.documentElement;
            
            try{
                var parentEl = parent.getSelectionParentElement();
             }catch(e){
                console.log(JSON.stringify(e));
            }
			
            parentId = JSON.stringify($(parentEl).attr('id'));
            //alert(parentId);

           /* if(!parent.booleanIdVal){
                parent.parentid = parentId;
            } */     
            
            
            
            var i = parent.activeCalloutps.indexOf(parentId);
        
            if(i != -1) {
               //alert('another callout exists in the same area');
               return false;
            }

           var posyInt = parseInt(posy.replace("px", ""));            
           parent.offsetTop = posyInt; //parentEl.offsetTop;

           parent.height = Math.max( body.scrollHeight, body.offsetHeight, 
                      html.clientHeight, html.scrollHeight, html.offsetHeight );
            
            var diff = parseInt(parent.height -  parent.offsetTop);
            parent.diff = diff;
            
            var containsHtmlTags = false;
            
            try{
                parent.text = window.getSelection().toString();
            }catch(e){
                    console.log(JSON.stringify(e));
            }

            
            var htmlContent = '';
               
                try{
                    
                    if(!parent.oldIE()){
                        var range = window.getSelection().getRangeAt(0);
                        var content = range.cloneContents(); 
                        htmlContent = new XMLSerializer().serializeToString( content );
                    }else{
                        htmlContent = document.selection.createRange().htmlText
                    }
                }catch(e){
                    console.log(JSON.stringify(e));
                }

            containsHtmlTags = htmlTagRe.test(htmlContent);
           
            
            if(!containsHtmlTags){             

                var  offsetTop = parent.offsetTop;

                offsetTop = offsetTop + "px";                   

                    if(parent.text.length > 0){
                        $('.callout-highlight-menu').hide().css({top:offsetTop, left:posx}).fadeIn();
                    }else{
                        $('.callout-highlight-menu').hide();
                    }

                    if(parent.text.length > 300){

                        parent.text = parent.text.substring(0, 300);
                    }
                    
            }else{
                 $('.callout-highlight-menu').hide();
            }

        });
        
        
         //update selected text callout 
        $('.add-callout-btn').click(function(e){
            //parent.booleanIdVal=true;
            calloutNum = parent.getAvailableCallout();

            parent.keywords[calloutNum]  = parent.text;
           // console.log(parent);

            if(typeof parent.parentid !=='undefined'){
                parent.currParentId = parent.parentid;
            }
            //alert(parent.parentid);
            //alert("parent.parentid in add button"+parentId);
            $('#calloutSelectedTextId'+calloutNum).val(parentId);
            if(!calloutNum){
                //alert('You have reached the limits of subscribed callouts');
                tjToast.enqueue({
                     level: 'warning',
                        text: 'You have reached the limits of subscribed callouts',
                        xclass: 'tjToast-3dc'
                    });
                    tjToast.now();
                
            }else{
                
                var offsetTop = parent.offsetTop;
               if(parent.findCalloutArea(offsetTop)){
                             //alert('another callout exists in the same area');
                             tjToast.enqueue({
                                 level: 'warning',
                                    text: 'Another callout exists in the same area',
                                    xclass: 'tjToast-3dc'
                                });
                                tjToast.now();
                             return false;
                 }
                
                 parent.initCallout(calloutNum);
                 $("#callout-popup" +calloutNum).show();
                 $("#limitError" + calloutNum).css("color", "black");
                 var posy1 = e.clientY + window.pageYOffset +'px'; //Top Position of Mouse Pointer
                 var posy2 = parseInt(posy1.replace("px", ""));
                 

                 if(parent.text == '' & false)
                  {
                        //alert('Please Select some text to update Callout text');
                        tjToast.enqueue({
                             level: 'warning',
                                text: 'Please select some text to update Callout text',
                                xclass: 'tjToast-3dc'
                           });
                           tjToast.now();
                  }
                  else
                    {   
                     try{
                            
                         $("#add-callout-inner" + calloutNum).html("");
                            CKEDITOR.instances['editor'+calloutNum] = CKEDITOR.appendTo('add-callout-inner'+ calloutNum);
                     }catch(e){
                         console.log(JSON.stringify(e))
                     }
                     
                        if(typeof CKEDITOR.instances['editor'+calloutNum] === 'undefined'){
                            CKEDITOR.instances['editor'+calloutNum] = CKEDITOR.appendTo('add-callout-inner'+ calloutNum);
                        }                        
                            try{
                                
                                 if(typeof CKEDITOR.instances['editor'+calloutNum] === 'undefined') {
                                   CKEDITOR.instances['editor'+calloutNum] = CKEDITOR.appendTo('add-callout-inner'+ calloutNum);
                                   
                                     
                                 }else{
                                     $("#add-callout-inner" + calloutNum).show();
                                     $("#add-callout-innertext" + calloutNum).hide();
                                     $("#save-btn-" + calloutNum).hide();
                                     $("#edit-btn-" + calloutNum).hide();
                                     $("#plusminus" + calloutNum).hide();                                     
                                     $("#add-callout-btn" + calloutNum).show();
                                     $("#limiterror" + calloutNum).show();
                                 }
                             }catch(e){
                                 console.log(JSON.stringify(e))
                             }                   

                    
                        CKEDITOR.config.toolbarLocation = 'bottom';
                        CKEDITOR.config.toolbar = 
                            [
                                [ 'Source', '-', 'Bold', 'Italic','Link' ]
                            ];
                         
                        
                        
                        
                         parent.limitChars('editor' +calloutNum,calloutNum);

                         if($('#add-callout-inner' +calloutNum).html() === parent.text ){
                             CKEDITOR.instances['editor'+ calloutNum].setData(parent.text);
                             
                         }else{
                              CKEDITOR.instances['editor'+ calloutNum].setData('');
                         }

                         var calloutHeight = 500; //$('#callout-popup' + calloutNum).height();
                        
                         if(parent.diff < (calloutHeight+parent.footerHeight)){
                            
                            //offsetTop = offsetTop - (calloutHeight - parent.diff)-parent.footerHeight;
                            //offsetTop = offsetTop - calloutHeight-parent.footerHeight;
                            offsetTop=offsetTop+parent.footerHeight;
                         } else {
                            offsetTop = offsetTop + 50;
                            
                         }
                         
                        //console.log('offsetTop: '+offsetTop);
                         $('#callout-popup' + calloutNum).css({top:offsetTop}).fadeIn();
                         
                         //$('#callout-popup' + calloutNum).css({top:offsetTop, left:'83%'}).fadeIn();
                        
                    }
                $('.callout-highlight-menu').hide();
            }

           
        });
        
        
        $("#saveall").on("click", function(){
            //calloutNum = parent.getAvailableCallout();

               parent.saveCallouts('save');

        });
        
        $("#submitall").on("click", function(){
            
            if (confirm('Are you sure you want to send for approval?')) {
               parent.saveCallouts('submit');
               if(!parent.getAvailableCallout()){
                    $(".btn-submit-all").hide(); 
                    $(".btn-all").hide();
               }
            }

        });
        
        parent.loadCallouts();

        var positions = [];
        for(i=0;i<parent.localCallouts;i++){
            tmp = i+1;
            //if(parent.localCallouts[i].status === 'active' | true)
            //{
            
                try{
                    if(typeof parent.localCallouts[i].position !=='undefined' & parent.localCallouts[i].position !==null){
                        positions[tmp] = parent.localCallouts[i].position;
                    }else{
                        positions[tmp] = parent.localCallouts[i].top;
                    }
                
                }catch(e){
                    console.log(JSON.stringify(e));
                }               
            }
        //}
        
        return positions;
 }
    
    
    
    /* renders the new callout */
    this.initCallout = function(calloutNum){
        
        var myParent = parent.currParentId;
        
       // parent.EL("uploadFile" +calloutNum).addEventListener("change", parent.readFile, false);
        
        //callout close
        
        $('#callout-close' +calloutNum).click(function(){
            
            
            CKEDITOR.instances['editor' + calloutNum].setData('');
            parent.activeCallouts[(calloutNum-1)] = false;
             parent.rejectTracking[calloutNum] = false;
            $('#callout-popup' +calloutNum).hide();
            var lcText = $('#add-callout-innertext' +calloutNum).html();
            lcText = lcText.replace(/'/g, "&#39;");
            var numCallouts = 5;
            for(i=1;i<=numCallouts;i++){
                var tmpObj = JSON.parse(localStorage.getItem("localCallouts"+i + parent.assetId));
                if(tmpObj===null){
                    continue;
                }
                
                var tmpText = tmpObj.calloutText
                 
                tmpText = tmpText.replace(/'/g, "&#39;")

                if(tmpText === lcText){
                    localStorage.removeItem("localCallouts"+i + parent.assetId);
                    parent.saveAndDeleteCallouts('save',calloutID,calloutNum);
                }else{
                     
                }
                if(calloutNum <=1){
					$(".btn-submit-all").css('padding','0');
				}else{
					$(".btn-submit-all").css('padding','10px 15px');
				}
            }
            
            var i = parent.activeCalloutps.indexOf(myParent);
            
            if(i != -1) {
               parent.activeCalloutps.splice(i, 1);
            }
            var activeCount = parent.getActiveCount();
            if(activeCount == 0){
                $("#saveall").hide();
            }
            parent.showSubmitCheck();
            
            var calloutID = $("#api-id-" +calloutNum).html();
            if(calloutID.length > 0){

               parent.saveAndDeleteCallouts('save',calloutID,calloutNum);
            }
            if(calloutNum <=1){
                $(".btn-submit-all").css('padding','0');
            }else{
                $(".btn-submit-all").css('padding','10px 15px');
            }
            
        });
        
        this.saveAndDeleteCallouts = function(operation, calloutID,calloutNum){
            //alert(calloutNum);
            var payload = parent.getPayload(operation);
            //alert(parent.calloutContent);
            payload.calloutContent = parent.calloutContent;
            for(index=0; index <payload.calloutContent.length; index++){
                if(calloutID == payload.calloutContent[index].id){
                    payload.calloutContent[index].status = 'delete';
                    payload.calloutContent[index].id=undefined;
                    payload.calloutContent[index].reviewStatus = 'InProgress';
                    //delete payload.calloutContent[calloutNum-1];
                    //delete parent.calloutContent[calloutNum-1];
                }
            }
            /*rajesh added code for functioning delete callout*/
                /*$("#rcomments" +calloutNum).hide();
                $("#plusminus" +calloutNum).hide();
                $('#apprej-wrapper'+)*/
                //parent.calloutContent = payload.calloutContent;
               // console.log(payload.calloutContent);
             /*rajesh added code for functioning delete callout*/
            $.ajax({
                  url: parent.apiUrl,
                  type: 'PUT',
                  data: payload,
                  success: function(data) {
                    //console.log(data.calloutContent);
                    parent.calloutContent = data.calloutContent;
                      var coContent = data.calloutContent;
                      for(k=0;k<coContent.length;k++){
                          if(typeof coContent !=='undefined'){
                             var divId = k+1;
                             var tempra = $("#api-id-" + divId).html(coContent[k].id);

                             if(coContent[k].status =='delete'){
                            var dcalloutid = k+1;
                            //alert("inside"+dcalloutid);
                            $('#apprej-wrapper'+dcalloutid).text('');
                            $('#plusminus'+dcalloutid).hide();                                  
                            $('#rcomments'+dcalloutid).text('');
                            }
                          }
                          
                      }
                      //parent.clearLocalCallouts();
                        if(operation==='save'){
                            //alert('saved');
                            tjToast.enqueue({
                             level: 'success',
                                text: 'Deleted Successfully!',
                                xclass: 'tjToast-3dc'
                              });
                              tjToast.now();
                             // window.location.reload();
                        }
						
                  }
                });
        }
        
        
        
  
/*
        $("#uploadFile" + calloutNum).on("change", function()
        {
            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

            if (/^image/.test( files[0].type)){ // only image file
                var reader = new FileReader(); // instance of the FileReader
                reader.readAsDataURL(files[0]); // read the local file

                reader.onloadend = function(){ // set image data as background of div
                    $("#imagePreview" +calloutNum).css("background-image", "url("+this.result+")");
                }
            }
        });
        
     */   
        
        $("#plusminus" +calloutNum).on("click", function(){

                if($("#plusminus" +calloutNum).text()=='See Comment'){
                            $("#plusminus" +calloutNum).html('<b>Hide Comment</b>');
                            $("#plusminus" +calloutNum).removeClass('glyphicon-plus hand');
                            $("#plusminus" +calloutNum).addClass('glyphicon-minus hand');
                            $("#rcomments" +calloutNum).show();
                }else{
                    $("#plusminus" +calloutNum).html('<b>See Comment</b>');
                    $("#plusminus" +calloutNum).removeClass('glyphicon-minus hand');
                    $("#plusminus" +calloutNum).addClass('glyphicon-plus hand');
                    $("#rcomments" +calloutNum).hide();
                }
        
        });
        //function added by Pandu to validate 300 characters in callout editor
        function strip(html)
        {
           var tmp = document.createElement("DIV");
           tmp.innerHTML = html;
           return tmp.textContent || tmp.innerText || "";
        }
        
        $("#add-callout-btn" +calloutNum).on("click", function(){
            
             //Pandu modified textarea value capture logic
             var calloutText = CKEDITOR.instances['editor' +calloutNum].getData().replace(/<\/?[^>]+(>|$)/g, "");

             
             if(calloutText.trim() === ""){  
                 $("#cke_editor" + calloutNum ).addClass("error-callout-blank");
                 return false;
             } else if(strip(calloutText).length > 300){//Pandu modified textarea value capture logic
                 //alert("Limit exceed more than 300 characters");
                 tjToast.enqueue({
                     level: 'error',
                        text: 'Limit exceed more than 300 characters!',
                        xclass: 'tjToast-3dc'
                   });
                   tjToast.now();
                 return false;
             } else{
                  $("#cke_editor" +calloutNum ).removeClass("error-callout-blank");
             }
           var calloutText = CKEDITOR.instances['editor' +calloutNum].getData();
            if(calloutNum > 0 ){
                var myParent = parent.currParentId.toString().replace(/['"]+/g, '');    
                parent.activeCalloutps.push(myParent);
                parent.calloutpIds[calloutNum-1] = myParent;
                parent.activeCallouts[calloutNum-1] = true; 
                parent.activeCalloutps.push(parent.parentid);
               // alert("pp : "+parent.parentid);
                if($("#rcomments" +calloutNum).text().length > 0){
                    $("#plusminus" +calloutNum).show();
                }
                //parent.booleanIdVal=false;                
           }
           
            
            
            $("#add-callout-inner" + calloutNum).hide();
            var lcText = $("#add-callout-innertext" + calloutNum).html();
            lcText = lcText.replace(/'/g, "&#39;");
            $("#add-callout-innertext" + calloutNum).html(calloutText);
            $("#add-callout-innertext" + calloutNum).show();
            $("#limiterror" + calloutNum).hide();
            
           // $("#save-btn-" + calloutNum).show();
             var calloutText = CKEDITOR.instances['editor' +calloutNum].getData();
             var top = $("#callout-popup" + calloutNum).css('top');
             var apiId = $("#api-id-" + calloutNum).html();
             
             var numCallouts = 5;
             var found = false;
            for(i=1;i<=numCallouts;i++){
                var tmpObj = JSON.parse(localStorage.getItem("localCallouts"+i + parent.assetId));
                if(tmpObj===null){
                    continue;
                }

                var tmpText = tmpObj.calloutText.replace(/'/g, "&#39;");
                if(tmpText === lcText){
                    found = true;
                    parent.localSave(i,calloutText,top,apiId,parent.text);
                }
                
                
            }
            
            if(!found){
                parent.localSave(calloutNum,calloutText,top,apiId,parent.text);
            }
             
            $("#edit-btn-" + calloutNum).show();
            $("#add-callout-btn" +calloutNum).hide();
            
            if(($("#rcomments" +calloutNum).text())!=''){
                    $("#plusminus" +calloutNum).show();  
                    //$("#rcomments" +calloutNum).show();
                 }else{
                    $("#plusminus" +calloutNum).hide();  
                    //$("#rcomments" +calloutNum).hide();
             }
            
            $("#plusminus" +calloutNum).html('See Comment');
            $("#plusminus" +calloutNum).removeClass('glyphicon-minus');
            $("#plusminus" +calloutNum).addClass('glyphicon-plus');
            $("#rcomments" +calloutNum).hide();
            
            $('.btn-submit-all').show();
            $('#saveall').show();
            parent.showSubmitCheck();
           
        });
        
        
        // above function commited
        
        
        
        /*
        $("#save-btn-" + calloutNum).on("click", function(){
             var calloutText = CKEDITOR.instances['editor' +calloutNum].getData();
             var top = $("#callout-popup" + calloutNum).css('top');
             var apiId = $("#api-id-" + calloutNum).html();
             parent.localSave(calloutNum,calloutText,top,apiId);
             alert("Callout Saved");
        });
        */
             $("#edit-btn-" + calloutNum).on("click", function(){
                 parent.rejectTracking[calloutNum] = false;
                 $("#save-btn-" + calloutNum).hide();
                 $("#edit-btn-" + calloutNum).hide();
                 $("#plusminus" +calloutNum).hide();  
                 $("#rcomments" +calloutNum).hide();      
                 $("#add-callout-inner" + calloutNum).show();
                 $("#add-callout-innertext" + calloutNum).hide();
                 $("#add-callout-btn" +calloutNum).show();
                 $("#limiterror" + calloutNum).show();
                 /*alert();*/
            });
        
    }
    
    /* appends the ckeditor in the new callout */
   this.invokeCallout = function(calloutNum,inputText){
            
          if(calloutNum > 5){
              return false;
          }
       
       
            if(typeof CKEDITOR.instances['editor'  +calloutNum] === 'undefined'){
                        
                       CKEDITOR.instances['editor'+calloutNum] = CKEDITOR.appendTo('add-callout-inner'+ calloutNum);
                
                    }
                    
                    CKEDITOR.config.toolbarLocation = 'bottom';
                    CKEDITOR.config.toolbar = 
                        [
                            [ 'Source', '-', 'Bold', 'Italic','Link' ]
                        ];
                    
                    parent.limitChars('editor' +calloutNum,calloutNum);

            
                    CKEDITOR.instances['editor'+ calloutNum].setData(inputText);
            
    }
   
   
   /* renders all callouts on load */
    this.loadCallouts = function(){

        var calloutContent = parent.calloutContent;
        var apiCallouts = new Array();
        var existingCalloutApiIds =[];
        var existingLocalCalloutApiIds = [];
        var noLocalContent = true;
         var numCallouts = 5;
        
        for (i = 1; i <= numCallouts;i++) { 
            if(localStorage.getItem("localCallouts"+i + parent.assetId) !== null){
                var tmp = localStorage.getItem("localCallouts"+i + parent.assetId);
                
                if(tmp.length > 1){
                    tmp = JSON.parse(tmp);                    
                    existingLocalCalloutApiIds.push(tmp.apiId);
                }
            }
        }
        
        
        if(typeof calloutContent !== 'undefined' & calloutContent !== null ){
            
            for (j = 0;j < calloutContent.length;j++) { 
                var tmpObj = calloutContent[j];
                
                if(typeof tmpObj.id !== 'undefined' && tmpObj.status!='delete'){
                    existingCalloutApiIds.push(tmpObj.id);
                    apiCallouts[tmpObj.id] = tmpObj;
                }
            }
            
        }
        
        
       
        var localText ="[";
        
        for (i = 1; i <= numCallouts;i++) {
            var tmp = "";
           if(localStorage.getItem("localCallouts"+i + parent.assetId) !== null){
               var localcallout = localStorage.getItem("localCallouts"+i + parent.assetId);
               
               if(localcallout.length){
                   var tmpObj2 = JSON.parse(localcallout);
                   noLocalContent = false;
                       tmp =  localcallout; //apiCallouts[localcallout.apiId];                     
               
                   tmp += ',';
               }
               
               localText += tmp
           } 
        }

        if(noLocalContent | true){
            tmp ='';
            
            if(typeof calloutContent !== 'undefined' & calloutContent !== null ){
                for (j = 0;j < calloutContent.length;j++) { 
                    tmp ='';
                    var tmpObj = calloutContent[j];

                    if(typeof tmpObj.id !== 'undefined' && tmpObj.status!='delete'){
                        if(!(existingLocalCalloutApiIds.indexOf(tmpObj.id) > -1)){
                            tmp += JSON.stringify(tmpObj); 
                            tmp += ',';                    
                        }
                    }

                    localText += tmp;
                }
            }
            
            
        }

        if(localText.substr(localText.length - 1) === ","){
            localText = localText.slice(0, -1);
        }
        
        localText += "]";

        var localArray = JSON.parse(localText);
        
        if(localArray instanceof  Array){
                parent.localCallouts  = localArray;
        }
        
        
               
        var allCalloutCount = 0;
        var submittedCount = 0;
        $('.btn-submit-all').hide();
        for (i = 0; i < parent.localCallouts.length;i++) {
            var local = true;
            var calloutNum = i+1;
            var obj = parent.localCallouts[i];
            //alert(JSON.stringify(obj));
            //alert(typeof obj.calloutNum === 'undefined');
            if(typeof obj.calloutNum === 'undefined'){
                local = false;
            }

            parent.activeCallouts[calloutNum-1] = true;

                if(local){
                    $("#add-callout-innertext" + calloutNum).html(obj.calloutText);
                    $("#add-callout-btn" + calloutNum).hide();
                    $("#api-id-" + calloutNum).html(obj.apiId);
                    var top = parseInt(obj.top.replace("px", ""));
                    $('#callout-popup' + calloutNum).css('top',obj.top);
                    //$('#callout-popup' + calloutNum).css('left',"83%");
                    $('#callout-popup' +calloutNum).show();
                    //$("#save-btn-" + calloutNum).show();
                    $("#limiterror" + calloutNum).hide();
                    $("#edit-btn-" + calloutNum).show();
                    $('#add-callout-inner' +calloutNum).hide();
                    $('.btn-submit-all').show();
                    parent.invokeCallout(calloutNum,obj.calloutText);
                    parent.initCallout(calloutNum);
                    allCalloutCount++;
                    parent.keywords[calloutNum] = obj.keyword;
                    parent.rejectTracking[calloutNum] = false;
                }else{  
                    
                        $("#callout-close" + calloutNum).hide();
                        if(obj.id.length >0 && obj.status == 'new'){
                            $("#callout-close" + calloutNum).show();
                        }
                        var reviewComment = '';
                    
                        if(typeof parent.reviewComments[obj.id] !=='undefined'){
                             reviewComment = parent.reviewComments[obj.id];
                            if(reviewComment !==null &  reviewComment !==''){
                                $('#rcomments' + calloutNum).html(reviewComment);
                                $('#plusminus' + calloutNum).show(); 
                                $("#callout-close" + calloutNum).show();
                            }
                        }else{
                            $('#plusminus' + calloutNum).hide();  
                        }
                    
                        $("#add-callout-innertext" + calloutNum).html(obj.comment);
                        $("#add-callout-btn" + calloutNum).hide();
                        $("#api-id-" + calloutNum).html(obj.id);
                         parent.keywords[calloutNum] = obj.keyword;
                        
                        try{
                            position = obj.position.top + "px";                         
                        }catch(e){
                            var objId = obj.position.id.toString().replace(/['"]+/g, '');  
                            position = $("#" + objId).offset().top;
                            console.log(JSON.stringify(e));
                        }
                        
                        $('#callout-popup' + calloutNum).css('top',position);

                        $('#callout-popup' +calloutNum).show();
                    if(obj.status === 'new' | obj.status === 'inactive' ){
                         parent.rejectTracking[calloutNum] = false;
                        $("#edit-btn-" + calloutNum).show();
                        $('.btn-submit-all').show();
                        if(obj.status === 'inactive'){
                            $('#plusminus' + calloutNum).show(); 
                            parent.rejectTracking[calloutNum] = true;
                        }                        
                        $("#apprej-wrapper" + calloutNum).html(parent.toCamelCase(obj.reviewStatus));
                    }else{
                          parent.rejectTracking[calloutNum] = false;
                         $("#callout-close" + calloutNum).hide();
                         $("#save-btn-" + calloutNum).hide();
                         $("#edit-btn-" + calloutNum).hide();
                         $("#apprej-wrapper" + calloutNum).html(parent.toCamelCase(obj.reviewStatus));

                        if(obj.reviewStatus === 'approved'){
                            submittedCount++;
                            $("#apprej-wrapper" + calloutNum).css('color','green');
                            $("#plusminus" + calloutNum).hide();
                        }else{
                             $("#apprej-wrapper" + calloutNum).css('color','red');
                            submittedCount++;
                        }
                        
                        if(obj.reviewStatus === 'InProgress'){
                            submittedCount++;
                            $('#plusminus' + calloutNum).hide(); 
                            $("#callout-close" + calloutNum).show();
                        }
                            
                         $("#apprej-wrapper" + calloutNum).show();
                    }
                        $("#limiterror" + calloutNum).hide();
                       
                        $('#add-callout-inner' +calloutNum).hide();
                        parent.invokeCallout(calloutNum,obj.comment);
                        parent.initCallout(calloutNum);
                        allCalloutCount++;
                }
            
        }
       

        if(allCalloutCount == 0 | allCalloutCount == submittedCount  ){
            $(".btn-submit-all").hide(); 
        }
 
        parent.allCallouts = allCalloutCount;
        if(allCalloutCount >= parent.calloutCount){
            $("#submitall").show();
        }else{
            $("#submitall").hide();
        }
        //submitall
        
    }
    
    /*  checks for another callout in the same area */
    this.findCalloutArea = function(myTop){
        var hit = false;
        for(i=1;i<=5;i++){
            if($('#callout-popup' + i).is(":visible")){
               var top =  $('#callout-popup' + i).offset().top;
               var  divHeight = $('#calloutdata' + i).height() + 20;
               var end = top+divHeight;  
                if(!(myTop < (top-divHeight) | myTop > end)){
                    hit = true;
                }
            }
        }
        return hit;
    }
    
    /* locally saves the callout */
    this.localSave = function(calloutNum,calloutText,top,apiId,keyword){
        
        if(apiId==""){
            apiId = false;
        }
        
        var obj = {"calloutText":calloutText,"top":top,"calloutNum":calloutNum,"apiId":apiId,"keyword":keyword};
        
        parent.localCallouts.push();
        localStorage.setItem("localCallouts"+calloutNum + parent.assetId, JSON.stringify(obj));
       
    }
    

    
    this.editMode = function(calloutNum){
        $("#add-callout-innertext" + calloutNum).hide();
        $('#add-callout-inner' +calloutNum).show();
        $("#limiterror" + calloutNum).show();
    }
    
    
    this.toCamelCase = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}]);