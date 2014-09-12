game = {
	init : function(){
		gapSize = 160;
		handDistance = 200;
		handWidth = 323;
		minHandWidth = 50;
		container = $('#container');
		player = $('#player');
		cWidth = container.width();
		cHeight = container.height();
		speed = 100;
		posMark = 0;
		direction = 0;
		topHandL = topHandR = null;
		timmer = null;
		e1W = 20;
		e1H = 20;
		e2W = 20;
		e2H = 30;
		e1R = Math.sqrt(e1W*e1W + e1H*e1H),
		e2R =Math.sqrt(e2W*e2W + e2H*e2H);
		score = 0;
		scroeC = $('#score');
	},
	isMobile : function(){
		var sUserAgent= navigator.userAgent.toLowerCase(),
		bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
		bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
		bIsMidp= sUserAgent.match(/midp/i) == "midp",
		bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
		bIsUc= sUserAgent.match(/ucweb/i) == "ucweb",
		bIsAndroid= sUserAgent.match(/android/i) == "android",
		bIsCE= sUserAgent.match(/windows ce/i) == "windows ce",
		bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile",
		bIsWebview = sUserAgent.match(/webview/i) == "webview";
		return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
	},
	start : function(){
		player.addClass('flyl');
		$('#trees').addClass('treedown');
		game.bgMove();
		scroeC.show();

		var eventType = this.isMobile() ? 'touchstart' : 'click';
		$(document).on(eventType, function(){
			if(++direction%2==0){
				player[0].className = 'flyl';
			}
			else{
				player[0].className = 'flyr';
			}
		});
	},
	impactCheck : function(e1, e2){
		var e1Offset = e1.offset(),
		e2Offset = e2.offset(),
		e1PositionL = e1.position().left,
		l1 = (e1Offset.left+e1W/2) - (e2Offset.left+e2W/2),
		l2 = (e1Offset.top+e1H/2) - (e2Offset.top+e2H/2),
		l3 = Math.sqrt(l1*l1 + l2*l2);

		if(e1PositionL<=1 || e1PositionL+e1W>=cWidth){
			return true;
		}
		return l3<(e1R+e2R-10);
	},
	generateHand : function(){
		if(topHandL && parseInt(topHandL.css('top'))<handDistance)return;
		var handL = $('<div class="hand_l"><div class="t trot"></div></div>'),
			handR = $('<div class="hand_r"><div class="t trot"></div></div>'),
			handLminL = handWidth-minHandWidth,
			handLmaxL = handWidth+minHandWidth+gapSize-cWidth,
			handLLeft = Math.random()*(handLmaxL-handLminL) + handLminL;
		handL.css({top:-50, left:-handLLeft});
		handR.css({top:-50, left:handWidth-handLLeft+gapSize});
		container.append(handL, handR);
		topHandL = handL;
		topHandR = handR;
	},
	bgMove : function(){
		game.generateHand();//产生横梁
		posMark += 2;
		container.css('background-position', '0 '+posMark+'px');
		
		var hands = $('.hand_l, .hand_r');
		hands.each(function(index, element){
			var _this = $(this),
				thisTop = parseInt(_this.css('top'));
			if(thisTop>cHeight){
				_this.remove();
			}
			else{
				thisTop += 2;
				_this.css('top', thisTop+'px');
			}
			if(thisTop>player.offset().top+e1H){
				//已经位于下方
				if(!_this.data('pass') && index%2==0){
					scroeC.text(++score);
					_this.data('pass', 1);
				}
			}
			else{
				//碰撞检测
				if(game.impactCheck(player, _this.find('.t'))){
					game.stop();
					return false;
				}
			}
			
		});

		timmer = requestAnimationFrame(game.bgMove);
	},
	stop : function(){
		player[0].className = 'dropdown';
		$(document).off('click');
		setTimeout(function(){
			cancelAnimationFrame(timmer);
		},0);
		setTimeout(function(){
			$('#scorefinal').text(score);
			$('#scorepan').show();	
		}, 250);
		
	},
	restart : function(){
		game.init();
		$('.hand_l, .hand_r').remove();
		scroeC.text(score);
		player[0].className = '';
		game.start();
	}
};

(function(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    }
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    }
}());

game.init();
$('.start').on('click', function(){
	game.start();
	$(this).hide();
});
$('#again').on('click', function(){
	game.restart();
	$('#scorepan').hide();
});
