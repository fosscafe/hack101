reportsApp.service('tlpReportsService', function(){
	
	this.getAllFigures = function(data){
		    var figIdMap = {};
			var figData = data.content.report.figures;
			figData.forEach(function(resp){
				figIdMap[resp.id] = resp;
			})
			return figIdMap;
		};
	this.getTocRefsForRecommendations=function(data){

		var tocRefsforRecommendations=[];
		if( data.content.report.contents.mainContent==undefined){
			//console.log("no toc ref's for recommendations");
		}else{
			var recommendationSectionData=data.content.report.contents.mainContent.recommendationsSections;
			if(recommendationSectionData != undefined)
			{
			recommendationSectionData.forEach(function(rsData){
				if(rsData.tocRef!=undefined){
					var tocRefIdforRecommendations=rsData.tocRef;
					tocRefsforRecommendations.push(tocRefIdforRecommendations);
				}
			});
		}
		}
		return tocRefsforRecommendations;

	};
	this.getTocRefsForWhatItMeans=function(data){

		var getTocRefsForWhatItMeans=[];
		if( data.content.report.contents.mainContent==undefined){
			//console.log("no toc ref's for WhatItMeans");
		}else{
			var whatItMeansSectionData=data.content.report.contents.mainContent.whatItMeansSections;

			whatItMeansSectionData.forEach(function(wimsData){
				if(wimsData.tocRef!=undefined){
					var tocRefIdforWhatItMeansSection=wimsData.tocRef;
					getTocRefsForWhatItMeans.push(tocRefIdforWhatItMeansSection);
				}
			});
		}
		//console.log("toc refs for what it means"+getTocRefsForWhatItMeans);
		return getTocRefsForWhatItMeans;

	};
	this.getTocRefs=function(data){
		var tocRefs=[];
		
		if( data.content.report.contents.mainContent==undefined){
			//console.log("no toc ref's");
		}else{
			var mainReportSectionData=data.content.report.contents.mainContent.mainReportSections;
			
			mainReportSectionData.forEach(function(mrsData){
				
				if(mrsData.sectionTitle !=undefined){
					if(mrsData.sectionTitle.type=='L1'){
						var tocRefId=mrsData.tocRef;
						tocRefs.push(tocRefId);
					}	
				}
				
	   		});
		}
   			return tocRefs;
   		
	};
		
	this.getEndNoteRefs = function(data){
		
		var endNoteSlideDivarr = [];
		if( data.content.report.contents.mainContent==undefined){
			//console.log("no end notes");
		}else{
			var endNoteArr = data.content.report.contents.mainContent.endNotes;
			//console.log("endNoteArr length"+endNoteArr.length);
		
			endNoteArr.forEach(function(res){

				var divSlideId = 'endNoteSlide' + res.ref;
				endNoteSlideDivarr.push(divSlideId);
			});

		}
		//console.log("endNoteSlideDivarr"+endNoteSlideDivarr);
		return endNoteSlideDivarr;
	};
	this.getCookie=function(cookiename){

	  // Get name followed by anything except a semicolon
	  var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	  // Return everything after the equal sign
	  return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
	  
	};
	 
});

