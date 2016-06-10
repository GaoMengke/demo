;(function($){

	var Carousel = function(poster){
		var self = this;
		console.log(this)
//		console.log(poster)
		//保存单个旋转木马对象
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");//获取ul  左右按钮 所有的li
		this.nextBtn = poster.find("div.poster-next-btn");
		this.prevBtn = poster.find("div.poster-prev-btn");
		this.posterItems = poster.find("li.poster-item");
		//如果li的个数为偶数则把第一个li复制插入到ul中
		if( this.posterItems.size()%2 == 0 ){
			this.posterItemMain.append( this.posterItems.eq(0).clone() );
			this.posterItems = this.posterItemMain.children();
		};
		//获取第一个和最后一个li的节点
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		//
		this.rotateFlag = true;
		//默认配置参数
		this.setting = {
			"width" : 1000,			//幻灯片的宽度
			"height" : 270,			//幻灯片的高度
			"posterWidth" : 640,	//幻灯片第一帧的宽度
			"posterHeight" : 270,	//幻灯片第一帧的高度
			"scale" : 0.9,			//记录显示比例关系
			"speed" : 500,
			"autoPlay" : false,
			"delay" : 5000,
			"verticalAlign" : "middle" //top bottom
		};
		console.log(this.posterItems)
		//将this.getsetting（）里的对象的属性和值扩展到this.setting里 关联第239行
		$.extend( this.setting,this.getSetting() );
//		console.log(this.getSetting())
		//设置配置参数值//初始化div高宽 ul高宽  左右按钮的位置 以及第一个li的位置
		this.setSettingValue();
		//初始化幻灯片位置//为剩下的每个li设置初始位置
		this.setPosterPos();
		//左旋转按钮
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("left");
			};
		});
		//右旋转按钮
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("right");
			};
		});
		//是否开启自动播放
//		if(this.setting.autoPlay){
//			this.autoPlay();
//			this.poster.hover( function(){
//				//self.timer是setInterval的种子
//				window.clearInterval(self.timer);
//			}, function(){
//				self.autoPlay();
//			});			
//		};
	};
	Carousel.prototype = {
//		autoPlay:function(){
//			var self = this;
//			this.timer = window.setInterval( function(){
//				self.nextBtn.click();
//			}, this.setting.delay );
//		},

		//旋转
		carouseRotate:function(dir){
			var _this_  = this;
			var zIndexArr = [];
			//左旋转
			if(dir === "left"){
				this.posterItems.each(function(){
					var self = $(this),
						prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						
						width = prev.width(),
						height =prev.height(),
						opacity = prev.css("opacity"),
						left = prev.css("left"),
						top = prev.css("top"),
						zIndex = prev.css("zIndex");
//console.log(prev)
					zIndexArr.push(zIndex);
					self.animate({
						width :width,
						height :height,
					  zIndex :zIndex,
					    opacity :opacity,
					    left :left,
					    top :top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}else if(dir === "right"){//右旋转
				this.posterItems .each(function(){
					var self = $(this),
						next = self.next().get(0)?self.next():_this_.posterFirstItem,
						width = next.width(),
						height =next.height(),
						opacity = next.css("opacity"),
						left = next.css("left"),
						top = next.css("top"),
						zIndex = next.css("zIndex");

					zIndexArr.push(zIndex);					
					self.animate({
						width :width,
						height :height,
					  //zIndex :zIndex,
					    opacity :opacity,
					    left :left,
					    top :top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});	
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			};
		},
		//设置剩余的帧的位置关系
		setPosterPos:function(){
			var self = this,
			//去掉已经配置好参数的第一个li
				sliceItems = this.posterItems.slice(1),
				//获得剩余li的长度减去一半
				sliceSize = sliceItems.size()/2,
				//获得第一半的lidom
				rightSlice = sliceItems.slice(0,sliceSize),
				
				////存在图片奇偶数问题
////		level = Math.floor(this.posterItems.size()/2),
        //4
        level=sliceSize,
        //获得剩余一半的li节点
				leftSlice = sliceItems.slice(sliceSize);
//			console.log(rightSlice)
			//设置右边帧的位置关系和宽度高度top
			//this.setting.width位整个ul的宽度
			//posterwidth为第一帧li的宽度 相减除以2位第一帧左移的位置
			var firstLeft = (this.setting.width - this.setting.posterWidth)/2;
			//获得第一帧的宽度
			var rw = this.setting.posterWidth,
			// firstleft+rw为右侧li第二帧左移的距离
				fixOffsetLeft = firstLeft + rw,
				//rh为第一帧的高度
				rh = this.setting.posterHeight,
				//gap为每一帧的间隔距离
				gap = ((this.setting.width - this.setting.posterWidth)/2)/level;
			
			//设置右边位置关系
			//遍历右侧li
			rightSlice.each(function(i){
				level--;
				//rw、rh为每一帧的宽度和高度
				rw = rw * self.setting.scale;
//				console.log(rw)
				rh = rh * self.setting.scale;
				var j = i;
				//设置当前li的样式
				$(this).css({
					zIndex :level,
					width :rw,
					height :rh,
					opacity :1/(++j),
					left :fixOffsetLeft+(++i)*gap - rw,
					//设置每个li的top值
					top :self.setVerticalAlign(rh)
				});
			});
     
			//设置左边的位置关系
			//获得右侧最后一个li的高宽
			var lw = rightSlice.last().width(),
				lh  =rightSlice.last().height(),
				oloop = Math.floor(this.posterItems.size()/2);
//				console.log(leftSlice)
   // 遍历左侧li 把右侧最后一个li的高宽给左侧第一个li（这个左侧第一个li是在最下面的li 这些li是以一个圆形从右向左转的）
       leftSlice.each(function(i){
				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/oloop,
					left:i*gap,
					top:self.setVerticalAlign(lh)
				});
				//遍历时高宽乘以scale
				lw = lw/self.setting.scale;
				lh = lh/self.setting.scale;
				oloop--;
			});
		},
	
		//设置垂直排列对齐
		setVerticalAlign:function(height){
			var verticalType  = this.setting.verticalAlign,
				top = 0;
			if(verticalType === "middle"){
				top = (this.setting.height-height)/2;
			}else if(verticalType === "top"){
				top = 0;
			}else if(verticalType === "bottom"){
				top = this.setting.height-height;
			}else{
				top = (this.setting.height-height)/2;
			};
			return top;
		},

		//设置配置参数值去控制基本的宽度高度。。。
		setSettingValue:function(){
		  //给div设置初始值
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			//给ul设置初始的宽和高
			this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height
			});
			//计算上下切换按钮的宽度
			var w = (this.setting.width-this.setting.posterWidth)/2;
			//设置切换按钮的宽高，层级关系
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				//5
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});			
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				top:0,
				//4
				zIndex:Math.floor(this.posterItems.size()/2)
			});
		},

		//获取人工配置参数
		getSetting:function(){			
			var setting = this.poster.attr("data-setting");
			if(setting && setting != ""){
				return $.parseJSON(setting);
			}else{
				return {};
			};
		}	
	};

	Carousel.init = function(posters){
		var _this_ = this;
		
		posters.each(function(){
//			 console.log("halo Louis;")
			new  _this_($(this));
			console.log($(this))
		});
	};

	//挂载到window下
	window.Carousel = Carousel;

})(jQuery);