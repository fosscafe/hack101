reportsApp.service("calloutDisplayService",function(){
    
	var calloutIds=[];
	
    /* renders the callout content */
    this.displayCallout = function(calloutContentdata){
		var isIEBrowser = false || !!document.documentMode;	
		var isSafariBrowser = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);		
		if(isIEBrowser){
			var windowWidth=$(window).width();
		}else if(isSafariBrowser){
			var windowWidth=$(window).width();
		}else{
			var windowWidth=$(window).width()+17;
		}
		

		if(windowWidth <1024 && window.location.href.indexOf("editor") == -1){
			
			$('.callout-display-wrapper').addClass('displayNoneMobile');
			setTimeout(function(){
				
		 		if(calloutContentdata.length !=undefined || calloutContentdata.length !='' || calloutContentdata.length !=null){
					
		 			for(var index=0;index<calloutContentdata.length;index++){
		    			if(calloutContentdata[index].status=='active'){
		    				$("#callout_in_mobile_"+index).remove();

		    			if(calloutContentdata[index].position.id!='undefined' || calloutContentdata[index].position.id !=false || calloutContentdata[index].position.id !=''){

		    				var calloutId=calloutContentdata[index].position.id;
		    				
		    				if(calloutId !=undefined){
		    					if(calloutId.indexOf("figid") >0){
		    						var newText =  '<div ng-name='+calloutContentdata[index].id+' class="callout_content_mobile" id="callout_in_mobile_'+index+'"><div class="callout-next-border" id="callout-next-div-'+index+'"></div><div class="callout_header_in_mobile">'+calloutContentdata[index].title+'</div>'+calloutContentdata[index].comment+'</div>';
									$('#'+calloutId).append(newText);
									var newText1 = '<span id="highlited-callout-text_'+index+'" class="highlited-text-callout"></span>';
									$('#'+calloutId).before(newText1);
			        				var highlitedtext_height=$('#highlited-callout-text_'+index).position().top;
									var callout_height=$('#callout_in_mobile_'+index).position().top;
									var total_height=callout_height - highlitedtext_height;
									
									//calloutIds.push(Number(callout_height));

									$('#callout-next-div-'+index).css('height',total_height);
									$('#callout-next-div-'+index).css('top',-total_height);
		    				}else{
		    					var keyword=calloutContentdata[index].keyWord.trim();
		    					var $elem = $('#'+calloutContentdata[index].position.id);
								var text = $elem.html();
								
								keyword=validateKeyword(keyword).trim();

								var newText = text.replace(keyword, '<span id="highlited-callout-text_'+index+'" class="highlited-text-callout">'+keyword+'</span>');
								$elem.html(newText);
								var newText =  '<div ng-name='+calloutContentdata[index].id+' class="callout_content_mobile" id="callout_in_mobile_'+index+'"><div class="callout-next-border" id="callout-next-div-'+index+'"></div><div class="callout_header_in_mobile">'+calloutContentdata[index].title+'</div>'+calloutContentdata[index].comment+'</div>';
								$elem.append(newText);
								


								if($('#highlited-callout-text_'+index).length==0){
									var newText = '<span id="highlited-callout-text_'+index+'" class="highlited-text-callout"></span>';
									$elem.before(newText);
									
								}
								
								var highlitedtext_height=$('#highlited-callout-text_'+index).position().top;
								
								var callout_height=$('#callout_in_mobile_'+index).position().top;
								
								var total_height=callout_height - highlitedtext_height;

								//calloutIds.push(Number(callout_height));
								
								$('#callout-next-div-'+index).css('height',total_height+12);
								$('#callout-next-div-'+index).css('top',-total_height-12);

		    				}
		    				}
		    				
		    			}	
		    			}
		    			
		            }
		            
		 		}
	    		
	            
	            clearIntervalFunc( 0 );
	     	}, 5000);
			
		}else{
			
			$('.callout-display-wrapper').removeClass('displayNoneMobile');
		}
        
	}
	
	function validateKeyword(keyword){
	 	if(keyword !== 'undefined' & keyword != null){
			keyword = keyword.replace(/&#39;/g, "'");
        }
        
        if(keyword.indexOf('(') >=1){
        	var bracess_count=keyword.match((/[(]/g) || []).length;
        	
			if(bracess_count==1){
				var split_val_open=keyword.split('(');
				var split_val_close=keyword.split(')');
				
				if( split_val_close[1] != "undefined" || split_val_open[0].lenght >= split_val_close[1].length){
					keyword=split_val_open[0];
				}else{
					keyword=split_val_close[1];	
				}
			}else if(bracess_count >1){
				var split_val_open=keyword.split('(');
				var split_val_close=keyword.split(')');
				var maxstring='';
				for(var x=0;x<split_val_open.length;x++){
					var split_val_open_right=split_val_open[x].split(')');
					if(split_val_open_right.length==1){
						if(maxstring.length >split_val_open_right[0].length){
							maxstring=maxstring;
						}else{
							maxstring=split_val_open_right[0];
						}
					}
					if(split_val_open_right.length==2){
						if(maxstring.length >split_val_open_right[1].length){
							maxstring=maxstring;
						}else{
							maxstring=split_val_open_right[1];
						}
					}
				}
				for(var x=0;x<split_val_close.length;x++){
					var split_val_open_right=split_val_close[x].split('(');
					if(split_val_open_right.length==1){
						if(maxstring.length >split_val_open_right[0].length){
							maxstring=maxstring;
						}else{
							maxstring=split_val_open_right[0];
						}
					}
					if(split_val_open_right.length==2){
						if(maxstring.length >split_val_open_right[1].length){
							maxstring=maxstring;
						}else{
							maxstring=split_val_open_right[1];
						}
					}
				}
				keyword=maxstring;
			}else{
				return keyword;	
			}
        }
		return keyword;
	 }
});

