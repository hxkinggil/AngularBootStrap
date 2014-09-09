var module = angular.module('tableSpanModule',[]);

module.directive('tableSpan',['$compile',function($compile){
	var templateHtml;
    return {
        restrict: 'A',
        scope : {
            data:'=',
            headerMapping : '='
        },
        controller : function($scope, $element, $attrs, $transclude,$timeout) {
        	
        	
        	 console.log('tableSpan controller');
        	 var subLinkCount = 0;
        	 var getLinkCount = function(){
        	     return ++subLinkCount;
        	 }
        	 
        	 //消除headerMapping中的null
        	 var lastValue = null;
        	 for(var key in $scope.headerMapping){
        	     if($scope.headerMapping[key]==null){
        	          $scope.headerMapping[key] == lastValue;
        	     }else{
        	          lastValue == $scope.headerMapping[key];
        	     }
        	 }

        	 function getHeadMappingKeyCount(){
        	 	var  dataKeyCount = 0;
        	     for(var key in $scope.headerMapping){
	        	     dataKeyCount ++;
	        	 }
	        	 return dataKeyCount;
        	 }
        	 
        	 
        	 function getDelCell(){
        	     var delCell = [];
	        	 delCell.push([]);//第一行 没有需要删除的
	        	 //标记要删除的单元格
	        	 for(var i=1,len=$scope.data.length;i<len;i++){
	        	     var delRow = [];
	        	     var currentRow = $scope.data[i];
	        	     //for(var j=i-1;j>=0;j--){
	        	     	var matchRow = $scope.data[i-1];
	        	        var k = 0;
	        	        for(var key in $scope.headerMapping){
	        	            if(matchRow[$scope.headerMapping[key]]==currentRow[$scope.headerMapping[key]]){
	        	                delRow.push(k);
	        	                k++;
	        	            }else{//如果前面的未有合并  后面的不可能要删除
	        	               break;
	        	            }
	        	        }
	        	    // }
	        	     delCell.push(delRow);
	        	 }
	        	 return delCell;
        	 }

        	 function getRowSpanCell(delCell){
        	     var rowSpanCell = [];
	        	 for(var i=0,len=delCell.length;i<len;i++){
	        	     var rowSpan = {};
	        	     var currentDelRow = delCell[i];
	        	     var canMathCol = [];
	        	     var dataKeyCount = getHeadMappingKeyCount();
	        	     for(var j=0;j<dataKeyCount;j++){
	        	         if(getValueFromArray(j,currentDelRow)==null){
	        	             canMathCol.push(j);
	        	         }
	        	     }
	        	     for(var j=i+1;j<len;j++){
	        	         var matchDelRow = delCell[j];
	        	         var nextCanDelRow = [];
	        	         for(var k=0,kLen=matchDelRow.length;k<kLen;k++){
	        	             if(getValueFromArray(matchDelRow[k],currentDelRow)==null&&getValueFromArray(matchDelRow[k],canMathCol)!=null){
	        	                 nextCanDelRow.push(matchDelRow[k]);
	        	                 if(rowSpan[matchDelRow[k]]){
	        	                     rowSpan[matchDelRow[k]] += 1;
	        	                 }else{
	        	                     rowSpan[matchDelRow[k]] = 2;
	        	                 }
	        	             }
	        	         }
	        	         canMathCol = nextCanDelRow;
	        	         if(canMathCol.length==0){
	        	             break;
	        	         }
	        	     }
	        	     rowSpanCell.push(rowSpan);
	        	 }
	        	 return rowSpanCell;
        	 }

        	 var delCell = getDelCell();
        	 var rowSpanCell = getRowSpanCell(delCell);
        	 
        	 var getRowInfoByIndex = function(index){
        	     if(index>$scope.data.length){
        	         return null;
        	     }else{
        
        	         return {delRow:delCell[index],spanRow:rowSpanCell[index]};
        	     }
        	 }
        	 
        	 function getValueFromArray(value,array){
        	     for(var i=0;i<array.length;i++){
        	         if(value==array[i]){
        	             return i;
        	         }
        	     }
        	     return undefined;
        	 }
        	 
        	 function changeDelRowToKey(delRow){
        	     var result = {};
        	     for(var i=0;i<delRow.length;i++){
        	     	var k = 0;
        	        for(var key in $scope.headerMapping){
        	            if(delRow[i]==k){
        	                result[key]=true;
        	                break;
        	            }
        	            k++;
        	        }
        	     }
        	     return result;
        	 }
        	 
        	 function chageSpanRowToKey(spanRow){
        	 	var reResult = {};
        	     for(var key in spanRow){
        	     	 var k = 0;
        	         for(var key2 in $scope.headerMapping){
        	             if(parseInt(key)==k){
        	                 reResult[key2] = spanRow[key];
        	                 break;
        	             }
        	             k++;
        	         }
        	     }
        	     return reResult;
        	 }
        	 
        	//var athis = this;
        	/*$scope.$watch('data',function(newValue,oldValue){
				console.log('change!');
				subLinkCount = 0;
			    delCell = getDelCell();
			    rowSpanCell = getRowSpanCell(delCell);
			     console.log($element.html());
			     
			     $timeout(function(){
			        var scopeArray = [];
			        
				    while(scopeArray.length!=newValue.length){
				    	
				    	scopeArray = [];
				    	var eleContent = $element.contents();
					    for(var i=0;i<eleContent.length;i++){
						    var eleScope = angular.element(eleContent[i]).scope();
						    if(eleScope&&eleScope.$index!=null){
						    	scopeArray.push(eleScope);
						    }
					    }
				    }
				    for(var i=0;i<scopeArray.length;i++){
				        var eleScope = scopeArray[i];
				        var linkCount = getLinkCount();
		                var rowSpanAndDelInfo =getRowInfoByIndex(linkCount-1);
						eleScope.spanRow = chageSpanRowToKey(rowSpanAndDelInfo.spanRow);
						eleScope.delRow = changeDelRowToKey(rowSpanAndDelInfo.delRow);
				    }
			    });
				
			},true);*/
			
        	 var lastScope = [];
			$scope.$watch('data',function(newValue,oldValue){
				$element.contents().remove();
				var comService = $compile(templateHtml);
				console.log(templateHtml);
				comService($scope.$parent,function(clone){
					console.log(templateHtml);
					for(var i=0;i<lastScope.length;i++){
					    lastScope[i].$destroy();
					    lastScope[i] = null;
					}
				    
					for(var i=0;i<clone.length;i++){
						var chiScope = angular.element(clone[i]).scope();
						if(chiScope!=null){
							lastScope.push(chiScope);
						}
					}
					$element.append(clone);
				});
			},true);
			
				this.setDelAndRow = function(subScope,index){
					if(index==0){
					    delCell = getDelCell();
			            rowSpanCell = getRowSpanCell(delCell);
					}
			        var rowSpanAndDelInfo = getRowInfoByIndex(index);
			        subScope.spanRow = chageSpanRowToKey(rowSpanAndDelInfo.spanRow);
			        subScope.delRow = changeDelRowToKey(rowSpanAndDelInfo.delRow);
			    }
        },
        compile:function(tElement, tAttrs, transclude){
        	//1.指令自己编译
        	templateHtml = tElement.html();
        	tElement.contents().remove();
        	
            /*var tr = tElement.children("tr[ng-repeat]");
            for(var i=0;i<tr.length;i++){
                 var tds = angular.element(tr[i]).children("td");
                 for(var j=0;j<tds.length;j++){
        
                     var td = angular.element(tds[j]);
                     var colName = td.attr('colName');
                     if(colName){
                         td.attr("ng-if","!delRow."+colName);
                         td.attr("rowSpan","{{spanRow."+colName+" ? spanRow."+colName+" : '1'}}");
                     }
                 }
            }*/
            
            return {
                pre:function preLink(){},
                post:function postLink(scope, iElement, iAttrs){
                }
            }
        }
    }
}]);


module.directive('trSpan',function(){
    return {
        restrict: 'A',
        //template:'<div></div>',
        priority: 999,
        require : '^tableSpan',
        compile:function(tElement, tAttrs, transclude){
             return {
                pre: function preLink(scope, iElement, iAttrs){
                    
                },
                post: function postLink(scope, iElement, iAttrs,tableSpanController){
                	
                	/*var expression = iAttrs.ngRepeat;
        			var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
        			var watchName = match[1];
                	
                	scope.$watch(watchName,function(){
                	    console.log(watchName+' change!');
                	});
                	var linkCount = tableSpanController.getLinkCount();
                	var rowSpanAndDelInfo = tableSpanController.getRowInfoByIndex(linkCount-1);
                	
                	//标记为ignore属性的td
                	var ignoreIndexArray = [];
                	for(var i=0;i<iElement.children().length;i++){
                	    if($(iElement.children()[i]).attr("ignoreRowSpan")=="true"){
                	        ignoreIndexArray.push(i);
                	    }
                	}
                	
                	//FIXME:
                	var getRealIndex = function(index){
                		var realIndex = index;
                	    for(var i=0;i<ignoreIndexArray.length;i++){
                	        if(realIndex>=ignoreIndexArray[i]){
                	            realIndex++;
                	        }else{
                	            return realIndex;
                	        }
                	    }
                	    return realIndex;
                	}
                	
                	//处理合并rowSpan
                	scope.spanRow = rowSpanAndDelInfo.spanRow;
                	
                	for(var key in rowSpanAndDelInfo.spanRow){
                		var realIndex = getRealIndex(key);
                	     $(iElement.children()[realIndex]).attr('rowSpan',rowSpanAndDelInfo.spanRow[key]);
                	}
                	
                	//处理删除单元格
                	scope.delRow = rowSpanAndDelInfo.delRow;
                	
                	var eleChildren = iElement.children();
                	for(var i=0;i<rowSpanAndDelInfo.delRow.length;i++){
                	    var delCellIndex = rowSpanAndDelInfo.delRow[i];
                	    var realIndex = getRealIndex(delCellIndex);
                	    $(eleChildren[realIndex]).remove();
                	}*/
                	tableSpanController.setDelAndRow(scope,scope.$index);
                }
                
             };
        }
    }
});

function tableSpan(data,headerMapping){
     var lastValue = null;
        	 for(var key in headerMapping){
        	     if(headerMapping[key]==null){
        	          $headerMapping[key] = lastValue;
        	     }else{
        	          lastValue =headerMapping[key];
        	     }
        	 }

        	 function getHeadMappingKeyCount(){
        	 	var  dataKeyCount = 0;
        	     for(var key in headerMapping){
	        	     dataKeyCount ++;
	        	 }
	        	 return dataKeyCount;
        	 }
        	 
        	 
        	 function getDelCell(){
        	     var delCell = [];
	        	 delCell.push([]);//第一行 没有需要删除的
	        	 //标记要删除的单元格
	        	 for(var i=1,len=data.length;i<len;i++){
	        	     var delRow = [];
	        	     var currentRow = data[i];
	        	     //for(var j=i-1;j>=0;j--){
	        	     	var matchRow =data[i-1];
	        	        var k = 0;
	        	        for(var key in headerMapping){
	        	            if(matchRow[headerMapping[key]]==currentRow[headerMapping[key]]){
	        	                delRow.push(k);
	        	                k++;
	        	            }else{//如果前面的未有合并  后面的不可能要删除
	        	               break;
	        	            }
	        	        }
	        	    // }
	        	     delCell.push(delRow);
	        	 }
	        	 return delCell;
        	 }

        	 function getRowSpanCell(delCell){
        	     var rowSpanCell = [];
	        	 for(var i=0,len=delCell.length;i<len;i++){
	        	     var rowSpan = {};
	        	     var currentDelRow = delCell[i];
	        	     var canMathCol = [];
	        	     var dataKeyCount = getHeadMappingKeyCount();
	        	     for(var j=0;j<dataKeyCount;j++){
	        	         if(getValueFromArray(j,currentDelRow)==null){
	        	             canMathCol.push(j);
	        	         }
	        	     }
	        	     for(var j=i+1;j<len;j++){
	        	         var matchDelRow = delCell[j];
	        	         var nextCanDelRow = [];
	        	         for(var k=0,kLen=matchDelRow.length;k<kLen;k++){
	        	             if(getValueFromArray(matchDelRow[k],currentDelRow)==null&&getValueFromArray(matchDelRow[k],canMathCol)!=null){
	        	                 nextCanDelRow.push(matchDelRow[k]);
	        	                 if(rowSpan[matchDelRow[k]]){
	        	                     rowSpan[matchDelRow[k]] += 1;
	        	                 }else{
	        	                     rowSpan[matchDelRow[k]] = 2;
	        	                 }
	        	             }
	        	         }
	        	         canMathCol = nextCanDelRow;
	        	         if(canMathCol.length==0){
	        	             break;
	        	         }
	        	     }
	        	     rowSpanCell.push(rowSpan);
	        	 }
	        	 return rowSpanCell;
        	 }

        	 var delCell = getDelCell();
        	 var rowSpanCell = getRowSpanCell(delCell);
        	 
        	 var getRowInfoByIndex = function(index){
        	     if(index>data.length){
        	         return null;
        	     }else{
        
        	         return {delRow:delCell[index],spanRow:rowSpanCell[index]};
        	     }
        	 }
        	 
        	 function getValueFromArray(value,array){
        	     for(var i=0;i<array.length;i++){
        	         if(value==array[i]){
        	             return i;
        	         }
        	     }
        	     return undefined;
        	 }
        	 
        	 function changeDelRowToKey(delRow){
        	     var result = {};
        	     for(var i=0;i<delRow.length;i++){
        	     	var k = 0;
        	        for(var key in headerMapping){
        	            if(delRow[i]==k){
        	                result[key]=true;
        	                break;
        	            }
        	            k++;
        	        }
        	     }
        	     return result;
        	 }
        	 
        	 function chageSpanRowToKey(spanRow){
        	 	var reResult = {};
        	     for(var key in spanRow){
        	     	 var k = 0;
        	         for(var key2 in headerMapping){
        	             if(parseInt(key)==k){
        	                 reResult[key2] = spanRow[key];
        	                 break;
        	             }
        	             k++;
        	         }
        	     }
        	     return reResult;
        	 }
        	 
        	 this.getDelAndRow = function(index){
			        var rowSpanAndDelInfo = getRowInfoByIndex(index);
			          rowSpanAndDelInfo.spanRow = chageSpanRowToKey(rowSpanAndDelInfo.spanRow);
			        rowSpanAndDelInfo.delRow = changeDelRowToKey(rowSpanAndDelInfo.delRow);
			       return rowSpanAndDelInfo;
			    }
}