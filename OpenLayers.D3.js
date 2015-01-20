    	OpenLayers.Layer.D3 =  OpenLayers.Class(OpenLayers.Layer.Vector, {
				d3FeaturesNodeClass:'d3features',
				d3Features:[],
				afterAdd:function(){
					var self = this;

					if(this.renderer.CLASS_NAME.match(/SVG$/)){

						this.d3InitSVG();
	      				this.events.register('moveend',this,this.onMoveEnd);


					}else{

					}
					
				},

				onMoveEnd:function(e){
					this.onPan();
					this.d3RenderFeatures();
				},

				onPan:function(){
                	if(this.d3FeaturesNode){

                		this.d3ClearRoot();

				        var ext = this.map.getExtent();
				        var res = this.map.getResolution();

				        var l = -ext.left/res;
				        var t = ext.top/res;

				        var _l = this.renderer.left;
				        var _t = this.renderer.top;

				        var _xOffset = this.renderer.xOffset;
				        var _x = l - _l + _xOffset;
				        var _y = t - _t;


				        this.d3FeaturesNode.attr("transform", "translate(" + _x + "," + _y + ")");


			        }
				},


				getFeaturesInView:function(){
					var self = this;
					var feats = [];
					var boundsArr = this.getViewportBoundsArr();
					if(this.d3Features){
						this.d3Features.forEach(function(f){
							if(self.inViewPort(new OpenLayers.LonLat(self.d3XAccessor(f),self.d3YAccessor(f)),boundsArr)){
								feats.push(f)
							}
						})
					}
					return feats;
				},

				//accepts lonlat and array of bnds obj
				//for finding features within viewport
				//bndsArr accounts for dateline
               	inViewPort: function(ll,bndsArr){
               		var inView = false;
               		if(bndsArr && bndsArr.length > 0){
                		//var _oll = {lon:ll[0],lat:ll[1]};
                		inView = bndsArr[0].containsLonLat(ll);
              			if(!inView && bndsArr.length > 1){
              				inView = bndsArr[1].containsLonLat(ll);
              			}
              		}
              		return inView;
	            },


	            getViewportBoundsArr:function(){
					var destProj = this.map.projection;
                	var llProj = new OpenLayers.Projection("EPSG:4326");
                	var isMercator = destProj.projCode.match('3857') || destProj.projCode.match('900913') ? true : false;

                	var bnds = this.map.getExtent();
                	var bndsArr;


                	if(!isMercator){
                		bndsArr = [bnds];
                	}else{
		                var nBnds = bnds.clone().transform(destProj,llProj);
		                var nBnds1 = nBnds.clone();
		                //var nBnds1 = [[nBnds.left,n],[]]
		                
		                 bndsArr = [nBnds1];

		                if(
		                  ((nBnds.left > 0 && nBnds.right < 0) || 
		                  (nBnds.left > 0 && nBnds.left > nBnds.right) ||
		                  (nBnds.left < 0 && nBnds.left > nBnds.right))
		                ){
		                  //small hack!
		                  var smallNum = .0000000001;
		                  bndsArr = [
		                  	new OpenLayers.Bounds(nBnds.left,nBnds.bottom,180-smallNum,nBnds.top),
		                  	new OpenLayers.Bounds(-180 + smallNum,nBnds.bottom,nBnds.right,nBnds.top)
		                  ]
		                }

		                bndsArr.forEach(function(b){
		                	b.transform(llProj,destProj);
		                });
	                }

	                return bndsArr;
	            },

				d3InitSVG:function(){
					this.d3Div = d3.select(this.div);
					var size = this.map.getSize();

					this.olRoot = this.d3Div.selectAll("svg");
					this.olRoot.remove(); 

					this.d3Root = this.d3Div.append("svg")
						.attr('width',size.w)
						.attr('height',size.h);

					this.d3ClearRoot();
				},



				d3LoadFeatures:function(features){
					this.d3Features = features;
					this.d3ClearRoot();
					this.d3RenderFeatures();
				},

				d3ClearRoot:function(){
					if(this.d3Root){
						this.d3Root.select('.' + this.d3FeaturesNodeClass).remove();
					}
					this.d3FeaturesNode = this.d3Root.append('g')
						.attr('class',this.d3FeaturesNodeClass);
				},

				d3RenderFeatures:function(){

				},


				d3FeatureXAccessor:function(f){
					return f[0];
				},
				d3FeatureYAccessor:function(f){
					return f[1];
				},

				d3Project:function(f){
					var p = [this.d3XAccessor(f),this.d3YAccessor(f)];
			        this.renderer.calculateFeatureDx({left:p[0],right:p[0]},this.map.getMaxExtent());
			        var featureDx = this.renderer.featureDx;
			        var geometry = {x:p[0],y:p[1]};
			        var resolution = this.renderer.getResolution();
			        var x = ((geometry.x - featureDx) / resolution + this.renderer.left);
			        var y = (this.renderer.top - geometry.y / resolution);
			        return [x,y];
				}

			});

			OpenLayers.Layer.D3Hex = OpenLayers.Class(OpenLayers.Layer.D3, {
				
				//used for calculating hexes
				d3HexRadius:10,

				//used for drawing hexes
				d3VisibleHexRadius:function(d){
					return this.d3HexRadius - 1;
				},
				
				//limit, above which, points are drawn rather than hexes
				d3HexZoomLimit:6,

				d3RenderFeatures:function(){

					if(this.d3HexZoomLimit && this.map.getZoom() > this.d3HexZoomLimit){
						this.d3DrawPoints();
					}else{
						this.d3UpdateHexData();
						this.d3DrawHexes();
					}

				},

				d3MakeHexBin:function(){
					var size = this.map.getSize();
    				this.hexbin = d3.hexbin()
      					.size([size.w,size.h])
      					.radius(this.d3HexRadius);

				},


				d3DrawPoints:function(){
					//console.log('Make points..')
					var feats = this.getFeaturesInView();

					this.d3FeaturesNode.selectAll("circle")
						.data(feats)
						.enter().append("circle")
						.attr(this.d3GetPointAttr())
						.style(this.d3GetPointStyle())

				},

				d3DrawHexes:function(){
					var self = this;
					this.d3FeaturesNode.selectAll("path")
						.data(this.hexData)
						.enter().append("path")
						.attr(this.d3GetHexAttr())
						.style(this.d3GetHexStyle())

				},

				d3UpdateHexData:function(){
					if(!this.hexbin){
						this.d3MakeHexBin();
					}
					var points = [];
					var self = this;
					this.d3Features.forEach(function(f){
						var p = self.d3Project(f);
						p.push(f);
						points.push(p);
					});
					this.hexData = this.hexbin(points);
					this.d3AfterHexDataUpdate();
				},

				//this makes is a place to set up variables used for styling based on how the hexes were distributed out
				d3AfterHexDataUpdate:function(){
					this.d3MaxHexBinSize = d3.max(this.hexData,function(h){
						return h.length
					})

					this.d3MinHexBinSize = d3.min(this.hexData,function(h){
						return h.length
					});

				},

				d3HexFill:"#FFF",
				d3PointFill:"#FFF",

				d3GetHexStyle:function(){
					var self = this;
					return {
						'fill':function(d){
							if(typeof self.d3HexFill == 'function'){
								self.d3HexFill(d,this);
							}else{
								return self.d3HexFill;
							}
						},
						'opacity':function(d){
							if(typeof self.d3HexOpacity == 'function'){
								return self.d3HexOpacity(d,this);
							}else{
								return self.d3HexOpacity;
							}
						},
						'stroke':function(d){
							if(typeof self.d3HexStroke == 'function'){
								return self.d3HexStroke(d,this);
							}else{
								return self.d3HexStroke;
							}
						},

					}
				},

				d3GetHexAttr:function(){
					var self = this;
					return {
						"d":function(d) { 
						   return  self.hexbin.hexagon(self.d3VisibleHexRadius(d)); 
						},
						"transform":function(d) { 
						  return "translate(" + d.x + "," + d.y + ")"; 
						}

					};
				},

				d3PointRadius:function(d){
					return 5;
				},


				d3GetPointAttr:function(){

					var self = this;
					return {
						"r":function(d) { 
						   return  self.d3PointRadius(d); 
						},
						"transform":function(d) { 
							var p = self.d3Project(d);
							return "translate(" + p[0] + "," + p[1] + ")"; 
						}

					}

				},

				d3GetPointStyle:function(){
					var self = this;
					return {
						'fill':function(d){
							if(typeof self.d3PointFill == 'function'){
								self.d3PointFill(d,this);
							}else{
								return self.d3PointFill;
							}
						},
						'opacity':function(d){
							if(typeof self.d3PointOpacity == 'function'){
								return self.d3PointOpacity(d,this);
							}else{
								return self.d3PointOpacity;
							}
						},
						'stroke':function(d){
							if(typeof self.d3PointStroke == 'function'){
								return self.d3PointStroke(d,this);
							}else{
								return self.d3PointStroke;
							}
						},

					}
				}


			});