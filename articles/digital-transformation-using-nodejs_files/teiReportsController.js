
reportsApp.controller("teiReportsController",
						['$scope','$http','$window','$timeout','$location','$anchorScroll',
						'$stateParams','$state','reportsDataFactory',
						'pdfDownloadFactory','reportMappingFactory','$filter',
						'urlMapperService','errorMapperService','teiReportsService','$sce','urlMaskMappingFactory',
						function($scope,$http,$window,$timeout, 
								$location, $anchorScroll,$stateParams,
								$state,reportsDataFactory,pdfDownloadFactory,
								reportMappingFactory, $filter,urlMapperService,errorMapperService,teiReportsService,$sce,urlMaskMappingFactory){
	   	//var absUrl = $location.absUrl();
	    //var referrer = $window.document.referrer;



		
	   	//var clientAddress = HttpContext.Current.Request.UserHostAddress;
	   	//console.log('inside forester controller');
	   	// $scope.showShare = false;
	   	 $scope.loaded = false; 
		 $scope.respdata = {};
		 $scope.selectedText = "";
		 $scope.searchTerm = '';
		 $scope.selectedSectionID = $.cookie("sectionID");

		 /*Search function starts*/
		 $scope.searchTerm2 = '';
		 $scope.matchCount = 0;
		 $scope.nextPosition = 0;
		var highlightFirstFlag = true;
		$scope.sendCount = function(count){
			$scope.matchCount = count;
			if(count == 0){
				highlightFirstFlag = true;	
				$scope.nextPosition = 0;
			} else {
				if($scope.matchCount > 0 && highlightFirstFlag){
					highlightFirstFlag = false;			
					$scope.onNext();
				}
			}
		}
		 
		var next;

		$scope.showSocial = function(){
			//alert('yaa');
		       $(".socialShareInfographic").toggle("slide", { direction: "right" }, 1000);
		    
		}

		$scope.onNext = function(){
			if($scope.nextPosition != 0){
				angular.element('#highlightId'+$scope.nextPosition).addClass("highlight").removeClass("highlight-red");
			}

			if($scope.nextPosition >= $scope.matchCount) {
				$scope.nextPosition = 1;
			} else {
				$scope.nextPosition++;
			}

			$('#highlightId'+$scope.nextPosition).removeClass("highlight").addClass("highlight-red");
			var offsetTopDiv = 'highlightId'+$scope.nextPosition;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.tei-header-wrapper').height();

			var $container = $("html,body");
			var $scrollTo = $('.highlight-red');
			$container.animate({scrollTop: ($scrollTo.offset().top - $container.offset().top)-100, scrollLeft: 0},300); 
		}
		 
		$scope.scrollToTop = function(){
			//$window.scrollTo(0, 0)
			//$anchorScroll();
			$('body,html').animate({scrollTop: 0}, 800);
			return false;
		}
		$scope.scrollToTopNew = function(){
			var introHeight = $('.introduction-outer-wrapper').height();
			$('body,html').animate({scrollTop: introHeight+20}, 800);
			return false;
		}
		 
		 $scope.onPrevious = function(){
			angular.element('#highlightId'+$scope.nextPosition).addClass("highlight").removeClass("highlight-red");
		 	
		 	if($scope.nextPosition == 1 || $scope.nextPosition == 0){
		 		$scope.nextPosition = $scope.matchCount;
		 	} else if($scope.nextPosition <= $scope.matchCount) {
				$scope.nextPosition--;
			}

	        angular.element('#highlightId'+$scope.nextPosition).removeClass("highlight").addClass("highlight-red");
	        var offsetTopDiv = 'highlightId'+$scope.nextPosition;
			var offsetTp = angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.tei-header-wrapper').height();

			var $container = $("html,body");
			var $scrollTo = $('.highlight-red');
			$container.animate({scrollTop: ($scrollTo.offset().top - $container.offset().top)-100, scrollLeft: 0},300); 			 
		 }
		 /*Search function ends*/
		 /*//to enable tracker.....
		enableTracker();*/


		
		 $scope.mainReportHeading = 0;
		$scope.tableOfContent=false;
		//console.log("referrer is");
		 
		$scope.tabs = reportMappingFactory.tabsData;
		//$scope.respdata = jsonContent;

		// URL Mask - Map URL params to get TEI report data
		// Shankar Venugopal - 21 July 2016
		//
   		//urlMaskMappingFactory.getURLMaskMap($stateParams).then(function(urlMapData) {
   			reportsDataFactory.getReportData($stateParams).success(function(data) {

			//reportsDataFactory.getReportData(urlMapData.data.mcaasUrlDecode).success(function(data) {
				var reportDate;
				$scope.respdata = data;
				
				if($scope.respdata.assetInfo.metaInfo.template !=undefined){
					$scope.templete="templates/forester-tei-report-new.html"
				}else{
					$scope.templete="templates/forester-tei-report.html"
				}
				
				var jsonData=$scope.respdata.jsondata;
				/* to enable tracker..... */
				
				if(data.goLiveDate!=undefined){
					$scope.reportDate=new Date((data.goLiveDate).replace("IST",""));
				}

				//  $scope.endNoteSlideDivIds = teiReportsService.getEndNoteRefs(data);
				$scope.figureMap = teiReportsService.getAllFigures(data);
				$scope.tableMap = teiReportsService.getAllTables(data);
				$scope.idMap = teiReportsService.getIdMap(data);
				
				
				
				$scope.figureData={};
				$scope.figureDataLabel={};
				$scope.highlightImageData={};
	 			var x=0;
	 			angular.forEach(data.content.report.figures, function(fig, index) {
					$scope.figureData[fig.id] = "data:image/gif;base64,"+fig.encodedImage;
					$scope.figureDataLabel[fig.id] = fig.label;
					if( fig.label!=""){
	 			 		$scope.highlightImageData[x] = {"id":fig.id,"value":fig.label};
	 			 		x=x+1;
	 			 	} 			  
				});
				$scope.table={};
				$scope.highlightTableData={};
				var x=0;
	 			

	 			angular.forEach(data.content.report.tables, function(table, index) {
	 			 	
					$scope.table[table.id] = table; 
					$scope.highlightTableData[x] = {"id":table.id,"value":table.label};
					x=x+1;			  
				});

				$scope.subSections={};
				var x1=0;
				angular.forEach(data.content.report.contents.mainContent.mainReportSections, function(title, index) {
	 			 	
					if(title.sectionTitle.type=='L2' || title.sectionTitle.type=='L1'){
						$scope.subSections[x1]={"id":x1,"value":title.sectionTitle.value};
						x1=x1+1;
					}
					
								  
				});



				var viewPortHeight = $(window).height();
				viewPortHeight = parseInt(viewPortHeight - 300);
				var tableContentLength = $scope.respdata.content.report.contents.toc.tocSection[0].tocItem.length;
				$scope.verticalScrollLength = parseInt(viewPortHeight/tableContentLength) + 'px';
				//$scope.verticalScrollLength = verticalScrollLength + "px";
				
				$scope.tocRefs=teiReportsService.getTocRefs(data);

				//infinite scroll
				$scope.mainReportSubSections = [];
				$scope.sectionId = data.content.report.contents.mainContent.mainReportSections.length > 0?"1":null;
				$scope.busy = false;
				
				$scope.disabled = false;
				//$scope.getEncodedImage(data);

				$scope.nextSection = function(){
					if($scope.busy || $scope.sectionId == $scope.tocRefs.length+1){
						return;
					}
					$scope.busy = true;
					$scope.getMainReportSubSections($scope.sectionId, data);
				}

				var encodedImageHash = {};
				angular.forEach(data.content.report.iconImages,function(iconImage,index){
					encodedImageHash[iconImage.id] = iconImage.encodedImage;
				});

				$scope.getEncodedImage = function(imgId){
					return encodedImageHash[imgId];
				} 

				$scope.getMainReportSubSections = function(subIndex, data){
					var isTocRefAvailable = false;
					angular.forEach(data.content.report.contents.mainContent.mainReportSections,function(mainReportSection,index){
						if(mainReportSection.tocRef != undefined && mainReportSection.tocRef == subIndex){
							$scope.mainReportSubSections.push(mainReportSection);
							isTocRefAvailable = true;
						} else if(isTocRefAvailable && mainReportSection.tocRef == undefined){
							$scope.mainReportSubSections.push(mainReportSection);
							isTocRefAvailable = true;
						} else {
							isTocRefAvailable = false;
						}		 			
					});
					$scope.busy = false;
					if($scope.sectionId <= $scope.tocRefs.length){
						$scope.sectionId++;
					if($scope.mainReportSubSections.length <= 1){
						$scope.nextSection();
					}
					} else {
						$scope.busy = true;
					}
				}

				$scope.getMainReportSubSections($scope.sectionId, data);

				$scope.$emit('list:filtered');

				
				
				
				var circleLength=12;
				var totalCircles=$scope.respdata.content.report.contents.toc.tocSection[0].tocItem.length+2;
				var totalCircleLength=circleLength*totalCircles;
				
				var totalLineLenth= $( window ).width() -totalCircleLength;
				
				$scope.eachLineLength=(totalLineLenth/(totalCircles-1));
				$scope.style={ "width":$scope.eachLineLength+'px'};
				$scope.style1={ "width":$scope.eachLineLength+6+'px'};

				$scope.loaded = true;
				enableTracker($scope.respdata.assetInfo.metaInfo.tenantId,$scope.respdata.assetInfo.metaInfo.userId,$scope.respdata.assetInfo.metaInfo.assetId);

				//pradeep navigation to new template
				 $scope.navigateToImage=function(imageId){
				 	var imageTop=$("#figure_"+imageId).offset().top;
				 	var headerHeight=$('.report-header-wrapper').height();
					$('body,html').animate({scrollTop: imageTop-headerHeight-40}, 800);
					$('.highlights-list-wrapper').slideUp();
				 }


				 $scope.navigateToTable=function(tableId){
				 	var tableTop=$("#table_"+tableId).offset().top;
				 	var headerHeight=$('.report-header-wrapper').height();
				 	$('body,html').animate({scrollTop: tableTop-headerHeight}, 800);
				 	$('.highlights-list-wrapper').slideUp();	
				 }
				 //pradeep navigation to new template



				$scope.navigateToHeader = function(headerId){
					var divOffset = $("#content_header_"+headerId).offset().top;
					$('.mobile-menu-btn-close').hide();
		            $('.mobile-menu-btn-tei').fadeIn();
		            $(".mobile-menu-wrapper").fadeOut();
		            if($('body').width() < 700){
				    	$('body,html').animate({scrollTop: divOffset-130}, 800);    
				    }else{
				        $('body,html').animate({scrollTop: divOffset}, 800);
				    }
					
				}


				//Left scroll
				$scope.scrollTo = function(selectedPageId){
					//alert('sdf');
					$(".leftmenu-list-wrapper").css({width:"45px"});
					$(".leftmenu-list-wrapper").removeClass('custombg');
					$('.left-nav-top').hide();
					
			    	//if ($(window).width() < 400 && $('.left-nav-top').css('left') == '0px') {
			    	//	$scope.leftMenuDisplay();
	    			//}

					selectedPageId = parseInt(selectedPageId);

					if(selectedPageId < $scope.sectionId || $scope.tocRefs.length == 0){
						return;
					} else {
						$scope.busy = true;
						$scope.getMainReportSubSectionsRange($scope.sectionId, selectedPageId, data);
					}
				}


				$scope.getMainReportSubSectionsRange = function(fromIndex, toIndex, data){
					var isTocRefAvailable = false;
					angular.forEach(data.content.report.contents.mainContent.mainReportSections,function(mainReportSection,index){
						var currentIndex = parseInt(mainReportSection.tocRef);
						if(mainReportSection.tocRef != undefined && (currentIndex >= fromIndex &&  currentIndex <=toIndex)){
							$scope.mainReportSubSections.push(mainReportSection);
							isTocRefAvailable = true;
						} else if(isTocRefAvailable && mainReportSection.tocRef == undefined){
							$scope.mainReportSubSections.push(mainReportSection);
							isTocRefAvailable = true;
						} else {
							isTocRefAvailable = false;
						}
					});

					$scope.busy = false;
					if($scope.sectionId <= $scope.tocRefs.length){
						$scope.sectionId = toIndex+1;
					} else {
						$scope.busy = true;
					}
				}
				//Left scroll

					$scope.tocRefsForRecommendations=teiReportsService.getTocRefsForRecommendations(data);

					//nischitha code for social sharing
					if($scope.respdata.assetInfo.vadInfo.socialSharingExists==true){
						$scope.socialmediaurls = $scope.respdata.assetInfo.vadContent.socialSharingURLs;
					}



			}).error(function (data, status) {
				// Handle HTTP error
			}).catch(function (error) {
				// Catch and handle exceptions from success/error/finally functions
				console.log("Error:"+error);
				// $window.alert(error.status + ':' + errorMapperService.getErrorMessage(error.status));
			});
   		//});
   		// Ends here

		 $scope.currentTab = 'one.tpl.html';
	     $scope.onClickTab = function (tab) {
	        $scope.currentTab = tab.url;
	     }  
		 $scope.isActiveTab = function(tabUrl) {
		        return tabUrl == $scope.currentTab;
		 }
		 $scope.navigateTitleDiv=function(id){
			 id = $filter('removeSpaces')(id);
			 $location.hash(id);
		     $anchorScroll();
		 }
		 $scope.closeCalloutAlert=function(){
		 	$scope.calloutAlert.load = false ;
		 }

		 //pandu added click event for highlights figure view
		 $scope.navigateFigureDiv=function(id, sectionId){
			$scope.scrollTo(sectionId);

			var offsetTp = 0; //angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.tei-header-wrapper').height();
			$('.highlights-list-wrapper').fadeOut();
			// Code added by Shankar for Table highlights
			// 27 July 2016
			if($("#"+id).length != 0) {
				var divOffset = $("#"+id).offset();
				offsetTp = divOffset.top;
			}
			// Ends here

			$('html, body').animate({
			    scrollTop: offsetTp - pageHeader-20
			});
	    	if ($(window).width() < 400) {
	    		$scope.showHighlights();
	    	}
		 }

		 //pandu added click event for highlights table view
		 $scope.navigateTableDiv=function(id, sectionId){
		 	// $('.highlights-list-wrapper').fadeOut();

			for(var nav=0;nav<=$scope.respdata.content.report.tables.length;nav++){
				$scope.nextSection();
			}

			$scope.nextSection();
			$scope.scrollTo(sectionId);
			var offsetTp = 0; //angular.element(document.getElementById(offsetTopDiv)).prop('offsetTop');
			var pageHeader = $('.tei-header-wrapper').height();
			$('.highlights-list-wrapper').fadeOut();
			// Code added by Shankar for Table highlights
			// 27 July 2016
			if($("#"+id).length != 0) {
				//console.log("id: "+$("#"+id));
				var divOffset = $("#"+id).offset();
				//console.log("divOffset: "+divOffset.top);
				offsetTp = divOffset.top;
				$('html, body').animate({
				    scrollTop: offsetTp - pageHeader-10
				});

			}else{
				//console.log("id not found: "+$("#"+id));
				setTimeout(function(){ 
					var divOffset = $("#"+id).offset();
					//console.log("divOffset: "+divOffset.top);
					offsetTp = divOffset.top;
					clearTimeout(0);
					$('html, body').animate({
					    scrollTop: offsetTp - pageHeader-10
					});
				 }, 1000);
			}
			
			
			// Ends here
		
			

	    	if ($(window).width() < 400) {
	    		$scope.showHighlights();
	    	}
		 }

		 var endNoteDivValue=true;
		$scope.toggle = function() {
			endNoteDivValue=true;
	        $scope.$broadcast('event:toggle');
	    }
	    
		$scope.navigateEndNoteDiv=function(id){
			//console.log("end note id is :"+id);
			$location.hash('endNoteBody'+id);
		    $anchorScroll();
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
		    document.getElementById(endNoteSlideId).style.top = offsetTp + 15 + 'px';
		    document.getElementById(endNoteSlideId).style.display="block";
		    
		}

		$scope.endNoteSlideDivHide = function(index){
				var hideDiv = 'endNoteSlide' + index;
				document.getElementById(hideDiv).style.display="none";
		}

		$scope.navigateseeFigureDiv=function(seeFigureId){
			seeFigureId='see Figure '+seeFigureId;
			$location.hash(seeFigureId);
		    $anchorScroll();
		}

		$scope.navigateEndNoteRef=function(id){
			id='endNoteRef' + id;
			//console.log('id is  ' + id);
			$location.hash(id);
		    $anchorScroll();
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
			//	console.log(pdf);
			    
			    if (ie || oldIE || ieEDGE) {
       					window.navigator.msSaveBlob(pdf, fileName);
    				}else {

    					saveData(pdf, fileName);
      					
       				}
			  }).catch(function(err){
				  $window.alert("in error:");
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

		/*$('.table-content-inner').scroll(function() {
			$(".table-header").addClass("fixedposition");
		}); */ 

		//navbar changes on scrolling starts here
		
	 
	//navbar changes on scrolling ends here

	$scope.downloadKitHtml ="<div class='download-file-wrapper'><div class='excel-download-btn'><a href='#'><span class='text-left'><img src='templates/images/download-kit.png' alt='Download Kit' title='Download Kit'/></span><span class='text-right'>Download Kit</span></a></div><div class='excel-text'>Download the Mobile Engagement Automation Solutions Toolkit</div></div>";

	/*Pandu added script for toc*/
	$scope.showHighlights = function(){
		$('.search-div-id').hide();
		 // Set the effect type
		var effect = 'slide';

		// Set the options for the effect type chosen
		var options = { direction: 'right' };

		// Set the duration (default: 400 milliseconds)
		var duration = 500;

		$('.highlights-list-wrapper').toggle(effect, options, duration);
		
		$('.left-nav-top').hide();
		$(".leftmenu-list-wrapper").animate({width:"45px"},50);
		$(".leftmenu-list-wrapper").removeClass('custombg');
		
		$scope.socialMediaIcons = false;
		$('.social-link-btn-tei').css('display','block');
		
		
		
	}
	
	$scope.closeTOC = function()
	{
		
			$(".leftmenu-list-wrapper").animate({width:"45px"},50);	
			$(".leftmenu-list-wrapper").removeClass('custombg');
			//$(".left-nav-top").animate({width:"450px"});
			
			var effect = 'slide';
			// Set the options for the effect type chosen
			var options = { direction: 'left' };
			// Set the duration (default: 400 milliseconds)
			var duration = 200;
			$('.left-nav-top').toggle(effect, options, duration);
		
	}

	$scope.leftMenuDisplay = function()
	{
		
			$(".leftmenu-list-wrapper").animate({width:"450px"});	
			$(".leftmenu-list-wrapper").addClass('custombg');
			//$(".left-nav-top").animate({width:"450px"});
			
			var effect = 'slide';
			// Set the options for the effect type chosen
			var options = { direction: 'left' };
			// Set the duration (default: 400 milliseconds)
			var duration = 500;
			$('.left-nav-top').toggle(effect, options, duration);
			
			$('.highlights-list-wrapper').hide();
			
			
			
		
	}

	$scope.searchButtonClick = function() {
		if($(window).width() > 400) {
			var rt = $(window).width() - 10 - ($('.page-search-wrapper').offset().left + $('.page-search-wrapper').outerWidth());
			$('.search-div-id').stop().animate({right:rt+'px'});
		}
		
		$('.search-div-id').slideToggle();
		$('#text-12').focus();
		// if($('.highlights-list-wrapper').css("right") == "0px") {
			// $scope.showHighlights();
		// }
	}

	$scope.closeOverlay = function() {
		$('.search-div-id').slideToggle();
		angular.element("[id^=highlightId]").removeClass("highlight").removeClass("highlight-red");
		angular.element("#text-12").val("");
		//angular.element("#search-count").text("");
		$scope.nextPosition = 0; 
		$scope.matchCount = 0;
	}

	$scope.pdfToggle = function(){
		$('.pdf-preview').slideToggle();
	}

	

	// code for text highlighting function starts here
	$scope.mouseUp = function(selectedId,e){
		
	 if($scope.selectedText = window.getSelection().toString().replace(/'/g, "&#39;"))
		{
			$scope.offsetTop = e.pageY;
			$('.arrow_box').css("display","block").css("top",e.pageY+10).css("left", e.pageX-115);
		}
		
		else if($scope.selectedText == "") {

			$('.arrow_box').css("display","none");
		}
		else{
			$('.arrow_box').css("display","none");
		}	        
		
		
	    	
	};
	// code for text highlighting function ends here
	$scope.mouseDown = function(selectedId,e){
		$('.arrow_box').css("display","none");
	};
	//nischitha code for social sharing
	(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=879658452063499&version=v2.1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	$scope.navigateToFB=function(url){

	/*var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?picture=http://mcaas-dev-icm-assets-ui.mybluemix.net/templates/images/forrester_logo.png&description='+encodeURIComponent("WHY READ THIS REPORT")+'&title='+$scope.respdata.content.report.title+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),    			  			*/
		// var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?description='+'&title='+$scope.respdata.content.report.title+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),
		/*var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?description='+encodeURIComponent($scope.respdata.content.report.abstract)+'&title='+parseHTMLTags($scope.respdata.content.report.title)+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),	
		'facebook-share-dialog', 
		'width=626,height=436');
		
		return false;*/
		var fblogoURL='data:image/png;base64,'+$scope.respdata.content.report.logoImage;
		FB.init({
	            appId      : '440609026118774',
	            xfbml      : true,
	            version    : 'v2.1'
	        });
	        var product_name   =   parseHTMLTags($scope.respdata.content.report.title);
	        var description    =   $scope.respdata.content.report.abstract;
	        /*var share_image    =    'http://mcaas-prod-icm-assets-ui.mybluemix.net/templates/images/small_logo.png';*/
			var currenturl=document.URL;
			
			if(currenturl.includes("servicenow")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_servicenow_logo.png';
			}
	        if(currenturl.includes("equinix")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_tei_logo.png';
			}
			if(currenturl.includes("IBM")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_ibm_tei_logo.png';
			}
			
	        //var share_image	= $scope.respdata.content.report.logoImage;
	        var share_url      =    $scope.socialmediaurls.facebookAssetURL;
	        FB.ui({
	            method: 'feed',
	            name: product_name,
	            link: share_url,
	            picture: share_image,
	            description: description
	        }, function(response){
	        	//alert("done");
	        	facebookSharing(response);
	        });
	   };


$scope.navigateToTwitter=function(url)
{
	
	var tweetDialog=
		//window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+ '&text= ' + ' ' + encodeURIComponent($scope.respdata.content.report.title),
		window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+ '&text= ' + $scope.selectedText,
		'twitter-share-dialog',
		'width=626,height=436'
		);
		return false;
	};

$scope.navigateToLinkedIn=function(shareurl){
	//http://www.linkedin.com/shareArticle?mini=true&url=http://stackoverflow.com/questions/10713542/how-to-make-custom-linkedin-share-button/10737122&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com
	var linkedInDialog=
			
			window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent($scope.socialmediaurls.linkedinAssetURL)+'&title='+parseHTMLTags($scope.respdata.content.report.title) + '&summary='+encodeURIComponent($scope.respdata.content.report.abstract)+'&source=Forrester',	
			'LinkedIn-share-dialog',
			'width=626,height=436'
			);	
			return false;
	};

$scope.navigateToEmail=function(shareurl){
	
	$scope.mailLink="mailto:"
		/*+ "?cc=",*/
     	//+ "?subject="+$scope.respdata.content.report.title
     	//+ "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
	     	//Ragav's modified code for email sharing
     	+ "?subject="+parseHTMLTags($scope.respdata.content.report.title)
     	+ "&body=See what I just read about: "+$scope.selectedText+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
     	//window.open(mailLink);
     	//window.location.href = mailLink;
};


//for tei infographic
//var fblogoURL='data:image/png;base64,'+$scope.respdata.content.report.logoImage;

	//var infographicImageLrg = 'data:image/png;base64,'+$scope.respdata.content.report.infoGraphicImage;

//console.log($scope.infographicImageLrg);

$scope.navigateToEmailInfographic=function(shareurl){
	
	$scope.mailLink="mailto:"
		/*+ "?cc=",*/
     	//+ "?subject="+$scope.respdata.content.report.title
     	//+ "&body=See what I just read about "+$scope.respdata.content.report.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
	     	//Ragav's modified code for email sharing
     	+ "?subject="+parseHTMLTags($scope.respdata.content.report.title)
     	+ "&body=See what I just read about: "+$scope.selectedText+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
     	//window.open(mailLink);
     	//window.location.href = mailLink;
};

$scope.navigateToLinkedInInfographic=function(shareurl){
	
	var linkedInDialog=
			
			window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent($scope.socialmediaurls.linkedinAssetURL)+'&title='+parseHTMLTags($scope.respdata.content.report.title) + '&summary='+encodeURIComponent($scope.respdata.content.report.abstract)+'&source=Forrester',	
			'LinkedIn-share-dialog',
			'width=626,height=436'
			);	
			return false;
	};

$scope.navigateToFBInfographic=function(url){

		var fblogoURL='data:image/png;base64,'+$scope.respdata.content.report.logoImage;
		FB.init({
	            appId      : '440609026118774',
	            xfbml      : true,
	            version    : 'v2.1'
	        });
	        var product_name   =   parseHTMLTags($scope.respdata.content.report.title);
	        var description    =   $scope.respdata.content.report.abstract;
			var currenturl=document.URL;
			
			if(currenturl.includes("servicenow")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_servicenow_logo.png';
			}
	        if(currenturl.includes("equinix")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_tei_logo.png';
			}
			if(currenturl.includes("IBM")){
				var share_image    =    'http://mcaas-'+urlMapperService.getUrl('env')+'-icm-assets-ui.mybluemix.net/templates/images/tei/images/fb_ibm_tei_logo.png';
			}
			
	        //var share_image	= $scope.respdata.content.report.logoImage;
	        var share_url      =    $scope.socialmediaurls.facebookAssetURL;
	        FB.ui({
	            method: 'feed',
	            name: product_name,
	            link: share_url,
	            picture: share_image,
	            description: description
	        }, function(response){
	        	//alert("done");
	        	facebookSharingInfographic(response);
	        });
	   };


$scope.navigateToTwitterInfographic=function(url)
{
	
	var tweetDialog=
		
		window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+ '&text= ' + $scope.selectedText,
		'twitter-share-dialog',
		'width=626,height=436'
		);
		return false;
	};	

	//$("[data-toggle='tooltip']").tooltip();
		$scope.socialMediaIcons = false;
		$scope.showSocialMedia = function(){
			$scope.socialMediaIcons = true;
			$('.social-link-btn-tei').css('display','none');
			$('.highlights-list-wrapper').fadeOut();
			
		}
		$scope.hideSocialMedia = function(){
			$scope.socialMediaIcons = false;
			$('.social-link-btn-tei').css('display','block');
			$('.arrow_box').css('display','none');
		}

		//download pdf dynamically added by Pandu on 17march2017
		$scope.downloadPDFfromS3=function(assetid){
		 	//if(code == "EN")
			//{
				window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/TEI/pdf/"+assetid+".pdf");
			//}
			/*else{
				window.open("https://kloudrydermcaas.s3.amazonaws.com/mcaas/Forrester/"+assetid+"_"+code+".pdf");
			}*/	
		}
		
		//download infographic pdf
		$scope.downloadInfographicPdfFromS3=function(assetid){
		 	
				window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/TEI/pdf/"+assetid+"-infographic.pdf");
			
		}

		//introduction overlay for TEI added by Pandu
		$scope.overlayClose = function(){
			$('.introduction-wrapper').fadeOut();
			$('body').css('overflow', 'auto');
			//$('.tei-header-wrapper').css('display', 'block');
			$('.bookmark').css('display', 'block');
		}
		//introduction overlay for TEI added by Pandu


		//TEI NEW DESIGN ADDED BY PANDU
		$scope.navigateToReport=function(){
        	var scrollTopos = $('.report-header-wrapper').offset().top;
			$("html,body").animate({scrollTop: scrollTopos+20},300); 

        }
		//TEI NEW DESIGN ADDED BY PANDU


		//make new tei header fixed - added by Pandu on 25th may 2017
		function setIntroHeight() {
			
			if($scope.respdata.assetInfo.metaInfo.template !=undefined){
				var introHeight = $('.introduction-outer-wrapper').height();
			
				var scrollTopPage = $(window).scrollTop();
				
				if(scrollTopPage > introHeight ){
					$('.report-header-wrapper').css({'top': '0','position':'fixed','left':'0','z-index':'99','padding-top':'0px'});
					$('.temphide').show();
					$('.go-to-top-tei,.page-prev-icon,.page-next-icon').fadeIn();
					//$('.bookmark-icon').fadeIn();
				}else{
					$('.report-header-wrapper').css({'position':'','padding-top':'20px'});	
					$('.temphide').hide();
					$('.go-to-top-tei,.page-prev-icon,.page-next-icon').fadeOut();
					$('.mobile-menu-btn-close').click();
					//$('.bookmark-icon').fadeOut();
				}
				if(scrollTopPage > 300){
					$('.social-media-icons-tei-right').fadeIn();
				}else{
					$('.social-media-icons-tei-right').fadeOut();	
				}
				

				
				$scope.checkHeader();	
			}
		}

		angular.element(window).on('scroll', setIntroHeight);
		
		var next=0,prev=0;

		$scope.checkHeader =function(){
			 $headerElement = $('.content-header-h1');
			 
			 var docViewTop = $(window).scrollTop();
             var docViewBottom = docViewTop + $(window).height();
             
			 $.each($headerElement, function() {
			 	var id=$(this).attr('id');
                var elem=$(this);
                
                var elemTop = $(elem).offset().top;
                var elemBottom = elemTop + $(elem).height();
                if((elemBottom <= docViewBottom) && (elemTop >= docViewTop)){
                	$('.line').removeClass('loaded-line');
                	$('.circle').removeClass('loaded-circle');
                	
                	var secId=id.split('_');
                	
                	
                    $('#line-first').addClass('loaded-line');
                    for(i=1;i<=secId[2];i++){
                    	$('#tocCircle_'+i).addClass('loaded-circle');
                    	var x=i-1;
                    	$('#tocLine_'+x).addClass('loaded-line');
                    }
                }
			 });
			


            $subHeader = $('.next-prev-navigation');
			 
			var docViewTop = $(window).scrollTop();
           	var docViewBottom = docViewTop + $(window).height();
           	$.each($subHeader, function() {
           		var id=$(this).attr('id');
                var elem=$(this);
                
                var elemTop = $(elem).offset().top;
                var elemBottom = elemTop + $(elem).height();
                if((elemBottom <= docViewBottom) && (elemTop >= docViewTop)){
                	
                	
                	var secId=id.split('_');
                	prev=Number(secId[1])-1;
                	next=Number(secId[1])+1;
                	
                }
			});
			// var maxlength=Object.keys($scope.subSections).length;
			// if(maxlength==next){
			// 	prev=next-1;
			// }

			
			$('#page-prev-icon').attr('onclick','navigateToNextPrev('+prev+')');
        	$('#page-next-icon').attr('onclick','navigateToNextPrev('+next+')'); 
		}

		angular.element(window).on('resize', calculateLineWidth);

		function calculateLineWidth(){
			
			var circleLength=12;
			var totalCircles=$scope.respdata.content.report.contents.toc.tocSection[0].tocItem.length+2;
			var totalCircleLength=circleLength*totalCircles;
			
			var totalLineLenth= $('.main-container-wrapper').width() -totalCircleLength;
			
			$scope.eachLineLength=(totalLineLenth/(totalCircles-1));
			
			$('.line').width($scope.eachLineLength+'px');
			$('.line-last').width(Number($scope.eachLineLength)+23+'px'); 
		}

		$scope.highlightsList = function(){
			$('.highlights-list-wrapper').slideDown();
			$('.mobile-menu-btn-close').hide();
            $('.mobile-menu-btn-tei').fadeIn();
            $(".mobile-menu-wrapper").fadeOut();
		}

		$scope.highlightsListClose = function(){
			$('.highlights-list-wrapper').slideUp();
			$('.mobile-menu-btn-close').hide();
            $('.mobile-menu-btn-tei').fadeIn();
            $(".mobile-menu-wrapper").fadeOut();
		}

		//make new tei header fixed - added by Pandu on 25th may 2017

		//setTimeout(showToolTip, 5000);
		
		$scope.removeTooltip=function(){
			$('.toc-tooltip').fadeOut();	
		}

		$scope.showToolTip = function(tocId){
			$('.toc-tooltip').hide();	
			$('#tooltip_'+tocId).fadeIn();
		}
		
		$scope.mobileMenuDisplay = function(){
            $('.mobile-menu-btn-close').fadeIn();
            $('.mobile-menu-btn-tei').hide();
            $('.highlights-list-wrapper').slideUp();
            $(".mobile-menu-wrapper").fadeIn();
        }
 
        $scope.mobileMenuClose = function(){
            $('.mobile-menu-btn-close').hide();
            $('.mobile-menu-btn-tei').fadeIn();
            $(".mobile-menu-wrapper").fadeOut();
            $('.highlights-list-wrapper').slideUp();
        }
		
		
}]);



function searchAndHighlight(searchTerm, selector) {
    if (searchTerm) {
        //var wholeWordOnly = new RegExp("\\g"+searchTerm+"\\g","ig"); //matches whole word only
       // var anyCharacter = new RegExp("\\g["+searchTerm+"]\\g","ig"); //matches any word with any of search chars characters
        var selector = selector || "#realTimeContents"; //use body as selector if none provided
        var searchTermRegEx = new RegExp(searchTerm, "gi");
        var matches = $(selector).text().match(searchTermRegEx);
        
        if (matches != null && matches.length > 0) {
            $('.highlighted').removeClass('highlighted'); //Remove old search highlights  

            //Remove the previous matches
            $span = $('#realTimeContents i');
            $span.replaceWith($span.html());

		    if (searchTerm === "&") {
		        searchTerm = "&amp;";
		        searchTermRegEx = new RegExp(searchTerm, "gi");
		    }

            $(selector).html($(selector).html().replace(searchTermRegEx, "<i class='match'>" + searchTerm + "</i>"));

            $('.match:first').addClass('highlighted');

            var $container = $("html,body");
			var $scrollTo = $('.highlighted');
			$container.animate({scrollTop: ($scrollTo.offset().top - $container.offset().top) - 100, scrollLeft: 0},300); 
            var i = 0;

            $('.next_h').off('click').on('click', function () {
                i++;

                if (i >= $('.match').length) i = 0;

                $('.match').removeClass('highlighted');
                $('.match').eq(i).addClass('highlighted');
                //nextPage();
                var $container = $("html,body");
				var $scrollTo = $('.highlighted');
				$container.animate({scrollTop: ($scrollTo.offset().top - $container.offset().top) - 100, scrollLeft: 0},300); 

            });

            $('.previous_h').off('click').on('click', function () {

                i--;

                if (i < 0) i = $('.match').length - 1;

                $('.match').removeClass('highlighted');
                $('.match').eq(i).addClass('highlighted');

                var $container = $("html,body");
				var $scrollTo = $('.highlighted');

				$container.animate({scrollTop: ($scrollTo.offset().top - $container.offset().top)- 120, scrollLeft: 0},300); 
			});




            if ($('.highlighted:first').length) { //if match found, scroll to where the first one appears
                $(window).scrollTop($('.highlighted:first').position().top);
            }
            return true;
        }
    }
    return false;
}


function parseHTMLTags(html){
	var div = document.createElement("div");
	div.innerHTML = html;
	return div.innerText;
}

$(document).ready(function(){
	//alert('from controller');
	


	$(window).on('scroll',function()
	{
		var scrollTop = $(window).scrollTop();
		if ($(this).scrollTop() > 100) 
		{
			if($(window).width() < 150) {
				 $('.scrollToTop').fadeOut();
			} else {
				 $('.scrollToTop').fadeIn();
			}				
		}
		else {
			 $('.scrollToTop').fadeOut();
		}
	});	
		
		// if($(window).width() > 641){
			$(window).on('scroll',function(){
				var scrollTop = $(window).scrollTop();
				if(scrollTop > 1)
				{
					$('.tei-header-wrapper').stop().animate({opacity: "0.9"},100);
					//$('.tei-header-wrapper').stop().animate({opacity: "0.9",height:"65px",padding:"0px"},100);
					//$('.leftmenu-list-wrapper').stop().animate({top:"52px"},100);
					//$('.menu-icon').stop().animate({top:"20px"},100);
					//$('.tei-header-wrapper .logo-wrapper a img').stop().animate({width:"130px",height:"50px"},200);
					
				}
				else
				{
					$('.tei-header-wrapper').stop().animate({opacity: "1.0"},100);
					//$('.tei-header-wrapper').stop().animate({opacity: "1.0",height:"96px",padding:"10px"},100);
					//$('.leftmenu-list-wrapper').stop().animate({top:"85px"},100);
					//$('.menu-icon').stop().animate({top:"30px"},100);
					//$('.tei-header-wrapper .logo-wrapper a img').stop().animate({width:"150px",height:"65px"},200);
					
					
					
				}
			});
		// }
		// else{
		// 	console.log('smaller screen');
		// }
		
		$(window).resize(function () {
			if($(window).width() > 641){
				//console.log('larger screen width');
			}
			else{
				//console.log('smaller screen width');
			}
		
		});
});
