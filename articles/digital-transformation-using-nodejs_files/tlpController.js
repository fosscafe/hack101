reportsApp.controller("tlpController",
						['$scope','$window','$timeout','$location','$anchorScroll',
						'$stateParams','$state','reportsDataFactory','socialDataFactory',
						'pdfDownloadFactory','reportMappingFactory','$filter',
						'urlMapperService','errorMapperService','tlpReportsService','calloutEditService','calloutService','calloutApprovalService','$window',
						'calloutDisplayService','$http','quizFactory',
						function($scope,$window,$timeout,
								$location,$anchorScroll,$stateParams,
								$state,reportsDataFactory,socialDataFactory,pdfDownloadFactory,
								reportMappingFactory, $filter,urlMapperService,errorMapperService,tlpReportsService,
								calloutEditService,calloutService,calloutApprovalService,$window,calloutDisplayService,$http,quizFactory){
	   
	   	var visit='';
	   	 
	   	$scope.loaded = false; 
		$scope.respdata = {};
		
		var isChromeBrowser = !!window.chrome && !!window.chrome.webstore;		
		var isFirefoxBrowser = typeof InstallTrigger !== 'undefined';		
		var isIEBrowser = false || !!document.documentMode;		
		var isSafariBrowser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);		
	    // End of Call out reset
		
		// Rajesh code for PDF download from s3 starts here //
		$scope.downloadPDFfromS3=function(assetid){
		 	window.open("https://kloudrydermcaasicmforrester.s3.amazonaws.com/mcaas/TLP/"+assetid+".pdf");
		}
		// Rajesh code for PDF download from s3 ends here //
		 
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

		 	
			
			 data=response.data;
			 $scope.reportData(data);
				
		 	});

		 	$scope.reportData = function(data) {
		 	var reportDate;
		    $scope.respdata = data;
		     
		    $scope.pdflanguages = $scope.respdata.assetInfo.vadContent.pdflanguages;
		    $scope.reportDate=new Date((data.content.report.date).replace("IST",""));
			//console.log($scope.respdata);
			$scope.figureData={};
 			 angular.forEach($scope.respdata.content.report.figures, function(fig, index) {
				$scope.figureData[fig.id] = "data:image/gif;base64,"+fig.encodedImage; 			  
			});
 			
 			
 		// 	 angular.forEach($scope.respdata.content.report.graphs, function(graph, index) {
			// 	$scope.graphData[graph.id] = graph.graphData; 			  
			// });

		    $scope.loaded = true;
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=879658452063499&version=v2.1";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
		     
		    $scope.tocRefs=tlpReportsService.getTocRefs(data);
			if($scope.respdata.assetInfo.vadInfo.socialSharingExists==true){
				 	$scope.socialmediaurls = $scope.respdata.assetInfo.vadContent.socialSharingURLs;
			 }

			/*enable tracker*/

			// if(!$scope.heatmap_exist){
			 	enableTracker($scope.respdata.assetInfo.metaInfo.tenantId,$scope.respdata.assetInfo.metaInfo.userId,$scope.respdata.assetInfo.metaInfo.assetId);
			// } else {
				
			// 	$scope.tableOfContent=false;
			// }

			setTimeout(function(){ $scope.displayGraphs(); clearIntervalFunc(1);}, 2000);
		}

		 $scope.displayGraphs=function(){
            var option1 = {
                    legend: { x: 'right', data: ['Today', 'Goal'] },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    grid: { borderWidth: 0, y: 80, y2: 40, x2: 25, x: 10 },
                    xAxis: [{ type: 'category', splitLine: { show: false }, axisTick: { show: false }, axisLine: { show: false }, data: ['51%-60%', '61%-70%', '71%-80%', '81%-90%', '91%-100%'] }],

                    yAxis: [{ type: 'value', splitLine: { show: false }, show: false, axisTick: { show: false }, axisLine: { show: false } }],
                    series: [{
                        name: 'Today',
                        type: 'bar',
                        data: [9, 10, 6, 2, 2],
                        itemStyle: { normal: { color: '#77AA41', label: { textStyle: { color: '#333333' },show: true, position: 'top', formatter: '{c}%' } } }
                    }, {
                        name: 'Goal',
                        type: 'bar',
                        data: [13, 17, 19, 14, 10],
                        itemStyle: { normal: { color: '#003B5B', label: { textStyle: { color: '#333333' },show: true, position: 'top', formatter: '{c}%' } } }
                    }]
                };
         	 myChart = echarts.init(document.getElementById("GRAPH001"));
             myChart.setOption(option1);
            var option2 = {
                    tooltip: { trigger: 'item', formatter: "{b} : <br/>{c} ({d}%)", textStyle:{fontSize: 10}},
                    series: [{
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        itemStyle: { normal: { label: { show: true, position: 'inner',distance:1.3,textStyle: { color: '#333333' }, formatter: function(params) {return params.name + "\n" + params.value + '%' } }, labelLine: { show: false } } },
                        data: [
                            { value: 19, name: 'Hours', itemStyle: { normal: { color: '#467E19', barBorderRadius: 0 } } },
                            { value: 20, name: 'Minutes', itemStyle: { normal: { color: '#77AA41', barBorderRadius: 0 } } },
                            { value: 21, name: 'Months', itemStyle: { normal: { color: '#003B5B', barBorderRadius: 0 } } },
                            { value: 30, name: 'Weeks', itemStyle: { normal: { color: '#003D98', barBorderRadius: 0 } } },
                            { value: 26, name: 'Days', itemStyle: { normal: { color: '#888888', barBorderRadius: 0 } } },
                        ]
                    }]
                };
            myChart = echarts.init(document.getElementById("GRAPH002"));
            myChart.setOption(option2);
            var option3 = {
                  tooltip : {
                    trigger: 'item',
                    formatter : function (params) {
                        if(params.value !=''){
                            return params.seriesName + '<br/>' + params.name + ' : ' + params.value+'%';
                        }else{
                            return params.seriesName + '<br/>' + params.name;    
                        }
                        
                    }
                },
                dataRange: {
                    show: false,min: 0,
                    max: 0,
                    text:['High','Low'],
                    realtime: false,
                    calculable : false,
                    color: ['#666666','#666666','#666666','#666666','#666666','#666666']
                },
                series : [
                    {
                        name: '',type: 'map',mapType: 'world',mapLocation: {y : 60},
                        itemStyle:{emphasis:{color:'rgba(255, 255, 255, .1)',show:false,label:{show:true,textStyle: { color: '#333333' }}}},
                        data:[
                            {name : 'France', value : 18.1},
                            {name : 'Germany', value : 18.1},
                            {name : 'United Kingdom', value : 18.1},
                            {name : 'United States of America', value : 49.0}
                            
                        ]
                    }
                ]
            };
            myChart = echarts.init(document.getElementById("GRAPH003"));
            myChart.setOption(option3);
            var option4 = {
                  tooltip: { trigger: 'item', formatter: "{b} : <br/>{c} (%)" , textStyle:{fontSize: 10}},
                    series: [{
                    type: 'pie',
                    radius:['70','40'],
                    center: ['50%', '50%'],
                    itemStyle: { normal: { color: '#666666', label: { position: 'inner',distance:1.0, color: '#ffffff',textStyle: { color: '#333333' },formatter: function(params) {
                      return params.name + "\n" + params.value + '%' }, show: true }, labelLine: { show: false },borderWidth:2,borderColor:"#ffffff" } },
                    data: [
                        { value: 48, name: 'Manager', itemStyle: { normal: { color: '#666666'} } },
                        { value: 8, name: 'C-Level executives', itemStyle: { normal: { color: '#666666'} } },
                        { value: 28, name: 'Director', itemStyle: { normal: { color: '#666666' } } },
                        { value: 10, name: 'Vice president', itemStyle: { normal: { color: '#666666' } } }
                    ]
                  }]
            };
            myChart = echarts.init(document.getElementById("GRAPH004"));
            myChart.setOption(option4);
            var option5 = {
                    tooltip: { trigger: 'axis', formatter: "{b} <br>:{c}", axisPointer: { type: 'shadow' }, textStyle:{fontSize: 10} },
                    xAxis: [{ type: 'value', show: false, splitLine: { show: false }, axisTick: { show: false }, axisLine: { show: false } }],
                    grid: { borderWidth: 0, y: 20, y2: 20, x2: 40, x: 200 },
                    yAxis: [{
                        type: 'category',
                        show:true,
                        splitLine: { show: false },
                        axisLine: { show: false },
                        axisTick: { show: false },
                        data: ['CIO/Office of \nthe CIO/CTO', 'Enterprise \nArchitect', 'Application \nDevelopment', 'IT infrastructre \nand Operations']

                    }],
                    series: [{
                        type: 'bar',
                        barWidth :30,
                        data: [10, 21, 28, 41],
                        itemStyle: { normal: { color: '#666666', label: { textStyle: { color: '#333333' },show: true, position: 'right', formatter: '{c}%' } } },
                    }]
                };
                if ($(window).width() < 740) {
                    option5.grid.x = 10;
                    option5.yAxis[0].show=false;
                } else {
                    option5.yAxis[0].data = ['CIO/Office of the CIO/CTO', 'Enterprise Architect', 'Application Development', 'IT infrastructre and Operations'];
                }
                myChart1 = echarts.init(document.getElementById('GRAPH005'));
                myChart1.setOption(option5);
               
         }  
    
	/*css for save share close on body click*/
		$scope.$window = $window;
	    $scope.savepdf = false;
	   
	    $scope.social = false;
	  
	    //raghu added new script for cookie div alert
	    $scope.showCookieAlert = true;
	    $scope.closeCookieAlert = function(){
	    	$scope.showCookieAlert = false;	
	    }
	    $scope.generateClass=function(width){
	    	if(width==4){return 'one-coloumn';}
	    	if(width==3){return 'two-coloumn';}
	    	if(width==2){return 'half-coloumn';}
	    }
	    $scope.addClassSection=function(type,value){
            var retval=''
            if(value=='Key Findings'){
                retval=retval+"key-findings-bg"
            }
	    	if(type=='L1' || type=='L2'){
                return 'section-start '+retval;
            }else{
                return 'section-exist '+retval;
            }
	    }
	     $scope.survey={};
	    $scope.loadQuiz=function(){
            quizFactory.getQuizData($stateParams,null,'get').then(function(response) {
                if(response.status==200){
                   $scope.survey=response.data.data[0].jsondata[0]; 
                    angular.forEach(response.data.data[0].jsondata, function(question, index) {
                        
                        $('.quiz-question-inner').text(question.question);
                        //console.log($scope.survey);
                        var answeroptions="";//'<form id="TLPSurveySection" action="#">';
                        angular.forEach(question.options[0], function(option, index1) {
                            if(option!=undefined || option!=''){
                                
                                answeroptions=answeroptions+'<p><input type="checkbox" id="option_'+index1+'" name="options[]" value="'+option+'"/><label for="option_'+index1+'">'+option+'</label></p>';

                            }
                        });
                        //answeroptions=answeroptions+"";
                        $('.quiz-answer-inner').html(answeroptions);
                        var ansHeight = $('.quiz-answers').height();
                        $('.quiz-question').height(ansHeight);
                        
                    });
                }else{
                    $('.quiz-section').remove();
                }
                
            });
            //console.log($scope.survey);
        };

        $scope.surveySubmitValidation=function(){
            //var formdata=$("#TLPSurveySection").serialize();
            //console.log('formdata:   '+formdata);
            var finalAnswer={'questionKey':'','options':''};
            var responseArr=[];
            finalAnswer.questionKey=$scope.survey.questionKey;
            var totalOptions=Object.keys($scope.survey.options[0]).length;
            var options=[];
            var checked=false;
            for(var x=1;x<=totalOptions;x++){
                if($('#option_'+x).prop("checked") == true){
                
                   options.push(x);
                   checked=true;
                }
            }

            finalAnswer.options=options;
            responseArr.push(finalAnswer);
            // console.log(finalAnswer);
            if(checked==true){
                quizFactory.getQuizData($stateParams,responseArr,'post').then(function(response) {
                    //console.log(response);
                    $('.survey-error').remove();
                    
                    $('.quiz-btn-submit').remove();
                    quizFactory.getQuizData($stateParams,responseArr,'anlytics').then(function(response1) {
                        //console.log('response1');
                        //console.log(response1.data.data);
                        var optionsArr=[];
                        var countArr=[];

                        angular.forEach($scope.survey.options[0], function(option, index1) {
                            for(var x=0;x<totalOptions;x++){
                                if(response1.data.data[x] !=undefined && response1.data.data[x].options==index1){
                                    countArr.push(response1.data.data[x].count);
                                    optionsArr.push(option);
                                }
                            }
                        });
                        
                        var serveyOption = {
                            
                            series : [
                                        {
                                            name:'',type:'pie',radius : '60%',center: ['45%', '45%'],
                                            itemStyle: { normal: { label: { show: true, position: 'inner',distance:1.2,textStyle: { color: '#333333' }, formatter:   '{d}%'  }, labelLine: { show: false } } },
                                            data:[
                                                
                                            ]
                                        }
                                    ]
                        };
                        var color=['#81ccf1','#003d98','#333338','#888888','#77AA41','#033b98','#023d99','#003b5b','#3f7a36','#477f28']
                        var p=0;
                        angular.forEach($scope.survey.options[0], function(option, index1) {
                            for(var x=0;x<totalOptions;x++){
                                if(response1.data.data[x] !=undefined){
                                    if(response1.data.data[x].options==index1){
                                        var obj={value:'', name:'',itemStyle: {normal: {color:''}}};
                                        obj.value=response1.data.data[x].count;
                                        obj.name=option;
                                        obj.itemStyle.normal.color=color[p];
                                        serveyOption.series[0].data.push(obj);    
                                        
                                    }else{
                                        //$('.graph-section').append('<div>'+option+'</div>');            
                                    }
                                    

                                }
                            }
                           $('.report-options-after-submit').append('<div class="answer-after-submit col-md-6"> <div class="option-bullet" style="background:'+color[p]+'"></div> '+option+'</div>'); 
                           p=p+1;
                        });

                        $('.graph-section').show();
                        $('.question-section').hide();

                        myChart1 = echarts.init(document.getElementById('survey-graph'));
                        myChart1.setOption(serveyOption);
                        $('.callout-text-survey').html('<div class="announcment"><label class="survey-success"><b>Did you know? </b><br> B2B content marketing budgets are increasing 14% (avg.) for 2017</label></div>');

                    });
                });
            }else{
                //alert('Please check atleast one option');
                $('.quiz-answer-inner').append('<label class="error survey-error">Please check atleast one option</label>');
            }

        };
        
        angular.element(window).on('resize', reloadGraphs);

        function reloadGraphs(){
            
             $scope.displayGraphs();
        }

        //toc dropdown
        $scope.tocListDisplay = function(){
            var headerHeight = $('.tlp-header-wrapper').innerHeight();
            $('.tlp-toc-btn').toggleClass('tlp-toc-btn-close');
            $('.toc-content-wrapper').css('top',headerHeight).slideToggle();
            $('.social-share-wrapper').hide();
        }

        $scope.tocListDisplay2 = function(){
            var headerHeight = $('.tlp-header-wrapper').innerHeight();
            $('.tlp-toc-btn2').toggleClass('tlp-toc-btn-close2');
            $('.toc-content-wrapper2').css('top',headerHeight).slideToggle();
            $('.social-share-wrapper2').hide();
        }
        //social share dropdown
        $scope.socialShareDropdown = function(){
            var headerHeight = $('.tlp-header-wrapper').innerHeight();
            $('.social-share-wrapper').css('top',headerHeight).slideToggle();
            $('.toc-content-wrapper').hide();
        }
        $scope.socialShareDropdown2 = function(){
            var headerHeight = $('.tlp-header-wrapper').innerHeight();
            $('.social-share-wrapper2').css('top',headerHeight).slideToggle();
            $('.toc-content-wrapper2').hide();
        }

            
            /*social media functions*/
            $scope.navigateToFB=function(url){

            
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

            //for firefox
        $scope.navigateToEmail=function(shareurl){
            $scope.mailLink="mailto:"+ "?subject="+parseHTMLTags($scope.respdata.content.report.title)+ "&body=See what I just read about: "+$scope.selectedText+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
        };


        //social share for callout box
        $scope.calloutSocialShare=function(passedEventObject,secId,calloutSecId){
            //calculate offset left and top : http://cleanbugs.com/item/angularjs-how-get-offset-top-and-position-of-element-an-in-document-to-left-of-412966.html
            var x = passedEventObject.pageX;
            var y = passedEventObject.pageY;
            var cur_id="callout_"+secId+"_"+calloutSecId;
            $('.callout-social-share-wrapper').hide();
            $('.callout-share-close2, .callout-share-close').hide();
            $("#"+cur_id+' .callout-social-share-wrapper').show();
            $("#"+cur_id).prev().show();
            $("#"+cur_id).next().show();
        };
        $scope.closeSocialShare = function(){
            $('.callout-social-share-wrapper').hide();
            $('.callout-share-close2, .callout-share-close').hide();
        }
        $scope.calloutShareTwitter=function(shareText){
        shareText=shareText.substring(0, 80);
        var tweetDialog=
            window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+'&text='+encodeURIComponent(shareText+'...'),
            'twitter-share-dialog', 
            'width=626,height=436'
            );  
            return false;
        };
        
        $scope.calloutShareFB=function(shareText){

            
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
                description: shareText
            }, function(response){
                facebookSharing(response);
            });
        };

        $scope.calloutShareLinkedIn=function(shareText){
            //http://www.linkedin.com/shareArticle?mini=true&url=http://stackoverflow.com/questions/10713542/how-to-make-custom-linkedin-share-button/10737122&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com
            var linkedInDialog=
                    window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent($scope.socialmediaurls.linkedinAssetURL)+'&title='+encodeURIComponent($scope.respdata.content.report.title)+'&summary='+encodeURIComponent(shareText),
                    'LinkedIn-share-dialog', 
                    'width=626,height=436'
                    );  
                    return false;
            };

            //for firefox
        $scope.calloutShareEmail=function(shareText){
            $scope.mailLink="mailto:"+ "?subject="+parseHTMLTags($scope.respdata.content.report.title)+ "&body=See what I just read about: "+shareText+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
        };
        //social share callout box

        $scope.tabNavigation=function(event){
                sectionid = event.target.id.replace('toc_', '');
                $('.highlight-tab').removeClass('highlight-tab');
                $("#"+event.target.id).addClass('highlight-tab');
                if($(window).width() > 770){
                    $('html, body').animate({scrollTop: $("#"+sectionid).offset().top }, 1000);
                } else {
                    $('html, body').animate({scrollTop: $("#"+sectionid).offset().top - 95 }, 1000);
                }
                
        };


}]);


function clearIntervalFunc( waitinterval ) {
    clearInterval( waitinterval );   
}

function prevclick(){
        $('.jcarousel').jcarousel();
        $('.jcarousel').jcarousel('scroll', '-=1');
    }
    function nextclick(){
        $('.jcarousel').jcarousel();
        $('.jcarousel').jcarousel('scroll', '+=1');
    }
