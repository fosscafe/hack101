reportsApp.controller("foresterReportController",
						['$scope','$window','$timeout','$location','$anchorScroll',
						'$stateParams','$state','reportsDataFactory','socialDataFactory',
						'pdfDownloadFactory','reportMappingFactory','$filter',
						'urlMapperService','errorMapperService','reportsService','calloutEditService','calloutService','calloutApprovalService','$window',
						'heatmapZoneFactory','heatmapClickFactory','calloutDisplayService',
						function($scope,$window,$timeout,
								$location,$anchorScroll,$stateParams,
								$state,reportsDataFactory,socialDataFactory,pdfDownloadFactory,
								reportMappingFactory, $filter,urlMapperService,errorMapperService,reportsService,calloutEditService,calloutService,calloutApprovalService,$window,heatmapZoneFactory,heatmapClickFactory,calloutDisplayService){
	   	//var absUrl = $location.absUrl();
	    //var referrer = $window.document.referrer;
	  /*  var visit=$cookies.visit;
	    alert("visit:"+visit);*/
	   	//var clientAddress = HttpContext.Current.Request.UserHostAddress;
	   	$stateParams.assetType='reports'; //for webinar we are using same tenant ID, to execute both report and webinar we used.
	   	 var visit='';
	   	 var calloutContent=[];
	   	 $scope.loaded = false; 
		 $scope.respdata = {};
		 $scope.buttonValue='Send for Approval';
		 //$scope.calloutIds=[];
		 // Callout position reset		
	 	           		
		var isChromeBrowser = !!window.chrome && !!window.chrome.webstore;		
		var isFirefoxBrowser = typeof InstallTrigger !== 'undefined';		
		var isIEBrowser = false || !!document.documentMode;		
		var isSafariBrowser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);		
	    // End of Call out reset
		 

		// Code for Heatmap - Shankar Venugopal - 26 Sep 2016
		//
		var heatmapZone_json = {};
		var heatmapClick_json = {};
		$scope.heatmap_exist = false;
		if($location.url().indexOf('heatmap') > -1){    
	        var param = $location.url().split('?')[1];
	        var param_val = param.split("=")[1]; 

	        if( param_val == "true"){
	        	$scope.heatmap_exist = true;
	        }
    	}	

		if($scope.heatmap_exist){
			var stopExec = true;
			$(document).ready( function() {
			    var waitinterval = setInterval( function() {
			        if( $( ".end-notes-wrapper" ).length > 0 && stopExec) {
    					$('#heatmap_div_busy').css('width',"100%");

			            stopExec = false;
			            clearIntervalFunc( waitinterval );

						var page_width = $(document).width();
    					var doc_height = $(document).height();
    					var zone_height = parseInt((doc_height * 0.1 ));

    					var overlay = jQuery("<canvas id='overlay_id'>");
    					overlay.appendTo("#heatmap_div");

    					$('#overlay_id').attr({'height' : doc_height+'px', 'width' : page_width+'px'});
    					var overlay_div_obj = document.getElementById("overlay_id");

    					$('#heatmap_div_busy').css({'width':"0", 'height':'0'});
    					$("#heatmap_div").css('width',"100%");


    					//Pradeep added code to float the header toc and social media start--
    					$('.header-wrapper').css('position','absolute');
    					$('#callout-alert-wrapper').css('display','none');
    					$('.social-media-wrapper').css('right','0');
    					$('.social-media-icons-right').css('position','absolute');
    					$(".table-content-wrapper").css('position','absolute');
    					$('.fixedposition').css('position','absolute');
    					$('.table-header').css('position','absolute');
    					$('.hideShare').css('position','absolute');
    					

    					//Pradeep added code to float the header toc and social media end--

						heatmapZoneFactory.getheatmapZone($stateParams).then(function(heatmapZoneData){
							heatmapZone_json = heatmapZoneData.data[0];
							var topThreeZoneData = getTopThreeZones(heatmapZone_json);

							for (var key in topThreeZoneData) {
					            createZoneHeatMap(key, topThreeZoneData[key], zone_height, overlay_div_obj); 
							}
						});

						heatmapClickFactory.getheatmapClick($stateParams).then(function(heatmapClickData){
							heatmapClick_json = heatmapClickData.data.clicksdata;

							for (var i in heatmapClick_json) {
								var obj = heatmapClick_json[i];
								createClickHeatMap(obj['x'], obj['y'], overlay_div_obj);
							}
						});
			        }
			    }, 3000 );
			});
		}

		// -- Ends --


		// Rajesh code for PDF download from s3 starts here //
		$scope.downloadPDFfromS3=function(code,assetid){
		 	//alert(assetid);
		 	if(code == "EN")
			{
				//alert("English");
				window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/Reprints/"+assetid+".pdf");
			}
			else{
				window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/Reprints/"+assetid+"_"+code+".pdf");
			}
		}
		$scope.downloadExcelfromS3=function(filename){
			
			var assetid=$stateParams.assetId.replace("'","");
			assetid=assetid.replace("'","");
			window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/Reprints/"+assetid+".xlsx");
		}
		// Rajesh code for PDF download from s3 ends here //
		 
		 $scope.setPositions = $timeout( function(){
			try{
				 numCallouts = 5; 
				 for(var p=1;p<=numCallouts;p++){
					 var x =$("#callout-popup" + p ).attr('position');
                     var top = $("#callout-popup" + p ).css('top');
					 if(typeof x !=='undefined' & typeof top !=='undefined' & top!=null){
						 if(x.length > 0){
							 var offset = $("#" + x ).offset().top;
							 //$("#callout-popup" + p ).css('top',offset);
						 }
					 }
				 }
			}catch(e){
                //console.log(JSON.stringify(e));
                
	            }
		 },5000);
		 
		
		 

		 $scope.calloutAlert = {
 			load: true,
 		};
		 
		 this.getVariable = function getQueryVariable(variable) {
			  
			 try{
				 var query = window.location.hash.substring(1);
				  var tmp = query.split("?");
				  query = tmp[1];
				  var vars = query.split("&");
				  for (var i=0;i<vars.length;i++) {
				    var pair = vars[i].split("=");
				    if (pair[0] == variable) {

				      return pair[1];
				    }
				  } 
			 }catch(e){
                 //console.log(JSON.stringify(e));
                 return false;
	            }
			  
			 	return false;
			};

		 
        var reviewComments = [];
                            
       
                            
                            
		var editor =  this.getVariable('editor');
		var permission = this.getVariable('permission');
	
		$stateParams.editor = editor;
		
		$stateParams.permission = permission;
		
		$scope.tableOfContent=true;
		$scope.socialMediaIcons = false;
		$scope.IsVisible = false; //Ragav:- setting the language list's div hidden
		
		$scope.showSocialMedia = function()
		{
			$scope.socialMediaIcons = $scope.socialMediaIcons ? false : true;
			$scope.IsVisible = false;
		}
		$scope.hideSocialMedia = function(){$scope.socialMediaIcons = false;}
		
		$scope.showTOC=function(){
			$('#TOCHead').css('display','block');
			$('.table-btn-show').css('display','none');
		}

		$scope.hideTOC=function(){
			//alert('sd');
			$('#TOCHead').css('display','none');
			$('.table-btn-show').css('display','block');	
		}
		
//		amir Mobile table of contents 
			$(window).on("resize.doResize", _.debounce(function (){    
				 $scope.$apply(function(){
					 if($(window).width() < 1024){
							//$('#TOCHead').hide();
						}
					 else
						 {
							 $('#TOCHead').show();
						 }
				 });
}));
							
							//		End amir Mobile table of contents 
		
		$scope.showIcons=function(){
    		//$('.social-media-wrapper').css('display','block');
    		$(".social-media-wrapper").fadeIn(1500);
    		$('.hideShare').css('display','block');
    		$('.showShare').css('display','none');
		}

		$scope.hideIcons=function(){
    		//$('.social-media-wrapper').css('display','none');
    		$(".social-media-wrapper").fadeOut(500);
    		$('.hideShare').css('display','none');
    		$('.showShare').css('display','block');
		}

		//Ragav's change for show/hide languages starts here //
		$scope.getLength=function(Obj){

			return Object.keys(Obj).length;


		}

		/*$scope.showDiv = function(assetid)
		{
			
			$scope.socialMediaIcons = false; //Ragav:- setting the social media share icons div hidden
			if($scope.respdata.assetInfo.vadContent.pdflanguages!=null)
			{
				$scope.IsVisible = $scope.IsVisible ? false : true;//Ragav:- setting the language list's div hidden if visible and vice versa
			}
			else {
				$scope.IsVisible = false; ////Ragav:- setting the language lists div hidden
				window.open("https://kloudrydermcaas.s3.amazonaws.com/Forrester/"+assetid+".pdf");
			}
		}*/
		//Ragav's change for show/hide languages ends here //

		if(!editor & !permission){
			$scope.mode = 'show';
		} else if(editor.length > 0 & permission==='50b804a7-c6ff-4ae0-8d7e-e098eab06333'){
			$scope.mode = 'edit';            
		}else if(editor.length > 0 & permission==='47d9001f-fdcd-48a9-98cc-91b533d03fa2'){
			$scope.mode = 'approval';
			$scope.buttonValue = 'Notify Client';
		}
		
		 $scope.failureMessage = false;
		 
		 $scope.tabs = reportMappingFactory.tabsData;
         
		 /* raghu code for landing url */
         	var absUrl = $location.absUrl();
			var currentUrlSm = splitSmCode(absUrl);
          /* raghu code for landing url ends*/   
/* code to redirect to landing URL */
var newRefCookieValue={
	"status":"new",
	"referralurl":getCookie('referralurl')
};

var finalRefCookieValue={
	"status":"complete",
	"referralurl":window.document.referrer
};
var submitted=false;
		 	reportsDataFactory.getReportData($stateParams,$scope.mode).then(function(response) {

/* rajesh code to display 404 image if url is expired*/ 
if(typeof response.data.status !=='undefined' ) {
 if(response.data.status ==='authentication Failure' | response.data.status ===' URL Expired'){
     /*$scope.failureMessage = data.status;*/
     $scope.failureMessage = " ";
     return false;
 }
}
/* rajesh code to display 404 image if url is expired ends*/
		 	var data,flag=true;
		 	var cookieId=getTenantId()+getTenantUserId()+getAssetId();
		 	var reportSMCookie;
		 	var reportCookies=JSON.parse(reportsService.getCookie(cookieId));
		 	if(currentUrlSm.sm!==undefined){		 				 		
		 		enableSocialMediaCookies();
		 		reportSMCookie=JSON.parse(reportsService.getCookie(cookieId));	 	
		 		if(reportSMCookie.status=='new'){		 			
					if(response.data.landingUrl!=null){
						location.href=response.data.landingUrl;
						flag=false;
					}else{						
						flag=true;
					}
				}	
			}else{
				if(reportCookies.status=='new'){					
					var newRefCookie=JSON.parse(getCookie(cookieId));					
					newRefCookie.status='complete';
					setCookie(cookieId,JSON.stringify(newRefCookie));
				}else if(reportCookies.status=="complete"){									
					setCookie(cookieId,JSON.stringify(finalRefCookieValue));					
				}
			}
			if(flag){
			 data=response.data;
			 $scope.reportData(data);
			}
/* code to redirect to landing URL */		 
		 		
	             
		 		/*if(data.assetInfo.vadInfo.socialSharingExists === true) {
		 			//console.log("true");
		 			var facebookSm = splitSmCode(data.assetInfo.vadContent.socialSharingURLs.facebookAssetURL);
				 	var twitterSm = splitSmCode(data.assetInfo.vadContent.socialSharingURLs.twitterAssetURL);
				 	var linkedInSm = splitSmCode(data.assetInfo.vadContent.socialSharingURLs.linkedinAssetURL);
				 	var emailSm = splitSmCode(data.assetInfo.vadContent.socialSharingURLs.emailAssetURL);

		            var facebookCookie = readCookie('facebookUrl');
		            var twitterCookie = readCookie('twitterUrl');
		            var linkedInCookie = readCookie('linkedinUrl');
		          
		            
		            facebookUrl = facebookCookie != null ?  facebookCookie.replace('%3A', ':') : undefined;
		            twitterUrl = twitterCookie != null ? twitterCookie.replace('%3A', ':') : undefined;
		            linkedinUrl = linkedInCookie != null ?  linkedInCookie.replace('%3A', ':') : undefined;
		           
		 			if(currentUrlSm.sm != undefined && data.landingUrl != undefined){
		 				if (currentUrlSm.sm === facebookSm.sm) {
		 					if (facebookUrl != data.landingUrl) {
				 			cookievalue = escape(data.landingUrl) + ";";
							document.cookie="facebookUrl=" + cookievalue;
							location.href=data.landingUrl;
			 				} else {
			 					//enableTracker();
			 					$scope.reportData(data);
			 				}
		 				} else if (currentUrlSm.sm === twitterSm.sm) {
		 					if (twitterUrl != data.landingUrl) {
				 			cookievalue = escape(data.landingUrl) + ";";
							document.cookie="twitterUrl=" + cookievalue;
							location.href=data.landingUrl;
			 				} else {
			 					//enableTracker();
			 					$scope.reportData(data);
			 				}
		 				} else if (currentUrlSm.sm === linkedInSm.sm) {
		 					if (linkedinUrl != data.landingUrl) {
				 			cookievalue = escape(data.landingUrl) + ";";
							document.cookie="linkedinUrl=" + cookievalue;
							location.href=data.landingUrl;
			 				} else {
			 					//enableTracker();
			 					$scope.reportData(data);
			 				}
		 				} else if (currentUrlSm.sm === emailSm.sm) {
		 					//enableTracker();
			 				$scope.reportData(data);
		 				}
				 	} else {
				 		//enableTracker();
				 		$scope.reportData(data);
				 	}
		 		} else {
		 			//console.log("false");
		 			//enableTracker();
				 	$scope.reportData(data);
		 		}*/
		 	});

		 	$scope.reportData = function(data) {
		 		
				/*hotfix for salesforce callout starts*/
		 		if((window.navigator.platform.match(/Mac/g) && (data.assetInfo.metaInfo.tenantId == 2 && data.assetInfo.metaInfo.assetId == "RES131821"))){
                             angular.forEach(data.assetInfo.vadContent.calloutSection, function(calloutSection, key) {
                                   if(typeof InstallTrigger !== 'undefined'){// Firefox 1.0+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 130;
                                   } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { // At least Safari 3+: "[object HTMLElementConstructor]"
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 75;
                                   } else if(false || !!document.documentMode){ // Internet Explorer 6-11
                                         calloutSection.position.top = parseInt(calloutSection.position.top);
                                   } else if (!!window.StyleMedia){// Edge 20+
                                         calloutSection.position.top = parseInt(calloutSection.position.top);
                                   } else if(!!window.chrome && !!window.chrome.webstore) {//Chrome 1+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 145;
                                   }
                             });
                       } else if((window.navigator.platform.match(/Win/g) && (data.assetInfo.metaInfo.tenantId == 2 && data.assetInfo.metaInfo.assetId == "RES131821"))){
                             angular.forEach(data.assetInfo.vadContent.calloutSection, function(calloutSection, key) {
                                   if(typeof InstallTrigger !== 'undefined'){// Firefox 1.0+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) - 10;
                                   } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { // At least Safari 3+: "[object HTMLElementConstructor]"
                                         calloutSection.position.top = parseInt(calloutSection.position.top) - 75;
                                   } else if(false || !!document.documentMode){ // Internet Explorer 6-11
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 27;
                                   } else if (!!window.StyleMedia){// Edge 20+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 27;
                                   } else if(!!window.chrome && !!window.chrome.webstore) {//Chrome 1+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 20;
                                   }
                             });
                       } else if(window.navigator.platform.match(/Mac/g) && (data.assetInfo.metaInfo.tenantId == 2 && data.assetInfo.metaInfo.assetId == "RES119354")){
                             angular.forEach(data.assetInfo.vadContent.calloutSection, function(calloutSection, key) {
                                   if(typeof InstallTrigger !== 'undefined'){// Firefox 1.0+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 125;
                                   } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { // At least Safari 3+: "[object HTMLElementConstructor]"
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 75;
                                   } else if(false || !!document.documentMode){ // Internet Explorer 6-11
                                         calloutSection.position.top = parseInt(calloutSection.position.top);
                                   } else if (!!window.StyleMedia){// Edge 20+
                                         calloutSection.position.top = parseInt(calloutSection.position.top);
                                   } else if(!!window.chrome && !!window.chrome.webstore) {//Chrome 1+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 145;
                                   }
                             });
                       } else if((window.navigator.platform.match(/Win/g) && (data.assetInfo.metaInfo.tenantId == 2 && data.assetInfo.metaInfo.assetId == "RES119354"))){
                             angular.forEach(data.assetInfo.vadContent.calloutSection, function(calloutSection, key) {
                                   if(typeof InstallTrigger !== 'undefined'){// Firefox 1.0+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) - 10;
                                   } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { // At least Safari 3+: "[object HTMLElementConstructor]"
                                         calloutSection.position.top = parseInt(calloutSection.position.top) - 55;
                                   } else if(false || !!document.documentMode){ // Internet Explorer 6-11
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 45;
                                   } else if (!!window.StyleMedia){// Edge 20+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 45;
                                   } else if(!!window.chrome && !!window.chrome.webstore) {//Chrome 1+
                                         calloutSection.position.top = parseInt(calloutSection.position.top) + 40;
                                   }
                             });
                       }
                    /*hotfix for salesforce callout ends*/
				 if(typeof data.status !=='undefined' ) {
	            	 if(data.status ==='authentication Failure' | data.status ===' URL Expired'){
	                     $scope.failureMessage = data.status;
	                     return false;
	                 }
	             }
			//console.log("here 1");
              if(typeof data.assetInfo.reviewComments !=='undefined' & data.assetInfo.reviewComments!==null) {
            	  		reviewComments = data.assetInfo.reviewComments;
              }
                
             //Callout Code Starts
              
			 $scope.orgName = '';
             var calloutCount = 0;
             var calloutContent = [];
             
             if(typeof data.assetInfo.metaInfo !=='undefined'){
            	 $scope.orgName = data.assetInfo.metaInfo.organisation;
             }
			
			 var calloutFrom = '';
             
                          
             if(typeof $scope.orgName !== 'undefined'){
                 calloutFrom ="Comment from "+$scope.orgName;
             }

             try{
                
                 if(typeof data.assetInfo.vadInfo.calloutCount !== 'undefined' & data.assetInfo.vadInfo.calloutCount !== null ){

                       calloutCount = data.assetInfo.vadInfo.calloutCount;

                 }
             }catch(e){
                    console.log(JSON.stringify(e));
            }

             try{
                 if(calloutCount > 0){
                     
                     if(typeof data.assetInfo.vadContent.calloutSection !== 'undefined' & data.assetInfo.vadContent.calloutSection !== null ){

                     	$scope.globalCalloutObject=data.assetInfo.vadContent.calloutSection;
                        calloutContent = data.assetInfo.vadContent.calloutSection;
						 angular.forEach(calloutContent, function(callout) {
							if($stateParams.editor ==false && $stateParams.permission ==false){
								if(callout.status == 'active'){
									///$scope.calloutIds.push(Number(callout.position.top));	
								}
							}else{
								//$scope.calloutIds.push(Number(callout.position.top));
							}
							
						});
						// $scope.calloutIds.sort(function(a,b){
							// if(b<a){return 1;}
						// }); 
                        
                        if(calloutContent[0].title!=='undefined'){
                        	calloutFrom=calloutContent[0].title;
                        }
                        displayCallout();

                    }
                 }
             }catch(e){
                    console.log(JSON.stringify(e));
             }
             //console.log("here 2");
             $scope.calloutHeaderText=calloutFrom;
             
             $scope.calloutdata = calloutContent;
             
             if($stateParams.editor==''){
                 
             }
             
             if($stateParams.permission==''){
                 
             }
			 
		     $scope.showSaveSubmit = false;

             var callouUrl = urlMapperService.getUrl('calloutUrl');
             var cacheUrl = urlMapperService.getUrl('cacheUrl');

             switch($scope.mode) {
                    case 'edit':
                        if(calloutCount > 0){
                            $scope.showSaveSubmit = true; 
                        }
                         localStorage.setItem("calloutFromAPI", JSON.stringify(calloutContent));
                         //calloutEditService.setVals($stateParams,callouUrl,calloutCount,calloutContent,calloutFrom,reviewComments);
                         calloutEditService.setVals($stateParams,callouUrl,5,calloutContent,calloutFrom,reviewComments);
                         $scope.positions = calloutEditService.init();
                        
                    break;
                    case 'approval':
                        calloutApprovalService.setVals($stateParams,callouUrl,cacheUrl);
                        $scope.positions = calloutApprovalService.init(5,calloutContent,calloutFrom);
                     
                    break;
                    default:                    	
                    	$scope.positions = calloutService.init(5,calloutContent,calloutFrom);
   
            }
             
            // console.log(JSON.stringify(calloutSection));
             
             //Callout Code Ends
             
			 var reportDate;
		     $scope.respdata = data;

             var calloutSection=$scope.respdata.assetInfo.vadContent.calloutSection;
		    
		    $scope.pdflanguages = $scope.respdata.assetInfo.vadContent.pdflanguages;
		    //console.log($scope.pdflanguages);
		     if(typeof data.goLiveDate!='undefined' & data.goLiveDate!= null ){
		    	 $scope.reportDate=new Date((data.goLiveDate).replace("IST",""));
			 }
             
			 $scope.calloutAlert.image=false;
			 if(calloutSection==undefined || calloutSection == null){
			 		
 					$scope.calloutAlert.load = false ;
 					$scope.calloutAlert.image = false ;
 			 }else{
 			 	for(var x=0; x< calloutSection.length;x++){
 			 		if(calloutSection[x].status =='active'){
 			 			$scope.calloutAlert.image = true ;	
 			 		}
 			 	}
 			 }
 			 
 			 //console.log($scope.calloutAlert.image);
			 $timeout(function(){
                $(".callout-alert-wrapper" ).fadeOut( 400 );

             }, 10000);

		     $scope.endNoteSlideDivIds = reportsService.getEndNoteRefs(data);
		     $scope.figureMap = reportsService.getAllFigures(data);

		     $scope.loaded = true;
		     disableResponsiveness();

		     /*code to reset width of content-wrapper-inner accordingly to browser*/
		     if(!isChromeBrowser && !isFirefoxBrowser && !isSafariBrowser) {		
					$('#content-wrapper-inner-id').addClass("ie-modify-padding");		
			    }		
			
			    if(isSafariBrowser) {		
					$('#content-wrapper-inner-id').addClass("safari-modify-padding");		
			    }
			/* code to reset width of content-wrapper-inner accordingly to browser ends*/
		     
		     $scope.tocRefs=reportsService.getTocRefs(data);
		     
		     $scope.tocRefsForRecommendations=reportsService.getTocRefsForRecommendations(data);

		     $scope.tocRefsForWhatItMeans=reportsService.getTocRefsForWhatItMeans(data);
		     
		     /*code to get the socialmediaurls from broker*/
		
				if($scope.respdata.assetInfo.vadInfo.socialSharingExists==true){
					 
					 	$scope.socialmediaurls = $scope.respdata.assetInfo.vadContent.socialSharingURLs;
					 	
					 
				 }

			/*enable tracker*/

			if(!$scope.heatmap_exist){
				enableTracker($scope.respdata.assetInfo.metaInfo.tenantId,$scope.respdata.assetInfo.metaInfo.userId,$scope.respdata.assetInfo.metaInfo.assetId);
			} else {
				
				$scope.tableOfContent=false;
			}

			//enableTracker();
			//virtual tour 1st time visit

			/*if(!(primaryId = reportsService.getCookie("primaryIdCookie"))) 			
			startTour();*/
			//virtual tour 1st time visit
		  //}).error(function (data, status) {
			    // Handle HTTP error
		  //})//.catch(function (error) {
			    // Catch and handle exceptions from success/error/finally functions
			  //console.log("Error:"+error);
			  /*$window.alert(error);
			  $window.alert(error.status + ':' + errorMapperService.getErrorMessage(error.status));*/
		 // });
		}

		 $scope.currentTab = 'one.tpl.html';
                            
	     $scope.onClickTab = function (tab) {
	        $scope.currentTab = tab.url;
	     }  
         
		 $scope.isActiveTab = function(tabUrl) {
		        return tabUrl == $scope.currentTab;
		 }
		 $scope.navigateTitleDiv=function(id){
			 id = $filter('removeSpaces')(id);
			 //pandu added page scroll to fix header overlap
			 var offsetTopDiv = id;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.header-wrapper').height();

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader - 25 +'px'
			});
		 }
		 $scope.closeCalloutAlert=function(){
		 	$scope.calloutAlert.load = false ;
		 }
		  $scope.navigateFigureDiv=function(id){
			 //pandu added page scroll to fix header overlap
			 var offsetTopDiv = id;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.header-wrapper').height();

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader - 25 +'px'
			});
		 }
		 var endNoteDivValue=true;
		$scope.toggle = function() {
			endNoteDivValue=true;
	        $scope.$broadcast('event:toggle');
	    }
	    
		$scope.navigateEndNoteDiv=function(id){
			id='endNoteBody' + id;
			//pandu added page scroll to fix header overlap
			var offsetTopDiv = id;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.header-wrapper').height();

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader - 25 +'px'
			});
		}
		
		 
		$scope.displayEndNoteBody=function(id){
			var endNoteBodyId='endNoteBody' + id;
			var endNoteSlideId = 'endNoteSlide' + id;
			var endNoteSlideContentId = 'endNoteSlideContent' + id;
			var endNoteRefId = 'endNoteRef' +id;
			
			var offsetLft = angular.element(document.getElementById(endNoteRefId)).prop('offsetLeft');
			var offsetTp = angular.element(document.getElementById(endNoteRefId)).prop('offsetTop');

			
			
			$scope.endNoteSlideDivIds.forEach(function(divId){
				if(endNoteSlideId!=divId)
					document.getElementById(divId).style.display="none";
			});
			
			
			document.getElementById(endNoteSlideContentId).innerHTML=document.getElementById(endNoteBodyId).innerHTML; 
			document.getElementById(endNoteSlideId).style.left = offsetLft - 55 + 'px';
		    document.getElementById(endNoteSlideId).style.top = offsetTp + 25 + 'px';
		    document.getElementById(endNoteSlideId).style.display="block";
		    
		}

		$scope.endNoteSlideDivHide = function(index){
				var hideDiv = 'endNoteSlide' + index;
				document.getElementById(hideDiv).style.display="none";
		}

		$scope.navigateseeFigureDiv=function(seeFigureId){
			seeFigureId='see Figure '+seeFigureId;
			//pandu added page scroll to fix header overlap
			var offsetTopDiv = seeFigureId;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.header-wrapper').height();

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader - 25 +'px'
			});
		}

		$scope.navigateEndNoteRef=function(id){
			id='endNoteRef' + id;
			//pandu added page scroll to fix header overlap
			var offsetTopDiv = id;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.header-wrapper').height();

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader - 25 +'px'
			});
		}
		$scope.getForesterReport=function(reportId){
			var url = urlMapperService.getUrl('foresterReportUrl');
			var targetUrl = url + reportId;
			//console.log("target url is " + targetUrl);
			$window.open(targetUrl);
			
		}
		$scope.downloadPdf=function(){
			pdfDownloadFactory.getPdf($stateParams).then(function(obj) {
				//console.log('server data is ' + obj.data);

				var fileName=$scope.respdata.content.report.title;

				var ieEDGE = navigator.userAgent.match(/Edge/g);
    			var ie = navigator.userAgent.match(/.NET/g); // IE 11+
    			var oldIE = navigator.userAgent.match(/MSIE/g);


				pdf = new Blob([obj.data], {type: 'application/pdf'});
				//console.log(pdf);
			    
			    if (ie || oldIE || ieEDGE) {
       					window.navigator.msSaveBlob(pdf, fileName);
    				}else {

    					saveData(pdf, fileName);
      					
       				}
			  }).catch(function(err){
				  //$window.alert("in error:");
				  $window.alert(err.status + ':' + errorMapperService.getErrorMessage(err.status));
				  
			  });
			
		}
		var saveData =(function(){
			var a = document.createElement("a");
    		document.body.appendChild(a);
    		a.style = "display: none";

    		return function (pdf, fileName) {
        	//var json = JSON.stringify(data),
            //blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(pdf);
        	a.href = url;
        	a.download = fileName;
        	a.click();
        	//window.URL.revokeObjectURL(url);
    	};

	}());
		
		$scope.displayCalloutData=function(index){
            
			//console.log('display call out data' + index);
            var calloutdataId = 'calloutdata' + index;
            document.getElementById(calloutdataId).style.display= 'block';
			var calloutHeaderId = 'calloutHeader'+ index;
			document.getElementById(calloutHeaderId).style.display= 'none';

		};
		
		
		$scope.hideCalloutData=function(index){
			//console.log('hide call out data' + index);
			var calloutdataId = 'calloutdata' + index;
			document.getElementById(calloutdataId).style.display= 'none';

			var calloutHeaderId = 'calloutHeader'+ index;
			document.getElementById(calloutHeaderId).style.display= 'block';
			
		}

		
		/*Pandu added script for toc*/
		//$( ".callout-alert-wrapper" ).delay( 10000 ).fadeOut( 400 );
		
		var windowWidth = $(window).width();
			$(window).scroll(function() {    
			    var scroll = $(window).scrollTop();    
			    if (scroll > 75) {
			    	$(".table-content-wrapper").addClass("fixedposition");
			    	$(".table-btn-show").addClass("fixedposition");
			    }
			    if (scroll < 75) {
			    	$(".table-content-wrapper").removeClass("fixedposition");
			    	$(".table-btn-show").removeClass("fixedposition");
			     }

			     //on page scroll add progressbar script	 
			    var scrollTop = $(document).scrollTop(), documentHeight = $(document).height() - $(window).height(); 
				var progressbarWidth = scrollTop/documentHeight * 100;
 				$('.progress-bar').css('width', progressbarWidth+'%');
 				$('.progress-bar').attr('aria-valuemax', documentHeight);
 				//on page scroll add progressbar script

			});

		$('.table-content-inner').scroll(function() {
			$(".table-header").addClass("fixedposition");
		});  
		
		//virtual tour script added by Pandu
		$scope.startTourButton=function(){
			startTour();
		}
		
			
		setInterval(function() {
    		$('.btn-next').each(function(){
  				$(this).trigger('click');
  			});
		}, 100000);
		//virtual tour script added by Pandu
		

		// $scope.closeCookieAlert=function(){
		//  	$scope.cookieAlert.load = false ;
		//  }


		//navbar changes on scrolling starts here 
		$(window).on('scroll', function () 
		{
	        var scrollTop = $(window).scrollTop();
	        var headerHeight = $('.header-wrapper').height();
	        if (scrollTop > 74) {

	        	$('.header-wrapper').stop().animate({opacity: "1"},0);
	        	//$('.logo-wrappeer').stop().animate({width:"120px"},200);
	        	//$('.header-right-wrapper, .start-virtual-tour').stop().animate({margin:"0 0px 0 5%"},200);
	            $('.alert-right').stop().animate({lineHeight:"4px",fontSize:"11px"},200);
	        	$('.callout-alert-wrapper').stop().animate({height:"11px"},200);
	        	$('.callout-alert-btn').stop().animate({top:"-5px"},200);
	        	$('.callout-alert-btn').stop().animate({width:"10px",top:"-4px"},200);
	        	
	            
	        }
	        else {
	        	//$('.header-wrapper').stop().animate({opacity: "1.0",height:"74px",padding:"20px 0px 0px 0px"},0);
	        	//$('.logo-wrappeer').stop().animate({width:"234px"},200);
	           	//$('.header-right-wrapper').stop().animate({margin:"1.5% 0px 0 0"},200);
	           	//$('.start-virtual-tour').stop().animate({margin:"1.5% 0px 0 5%"},200);
	           	$('.alert-right').stop().animate({lineHeight:"14px",fontSize:"12px"},200);
	           	$('.callout-alert-wrapper').stop().animate({height:"19px"},200);
	           	$('.callout-alert-btn').stop().animate({top:"0px"},200);
	           	$('.callout-alert-btn').stop().animate({width:"15px",top:"0px"},200);
	           	
	        }
	        
	    });
		//navbar changes on scrolling ends here
		
		$scope.downloadKitHtml ="<div class='download-file-wrapper'><div class='excel-download-btn'><a href='#'><span class='text-left'><img src='templates/images/download-kit.png' alt='Download Kit' title='Download Kit'/></span><span class='text-right'>Download Kit</span></a></div><div class='excel-text'>Download the Mobile Engagement Automation Solutions Toolkit</div></div>";


		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=879658452063499&version=v2.1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		/*Pandu added script for toc*/
		/*social media functions*/
			/*var absUrl = $location.absUrl();
			console.log("absUrl:"+absUrl);*/
		$scope.navigateToFB=function(url){

			/*var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?picture=http://mcaas-dev-icm-assets-ui.mybluemix.net/templates/images/forrester_logo.png&description='+encodeURIComponent("WHY READ THIS REPORT")+'&title='+$scope.respdata.content.report.title+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),    			  			*/
				/*var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?description='+encodeURIComponent("WHY READ THIS REPORT")+'&title='+$scope.respdata.content.report.title+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),
    			'facebook-share-dialog', 
    			'width=626,height=436');
				
    			return false;*/
    		FB.init({
	            appId      : '440609026118774',
	            xfbml      : true,
	            version    : 'v2.1'
	        });
	        var product_name   =    $scope.respdata.content.report.title;
	        var description    =    $scope.respdata.content.report.abstract;
	        /*var share_image    =    'http://mcaas-prod-icm-assets-ui.mybluemix.net/templates/images/small_logo.png';*/
	        var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/small_logo.png';
	        var share_url      =    $scope.socialmediaurls.facebookAssetURL;
	        FB.ui({
	            method: 'feed',
	            name: product_name,
	            link: share_url,
	            picture: share_image,
	            description: description
	        }, function(response){
	        	facebookSharing(response);
	        });
		};


		$scope.navigateToTwitter=function(url){
			var tweetDialog=
				window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+'&text='+encodeURIComponent($scope.respdata.content.report.title),
				'twitter-share-dialog', 
				'width=626,height=436'
				);	
				return false;
			};

		$scope.navigateToLinkedIn=function(shareurl){
			//http://www.linkedin.com/shareArticle?mini=true&url=http://stackoverflow.com/questions/10713542/how-to-make-custom-linkedin-share-button/10737122&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com
			var linkedInDialog=
					window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent($scope.socialmediaurls.linkedinAssetURL)+'&title='+encodeURIComponent($scope.respdata.content.report.title)+'&summary='+encodeURIComponent($scope.respdata.content.report.abstract)+'&source=Forrester',
					'LinkedIn-share-dialog', 
					'width=626,height=436'
					);	
					return false;
			};

		// $scope.navigateToEmail=function(shareurl){
			// $scope.mailLink="mailto:"
				// /*+ "?cc=",*/
             	// + "?subject="+$scope.respdata.content.report.title
             	// + "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
             	// //window.open(mailLink);
             	// //window.location.href = mailLink;
		// };
		
		//for firefox
		$scope.navigateToEmail=function(shareurl){
			var mailLink="mailto:"
				/*+ "?cc=",*/
             	+ "?subject="+$scope.respdata.content.report.title
             	+ "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL)+"_self";
             	
             	var myWindow =window.open(mailLink,"myWindow");
             	myWindow.close();
			};


		if(isChromeBrowser){
	    	$scope.navigateToEmail=function(shareurl){
			var mailLink="mailto:"
				/*+ "?cc=",*/
             	+ "?subject="+$scope.respdata.content.report.title
             	+ "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL)+"_self";
             	
             	var myWindow =window.open(mailLink,"myWindow");
             	myWindow.close();
			};
	    }

	    if(isIEBrowser){
	    	//alert('IE');
	    	$scope.navigateToEmail=function(shareurl){
				var mailLink="mailto:"
				/*+ "?cc=",*/
             	+ "?subject="+$scope.respdata.content.report.title
             	+ "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL)+"_self";
             	
             	//var myWindow =window.open(mailLink,"myWindow");
             	//myWindow.close();
             	window.location.href = mailLink;
				};
	    }

	/*css for save share close on body click*/
	$scope.$window = $window;
    $scope.savepdf = false;
    $scope.toggleSavePdf = function() {
    $scope.social = false;
      $scope.savepdf = !$scope.savepdf;
      if ($scope.savepdf) {
        $scope.$window.onclick = function(event) {
          closeSearchWhenClickingElsewhere(event, $scope.toggleSavePdf);
        };
      } else {
        $scope.savepdf = false;
        $scope.$window.onclick = null;
        //$scope.$apply();
      }
    };

    $scope.social = false;
    $scope.toggleSocialShare = function() {
    $scope.savepdf = false;
      $scope.social = !$scope.social;
      if ($scope.social) {
        $scope.$window.onclick = function(event) {
          closeSearchWhenClickingElsewhere(event, $scope.toggleSocialShare);
        };
      } else {
        $scope.social = false;
        $scope.$window.onclick = null;
        $scope.$apply();
      }
    };

   

    function closeSearchWhenClickingElsewhere(event, callbackOnClose) {

      var clickedElement = event.target;
      if (!clickedElement) return;

      var elementClasses = clickedElement.classList;
      var clickedOnSearchDrawer = elementClasses.contains('handle-right') || elementClasses.contains('drawer-right') || (clickedElement.parentElement !== null && clickedElement.parentElement.classList.contains('drawer-right'));

      if (!clickedOnSearchDrawer) {
        callbackOnClose();
        return;
      }

    }
    /*js for save share close on body click*/

    //raghu added new script for cookie div alert
    $scope.showCookieAlert = true;
    $scope.closeCookieAlert = function(){
    	$scope.showCookieAlert = false;	
    }
    $timeout(function(){
         $(".cookie-alert-wrapper" ).fadeOut( 400 );
     }, 20000);

    //angular.element(window).on('resize',displayCallout);


    // pradeep code to display callout in mobile view

	 function displayCallout(){
	 	
		var isIEBrowser = false || !!document.documentMode;	
		var isSafariBrowser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);		
		if(isIEBrowser){
			var windowWidth=$(window).width();
		}else if(isSafariBrowser){
			var windowWidth=$(window).width();
		}else{
			var windowWidth=$(window).width()+17;
		}
		
	 	
	 	if(windowWidth < 1024){
	 		calloutDisplayService.displayCallout($scope.globalCalloutObject);
	 		
	 	}else{
	 		
			$('.callout-display-wrapper').removeClass('displayNoneMobile');
		}
	 	
	 	
	 }

	 $(window).on('resize', function(){
	 	//console.log("width pandu:    "+$(window).width());
	 	displayCallout();
	 });


	//Amir code for callout scroll display
	$scope.getCalloutHeightMobile=function(){
		$scope.calloutIdsMObile=[];
		$( ".callout_content_mobile" ).each(function( index ) {
		  
		  $scope.calloutIdsMObile.push($( this ).position().top );
		});
		$scope.calloutIdsMObile.sort(function(a, b){
			if ( a < b )
			  return -1;
			if ( a > b )
			  return 1;
			return 0;
		});
	}
	$scope.getCalloutHeight=function(){
		$scope.calloutIds=[];
		$( ".callout-display-wrapper").each(function( index ) {
		  if($( this ).is(":visible") == true){
			$scope.calloutIds.push($( this ).position().top );
		  }
		  
		  
		});
		$scope.calloutIds.sort(function(a, b){
			if ( a < b )
			  return -1;
			if ( a > b )
			  return 1;
			return 0;
		});
	
	}
	
	
	var clickcount=0;
	
	$scope.calloutScrollView = function(){ 
		
		var isIEBrowser = false || !!document.documentMode;	
		var isSafariBrowser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);		
		if(isIEBrowser){
			var windowWidth=$(window).width();
		}else if(isSafariBrowser){
			var windowWidth=$(window).width();
		}else{
			var windowWidth=$(window).width()+17;
		}
		
		if(windowWidth >=1024  || window.location.href.indexOf("editor") > -1){  
			$scope.getCalloutHeight();
			
			var destination=$scope.calloutIds[clickcount] -70;
			$('html, body').animate({scrollTop: destination}, 300);
			clickcount=clickcount+1;
		
			if($scope.calloutIds.length===clickcount){
				clickcount=0;
			}
		}else{
			$scope.getCalloutHeightMobile();
			var destination=$scope.calloutIdsMObile[clickcount] -70;
			$('html, body').animate({scrollTop: destination}, 300);
			clickcount=clickcount+1;
			if($scope.calloutIdsMObile.length===clickcount){
				clickcount=0;
			}
		}
		if(clickcount >4){
			clickcount=0;
		}
	}
	
	// amir Toc
	$scope.modify={};//need to define this variable first
    userVal = $location.search().toc;
	
	$scope.modify.name = userVal;								
	// $scope.gotoId = function(){                
				// var tocVal = $('#gotoInput').val();			
                // $('a').each(function(){
                        // var text = $(this).text();
                        // var id   = $(this).attr('id');
                        // if(text.trim()==tocVal){
                                // setTimeout(function(){
                                  // $('#'+id).trigger('click');
                                // },100)
                        // }
				// })}
	// setTimeout(function(){
           // $scope.gotoId();
    // },5000)	

    

}]);
//Amir Toc code End





// Code for Heatmap - Shankar Venugopal - 26 Sep 2016
//


// Generate rectangle to highlight heatmap zone
//
function createZoneHeatMap(zone_name, zone_val, zone_height, context_div_obj){
	var context = context_div_obj.getContext("2d");
	context.translate(0.5, 0.5);
    var num = parseInt(zone_name.split('_')[1]) / 10;

    var start_point = (num - 1) * zone_height;
    var end_point = num * zone_height;
    var zone_mid_point = parseInt((start_point + end_point)/2);

    var mid_zone_div_id = "";
    $( "calloutp" ).each(function( index ) {
        if($( this ).attr('id')) {
            var p = $( this ).position();
            if(p.top >  zone_mid_point){
                mid_zone_div_id = $( this ).attr('id');

                var parent_div_h = parseInt($('#'+mid_zone_div_id).parent().height() + 20);
                var parent_div_w = parseInt($('#'+mid_zone_div_id).parent().width() + 40);
                var parent_div = $('#'+mid_zone_div_id).parent().offset();
			    var highlight_color = getHeatmapColorCode(parseInt(zone_val));

			    roundRect(highlight_color, context, parent_div.left-20, parent_div.top-10, parent_div_w, parent_div_h, 20, true);
                return false; 
            }  
        }                
    });
}

// Generate Clicks heatmap
//
function createClickHeatMap(xPos, yPos, context_div_obj){
	var c1 = context_div_obj.getContext("2d");
	var c2 = context_div_obj.getContext("2d");
	var c3 = context_div_obj.getContext("2d");

	c1.beginPath();
	c1.arc(xPos, yPos, 10, 0, 2 * Math.PI);

	c1.fillStyle = 'red';
	c1.fill();
	c1.lineWidth = 5;
	c1.strokeStyle = 'yellow';
	c1.shadowBlur = 120;
	c1.stroke();

	c2.beginPath();
	c2.arc(xPos, yPos, 15, 0, 2 * Math.PI);

	c2.strokeStyle = 'lightgreen';
	c2.shadowBlur = 120;
	c2.stroke();

	c3.beginPath();
	c3.arc(xPos, yPos, 20, 0, 2 * Math.PI);

	c3.strokeStyle = '#336699';
	c3.shadowBlur = 120;
	c3.stroke();
}

// Clear WAIT - once you see the required content in web page
//
function clearIntervalFunc( waitinterval ) {
    clearInterval( waitinterval );   
}


// Get HEATMAP color code - values are in sec
//
function getHeatmapColorCode( timeSpent ) {
    if( timeSpent > 1080 ) { return "#E60000";
    } else if( timeSpent > 960 ) { return "#E81919";
    } else if( timeSpent > 840 ) { return "#EB3333";
    } else if( timeSpent > 720 ) { return "#EE4D4D";
    } else if( timeSpent > 600 ) { return "#F06666";
    } else if( timeSpent > 480 ) { return "#F28080";
    } else if( timeSpent > 360 ) { return "#F59999";
    } else if( timeSpent > 240 ) { return "#F8B2B2";
    } else if( timeSpent > 120 ) { return "#FACCCC";
    } else if( timeSpent > 0 ) { return "#FCE6E6";
    } else { return ""; }
}


// Get top three time spent heatmap data
//
function getTopThreeZones(heatmapZoneData){

	var props = Object.keys(heatmapZoneData).map(function(key) {
	  	return { key: key, value: this[key] };
	}, heatmapZoneData);

	props.sort(function(p1, p2) { 
		return p2.value - p1.value; 
	});
	
	var topThree = props.slice(0, 3);

	var topThreeObj = props.slice(0, 3).reduce(function(obj, prop) {
		obj[prop.key] = prop.value;
		return obj;
	}, {});

	return topThreeObj;
}


function roundRect(color, ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	
	if (typeof radius === 'undefined') {
		radius = 5;
	}

	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}

	ctx.beginPath();
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.4;
		ctx.strokeStyle = "yellow";
		ctx.lineWidth   = 10;
		//ctx.shadowBlur = 10;
	  	ctx.shadowColor = 'blue';

		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();

	if (fill) {
		ctx.fill();
	}

	if (stroke) {
		ctx.stroke();
	}
}
// -- Heatmap Code Ends Here --