reportsApp.service('teiReportsService', function(){
	
	this.getAllFigures = function(data){
		    var figIdMap = {};
			var figData = data.content.report.figures;
			figData.forEach(function(resp){
				figIdMap[resp.id] = resp.encodedImage;
			})
			return figIdMap;
		};
	this.getAllTables = function(data){
		    var tabIdMap = {};
			var tabData = data.content.report.tables;
			console.log("figure data",tabData.length)
			tabData.forEach(function(resp){
				tabIdMap[resp.id] = resp.encodedImage;
			})
			return tabIdMap;
		};
	/*this.getMainReportSubSections = function(subIndex, data){
		var mainReportSubSections = [];
		var isTocRefAvailable = false;
		angular.forEach(data.content.report.contents.mainContent.mainReportSections,function(mainReportSection,index){
			if(mainReportSection.tocRef != undefined && mainReportSection.tocRef == subIndex){
				mainReportSubSections.push(mainReportSection);
				isTocRefAvailable = true;
			} else if(isTocRefAvailable && mainReportSection.tocRef == undefined){
				mainReportSubSections.push(mainReportSection);
				isTocRefAvailable = true;
			} else {
				isTocRefAvailable = false;
			}
			
		  });
		return mainReportSubSections;
	}*/
	this.getTocRefsForRecommendations=function(data){

		var tocRefsforRecommendations=[];
		if( data.content.report.contents.mainContent==undefined){
			console.log("no toc ref's for recommendations");
		}else{
			// var recommendationSectionData=data.content.report.contents.mainContent.recommendationsSections;

			// recommendationSectionData.forEach(function(rsData){
			// 	if(rsData.tocRef!=undefined){
			// 		var tocRefIdforRecommendations=rsData.tocRef;
			// 		tocRefsforRecommendations.push(tocRefIdforRecommendations);
			// 	}
			// });
		}
		return tocRefsforRecommendations;

	};
	this.getTocRefs=function(data){
		var tocRefs=[];
		
		if( data.content.report.contents.mainContent==undefined){
			console.log("no toc ref's");
		}else{
			var mainReportSectionData=data.content.report.contents.mainContent.mainReportSections;
			
			mainReportSectionData.forEach(function(mrsData){
				if(mrsData.sectionTitle.type=='L1'){
					
					var tocRefId=mrsData.tocRef;
					tocRefs.push(tocRefId);
				}
	   		});
		}
   			return tocRefs;
   		
	};
		
	this.getEndNoteRefs = function(data){
		
		var endNoteSlideDivarr = [];
		if( data.content.report.contents.mainContent==undefined){
			console.log("no end notes");
		}else{
			var endNoteArr = data.content.report.contents.mainContent.endNotes;
			console.log("endNoteArr length"+endNoteArr.length);
		
			endNoteArr.forEach(function(res){

				var divSlideId = 'endNoteSlide' + res.ref;
				endNoteSlideDivarr.push(divSlideId);
			});

		}
		console.log("endNoteSlideDivarr"+endNoteSlideDivarr);
		return endNoteSlideDivarr;
	};

	this.getIdMap=function(data){
		var idMap = {};
		var i=0;
		if( data.content.report.contents.mainContent==undefined){
			console.log("no toc ref's");
		}else{
			var mainReportSectionData=data.content.report.contents.mainContent.mainReportSections;
			
			mainReportSectionData.forEach(function(mrsData){
				if(mrsData.sectionTitle.type=='L1'){
					
					idMap[mrsData.sectionTitle.value] = "page" + i;
					i++;
				}
	   		});
		}
   			return idMap;
   		
	};
	 
});

