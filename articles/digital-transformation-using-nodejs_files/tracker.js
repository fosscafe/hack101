/**
* http://usejsdoc.org/
*/
var emailCount=0;
var linkedinCount =0;
var twitterCount =0;
var facebookCount =0;

//Pandu declared variables to track TEI infographic social share data.
var infographicEmailCount = 0;
var infographicLinkedinCount = 0;
var infographicTwitterCount = 0;
var infographicFacebookCount = 0;
var infographicDownloadCount = 0;

function facebookSharing(response){
  //if (response != undefined) {
    facebookCount=Number(facebookCount)+1;
  //}
}
function emailSharing(){
  emailCount=Number(emailCount)+1;
  return false;
}
function linkedinSharing(){
  linkedinCount=Number(linkedinCount)+1;
}
function twitterSharing(){
  twitterCount=Number(twitterCount)+1;
}

//Pandu added to track TEI infographic social share data.
function facebookSharingInfographic(response){
  
    infographicFacebookCount=Number(infographicFacebookCount)+1;
  
}
function emailSharingInfographic(){
  
  infographicEmailCount=Number(infographicEmailCount)+1;
  console.log(infographicEmailCount);
  return false;
}
function linkedinSharingInfographic(){
  infographicLinkedinCount=Number(infographicLinkedinCount)+1;
}
function twitterSharingInfographic(){
  infographicTwitterCount=Number(infographicTwitterCount)+1;
}

$(document).ready(function(){
  var refCookieId=getTenantId()+getTenantUserId()+getAssetId();
  var absUrl= localStorage.getItem('absurl');
  var  referrer;  
  if(JSON.parse(GetCookie(refCookieId)).referralurl==''){
    referrer=window.document.referrer;
  }else{
    referrer = JSON.parse(GetCookie(refCookieId)).referralurl;
  }
  var publicIp=localStorage.getItem('userIp')+','+localStorage.getItem('localIp');
  //var localIp=localStorage.getItem('localIp');
   
  var accessDate = new Date();
  var tenantUserActionID = "UAID"+accessDate.getUTCFullYear()+(accessDate.getUTCMonth() + 1)+accessDate.getUTCDate()+accessDate.getUTCHours()+accessDate.getUTCMinutes()+accessDate.getUTCSeconds()+accessDate.getUTCMilliseconds();
  var status=true;
  var dCount = 0 ;
  var rClkCount=0;
  var lClkCount=0;
  var sClkCount=0;
  var lat =0.0;
  var lng =0.0;
  var resize=0;
  var qScan=0;
  var fScan=0;
  
  var forresterTanantId=2;

  var screenSize=screen.height+"X"+screen.width;
  var depth=screen.pixelDepth;
  var timeZone = new Date().toString().substring(24);

  var tenantId= localStorage.getItem('tenantId');
  var userId= localStorage.getItem('userId');
  var assetId= localStorage.getItem('assetId');

  //var url = $(location).attr("href");
  /*URL required for tracking based on userdetails starts*/
var url = generateURL($(location).attr("href"));

function generateURL(url){  
  var finalURL=url.split('#');
  var userParams=finalURL[1].split('/');
  userParams[3]=userId;
  userParams[4]="'"+assetId+"'";
  var finalParams=userParams.join('/');
  finalURL[1]=finalParams;
  finalURL.join('/');
  //console.log(finalURL.join('#'));
  return finalURL.join('#');
}
/*URL required for tracking based on userdetails ends*/
 //var  url  = "http://mcaas-dev-icm-assets-ui.mybluemix.net/#/assets/2/432/'RES113466'/reports"; 
  var imagelist="";           //
  var audiolist="";           //
  var videolist="";           //
  var linklist="";          //
  var textlist=""; 
  var tocList="";
  var calloutSeen=['N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N'];
var callOutClicked = [];
var calloutClickIDList="",calloutSeenIDList="",calloutClickNum =0,calloutSeenNum=0 ;
var visit;

var apiUrl='https://mcaas-prod-api.mybluemix.net/api/v1.0/visualization';  
//var apiUrl='https://mcaas-cert-api.mybluemix.net/api/v1.0/visualization';
//var apiUrl='http://10.16.32.208:6016/api/v1.0/visualization';
//var apiUrl='http://10.16.22.118:6009/api/v1.0/visualization';
var lasthighestScroll = 0;
var parcentage = 0;
var ActiveTimer = new Date();
var idleTimerPerecent = new Date();
var blurTiming =0;
var TotalActiveTime = 0;
var StartTimer = new Date();  
var StartTimerPerenctage = new Date();
var EndTimerPerenctage = new Date();
var TotalActiveTimeFor10Percent = 0;
var TotalActiveTimeFor20Percent = 0;
var TotalActiveTimeFor30Percent = 0;
var TotalActiveTimeFor40Percent = 0;
var TotalActiveTimeFor50Percent = 0;
var TotalActiveTimeFor60Percent = 0;
var TotalActiveTimeFor70Percent = 0;
var TotalActiveTimeFor80Percent = 0;
var TotalActiveTimeFor90Percent = 0;
var TotalActiveTimeFor100Percent = 0;
var lastPercentScroll =0;
/*var for video and infographic values*/
var infographicClick=0; 
var timeSpentOnVideo=0;
var videoClick=0;

var clickStats=[];
var searchedText=[];  

  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
         console.log ("Geolocation is not supported by this browser.");
      }
  }
  function showPosition(position) {
    lat=position.coords.latitude;   
    lng = position.coords.longitude;
  }
  getLocation();
   function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
  var expdate = new Date();

   var n = expdate.getTime();
    function getCookieVal (offset) {
      var endstr = document.cookie.indexOf (";", offset);
      if (endstr == -1)
      endstr = document.cookie.length;
      return unescape(document.cookie.substring(offset, endstr));
      }
      function GetCookie (name) {
      var arg = name + "=";
      var alen = arg.length;
      var clen = document.cookie.length;
      var i = 0;
      while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg)
      return getCookieVal (j);
     i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) 
      break; 
      }
      return null;
      }
      function SetCookie (name, value) {
      var argv = SetCookie.arguments;
      var argc = SetCookie.arguments.length;
      var expires = (2 < argc) ? argv[2] : null;
      var path = (3 < argc) ? argv[3] : null;
      var domain = (4 < argc) ? argv[4] : null;
      var secure = (5 < argc) ? argv[5] : false;
      document.cookie = name + "=" + escape (value) +
      ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
      ((path == null) ? "" : ("; path=" + path)) +
      ((domain == null) ? "" : ("; domain=" + domain)) +
      ((secure == true) ? "; secure" : "");
      }
      function DisplayInfo() {
      var expdate = new Date();
     //var currentUrl = window.location.href;
     var currentUrl =url;
     var splitingafter = currentUrl.split("#");
     // var currentUrl = "http://mcaas-dev-icm-assets-ui.mybluemix.net/#/assets/2/656/'RES119915'/reports";
      /* 
        var currentUrl1 = window.location.href;
          var res1 = currentUrl1.split("/");
        
        var currentUrl = 'http://mcaas-uat-icm-assets-ui.mybluemix.net/#/assets/2/'+res1[8]+'/%27'+res1[9]+'%27/reports'; */
         // alert(currentUrl);
      var res = splitingafter[1].split("/");
       fisrtPosition = true;
       //alert("TESTING"+res[7]);
      for (i=0;i<=res[4].length;i++)
            {
            var code = res[4].charCodeAt(i);
            if ( ((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122))  ) 
                  {
                fisrtPosition = i;
                    }
                if (fisrtPosition != true)
                   break;
}
//alert("fisrtPosition"+fisrtPosition)
if((res[4].lastIndexOf("%"))!=-1)
{
    position = res[4].lastIndexOf("%");
}
if((res[4].lastIndexOf("'"))!=-1)
{
    position = res[4].lastIndexOf("'") ;
}
   //alert("position"+position);
   visitCookie= res[2]+res[3]+res[4].substring(fisrtPosition,position);
   visitGuid = 'visit'+visitCookie;
   GUID = 'GUID'+visitCookie;
    //alert("GUID"+GUID);                                 
      expdate.setTime(expdate.getTime() +  (24 * 60 * 60 * 1000 * 365)); 
         if(!(primaryId = GetCookie("primaryIdCookie"))) {
                  SetCookie("primaryIdCookie", generateUUID(), expdate, "/", null, false);           
         }                  
      if(!(visit = GetCookie(visitGuid)) && !(assetGuid = GetCookie(GUID))) 
      visit = 0;
      visit++;
     SetCookie(visitGuid, visit, expdate, "/", null, false);
                  if(visit==1)
                          {
                         SetCookie(GUID, generateUUID(), expdate, "/", null, false);
                          }                       
                           trackingId = {
                                                            "userTrackingId": GetCookie('primaryIdCookie'),
                                                            "reportTrackingId": GetCookie(GUID)
                                
                                                      };
            //                alert(trackingId);                                                      
      }            
      DisplayInfo() ;
  
  /*shankar and Rajesh code for enabling paste on cke editor  */
$('body').bind("paste",function(e){
    var callOutId = $("label:contains('URL')").attr('for');
    
    if(callOutId != ""){
      callOutId = '#' + callOutId;
      $(""+callOutId+"").val(e.originalEvent.clipboardData.getData('text'));
    }
});
/*shankar and Rajesh code for enabling paste on cke editor ends here */


    var url_editor_val = getURLEditorModeInfo('editor');
    var url_permission_val = getURLEditorModeInfo('permission');
    var page_privileges = "cut copy paste contextmenu";
    
    if( url_editor_val.length > 0 && url_permission_val === '50b804a7-c6ff-4ae0-8d7e-e098eab06333' ) {
        page_privileges = "cut paste contextmenu";
    }

    $('body').bind(page_privileges,function(e) {
        //e.preventDefault();
    });
 
    // $('body').bind("cut copy paste contextmenu",function(e) {
    //     e.preventDefault();
    // });       
  //capture scroll any percentage
    $(window).scroll(function(){
         var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
     //   var  scrolltrigger = 0.95;
        
        //Percentage Code 
        if (wintop > lasthighestScroll)
                    {
          parcentage = parseInt((wintop/(docheight-winheight))*100);
          lasthighestScroll = wintop;
           }
        
       /***********End Code for Capturing time spent for each percentage**/ 

          /***********Start Code for Capturing time spent for each percentage**/ 
      var currentScrollPercentage = (wintop/(docheight-winheight))*100; 
   //   console.log("last Scroll Percentage "+lastPercentScroll);
   //   console.log("Blur Timing "+blurTiming);
      
      timeSpent(lastPercentScroll);
     lastPercentScroll = currentScrollPercentage;
     StartTimerPerenctage = new Date();
     blurTiming =0;
     
     /***********End Code for Capturing time spent for each percentage**/ 
    
    }); 
      var timeIntervalToSendUpadte =30000;
      function intervalUpdate()
      {     
        if (status==true)
          {
          status = 'update';
      
          localStorage.setItem('tenantUserActionID', tenantUserActionID);
        $.post(apiUrl,{tenantUserActionID: tenantUserActionID,parcentage:parcentage,pstat:'insert',rClkCount:rClkCount,lClkCount:lClkCount,sClkCount:sClkCount,lat:lat,lng:lng,visit:visit,url:url,resize:resize,screenSize:screenSize,depth:depth,timeZone:timeZone,referrer:referrer,publicIp:publicIp,trackingId:trackingId},
        function( data,status) { 
          //status = false;
            setTimeout(intervalUpdate,timeIntervalToSendUpadte);
                    });      
         }
        else {
    timeSpentOnVideo=getVideoCurTime();
    $.post(apiUrl,{tenantUserActionID:tenantUserActionID,parcentage:parcentage,pstat:status,rClkCount:rClkCount,lClkCount:lClkCount,sClkCount:sClkCount,lat:lat,lng:lng,resize:resize,imagelist:imagelist,audiolist:audiolist,videolist:videolist,linklist:linklist,textlist:textlist,tocList:tocList,qScan:qScan,fScan:fScan,calloutClickIDList:calloutClickIDList,calloutSeenIDList:calloutSeenIDList,calloutClickNum:calloutClickNum,calloutSeenNum:calloutSeenNum,
      TotalActiveTimeFor10Percent:TotalActiveTimeFor10Percent,
      TotalActiveTimeFor20Percent:TotalActiveTimeFor20Percent,
      TotalActiveTimeFor30Percent:TotalActiveTimeFor30Percent,
      TotalActiveTimeFor40Percent:TotalActiveTimeFor40Percent,
      TotalActiveTimeFor50Percent:TotalActiveTimeFor50Percent,
      TotalActiveTimeFor60Percent:TotalActiveTimeFor60Percent,
      TotalActiveTimeFor70Percent:TotalActiveTimeFor70Percent,
      TotalActiveTimeFor80Percent:TotalActiveTimeFor80Percent,
      TotalActiveTimeFor90Percent:TotalActiveTimeFor90Percent,
      TotalActiveTimeFor100Percent:TotalActiveTimeFor100Percent,
    emailCount:emailCount,
    linkedinCount:linkedinCount,
    twitterCount:twitterCount,
    facebookCount:facebookCount,
    infographicClick :infographicClick, 
    videoTimeSpent: timeSpentOnVideo,
    videoClick:videoClick,
    clickStats:clickStats,
    selectedText:selectedText,
    searchedText:searchedText,
	//Pandu added for TEI infographic social share track
	infographicEmailCount:infographicEmailCount,
	infographicLinkedinCount:infographicLinkedinCount,
	infographicTwitterCount:infographicTwitterCount,
	infographicFacebookCount:infographicFacebookCount,
	infographicDownloadCount:infographicDownloadCount
    },
   // $.post("http://localhost:6002/api/v1.0/visualization",{tenantUserActionID:tenantUserActionID,parcentage:parcentage,pstat:status,dCount:dCount,rClkCount:rClkCount,lClkCount:lClkCount,sClkCount:sClkCount,lat:lat,lng:lng,resize:resize,pclose:'open'},
         function( data,status) {         
            setTimeout(intervalUpdate,timeIntervalToSendUpadte);                              
            });  
        }
      }
      intervalUpdate();
/*code to get the id,x and y (clickstats) for heat map starts */
function handler(event) {
  var dot, eventDoc, doc, body, pageX, pageY;

  event = event || window.event; 

  //capturing the x anf y coordinates of the mouse pointer
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;
    event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
  }

  //console.log(event.target);

  //console.log('scroll: '+$(window).scrollTop());
  
  //save the coordinates in a globale variable
  mousePos = {
    x: event.pageX,
    y: event.pageY
  };

  
  if(event.target.id !=null || event.target.id !='' || event.target.id !=undefined){
    if(event.target.id == 'header-wrapper'){
     var newY=parseInt(event.pageY - $(window).scrollTop());
     mousePos.y = newY;
    }

    if(event.target.id.indexOf("social-media") !=-1){
      var newY=parseInt(event.pageY - $(window).scrollTop());
      mousePos.y = newY;
    }

    if(event.target.id.indexOf("toc") !=-1 || event.target.id.indexOf("Toc") !=-1 || event.target.id.indexOf("TOC") !=-1 || event.target.id.indexOf("table-btn-show-img") !=-1) {
      var newY=parseInt(event.pageY - $(window).scrollTop());
      mousePos.y = newY;
    }
     
  }
  
  
/*added by deepthi for search text TEI*/

  delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

$('input').keyup( function() {
  delay(function(){

    var searchedTextValue=event.target.value;
    if(searchedTextValue!=null&&searchedTextValue!='' && searchedTextValue!=undefined && searchedTextValue.indexOf(searchedTextValue) >=-1){
		searchedText.push(searchedTextValue);
    }    
  },2000);
});
/*added by deepthi for search text ends*/
//console.log(event.target.id);
  
  var xp = (mousePos.x / $(document).width()) * 100;
  var yp= (mousePos.y / $(document).height()) * 100;
  var clickStatsValue={"id":event.target.id,"x":mousePos.x,"y":mousePos.y};
  clickStats.push(clickStatsValue);
  //console.log(clickStats);
}

      
$(document).on("click", "body", function(event) { 
  //console.log(event.target.id);
  handler(event);
  
});
/*code to get the id,x and y (clickstats) for heat map ends */
      
      $(document).on("click", "h2", function() {        
         if(textlist.length<=0)
           {
           textlist = $(this).html();
          // alert(textlist);
           }
     else
           {
           textlist = textlist+";"+$(this).html();
          // alert(textlist);
           }
      });
      
      $(document).on("click", "h3", function() {        
       if(textlist.length<=0)
          {
          textlist = $(this).html();
          //alert(textlist);
          }
    else
          {
          textlist = textlist+";"+$(this).html();
          //alert(textlist);
          }
     });
      
      $(document).on("click", "a", function() {
        
       if(linklist.length<=0)
          {
         if ($(this).attr('class')== 'table-content-link ng-binding'){
        tocList = $(this).html(); 
         }else if($(this).html()=='quick scan'){
           qScan++;          
         }
      else if($(this).html()=='full reports'){
         fScan++;          
       }
         else {
      // alert($(this).attr('class'));
      linklist = $(this).html();
         // alert(linklist);
         }
          }
    else
          {
       if ($(this).attr('class')== 'table-content-link ng-binding'){
          tocList = $(this).html(); 
           }
       else if($(this).html()=='quick Scan'){
         qScan++;          
       }
    else if($(this).html()=='full reports'){
         fScan++;          
       }
       else {
      linklist = linklist+";"+$(this).html();
         // alert(linklist);
       }
          }
     });
      
      $(document).on("click", "img", function() {
        
          if(typeof imagelist !=='undefined'){ 
        if(imagelist.length<=0)
             {
           imagelist = $(this).attr('ng-name');
           //  alert(imagelist);
             }
       else
            {
         imagelist = imagelist+";"+$(this).attr('ng-name');;
            // alert(imagelist);
             }
          }
        });
      
      $(document).on("click", "audio", function() {
        
         if(audiolist.length<=0)
            {
          audiolist = $(this).attr('ng-name');
            //alert(audiolist);
            }
      else
            {
        audiolist = audiolist+";"+$(this).attr('ng-name');;
            //alert(audiolist);
            }
       });
      /*to get the current time spent on video starts*/
      var teiVideo = document.getElementById("reportVideo");
        $(teiVideo).on('play',function(){
          videoClick=1;
          if(videolist.length<=0)
            {
          videolist = $(this).attr('ng-name');
           // alert(videolist);
            }
      else{
          var videoName=videolist.split(';');
          for(var a=0;a<videoName.length;a++){
            if(videoName[a]!=videolist){
              videolist = videolist+";"+$(this).attr('ng-name');    
            }
          }
        
        }
      });
      var vid=0;
      var  preVideoTime=0;
      function getVideoCurTime() {
        vid = document.getElementById("reportVideo");
        if (typeof(vid) != 'undefined' && vid != null){

          if(vid.currentTime>preVideoTime){
            preVideoTime=vid.currentTime;
            return vid.currentTime;
          }

          return preVideoTime;
        }
      }
      /*to get the current time spent on video ends*/
      $(document).on("click", "video", function() {
        videoClick=1; 
        if(videolist.length<=0)
            {
          videolist = $(this).attr('ng-name');
           // alert(videolist);
            }
      else{
          var videoName=videolist.split(';');
          for(var a=0;a<videoName.length;a++){
            if(videoName[a]!=videolist){
              videolist = videolist+";"+$(this).attr('ng-name');    
            }
          }
        
        }
         
       });
      /*code to count the infographic click*/
      $(document).on("click", ".pdf-toggle", function() {
        infographicClick=1;
        });  
		$(document).on("click", ".infographic-pdf-download", function() {
        infographicDownloadCount=1;
        });
      
    $(document).on("click", ".download-pdf-link", function() {
    //alert('Hello');
           dCount++;

$.post(apiUrl,{tenantUserActionID: tenantUserActionID,dCount:dCount,pstat:'download'}, function( data ) {       
          //console.log("test");              
        });/* 
    

    $(document).on("click", "#email-button", function() {
      alert("Hello");
           emailCount++;
        });
    $(document).on("click", ".linkedin-button", function() {
           linkedinCount++;
        alert("Hello");
        });
    $(document).on("click", ".twitter-button", function() {
           twitterCount++;
        alert("Hello");
        }); */
    
    /*$('.test').click(function(){
      alert('hi alert');
    });*/
        
       

/*     $.post("http://localhost:6002/api/v1.0/visualization",{url:url,tenantUserActionID:tenantUserActionID,parcentage:parcentage,pstat:status,dCount:dCount,rClkCount:rClkCount,lClkCount:lClkCount,sClkCount:sClkCount,lat:lat,lng:lng,resize:resize,imagelist:imagelist,audiolist:audiolist,videolist:videolist,linklist:linklist,textlist:textlist,tocList:tocList,qScan:qScan,fScan:fScan,calloutClickIDList:calloutClickIDList,calloutSeenIDList:calloutSeenIDList,calloutClickNum:calloutClickNum,calloutSeenNum:calloutSeenNum,
        TotalActiveTimeFor10Percent:TotalActiveTimeFor10Percent,
      TotalActiveTimeFor20Percent:TotalActiveTimeFor20Percent,
      TotalActiveTimeFor30Percent:TotalActiveTimeFor30Percent,
      TotalActiveTimeFor40Percent:TotalActiveTimeFor40Percent,
      TotalActiveTimeFor50Percent:TotalActiveTimeFor50Percent,
      TotalActiveTimeFor60Percent:TotalActiveTimeFor60Percent,
      TotalActiveTimeFor70Percent:TotalActiveTimeFor70Percent,
      TotalActiveTimeFor80Percent:TotalActiveTimeFor80Percent,
      TotalActiveTimeFor90Percent:TotalActiveTimeFor90Percent,
      TotalActiveTimeFor100Percent:TotalActiveTimeFor100Percent,pclose:'open'},
             function( data,status) {                                     
                });*/
    });

$(document).on("click", ".callout-display-wrapper,.callout_content_mobile", function() {
  var yClick=0;
  if(window.location.href.indexOf("editor") > -1) {            
  }else{
    if (callOutClicked.length==0){
    callOutClicked[callOutClicked.length]=$(this).attr('ng-name');
    calloutClickNum++;
    calloutClickIDList = $(this).attr('ng-name');
    }else{
      var yClick=0;
      for (var i =1 ;i<=callOutClicked.length;i++){
        if ($(this).attr('ng-name')==callOutClicked[i-1]){
          yClick = 1;
        }
        if(i==callOutClicked.length && yClick==0){
          callOutClicked[callOutClicked.length]=$(this).attr('ng-name');
          calloutClickNum++;
          calloutClickIDList=calloutClickIDList+";"+$(this).attr('ng-name');
        }
      }
    }
  }
});
    
    $(document).on({
      "contextmenu": function(e) {
         rClkCount++;

          // Stop the context menu
          
          if(tenantId !=forresterTanantId){
            e.preventDefault();
          }
      },
      "mousedown": function(e) { 
        //  console.log("normal mouse down:", e.which); 
          if (e.which==1)
            {
            lClkCount++;
            }
          else if (e.which==2){
            sClkCount++;
          }
      },
      "mouseup": function(e) { 
      //    console.log("normal mouse up:", e.which); 
      
      if(tenantId==forresterTanantId){
        getSelectionText(e);
      }
          

      }
  })
    $(window).resize(function(){
      resize++;
    });   
   
    var selectedText=[];
    
   //pradeep code to track the selected text and thats id
   function getSelectionText(event){
      var sel = window.getSelection();
      
      if(sel.rangeCount > 0){
        var parentEl = sel.getRangeAt(0).commonAncestorContainer;  
        parentEl = parentEl.parentNode.id;
        
        var text=window.getSelection().toString();
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; 
       
        //capturing the x anf y coordinates of the mouse pointer
        if (event.pageX == null && event.clientX != null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        
        if(text !="" || text !=undefined){
          var selectedTextCount={"id":parentEl,"text":text,"y":event.pageY,"x":event.pageX};
              selectedText.push(selectedTextCount);

        }
      }
  }   
    


// Ragav's test code for browser close event starts
    // for chrome & firefox
      window.addEventListener("unload", function() {
       closeVisualizationData();
       return confirm("Do you really want to close?").hide(); 
      })

    // browser detection starts
    // Internet Explorer 6-11
      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      if(isIE)
      {
        //alert('sd');
        window.bind("onunload", function() {
          closeVisualizationData();
          return confirm("Do you really want to close?").hide(); 
        });
         
      }
      // browser detection ends
  
// Ragav's test code for browser close event ends

window.unload = function(e){
    var msg = 'Are you sure?';
    e = e || window.event;

    if(e){
      closeVisualizationData();
      //e.returnValue = msg;
    }
        

    //return msg;
}
window.beforeunload = function(e){
    var msg = 'Are you sure?';
    e = e || window.event;

    if(e){
      closeVisualizationData();
      //e.returnValue = msg;
    }
        

    //return msg;
}

/*code to close multiple tabs in same page*/
window.onbeforeunload = function(e){
    var msg = 'Are you sure?';
    e = e || window.event;

    if(e){
      closeVisualizationData();
      //e.returnValue = msg;
    }
        

    //return msg;
}
/*code to close multiple tabs in same page*/

function closeVisualizationData(){
  timeSpent(lastPercentScroll);
 timeSpentOnVideo=getVideoCurTime();//to send timeSpentOnVideo
 $.post(apiUrl,{tenantUserActionID: tenantUserActionID,pstat:'close',lat:lat,lng:lng,
      TotalActiveTimeFor10Percent:TotalActiveTimeFor10Percent,
      TotalActiveTimeFor20Percent:TotalActiveTimeFor20Percent,
      TotalActiveTimeFor30Percent:TotalActiveTimeFor30Percent,
      TotalActiveTimeFor40Percent:TotalActiveTimeFor40Percent,
      TotalActiveTimeFor50Percent:TotalActiveTimeFor50Percent,
      TotalActiveTimeFor60Percent:TotalActiveTimeFor60Percent,
      TotalActiveTimeFor70Percent:TotalActiveTimeFor70Percent,
      TotalActiveTimeFor80Percent:TotalActiveTimeFor80Percent,
      TotalActiveTimeFor90Percent:TotalActiveTimeFor90Percent,
      TotalActiveTimeFor100Percent:TotalActiveTimeFor100Percent,
      publicIp:publicIp,
    emailCount:emailCount,
    linkedinCount:linkedinCount,
    twitterCount:twitterCount,
    facebookCount:facebookCount,
    infographicClick :infographicClick, 
    videoTimeSpent: timeSpentOnVideo,
    videoClick:videoClick,
    clickStats:clickStats,
    selectedText:selectedText,
    searchedText:searchedText,
	//Pandu added for TEI infographic social share track
	infographicEmailCount:infographicEmailCount,
	infographicLinkedinCount:infographicLinkedinCount,
	infographicTwitterCount:infographicTwitterCount,
	infographicFacebookCount:infographicFacebookCount,
	infographicDownloadCount:infographicDownloadCount
 }, function( data ) {        
        //  console.log("test");              
        });

}

function yHandler(){
  var position =[];
  var calloutIds =[];
  var count=0;

  if(window.location.href.indexOf("editor") > -1) {
   
  }else{
    $('.callout-display-wrapper').each(function(){
      var offset = $(this).offset();
      position[count]=offset.top;
      calloutIds[count]= $(this).attr('ng-name');
      count++;                                   
    });
    var wintop = $(window).scrollTop()+$(window).height()-50;
    for (var i = 1; i <=position.length; i++){
      if (wintop> position[i-1]&&calloutSeen[i-1] =='N' && calloutIds[i-1]!==''){
        calloutSeen[i-1] = 'Y';
        calloutSeenNum++;
        if(typeof calloutSeenIDList !== 'undefined' & calloutSeenIDList !==null & calloutIds[i-1]!==''){
          if(calloutSeenIDList.length<=0){
            calloutSeenIDList = calloutIds[i-1];
          }else{
            calloutSeenIDList = calloutSeenIDList+";"+calloutIds[i-1];
          }
        }
      }
    }
  } 
}
window.onscroll = yHandler;

$(window).focus(function() {
    ActiveTimer = new Date();    
      blurTiming  = blurTiming + ((ActiveTimer.getTime()- idleTimerPerecent.getTime())/1000);
  //    alert("Focus");
  //  console.log("Inside Active Window "+blurTiming);
    
});
  $(window).blur(function() {
    idleTimerPerecent = new Date(); 
      var idleTimer = new Date();   
      var lastActivetime = (idleTimer.getTime() - ActiveTimer.getTime())/1000;
      TotalActiveTime  = TotalActiveTime + lastActivetime;
   //   alert("blur");    
}); 

function timeSpent(lastPercentScroll)
  {

    
      if ((lastPercentScroll == 10) || (lastPercentScroll < 10))
        {
          timeCalculator(10,StartTimerPerenctage,blurTiming);
        }
      
      else if ((lastPercentScroll == 20) || ((lastPercentScroll < 20) && (lastPercentScroll > 10))){
          timeCalculator(20,StartTimerPerenctage,blurTiming);               
      } 
      
      else if((lastPercentScroll == 30) || ((lastPercentScroll < 30) && (lastPercentScroll > 20))){
          timeCalculator(30,StartTimerPerenctage,blurTiming);               
      }
      
     else if((lastPercentScroll == 40) || ((lastPercentScroll < 40) && (lastPercentScroll > 30))){ 
          timeCalculator(40,StartTimerPerenctage,blurTiming);               
     }
    else if ((lastPercentScroll == 50) || ((lastPercentScroll < 50) && (lastPercentScroll > 40))){ 
          timeCalculator(50,StartTimerPerenctage,blurTiming);               
    }
      
    else if ((lastPercentScroll == 60) || ((lastPercentScroll < 60) && (lastPercentScroll > 50))){ 
        timeCalculator(60,StartTimerPerenctage,blurTiming);               
      }
      
    else if  ((lastPercentScroll == 70) || ((lastPercentScroll < 70) && (lastPercentScroll > 60))){
        timeCalculator(70,StartTimerPerenctage,blurTiming);               
    }
      
     else if ((lastPercentScroll == 80) || ((lastPercentScroll < 80) && (lastPercentScroll > 70))){
        timeCalculator(80,StartTimerPerenctage,blurTiming);             
     }
      
     else if ((lastPercentScroll == 90) || ((lastPercentScroll < 90) && (lastPercentScroll > 80))){
        timeCalculator(90,StartTimerPerenctage,blurTiming);               
     }  
     else{
        timeCalculator(100,StartTimerPerenctage,blurTiming);
     }

    TotalActiveTimeFor10Percent =Math.round(TotalActiveTimeFor10Percent);
    TotalActiveTimeFor20Percent =Math.round(TotalActiveTimeFor20Percent);
    TotalActiveTimeFor30Percent =Math.round(TotalActiveTimeFor30Percent);
    TotalActiveTimeFor40Percent =Math.round(TotalActiveTimeFor40Percent);
    TotalActiveTimeFor50Percent =Math.round(TotalActiveTimeFor50Percent);
    TotalActiveTimeFor60Percent =Math.round(TotalActiveTimeFor60Percent);
    TotalActiveTimeFor70Percent =Math.round(TotalActiveTimeFor70Percent);
    TotalActiveTimeFor80Percent =Math.round(TotalActiveTimeFor80Percent);
    TotalActiveTimeFor90Percent =Math.round(TotalActiveTimeFor90Percent);
    TotalActiveTimeFor100Percent =Math.round(TotalActiveTimeFor100Percent); 
  }

  function timeCalculator(TimePercent,StartTimerPerenctage,blurTiming){
          var EndTimerPerenctage = new Date();   
          lastPercentCount = (EndTimerPerenctage.getTime() - StartTimerPerenctage.getTime())/1000;
        var  lastPercentCount1 = lastPercentCount -blurTiming;
       //   alert("Bluring >>>>>>>>>>>"+blurTiming);

         if  (lastPercentCount > 0 && lastPercentCount1 > 0 ){
          switch (TimePercent) { 
          case 10: 
              TotalActiveTimeFor10Percent  = TotalActiveTimeFor10Percent + lastPercentCount1;
              break; 
          
          case 20: 
              TotalActiveTimeFor20Percent  = TotalActiveTimeFor20Percent + lastPercentCount1;             
        break; 
        
          case 30: 
              TotalActiveTimeFor30Percent  = TotalActiveTimeFor30Percent + lastPercentCount1;             
        break;  
          case 40: 
              TotalActiveTimeFor40Percent  = TotalActiveTimeFor40Percent + lastPercentCount1;               
        break;  
          case 50: 
              TotalActiveTimeFor50Percent  = TotalActiveTimeFor50Percent + lastPercentCount1;             
        break;  
          case 60: 
              TotalActiveTimeFor60Percent  = TotalActiveTimeFor60Percent + lastPercentCount1;               
        break;  
          case 70: 
              TotalActiveTimeFor70Percent  = TotalActiveTimeFor70Percent + lastPercentCount1;             
        break;  
          case 80: 
              TotalActiveTimeFor80Percent  = TotalActiveTimeFor80Percent + lastPercentCount1;               
        break;  
          case 90: 
              TotalActiveTimeFor90Percent  = TotalActiveTimeFor90Percent + lastPercentCount1;               
        break; 
          default:
              TotalActiveTimeFor100Percent  = TotalActiveTimeFor100Percent + lastPercentCount1;
      }   //Closing of switch Statement     
  }         
  }


});


function getURLEditorModeInfo(variable) {
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
        return false;
    }
    return false;
}
