/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
/* wondow.onload
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
window.addEventListener("load", function(  ) { 
	blueprint.colors = {
		bw: ["#ffffeb", "#000000"],
		grayscale: ["#ffffeb", "#888888", "#444444", "#000000"],
		industry: ["#ffffeb", "#ffcc00", "#9a0000", "#000000"],
		industrycolors: ["#ffcc00", "#9a0000"],
		blues: ["#2B4C6F", "#4A6A8A", "#183d68", "#07325f", "#004866"],
		greens: ["#267158", "#448870", "#126d4f", "#006644"],
		oranges: ["#E64A19", "#FF5722", "#ff6600", "#ffcc00", "#ff8000", "#e64d00"],
		blacks: ["#212121", "#727272"],
		whites: ["fffffa", "#B6B6B6"],
		circus: ["#9a0000", "#de4400", "#de4400", "#ffcc00", "#ffcc00", "#008888", "#4682B4","#4682B4", "#008848",  "#004888", "#006699"],
	};
	blueprint.basefreqs = [68, 80, 90, 100, 110, 120, 130, 140, 180, 240, 300 ];
	blueprint.chords = [];
	blueprint.allfreqs = [];
	blueprint.basefreqs.forEach(function(x,j,a){
		var chord = [ x, x*2, x*3, Math.floor(x*3/2), Math.floor(x*4/3) ];
		blueprint.chords.push( chord );
		Array.prototype.push.apply(blueprint.allfreqs, chord);
	});
	blueprint.allfreqs.sort(function(a, b) { return a - b; });
	blueprint.fonts = [	//" 'typewriterreport1942', Courier, Monaco, 'Courier New', monospace", 
			//" 'paintsplatter', Symbol, Wingdings, 'Zapf Dingbats', 'Arial Black' ",
			" 'Arial Black', Arial, sans ",
			" 'Courier', 'Courier New', 'Arial Bold',  Arial, sans ",
			"Monaco, 'Lucida Sans Unicode', 'Lucida Console', Monaco, monospace"
		];
	blueprint.soundclips = {
		bell1: {url: "/public/resources/bell1b.mp3"},
		bell2: {url: "/public/resources/bell2.mp3"},
		bell3: {url: "/public/resources/bell3.mp3"},
		bell4: {url: "/public/resources/bell4.mp3"},
		bell5: {url: "/public/resources/bell5.mp3"},
		bell6: {url: "/public/resources/bell6.mp3"},
		bell7: {url: "/public/resources/bell7.mp3"},
		bell8: {url: "/public/resources/bell8.mp3"},
		cellodrone1: {url: "/public/resources/cellodrone1b.mp3"},
		cellodrone2: {url: "/public/resources/cellodrone2b.mp3"},
		cellodrone3: {url: "/public/resources/cellodrone3.mp3"},
		cellodrone4: {url: "/public/resources/cellodrone4.mp3"},
		cellodrone5: {url: "/public/resources/cellodrone5.mp3"},
		cellodrone6: {url: "/public/resources/cellodrone6.mp3"},
	};
	blueprint.constants = {
		pi: Math.PI, duration: 48*60, maxelements: 0,
		pointerdown: "mousedown", pointerup: "mouseup", pointermove: "mousemove",
	};
	if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
	/* browser with either Touch Events of Pointer Events
	running on touch-capable device */
	}
	blueprint.coreblocks = ["navigation", "header", "film", "about", "widgets", "resources", "svgframe"];
	var appwidgets = ["telegraph", "grid", "count", "clock", "cloud", "broadcasts", "zebras", "leftterminal", "rightterminal", "crosshairs", "colorscreens", "circles", "vlines", "hlines", "pathpoints", "path", "sketches"];
	blueprint.widgets = [];
	appwidgets.forEach(function(x,j,array) {
		if(  document.querySelector("#"+x) ) {
			var nelements = document.querySelector("#"+x).childNodes.length;
			if( nelements > blueprint.constants.maxelements) blueprint.constants.maxelements = nelements;
			blueprint.widgets.push(x);
		}
	} );
	blueprint.routes = ["playfilm", "info"];
	
	blueprint.tools = buildtools( blueprint );
	blueprint.io = buildio( blueprint );
	blueprint.streams = buildstreams( blueprint );
	blueprint.actions = buildactions( blueprint );
	go( blueprint );
	document.querySelector("#resources").style["display"] = "none";
});

/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
/* build io
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
function buildio( blueprint ) {
	var io = {};
	io.dom = {};
	io.dom.coreblocks = {};
	io.dom.widgets = {};
	io.dom.routes = {};

	blueprint.coreblocks.forEach( function(x,j,array) {
		io.dom.coreblocks[x] = document.querySelector("#"+x);
	});
	blueprint.widgets.forEach( function(x,j,array) {
		var wrapper = document.querySelector("#"+x);
		var elements = Array.prototype.slice.call(document.querySelectorAll("."+x));
		//var elements = document.querySelectorAll("."+x);
		io.dom.widgets[x] = {};
		io.dom.widgets[x].name = x;
		io.dom.widgets[x].j = j;
		io.dom.widgets[x].wrapper = wrapper;
		io.dom.widgets[x].elements = elements;
		io.dom.widgets[x].number = elements.length;
		console.log("widget " + x + " = " + JSON.stringify(io.dom.widgets[x]));
	});
	blueprint.routes.forEach( function(x,j,array) {
		var route = document.querySelector("#"+x);
		//var elements = Array.prototype.slice.call(document.querySelectorAll("."+x));
		io.dom.routes[x] = {};
		io.dom.routes[x].name = x;
		io.dom.routes[x].el = route;
		console.log("route " + x + " = " + JSON.stringify(io.dom.routes[x]));
	});
	
	// ***** set sound ---------	
	if( blueprint.role !== "mobile") {
		io.sound = {};
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		io.sound.context = new AudioContext();
		io.sound.compressor = io.sound.context.createDynamicsCompressor();
		io.sound.compressor.threshold.value = -50;
		io.sound.compressor.knee.value = 40;
		io.sound.compressor.ratio.value = 12;
		io.sound.compressor.reduction.value = -20;
		io.sound.compressor.attack.value = 0;
		io.sound.compressor.release.value = 0.25;
		io.sound.gain = io.sound.context.createGain();
		io.sound.gain.gain.value = 0.4;
		io.sound.compressor.connect(io.sound.gain);
		io.sound.gain.connect(io.sound.context.destination);
		//hack to start sound on mobile ::: fix this
		io.sound.playnote = function(e) {
			var vco = blueprint.io.sound.context.createOscillator(); // vco : voltage-controlled oscillator
			vco.frequency.value = e.frequency;
			vco.type = "sine";
			var vca = blueprint.io.sound.context.createGain(); // vca : voltage-controlled gain 
			vco.connect(vca);
			//vca.connect(blueprint.io.sound.compressor);
			vca.connect(blueprint.io.sound.gain);
			var currenttime = blueprint.io.sound.context.currentTime;
			//fade in
			vca.gain.exponentialRampToValueAtTime(0.001, currenttime + e.delay);
			vca.gain.exponentialRampToValueAtTime(e.volume, currenttime + e.fadetime + e.delay);
			//fade out
			vca.gain.linearRampToValueAtTime(e.volume, currenttime + e.duration + e.delay - e.fadetime);
			vca.gain.linearRampToValueAtTime(0.001, currenttime + e.duration + e.delay);
			vco.start(currenttime + e.delay);
			vco.stop(currenttime + e.delay + e.duration + e.fadetime);
		};
		io.sound.playclip = function(e) {
			if(blueprint.soundclips[e.clip] && blueprint.soundclips[e.clip].buffer) {
				var source = blueprint.io.sound.context.createBufferSource();
				source.buffer = blueprint.soundclips[e.clip].buffer;
				var vca = blueprint.io.sound.context.createGain(); // vca : voltage-controlled gain 
				source.connect(vca);
				vca.connect(blueprint.io.sound.compressor);
				var currenttime = blueprint.io.sound.context.currentTime;
				vca.gain = e.volume;
				//fade out
				e.duration=source.buffer.duration;
				console.log(e.duration);
				source.start(currenttime + e.delay);
			}
		};
		
		var startsoundonmobile = function(){ io.sound.playnote( {frequency: 300, volume:0.4, duration:1, fadetime:0.1, delay: 0.0} ); window.removeEventListener("touchend", startsoundonmobile); };
		window.addEventListener("touchend", startsoundonmobile);
		// ***** load soundclips ---------
		Object.keys(blueprint.soundclips).forEach(function(key,j,array) {
			var clip = blueprint.soundclips[key];
			var request = new XMLHttpRequest();
			request.open("GET", clip.url, true);
			request.responseType = "arraybuffer";
			request.addEventListener("load", function() { 
				io.sound.context.decodeAudioData(request.response, function(buffer) {
					clip.buffer = buffer;
					console.log(buffer.duration)
					blueprint.io.sound.playclip({clip: blueprint.soundclips[key], volume:0.6, delay: 0.0});
				}, function(err){ console.log("sound buffer error " + err)} );
			});
			request.send();
		});
	}
	// ***** set telegraph ::: websocket connection ---------
	io.telegraph = { ws: null, open: false };
		var host = window.document.location.host.replace(/:.*/, '');
		var port = window.document.location.port;
		io.telegraph.ws = new WebSocket('ws://' + host + ':' + port);
		io.telegraph.ws.onopen = function() { io.telegraph.open = true; };
		io.telegraph.ws.onclose = function() { io.telegraph.open = false; };

	return io;
}
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
/* build core streams
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
function buildstreams( blueprint ) {
	var streams = {};
	Object.keys(blueprint.io.dom.routes).forEach( function(x,j,array) {
		var route = blueprint.io.dom.routes[x];
		console.log("route :: " + route.el.getAttribute("id"));
		streams[route.name + "route"] = {
			build: function( blueprint ) { 
				return Kefir.merge([ Kefir.fromEvents(route.el, "click"), Kefir.fromEvents(route.el, "touchstart").map(function(e) { e.preventDefault(); return e }) ])
					.scan( function(state, e) { state.count = state.count + 1; return state }, { count: 0, route: route }  ).log();
			},
			stream: null,
		};
	});

	streams["log"] = {
		// form ::: { telegram: {data: "¡ h 3 l l 0 ¡", type: "note", hashtags: "logpool"} },
		build: function( blueprint ) { return Kefir.pool( ); },
		stream: null,
	};
	streams["frequency"] = {
		// form ::: { frequency: 380, volume: 0.4, duration: 1.0, fadetime: 0.2, delay: 0.1},
		build: function( blueprint ) { return Kefir.pool( ); },
		stream: null,
	};
	streams["soundclip"] = {
		// form ::: { clip: "clang1", volume: 0.4, duration: 1.0, fadetime: 0.2, delay: 0.1},
		build: function( blueprint ) { return Kefir.pool( ); },
		stream: null,
	};
	streams["telegraphpostoffice"] = {
		// form ::: telegram:{ data: "! h Є L Ƚ Ͽ ¡", type: "text", hashtags: "machine", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}
		build: function( blueprint ) { return Kefir.pool( ); },
		stream: null,
	};
	streams["clock"] = {
		build: function( blueprint ) {
			var dt = 1000, start = new Date(), dtdt = 1000 * Math.floor(blueprint.constants.duration / 3), mod = 1, ticklength = 1;
			return Kefir.withInterval( dt, function(emitter) { 
				var d = new Date(); var t = d - start;
				if( t > blueprint.constants.duration*1000 ) start = new Date();
				/*
					mod = 1 + Math.floor( t / dtdt );
					if( Math.floor( t / 1000 )%mod === 0 ) emitter.emit( { d: d, ticklength: mod*1000 } );
				*/
				emitter.emit( { d: d, ticklength: 1000 } );
			})
			.scan( function(state, e){ state.count = state.count + 1; state.date = e.d; state.ticklength = e.ticklength; return state }, { count: 0, ticklength: dt, start: start, date: new Date() } );
		},
		stream: null,
	};
	streams["everyminute"] = {
		build: function( blueprint ) {
			return streams["clock"].stream.filter(function(x) { return ( x.date.getSeconds() > 60-x.dt-1 && x.date.getSeconds() < x.dt )}).throttle(4000)
				.scan( function(state, e){ state.count = state.count + 1; state.date = e.date; return state }, { count: 0, date: new Date() } );
		},
		stream: null,
	};
	streams["numbers"] = {
		build: function( blueprint ) {
			return streams["clock"].stream
				.scan( function(state, e){ state.count = state.count + 1; 
					state.numbers.forEach( function( value, index, array ) {
					var  r = Math.sin( array [index] ) * 1000;
					array[index] = r - Math.floor(r);
				}); return  state }, { count: 0, numbers: blueprint.seeds, length: blueprint.seeds.length } );
		},
		stream: null,
	};
	streams["windowresize"] = {
		build: function( blueprint ) {	
			var dt=400;	
			return Kefir.fromEvents(window, "resize").throttle(dt)
				.scan( function(state, e){ state.count = state.count + 1; state.width = window.innerWidth; state.height = window.innerHeight; return state }, { width: window.innerWidth, height: window.innerHeight, dt: dt, count: 0 } );
		},
		stream: null,
	};
	streams["xy"] = {
		build: function( blueprint ) {
			var numbers = blueprint.seeds, x = [], y = [];
			numbers.forEach( function(n,j,array) {
				x.push( 0 ); y.push( 0 );
			});
			return Kefir.combine( [ streams["numbers"].stream ], [ streams["windowresize"].stream ] )
				.scan( function(state, e){ state.count = state.count + 1; 
					state.x = []; state.y = [];
					e[0].numbers.forEach( function(n,j,numbers) {
						var x =  Math.floor(numbers[j] * e[1].width),  y =  Math.floor(numbers[(j+1)%numbers.length] * e[1].height);
						state.x.push( x ); state.y.push( y );
					});	
				return  state }, { count: 0, numbers: blueprint.seeds, x: x, y:y } );
		},
		stream: null,
	};
	streams["palette"] = {
		build: function( blueprint ) {
			var colors = [
				blueprint.colors.bw,
				blueprint.colors.industry,
				blueprint.colors.bw,
				blueprint.colors.circus,
				blueprint.colors.bw,
				blueprint.colors.industry,
				blueprint.colors.industrycolors,
				blueprint.colors.bw,
			];
			var fill = [ true, false, false, false, false, true, true, false, false, false, false, true, true];

			var dt = 10, duration = 18 * 60; //duration in clock ticks
			return streams["clock"].stream.filter(function(x){ return x.count % dt === 0 })
				.scan( function(state, e){ state.count = state.count + 1; 
					var intensity = state.intensity - e.count / duration;
					state.intensity =  intensity > 0.0 ? intensity : 1.0;
					state.colors = colors[ Math.floor(state.intensity * (colors.length-1)) ];
					state.fill = fill[ Math.floor(state.intensity * (fill.length-1)) ];
					state.stroke = !state.fill;
					state.ticklength = e.ticklength;
					state.font = blueprint.fonts [ e.count / duration % blueprint.fonts,length ];
				state.ncolors = state.colors.length;
				return  state }, { count: 0, colors: blueprint.colors.industry, fill: true, font: blueprint.fonts[0], stroke: false, ticklength: 1000, ncolors: blueprint.colors.industry.length, intensity: 1.0, dt: dt, duration: duration } );
		},
		stream: null,
	};
	streams["pointerdown"] = {
		build: function( blueprint ) {
			return Kefir.fromEvents( blueprint.io.dom.coreblocks["widgets"], "pointerdown" ).map(function(e) { e.preventDefault(); return { x: e.clientX-20, y: e.clientY-20 } })
				.scan( function(state, e){ state.count = state.count + 1; state.x = e.x; state.y = e.y; return state }, { x:0, y:0, count: 0 } ).log();
		},
		stream: null,
	};
	streams["pointerup"] = {
		build: function( blueprint ) {
			return Kefir.fromEvents( blueprint.io.dom.coreblocks["widgets"], "pointerup" )
				.scan( function(state, e){ state.count = state.count + 1; state.e = e; return state }, { count: 0 } );
		},
		stream: null,
	};
	streams["pointermove"] = {
		build: function( blueprint ) {
			var dt=400;
			return Kefir.fromEvents( blueprint.io.dom.coreblocks["widgets"], "pointermove" ).throttle(dt).map(function(e) { return { x: e.clientX-20, y: e.clientY-20 } })
				.scan( function(state, e){ state.count = state.count + 1; state.x = e.x; state.y = e.y; return state }, { x:0, y:0, dt: dt, count: 0 } );
		},
		stream: null,
	};
	streams["swipe"] = {
		build: function( blueprint ) {
			return streams["pointerdown"].stream.flatMap(
				function(downevent) {
					return streams["pointermove"].stream.takeUntilBy(streams["pointerup"].stream)
						.diff(
							function(prevevent, nextevent) {
								return { dx: nextevent.x - prevevent.x, dy: nextevent.y - prevevent.y };
							}, downevent).last();
				}
			).scan( function(state, e){ state.count = state.count + 1; state.dx = e.dx; state.dy = e.dy; return state }, { dx:0, dy:0, count: 0 } );
		},
		stream: null,
	};
	streams["leftswipe"] = {
		build: function( blueprint ) { 
			return streams["swipe"].stream.filter(function(e){ return e.dx < -60 })
			.scan( function(state, e){ state.count = state.count + 1; state.dx = e.dx; state.dy = e.dy; return state }, { dx:0, dy:0, value: -1, count: 0 } );
		},
		stream: null,
	};
	streams["rightswipe"] = {
		build: function( blueprint ) { 
			return streams["swipe"].stream.filter(function(e){ return e.dx > 60 })
			.scan( function(state, e){ state.count = state.count + 1; state.dx = e.dx; state.dy = e.dy; return state }, { dx:0, dy:0, value: 1, count: 0 } );
		},
		stream: null,
	};
	streams["swipes"] = {
		build: function( blueprint ) { return Kefir.merge( [ streams["leftswipe"].stream, streams["rightswipe"].stream ] ) },
		stream: null,
	};
	/*
	streams["watchposition"] = {
		build: function( blueprint ) {
			return Kefir.stream(function(emitter) {
				navigator.geolocation.watchPosition(emitter.emit, emitter.error, {timeout:60000, maximumAge:1000, enableHighAccuracy:true});})
					.scan( function(state, e){ state.position.latitude = e.coords.latitude; state.position.longitude = e.coords.longitude; state.count = state.count + 1; return state }, { position:blueprint.defaultposition, count: 0 } );
		},
		stream: null,
	};
	*/
	streams["autopointerdown"] = {
		build: function( blueprint ) {
			var dt = 19;
			return streams["xy"].stream.filter(function(x){ return x.count % dt === 0 })
				.scan( function(state, e){ state.count = state.count + 1; state.x = e.x[0]; state.y = e.y[0]; return state }, { x:0, y:0, dt: dt, count: 0 } ); 
		},
		stream: null,
	};
	streams["telegram"] = { // ***** websocket telegram stream ---------
		build: function( blueprint ) {
			return Kefir.fromEvents( blueprint.io.telegraph.ws, "message")
				.scan( function(state, e){ 
			  		state.count = state.count = state.count + 1; state.telegram = JSON.parse(e.data); return state }, { telegram: { data: "test test", type: "text", hashtags: "machine", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}, count: 0 } );
		},
		stream: null,
	};
	streams["telegraphnewsreel"] = { 
		output: { entries: [], number: 0, count: 0 },
		build: function( blueprint ) {
			var number = blueprint.io.dom.widgets["leftterminal"].number, entries = [];
			return streams["telegram"].stream.filter(function(x){ return x.telegram.type==="text"} )
				.scan( function(state, e){ 
					if(state.entries.length > state.number) state.entries = [];
					state.entries.unshift( { hashtags: e.telegram.hashtags, data: e.telegram.data } );
			  		state.count = state.count = state.count + 1; return state }, { entries: [], number: number, count: 0 } ).filter(function(x) { return x.entries.length === x.number});
		},
		stream: null,
	};
	streams["telegraphwriterkeyup"] = {
		build: function( blueprint ) {
			var dt = 18, el = blueprint.io.dom.widgets["telegraph"].elements[0];
			return Kefir.fromEvents(el, "keyup").map(function(e) { return e.keyCode; })
				.scan( function(state, e){ 
					streams["frequency"].stream.plug(Kefir.constant( { frequency: 80 + e*4, volume: 0.3, duration: .38, fadetime: 0, delay: 0 } ));
					state.keycode = e; state.count = state.count + 1; return state }, { el: el, keycode:0, count: 0, dt: dt } );

			if(blueprint.role !== "mobile") { el.setAttribute("readonly", "true"); }
		},
		stream: null,
	};
	streams["autotelegraphwriterkeyup"] = {
		build: function( blueprint ) {
			var dt = 28 + blueprint.tools.randominteger(0, 18), el = blueprint.io.dom.widgets["telegraph"].elements[0];
			var texts = [];
			var sources = document.querySelectorAll(".helloworld");
			for (var j = 0; j < sources.length; ++j) {
				var text = sources[j].textContent;
				texts.push(text.split(""));
			}
			return streams["clock"].stream.filter(function(x){ return x.count % dt === 0 }).flatMap(function(x) {
				el.style["color"] = blueprint.colors.bw[x.count/dt % blueprint.colors.bw.length];
				var text = texts[blueprint.tools.randominteger(0, texts.length)].concat("13");
				return Kefir.sequentially( Math.floor( 200 ), text );
			}).scan( function(state, e){ 
				el.value = el.value + e;
				streams["frequency"].stream.plug(Kefir.constant( { frequency: 80 + e.charCodeAt(0)*4, volume: 0.3, duration: .4, fadetime: 0, delay: 0 } ));
				state.keycode = e; state.count = state.count + 1; return state }, { el: blueprint.io.dom.widgets["telegraph"].elements[0], keycode:0, count: 0, dt: dt } );
		},
		stream: null,
	};
	streams["telegraphpost"] = {
		build: function( blueprint ) { 
			var dt = 38, delay = Math.floor( 1000 * dt / 10 );
			return Kefir.merge([streams["telegraphwriterkeyup"].stream, streams["autotelegraphwriterkeyup"].stream ]).filter( function(e) { return e.keycode == "13" && e.el.value != "" } )
				.scan( function(state, e){ state.keycode = e.keycode; state.count = state.count + 1; state.telegram.time=new Date(); state.telegram.data=e.el.value.replace("13", ""); e.el.value=""; return state }, { name: "telegraphpost", telegram: {data: "¡ h 3 l l 0 ¡", type: "text", hashtags: "telegraph", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}, count: 0 } );
		},
		stream: null,
	};
	/*
	streams["autotelegraphpost"] = {
		build: function( blueprint ) { 
			var dt = 38 + blueprint.tools.randominteger(0, 18), delay = Math.floor( 1000 * dt / 10 );
			var texts = [];
			var sources = document.querySelectorAll(".zero");
			var length = sources.length;
			var source0 = blueprint.tools.randominteger(0, length);
			for (var j = source0; j < length + source0; ++j) {
				var text = sources[ j%length ].textContent;
				Array.prototype.push.apply(texts, text.split("|||"));
			}
			return streams["clock"].stream.filter(function(x){ return x.count % dt === 0 })
				.scan( function(state, e){ state.telegram.time = e.date; 
					state.count = state.count + 1; 
					var text = texts[state.count%texts.length];
					state.telegram.data = "reader #" + blueprint.clientnumber + " ::: <br/>" + text; 
					state.telegram.hashtags = "z Є R Ø"; 
					return state }, { dt: dt, telegram: { data: "auto telegram ::: xxxøøø", type: "text", hashtags: "auto", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}, count: 0 } );
		},
		stream: null,
	};
	*/
	streams["crosshairstelegraphpost"] = {
		build: function( blueprint ) { 
			var dt = 38, delay = Math.floor( 1000 * dt / 10 );
			var texts = [];
			var sources = document.querySelectorAll(".helloworld");
			for (var j = 0; j < sources.length; ++j) {
				texts.push( sources[j].textContent );
			}
			return Kefir.combine( [ streams["pointerdown"].stream.throttle(400) ], [ streams["windowresize"].stream ] )
				.scan( function(state, e){ state.telegram.time = e.date; 
					state.count = state.count + 1; 
					state.text = texts[ blueprint.tools.randominteger(0, texts.length) ];
					state.telegram.data = {x: e[0].x/e[1].width, y: e[0].y/e[1].height}; 
					return state }, { dt: dt,  text: "¡ hellº wørlƉ !", telegram: { data: {x:0, y:0}, type: "data", hashtags: "crosshairs", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}, count: 0 } );
		},
		stream: null,
	};
	
	streams["telegraphposts"] = {
		build: function( blueprint ) { 
			return Kefir.merge([streams.telegraphpost.stream, streams.crosshairstelegraphpost.stream])
				.scan( function(state, e){ state.telegram=e.telegram; state.count = state.count + 1; return state }, { telegram:{ data: "! h Є L Ƚ Ͽ ¡", type: "text", hashtags: "machine", time: new Date(), _id: blueprint._id, clientnumber: blueprint.clientnumber}, count: 0 } );
		},
		stream: null,
	};
	streams["count"] = {
		build: function( blueprint ) {
			var dt = 33, delay = 1000, maxlength=0, mindx=1000;
			var texts = [];
			texts.push(["z3r0", "1", "twø", "3", "4", "f1vE", "6", "7", "eiGht","9", "teN"]);
			texts.push(["0", "1", "2", "3", "4", "5", "6", "7", "8","9", "10"]);
			texts.push(["ʘ", "i", "Ͽ", "ð", "i", "ȫ", "?", "z", "Є", "R", "Ø", "i", "ϕ", "Ø","Ͽ", "x"]);
			var text = [];
			[0,1,2,3,4,5,6,7,8,9].forEach(function(x,j,array) {
				text.push(blueprint.tools.translation.utftobinary(x));
			});
			texts.push(text);
			texts.forEach(function(t,j,array) {
				if(t.length>maxlength) {
					maxlength = t.length;
				}
			});
			mindx = Math.floor(1000*dt / maxlength);
			return streams["clock"].stream.filter(function(x){ return x.count % dt === 0 }).flatMap(function(x) {
				var text = texts[x.count/dt%texts.length].concat(". . .");
				var dx = Math.floor( 680*dt / text.length );
				return Kefir.sequentially( dx, text );
			}).scan( function(state, e){ state.text = e; state.count = state.count + 1; return state }, { text:". . .", count: 0, dx: 2000, mindx: mindx, dt: dt } );
		},
		stream: null,
	};
	streams["lettersfalling"] = {
		build: function( blueprint ) {
			var dt0 = 80, dtnoise = 100, delay0 = 200, delaynoise = 400;
			var texts = [], seq = [], min=1000, max=1;
			var filler = ["•", ".", "ø", "+", "i", "•", "||", "‰", "•", "Ͽ", "ø", "∞", "i", "~", "•", "ª", "¡", "•", "ϕ", "ø", "i", "•", "•", ".", "ø", "∞", "i", "•", "ª", "¡","@", "¢", "∞", "§", "¶", "•", "≥", "≤", "µ", "√", "ç", "≈", "∂", "Ω", "∂", "ƒ", "˚", "å", ".", "¥", "π", "£", "¡", "Ø", "_", "-", "+"];
			var silence = "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||".split("");
			var sources = document.querySelectorAll(".machine");
			var ntexts = sources.length, maxlength = 0;
			for (var j = 0; j < ntexts; ++j) {
				var text = sources[j].textContent;
				var letters = [];
				text.split("").forEach(
					function(value, index, array) {
						if(value !== " ") letters.push(value);
						else letters.push("_");
					}
				);
				if( letters.length > maxlength) { maxlength = letters.length; }
				texts.push ( letters );
			}
			texts.forEach(function(x,j,array) {
				if( texts[j].length < maxlength / 2) {
					texts[j].push.apply(texts[j], texts[j]);
				}
				for(var k=texts[j].length; k<maxlength; ++k) {
					texts[j].push(filler[blueprint.tools.randominteger(0, filler.length)]);
				}
				seq.push.apply(seq, texts[j]);
				seq.push.apply(seq, silence);
			});
			seq.forEach(function(x,j,a) {
				var c = x.charCodeAt(0);
				if(c > max) max = c;
				if(c < min) min = c;
			});
			
			return Kefir.repeat( function(iteration) {
				var dt = dt0 + blueprint.tools.randominteger(0, dtnoise), delay = iteration*delay + blueprint.tools.randominteger(0, delaynoise );
				return Kefir.sequentially( dt , seq ).filter( function(x) { return x !== "|"} ).delay(delay)
				.scan( function(state, e){ state.text = e; state.count = state.count + 1; return state }, { text:"|", count: 0, min: min, max: max, iteration: iteration, dt: dt } );
			});
		},
		stream: null,
	};
	Object.keys(streams).forEach(function(key,j,array) {
		streams[key].stream = streams[key].build( blueprint );
	});
	return streams;
}

/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
/* build actions
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
function buildactions( blueprint ) {
	actions = {};
	actions["inforoute"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.coreblocks["about"];
		return {
			description: { name: "inforoute", graffiti: "?? i N f Ø >>" },
			stream: blueprint.streams["inforoute"].stream,
			widget: widget,
			f: function(e) {
				blueprint.io.dom.coreblocks["film"].style["display"] = "none";
				blueprint.io.dom.coreblocks["about"].style["display"] = "block";
			},
		}
	};
	actions["playfilmroute"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.coreblocks["film"];
		return {
			description: { name: "playfilmroute", graffiti: ">> p L a Y >>" },
			stream: blueprint.streams["playfilmroute"].stream,
			widget: widget,
			f: function(e) {
				blueprint.io.dom.coreblocks["about"].style["display"] = "none";
				blueprint.io.dom.coreblocks["film"].style["display"] = "block";
			},
		}
	};
	actions["clock"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["clock"];
		return {
			description: { name: "clock", graffiti: "<< t 1 c K >>" },
			stream: blueprint.streams["clock"].stream,
			widget: widget,
			f: function(e) {
				var hour = (e.date.getHours() < 10 ? "0" + e.date.getHours() : e.date.getHours());
				var minute = (e.date.getMinutes() < 10 ? "0" + e.date.getMinutes() : e.date.getMinutes());
				var second = (e.date.getSeconds() < 10 ? "0" + e.date.getSeconds() : e.date.getSeconds()); 
				widget.elements[0].innerHTML = hour + ":" + minute + ":" + second;
				//widget.elements[0].innerHTML = minute + ":" + second;
				//widget.elements[0].innerHTML = "::: " + Math.floor( e.date.getTime()/1000 ) + " :::";
			},
		}
	};
	actions["count"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["count"];
		return {
			description: { name: "count", graffiti: "||||| ØØØ #thecount ØØØ |||||" },
			stream: blueprint.streams["count"].stream,
			widget: widget,
			f: function(e) {
				var k = e.count % widget.elements.length; 
				widget.elements[k].style["font-size"] = Math.floor(100 / e.text.length) + "vmin";
				widget.elements[k].style["color"] = blueprint.colors.bw[ blueprint.tools.randominteger(0, 3) ];
				widget.elements[k].innerHTML = e.text;
				Velocity({	
					elements: widget.elements[k],
					properties: { opacity: 1.0, scaleY: 4 },
					options: { duration: Math.floor(e.mindx*.6), delay: 0,  easing: "swing"}
				});
				Velocity({	
					elements: widget.elements[k],
					properties: { opacity: 0.0, scaleY: 0 },
					options: { duration: Math.floor(e.mindx*.6), delay: 0,  easing: "swing" }
				});
			},
		}
	};
	actions["rightterminal"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["rightterminal"];
		return {
			description: { name: "rightterminal", graffiti: " - -  > t E r m 1 N a L -- >" },
			stream: Kefir.combine( [ blueprint.streams["lettersfalling"].stream], [blueprint.streams["palette"].stream] ),
			widget: widget,
			f: function(e) {
				var ndisplayed = 8, fontsize = Math.floor(100 / ndisplayed ) + "vh";
				var el = widget.elements[e[0].count % widget.number];
				el.innerHTML = e[0].text;
				el.style["font-size"] = fontsize;
				el.style["color"] = blueprint.colors.bw[e[0].count%3];
				widget.wrapper.removeChild(el);
				widget.wrapper.insertBefore(el, widget.wrapper.firstChild);
				var frequency = 120 + Math.floor(    e[0].text.charCodeAt(0) *  ( 1800 - 80 )  /   (e[0].max - e[0].min)  );
				var volume = 0.5 - e[0].text.charCodeAt(0)*0.3/e[0].max;
				//volume = volume * (1-e[1].intensity) + 0.1;
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: frequency, volume: volume, duration: .2, fadetime: 0.0, delay: 0.0 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: frequency*2, volume: volume, duration: .2, fadetime: 0.0, delay: 0.0 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: e[0].text.charCodeAt(0)*2, volume: .2, duration: .1, fadetime: 0.0, delay: 0.0 } ));
				//blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: e.text.charCodeAt(0)*3 + 200, volume: 0.2, duration: .1, fadetime: 0.0, delay: 0.0 } ));
			},
		}
	};
	actions["everyminute"] = function(p) {
		var dt = 33;
		var widget = p.widget ? p.widget : blueprint.io.sound;
		return {
			description: { name: "rightterminal", graffiti: " - -  > t E r m 1 N a L -- >" },
			stream: blueprint.streams["clock"].stream.filter(function(x){ return x.count % dt === 0}),
			widget: widget,
			f: function(e) {
				blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "bell"+blueprint.tools.randominteger(0, 10), volume: 0.5, delay: 0 } ));
				blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "bell"+blueprint.tools.randominteger(0, 10), volume: 0.5, delay: 0.6 } ));
			},
		}
	};
	actions["leftterminal"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["leftterminal"];
		return {
			description: { name: "leftterminal", graffiti: " < - - t E r m 1 N a L < - -" },
			stream: blueprint.streams["telegraphnewsreel"].stream,
			widget: widget,
			input: { },
			f: function(e) {
				widget.wrapper.style["opacity"] = 0;
				widget.wrapper.style["font-family"] = blueprint.fonts[ blueprint.tools.randominteger(0, blueprint.fonts.length) ];
				e.entries.forEach( function(tweet, j, array) {
					var textentry = "<span class='marker black'> ++ " + tweet.hashtags + " ::: </span>"+ tweet.data;
					widget.elements[j].innerHTML = textentry;
				});
				blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "bell"+blueprint.tools.randominteger(0, 10), volume: 0.4, delay: 0 } ));
				blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "bell"+blueprint.tools.randominteger(0, 10), volume: 0.4, delay: 0.6 } ));

				Velocity({	
					elements: widget.wrapper,
					properties: {opacity: 1.0, rotateY: 0},
					options: { duration: 4000, delay: 0, loop: false, easing: "swing"}
				});
				Velocity({	
					elements: widget.wrapper,
					properties: {opacity: 0.0, rotateY: -20},
					options: { duration: 4000, delay: 3000, loop: false, easing: "swing"}
				});
				
			},
		}
	};
	actions["cloud"]  = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["cloud"];
		var width = widget.elements[0].width = window.innerWidth;
		var height = widget.elements[0].height = window.innerHeight;
		var r = 8, x=0, y=0;
		return {
			description: { name: "cloud", graffiti: "# ||| r  a D 1 Ø ::: x  ||| #" },
			stream: Kefir.combine([ blueprint.streams["telegram"].stream.filter(function(x){ return x.telegram.hashtags === "crosshairs"} ) ], [ blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				console.log("draw crosshairs!!");
				//var colors = ["38,38,38,", "68,68,68,"]; //http://hex.colorrrs.com/
				var colors = ["18,18,18,", "48,48,48,", "82,82,82,", "255,255,235,", ];
				var ctx = widget.elements[0].getContext("2d");
				x = e[0].telegram.data.x*e[1].width;
				y = e[0].telegram.data.y*e[1].height;
				width = widget.elements[0].width;
				height = widget.elements[0].height;
				if( x > width ) x = width - 8;
				if( y > height) y = height - 8;
				r = Math.max( blueprint.tools.randominteger(8, width*0.05), blueprint.tools.randominteger(8, height*0.05), 8);
				
				var a = Math.max(0.38, Math.random() );
				ctx.fillStyle = "rgba(" + colors[ blueprint.tools.randominteger(0,colors.length)] + a + ")";
				//ctx.fillStyle = colors[Math.floor( Math.random()*colors.length )];
				//ctx.fillRect( x, y, 40, 40);
				//ctx.fillRect(x, y, r, r);
				//ctx.font = "28px sans";
  				//ctx.fillText(e[0].text.split("")[0], x, y);
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2.0*Math.PI, true);
				ctx.closePath();
				ctx.fill();
			},
		}
	};
	actions["cloudstorm"]  = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["cloud"];
		var width0 = widget.elements[0].width = window.innerWidth;
		var height0 = widget.elements[0].height = window.innerHeight;
		var dt = 88, n = 200, x=0, y=0, a = 1;
		return {
			description: { name: "cloud", graffiti: "# ||| c L ø u D ||| s T Ø r M::: x  ||| #" },
			stream: Kefir.combine([ blueprint.streams["clock"].stream.filter(function(x){ return x.count % dt === 0} ), blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				var colors = ["38,38,38,", "68,68,68,"];
				var ctx = widget.elements[0].getContext("2d");
				ctx.clearRect(0, 0, widget.elements[0].width, widget.elements[0].height );
				widget.elements[0].width = e[1].width;
				widget.elements[0].height = e[1].height;
				/*
				var ctx = widget.elements[0].getContext("2d");
				x = blueprint.tools.randominteger(0, e[1].width);
				y = blueprint.tools.randominteger(0, e[1].height);
				*/

				/*
				for(var j=0; j<n; ++j) {
					ctx.beginPath();
					a = Math.max(0.38, Math.random() );
					ctx.strokeStyle = "rgba(" + colors[ blueprint.tools.randominteger(0,colors.length)] + a + ")";
					ctx.lineWidth = blueprint.tools.randominteger(1, 8);
					ctx.moveTo( x, y);
					ctx.quadraticCurveTo(x, y + blueprint.tools.randominteger(0, e[1].height - y), x + blueprint.tools.randominteger(0, e[1].width-x), y);
					x = blueprint.tools.randominteger(0, e[1].width);
					y = blueprint.tools.randominteger(0, e[1].height);
					ctx.closePath();
					ctx.stroke();
				}
				*/
			},
		}
	};
	actions["crosshairs"]  = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["crosshairs"];
		return {
			description: { name: "crosshairs", graffiti: "# ||| r  a D 1 Ø ::: x  ||| #" },
			stream: Kefir.combine([ blueprint.streams["crosshairstelegraphpost"].stream ], [ blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				//var symbols = ["•", ".", "ø", "+", "i", "•", "||", "‰", "•", "Ͽ", "ø", "∞", "i", "~", "•", "ª", "¡", "•", "ϕ", "ø", "i", "•", "•", ".", "ø", "∞", "i", "•", "ª", "¡","@", "¢", "∞", "§", "¶", "•", "≥", "≤", "µ", "√", "ç", "≈", "∂", "Ω", "∂", "ƒ", "˚", "å", ".", "¥", "π", "£", "¡", "Ø", "_", "-", "+"];
				var colors = blueprint.colors["bw"];
				var k = e[0].telegram.clientnumber % widget.number; 
				x = e[0].telegram.data.x*e[1].width - 10;
				y = e[0].telegram.data.y*e[1].height - 10;
				//blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "bell"+blueprint.tools.randominteger(0, 10), volume: 0.4, delay: 0 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: 120 + (y*x/4)%800, volume: 0.2, duration: .8, fadetime: 0.5, delay: 0 } ));
				widget.elements[k].style["left"] = x + "px";
				widget.elements[k].style["top"] = y + "px";
				widget.elements[k].style["color"] = colors[ k % colors.length ];
				Kefir.sequentially( 120, e[0].text.split("") ).onValue(function(l){ widget.elements[k].textContent = l });
				//widget.elements[k].innerHTML = symbols[e[0].telegram.clientnumber%symbols.length];		
			},
		}
	};
	
	actions["broadcasts"]  = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["broadcasts"];
		var stagger = blueprint.tools.randominteger(0, 400) + 300, width = 800; 
		var colors = blueprint.colors["bw"], color = "#000000", x = 0, y = 0, k = 0;
		var datastr = "", duration = 2000;

		var pchoices = [ 	
				{action: function(e, el, text) { el.textContent = text }, p: [ { opacity: 1.0}, { opacity: 0.0 }] },
				{action: function(e, el, text) { el.textContent = text }, p: [{ opacity: 1.0,  scaleX: 2}, { scaleY: 2 }, { opacity: 0.0 }, { scaleX: 1, scaleY: 1} ]}
			];
		return {
			description: { name: "broadcasts", graffiti: "# ||| r  a D 1 Ø ||| #" },
			stream: Kefir.combine([ blueprint.streams["telegram"].stream.filter(function(x){ return (x.telegram.hashtags !== "crosshairs") } ).delay(stagger) ], [ blueprint.streams["palette"].stream, blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				colors = e[1].colors;
				k = e[0].count % widget.number; 
				x = blueprint.tools.randominteger(0, e[2].width*0.48);
				y = blueprint.tools.randominteger(0, e[2].height*0.38);
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: blueprint.chords[ e[0].count % blueprint.chords.length ][0], volume: 0.4, duration: 2, fadetime: 0.5, delay: 0 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: blueprint.chords[ e[0].count % blueprint.chords.length ][1], volume: 0.3, duration: 2, fadetime: 0.5, delay: .4 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: blueprint.chords[ e[0].count % blueprint.chords.length ][3], volume: 0.2, duration: 2, fadetime: 0.5, delay: .8 } ));
				widget.elements[k].style["left"] = x + "px";
				widget.elements[k].style["top"] = y + "px";
				width = blueprint.tools.randominteger(e[2].width*0.8, e[2].width*1.2);
				widget.elements[k].style["width"] = width + "px";
				widget.elements[k].style["max-width"] = width + "px";
				widget.elements[k].style["font-size"] = blueprint.tools.randominteger( 20, Math.max(e[2].width, e[2].height)*.68 )+ "px";
				widget.elements[k].style["font-family"] = blueprint.fonts[ blueprint.tools.randominteger(0, blueprint.fonts.length) ];
				color = colors[ k % colors.length ];
				if(color === "9a0000") color = "#ffffeb";
				widget.elements[k].style["color"] = colors[ k % colors.length ];
				duration = blueprint.tools.randominteger(1680, 2400);
				datastr = e[0].telegram.data; if(e[0].telegram.type==="data") datastr = JSON.stringify(e[0].telegram.data);
				//widget.elements[k].innerHTML = "<span class='marker black'> ++ " + e[0].telegram.hashtags + " ::: </span>"+ datastr;
				
				pchoices[ k%pchoices.length ].action(e[0], widget.elements[k], datastr);
				pchoices[ k%pchoices.length ].p.forEach(function(x,j,array) {
					Velocity({	
						elements: widget.elements[k],
						properties: x,
						options: { duration: duration, delay: 0, loop: false, easing: "easeInOutQuad"}
					});
				});
				/*
				Velocity({	
					elements: widget.elements[k],
					properties: p[ k%p.length ].p1,
					options: { duration: duration, delay: 0, loop: false, easing: "easeInOutQuad"}
				});
				Velocity({	
					elements: widget.elements[k],
					properties: p[ k%p.length ].p2,
					options: { duration: duration*0.8, delay: 1000, loop: false, easing: "easeOutQuart"}
				});
				Velocity({	
					elements: widget.elements[k],
					properties: p[ k%p.length ].p3,
					options: { duration: 100, delay: 0, loop: false, easing: "linear"}
				});
				*/
						
			},
		}
	};
	actions["grid"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["grid"];
		var dt = 14; if(blueprint.role==="mobile") dt=15;
		return {
			description: { name: "grid", graffiti: " < - - ||| g R 1 D ||| - - > " },
			stream: Kefir.combine([ blueprint.streams["clock"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["palette"].stream, blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				var n = Math.floor(Math.sqrt(widget.number)), dx = Math.floor( e[2].width / n ), dy = Math.floor( e[2].height / n );
				var pchoices = [ [{ opacity: 1.0 }, { opacity: 0.0 }], [{ opacity: 1.0, rotateX: 20 }, { opacity: 0.0, rotateX: 0 }], [{ opacity: 1.0, rotateY: 20 }, { opacity: 0.0, rotateY: 0 }], [{ opacity: 1.0 }, { opacity: 0.0 }], [{ opacity: 1.0, scaleX: 2 }, { opacity: 0.0, scaleX: 1 }] ]
				
				var color="#000000", x = 0, y = 0;
				for(var j = 0; j < widget.number; ++j) {
					color = e[1].colors[ Math.floor( ( j + e[0].count/dt ) % e[1].ncolors ) ];
					e[1].fill ? widget.elements[j].style["background-color"] = color : widget.elements[j].style["background-color"] = "transparent";
					if( e[1].stroke ) {
						widget.elements[j].style["border-width"] = "30px";
						widget.elements[j].style["border-style"] ="dotted";
						widget.elements[j].style["border-color"] = color;
					}
					else { widget.elements[j].style["border-style"] ="none"; }
					x = (j % n)*dx; y = Math.floor(j/n)*dy;
					widget.elements[j].style["width"] = dx + "px";
					widget.elements[j].style["height"] = dx + "px";
					widget.elements[j].style["left"] = x + "px";
					widget.elements[j].style["top"] = y + "px";
					var p = pchoices[ blueprint.tools.randominteger(0, pchoices.length)];
					Velocity({	
						elements: widget.elements[j],
						properties: p[0],
						//properties: { opacity: 1},
						options: { duration: Math.floor( dt*e[1].ticklength / 3.0 ), delay: blueprint.tools.randominteger(0, 800), loop: false, easing: "linear"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p[1],
						//properties: { opacity: 0},
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: blueprint.tools.randominteger(0, 800), loop: false, easing: "linear"}
					});
				}		
			},
		}
	};
	actions["zebras"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["zebras"];
		var dt = 21; if(blueprint.role==="mobile") dt=37;
		return {
			description: { name: "zebras", graffiti: "! ||| z E b R @ z ||| !" },
			stream: Kefir.combine([ blueprint.streams["clock"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["xy"].stream, blueprint.streams["palette"].stream ]),
			widget: widget,
			f: function(e) {
				var length = e[1].x.length, duration = Math.max(400 + blueprint.tools.randominteger(0, dt*1000 / 5.0), 8000);
				var p1= { opacity: 1.0, scaleX: 3 }, p2 = { opacity: 0.0, scaleX: 1 }; 
				var color="#000000";
				if(e[0].count/dt % 2 === 0) { 
					p1= { opacity: 1.0, rotateY: 48 }; p2 = { opacity: 0.0, rotateY: 0 }; 
				}
				
				for(var j = 0; j < widget.number; ++j) {
					color = e[2].colors[ Math.floor( ( j + e[0].count/dt ) % e[2].ncolors ) ];
					e[2].fill ? widget.elements[j].style["background-color"] = color : widget.elements[j].style["background-color"] = "transparent";
					if( e[2].stroke ) {
						widget.elements[j].style["border-width"] = "30px";
						widget.elements[j].style["border-style"] ="dotted";
						widget.elements[j].style["border-color"] = color;
					}
					else { widget.elements[j].style["border-style"] ="none"; }

					var x = 20 + Math.floor(e[1].x[ j % length ] *.9);
					widget.elements[j].style["width"] = Math.floor(e[1].x[ (j+2) % length ] *.3 + 4) + "px";
					widget.elements[j].style["left"] = x + "px";
					Velocity({	
						elements: widget.elements[j],
						properties: p1,
						options: { duration: Math.floor( dt*e[2].ticklength / 6.0 ), delay: 200*j, loop: false, easing: "linear"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p2,
						options: { duration: Math.floor( dt*e[2].ticklength / 7.0 ), delay: 200*j, loop: false, easing: "linear"}
					});
				}		
			},
		}
	};
	actions["colorscreens"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["colorscreens"];
		var dt = 15; if(blueprint.role==="mobile") dt=30;
		var color="#000000";
		var p1 = { opacity: 1.0, scaleX: 80 }, p2 = { opacity: 0.0, scaleX: 1 };
		return {
			description: { name: "colorscreens", graffiti: "# c0L0R screens #" },
			stream: Kefir.combine([ blueprint.streams["clock"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["xy"].stream, blueprint.streams["palette"].stream ]),
			widget: widget,
			f: function(e) {
				
				for(var j = 0; j < widget.number; ++j) {
					color = e[2].colors[ Math.floor( ( j + e[0].count/dt ) % e[2].ncolors ) ];
					e[2].fill ? widget.elements[j].style["background-color"] = color : widget.elements[j].style["background-color"] = "transparent";
					if( e[2].stroke ) {
						widget.elements[j].style["border-width"] = "30px";
						widget.elements[j].style["border-style"] ="dotted";
						widget.elements[j].style["border-color"] = color;
					}
					else { widget.elements[j].style["border-style"] ="none"; }
					
					if(e[0].count % 2 === 0) { widget.elements[j].style["width"] = "4vw"; widget.elements[j].style["height"] = "100vh"; widget.elements[j].style["left"] = Math.floor( 8+e[1].x[j]*.8 ) + "px"; widget.elements[j].style["top"] = "0px" }
					else { p1= { opacity: 1.0, scaleY: 80 }; p2 = { opacity: 0.0, scaleY: 1 }; widget.elements[j].style["width"] = "100vw"; widget.elements[j].style["height"] = "4vh";  widget.elements[j].style["left"] = "0px"; widget.elements[j].style["top"] = Math.floor( 8+e[1].y[j]*.8 ) +"px" }
					Velocity({	
						elements: widget.elements[j],
						properties: p1,
						options: { duration: Math.floor( dt*e[2].ticklength / 6.0 ), delay: 300*j, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p2,
						options: { duration: Math.floor( dt*e[2].ticklength / 8.0 ), delay: 400*j, loop: false, easing: "swing"}
					});		
				}		
			},
		}
	};
	actions["sketches"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["sketches"];
		var dt = p.dt ? p.dt : 16;
		if(blueprint.role==="mobile") dt = 19;
		return {
			description: { name: "sketches", graffiti: "# paths ::: drawing ::: topologies ::: the path #" },
			stream: Kefir.combine([ blueprint.streams["xy"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["palette"].stream ]),
			widget: widget,
			f: function(e) {
				var numberpaths = widget.number, numberpoints = 3;
				var length = e[0].x.length, multiplier = .9, count = e[0].count / dt;
				for(var p=0; p<numberpaths; ++p) {
					var points = [];
					for(var j=0; j<numberpoints; ++j) {
						points.push({ x: e[0].x[(j+p)%length]*multiplier, y: e[0].y[(j+p)%length]*multiplier });
					}
					d = "M" + points[ 0 ].x + "," + points[ 0 ].y;
					d +=  " R" + points[ (1) % numberpoints ].x + "," + points[ (1) % numberpoints ].y;
					for(var j=2; j<numberpoints; ++j) {
						d += " " + points[ j ].x + "," + points[ j ].y;	
					}
					widget.elements[p].style.opacity = 0.0
					widget.elements[p].setAttributeNS(null, "stroke", e[1].colors[ p % e[1].ncolors ]);
					e[1].fill ? widget.elements[p].setAttributeNS(null, "fill", e[1].colors[ (p+1) % e[1].ncolors ]) : widget.elements[p].setAttributeNS(null, "fill", "none" );
					
					blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: blueprint.chords[count%blueprint.chords.length][p%4], volume: 0.3 + 0.1*e[1].intensity, duration: 1.8 + 0.6*e[1].intensity, fadetime: 0.2, delay: p*0.4 } ));
					blueprint.tools.curves.parsePath( widget.elements[p], d );
					var pathlength = widget.elements[p].getTotalLength();
					widget.elements[p].setAttributeNS(null, "stroke-dasharray", blueprint.tools.randominteger(10, pathlength*0.8 ));
					Velocity({	
						elements: widget.elements[p],
						properties: { opacity: 1, "stroke-dashoffset": pathlength  },
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: p*600, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[p],
						properties: { "stroke-dashoffset": 0  },
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: p*400, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[p],
						properties: { opacity: 0  },
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: 0, loop: false, easing: "swing"}
					});
				}
			},
		}
	};
	actions["circles"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["circles"];
		var dt = p.dt ? p.dt : 16;
		if(blueprint.role==="mobile") dt=18;
		var p1 = {opacity: 1.0}, p2 =  {opacity: 0.0};
		var color="#000000", x = 0, rmultiplier = 0.3;
		var pathlength = 100, r = 80;
		return {
			description: { name: "circles", graffiti: "# circles and lines chasing ::: circles #" },
			stream: Kefir.combine([ blueprint.streams["xy"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["palette"].stream ]),
			widget: widget,
			f: function(e) {
				var length = e[0].x.length;
				for(var j = 0; j < widget.number; ++j) {
					x = e[0].x[j%length], y = e[0].y[ (j+1)%length];
					color = e[1].colors[ Math.floor( ( j + e[0].count/dt ) % e[1].ncolors ) ];
					rmultiplier = (1.0-e[1].intensity)*0.3 + 0.3;
					r = 20 + Math.floor(e[0].y[ (j+3)%length ]*rmultiplier);

					e[1].fill ? widget.elements[j].setAttributeNS(null, "fill", color) : widget.elements[j].setAttributeNS(null, "fill", "none");
					if( e[1].stroke ) { 
						pathlength = blueprint.constants.pi * r * 2;
						widget.elements[j].setAttributeNS(null, "stroke-dasharray", blueprint.tools.randominteger(0, pathlength));
						widget.elements[j].setAttributeNS(null, "stroke", color); 
						widget.elements[j].setAttributeNS(null, "stroke-width", Math.floor(80*e[1].intensity + 10));
					}
					else { widget.elements[j].setAttributeNS(null, "stroke", "none"); }

					p1 = { opacity: 1.0, r: r, cx: x, cy: y }; p2 = { opacity: 0.0 };

					console.log("e[1].ticklength = " + e[1].ticklength + ", Math.floor( dt*e[1].ticklength / 4000 ) = " + Math.floor( dt*e[1].ticklength / 4000 ));
					Velocity({	
						elements: widget.elements[j],
						properties: p1,
						options: { duration: Math.floor( dt*e[1].ticklength / 4.0 ), delay: j*300, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p2,
						options: { duration: Math.floor( dt*e[1].ticklength / 6.0 ), delay: j*200, loop: false, easing: "linear"}
					});
				}		
			},
		}
	};
	actions["vlines"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["vlines"];
		var dt = p.dt ? p.dt : 16;
		if(blueprint.role==="mobile") dt=18;
		return {
			description: { name: "vlines", graffiti: "# circles and lines chasing ::: vlines #" },
			stream: Kefir.combine([ blueprint.streams["xy"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["palette"].stream, blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				var length = e[0].x.length;
				var color="#000000", x = 0, pathlength = e[2].height;;
				var p1 = { opacity: 1.0, x1: 0, x2: 0, y1: 0, y2: 0 }, p2 = { opacity: 0.0 };
				for(var j = 0; j < widget.number; ++j) {
					x = e[0].x[j%length];
					color = e[1].colors[ Math.floor( ( j + e[0].count/dt ) % e[1].ncolors ) ];
					widget.elements[j].setAttributeNS(null, "stroke", color); 
					widget.elements[j].setAttributeNS(null, "stroke-width", Math.floor(18*e[1].intensity + 10));
					if(e[1].intensity < 0.9) {
						widget.elements[j].setAttributeNS(null, "stroke-dasharray", blueprint.tools.randominteger(0, pathlength));
						p1 = { opacity: 1.0, x1: x, x2: x, y1: 0, y2: e[2].height }; p2 = { opacity: 0.0 };
					}
					else {
						widget.elements[j].setAttributeNS(null, "stroke-dasharray", pathlength);
						p1 = { opacity: 1.0, x1: x, x2: x, y1: 0, y2: e[2].height }; p2 = { opacity: 0.0 };
					}
					Velocity({	
						elements: widget.elements[j],
						properties: p1,
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: j*340, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p2,
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: j*200, loop: false, easing: "linear"}
					});
				}		
			},
		}
	};
	actions["hlines"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["hlines"];
		var dt = p.dt ? p.dt : 16;
		if(blueprint.role==="mobile") dt=18;
		return { 
			description: { name: "hlines", graffiti: "# circles and lines chasing ::: hlines #" },
			stream: Kefir.combine([ blueprint.streams["xy"].stream.filter(function(x){ return x.count % dt === 0 }) ], [ blueprint.streams["palette"].stream, blueprint.streams["windowresize"].stream ]),
			widget: widget,
			f: function(e) {
				var length = e[0].y.length;
				var color="#000000", y = 0, pathlength = e[2].width;
				var p1 = { opacity: 1.0, x1: 0, x2: 0, y1: 0, y2: 0 }, p2 = { opacity: 0.0 };
				for(var j = 0; j < widget.number; ++j) {
					y = e[0].y[j%length];
					color = e[1].colors[ Math.floor( ( j + e[0].count/dt ) % e[1].ncolors ) ];
					widget.elements[j].setAttributeNS(null, "stroke", color); 
					widget.elements[j].setAttributeNS(null, "stroke-width", Math.floor(18*e[1].intensity + 10));
					if(e[1].intensity < 0.9) {
						widget.elements[j].setAttributeNS(null, "stroke-dasharray", blueprint.tools.randominteger(0, pathlength));
						p1 = { opacity: 1.0, x1: 0, x2: e[2].width, y1: y, y2: y }; p2 = { opacity: 0.0 };
					}
					else {
						widget.elements[j].setAttributeNS(null, "stroke-dasharray", pathlength);
						p1 = { opacity: 1.0, x1: 0, x2: e[2].width, y1: y, y2: y }; p2 = { opacity: 0.0 };
					}
					Velocity({	
						elements: widget.elements[j],
						properties: p1,
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: j*300, loop: false, easing: "swing"}
					});
					Velocity({	
						elements: widget.elements[j],
						properties: p2,
						options: { duration: Math.floor( dt*e[1].ticklength / 5.0 ), delay: j*240, loop: false, easing: "linear"}
					});
				}				
			},
		}
	};
	actions["pathpoints"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["pathpoints"];
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return { 
			description: { name: "pathpoints", graffiti: "# paths ::: drawing ::: topologies ::: pathpoints #" },
			stream: Kefir.combine( [ Kefir.merge( [ blueprint.streams["pointerdown"].stream, blueprint.streams["autopointerdown"].stream ]) ], [ blueprint.streams["palette"].stream ] ),
			widget: widget,
			f: function(e) {
				var circle = widget.elements[ e[0].count % widget.number ], r0 = 13 + ( e[1].intensity * 8 );
				var color = e[1].colors[ Math.floor( ( e[0].count ) % e[1].ncolors ) ]; 
				//circle.setAttributeNS( null, "fill", blueprint.colors.industry[ e[0].count % blueprint.colors.industry.length ] );
				circle.setAttributeNS( null, "fill", color );
				var freq = 120 + (e[0].x/4)%800;
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: freq, volume: 0.3, duration: 2, fadetime: 0.5, delay: 0 } ));
				blueprint.streams["frequency"].stream.plug(Kefir.constant( { frequency: freq * 4 / 3, volume: 0.3, duration: 2, fadetime: 0.5, delay: 0.4 } ));
				//blueprint.streams["soundclip"].stream.plug(Kefir.constant( { clip: "cellodrone"+blueprint.tools.randominteger(0, 7), volume: 0.4, delay: 0 } ));

				Velocity({	
					elements: circle,
					properties: { opacity: 1, cx: e[0].x, cy: e[0].y, r: Math.floor(r0 * 9)  },
					options: { duration: 1000, delay: 0, loop: false, easing: "swing"}
				});
				Velocity({	
					elements: circle,
					properties: { opacity: 1, r: r0  },
					options: { duration: 1000, delay: 40, loop: false, easing: "swing"}
				});	
			},
		}
	};
	actions["path"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.dom.widgets["path"];
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return { 
			description: { name: "path", graffiti: "# paths ::: drawing ::: topologies ::: the path #" },
			stream:  Kefir.merge( [ blueprint.streams["pointerdown"].stream, blueprint.streams["autopointerdown"].stream ] ),
			widget: widget,
			f: function(e) {
				var number = blueprint.io.dom.widgets["pathpoints"].number;
				if(!widget.points){ widget.points = [] }
				var points = widget.points;
				for(var j=widget.points.length; j<number; ++j) {
					widget.points.push({x:0,y:0});
				}
				widget.points[ e.count % number ] = { x: e.x, y: e.y };
				var start = (e.count + 1) % number;
				d = "M" + widget.points[ start ].x + "," + widget.points[ start ].y;
				d +=  " R" + widget.points[ (start + 1) % number ].x + "," + widget.points[ (start + 1) % number ].y;
				for(var j=2; j<number; ++j) {
					d += " " + widget.points[ (start + j) % number ].x + "," + widget.points[ (start + j) % number ].y;	
				}
				//widget.elements[0].setAttributeNS(null, "stroke", blueprint.colors.bw[ e.count  % blueprint.colors.bw.length ]);
				blueprint.tools.curves.parsePath( widget.elements[0], d );
				if(e.count % 2 === 0) { p1= { opacity: 1, rotateX: 20+blueprint.tools.randominteger(0, 90), "stroke-width": 21 }; p2 = { rotateX: 0 } }
				else { p1= { opacity: 1, rotateY: 20+blueprint.tools.randominteger(0, 90), "stroke-width": 21 }; p2 = { rotateY: 0 } }
				Velocity({	
					elements: widget.elements[0],
					properties: p1,
					options: { duration: 800, delay: 0, loop: false, easing: "swing"}
				});
				Velocity({	
					elements: widget.elements[0],
					properties: p2,
					options: { duration: 1000, delay: 40, loop: false, easing: "swing"}
				});
				Velocity({	
					elements: widget.elements[0],
					properties: {opaciyu: 0.1, "stroke-width": 8},
					options: { duration: 1000, delay: 40, loop: false, easing: "swing"}
				});
			},
		}
	};
	actions["telegraphposts"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.telegraph.ws;
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return {
			description: { name: "telegraphposts", graffiti: "> ( t E L e G r @ p H p 0 s T ) < :::" },
			stream: blueprint.streams["telegraphposts"].stream,
			widget: widget,
			f: function(e) {
				if( blueprint.io.telegraph.open ) {
					try {
			    			widget.send(JSON.stringify(e.telegram));
			    			blueprint.streams["log"].stream.plug(Kefir.constant({data: "> ( t E L e G r @ p H p 0 s T ) < :::"+JSON.stringify(e.telegram), type: "note", hashtags: "telegrampost"} ));
			    		}
					catch(err) { blueprint.streams["log"].plug(Kefir.constant({data: "error sending telegram post ::: " + e.telegram.data, type: "error", hashtags: "telegrampost"} )); }
				}	
			},
		}
	};
	actions["log"] = function(p) {
		var widget = p.widget ? p.widget : console;
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return {
			description: { name: "log", graffiti: "> ( l Ø g ::: s T r 3 @ M ) < :::" },
			stream: blueprint.streams["log"].stream,
			widget: widget,
			f: function(e) {
				widget.log( "> ( l Ø g ::: s T r 3 @ M ) < :::" + e.data );	
			},
		}
	};
	actions["frequency"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.sound;
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return {
			description: { name: "frequency", graffiti: "> f r 3 Q u e n c Y < :::" },
			stream: blueprint.streams["frequency"].stream,
			widget: widget,
			f: function(e) {
				widget.playnote(e);
			},
		}
	};
	actions["soundclip"] = function(p) {
		var widget = p.widget ? p.widget : blueprint.io.sound;
		var dt = p.dt ? p.dt : 1;
		if(blueprint.role==="mobile") dt=1;
		return {
			description: { name: "soundclip", graffiti: "> s Ø u N d < :::" },
			stream: blueprint.streams["soundclip"].stream,
			widget: widget,
			f: function(e) {
				widget.playclip(e);
			},
		}
	};
	return actions;
}

function go( blueprint ) {
	Object.keys(blueprint.io.dom).forEach(function(x,j,array) {
		console.log(x);
	});
	Object.keys(blueprint.streams).forEach(function(x,j,array) {
		console.log(x);
	});
	Object.keys(blueprint.actions).forEach( function(key,j,array) {
		var action = actions[key]({});
		console.log("creating action " + action.description.name + " ::: graffiti ::: " + action.description.graffiti); 
		if(action.widget && action.stream) { 
			action.stream.onValue( action.f );
		}
	});
	
	/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
	/* stream errors
	/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
	Object.keys(blueprint.streams).forEach( function(key,j,array) {
		blueprint.streams[key].stream.onError( function(e) { 
			blueprint.streams["log"].stream.plug(Kefir.constant({data: "ERROR !!!  ::: " + key + " ::: " + JSON.stringify(e), type: "error", hashtags: key} )); 
		})
	})

}


/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
/* tools
/* &#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&# */
function buildtools( blueprint ) {
	var tools = {};
	tools.mod = function(n, m) {
		return ((n % m) + m) % m;
	}
	tools.randominteger = function(min, max) {
		return Math.floor( min + Math.random()*(max-min));
	}
	tools.applycss = function(p) {
		if(p.el) {
			var j = p.j || 0, n = p.n || 1, css = p.css || {};
			//todoL check browser coverage for: Object.keys(attributes).forEach( function(key, j, array) { ...
			for (var key in css) {
				if (css.hasOwnProperty(key)) {
					if(typeof css[key] === "function") p.el.style[ key ] = css[key](j, n);
					else p.el.style[ key ] = css[key];
				}
			}
		}
		return p.el;
	};
	tools.applyattributes = function(p) {
		if(p.el) {
			var j = p.j || 0, n = p.n || 1, attributes = p.attributes || {};
			//todoL check browser coverage for: Object.keys(attributes).forEach( function(key, j, array) { ...
			for (var key in attributes) {
				if (attributes.hasOwnProperty(key)) {
					if(p.ns) { 
						if(typeof attributes[key] === "function") p.el.setAttributeNS( null, key, attributes[key](j, n) );
						else p.el.setAttributeNS( null, key, attributes[key] );
					}
					else {
						if(typeof attributes[key] === "function") p.el.setAttribute( key, attributes[key](j, n) );
						else p.el.setAttribute( key, attributes[key] );
					}
				}
			}
		}
		return p.el;
	};
	tools.consolelog = function(msg) {
		console.log(msg);
	};
	tools.makeelement = function( p ) {
		var el = p.ns ? document.createElementNS(p.ns, p.tag) : document.createElement(p.tag);
		if(p.ns) { 
			el.setAttributeNS( null, "class", p.classname );
			el.setAttributeNS( null, "id", p.name );
			el.setAttributeNS( null, "name", p.name );
		}
		else {
			el.setAttribute( "class", p.classname );
			el.setAttribute( "id", p.name );
			el.setAttribute( "name", p.name );
		}
		tools.applycss( { ns: p.ns, el: el, j:0, n:1, css: p.css } );
		tools.applyattributes( { ns: p.ns, el: el, j:0, n:1, attributes: p.attributes } );
		if( p.content ) { 
			if(typeof p.content === "function") el.innerHTML = p.content( 0, 1 );
			else el.innerHTML = p.content;
		};
		return el;
	},
	tools.sound = {};
	tools.curves = {};
	tools.curves.init =  function() {
		// find each path, to see if it has Catmull-Rom splines in it
		var pathEls = document.documentElement.getElementsByTagName("path");
		for (var p = 0, pLen = pathEls.length; pLen > p; p++) {
			var eachPath = pathEls[ p ];
			tools.curves.parsePath( eachPath, eachPath.getAttribute("d") );
		}	
	};
	tools.curves.parsePath = function( path, d ) {
		var pathArray = [];
		var lastX = "";
		var lastY = "";

	  	//var d = path.getAttribute( "d" );
		if ( -1 != d.search(/[rR]/) ) {
			// no need to redraw the path if no Catmull-Rom segments are found
			// split path into constituent segments
	    		var pathSplit = d.split(/([A-Za-z])/);
	    		for (var i = 0, iLen = pathSplit.length; iLen > i; i++) {
				var segment = pathSplit[i];
				// make command code lower case, for easier matching
				// NOTE: this code assumes absolution coordinates, and doesn't account for relative command coordinates
				var command = segment.toLowerCase()
				if ( -1 != segment.search(/[A-Za-z]/) ) {
					var val = "";
					if ( "z" != command ) {
		  				i++;
		  				val = pathSplit[ i ].replace(/\s+$/, '');
					}

	        				if ( "r" == command ) {
			 			// "R" and "r" are the a Catmull-Rom spline segment
						var points = lastX + "," + lastY + " " + val;
	          					// convert Catmull-Rom spline to BÃ©zier curves
						var beziers = tools.curves.catmullRom2bezier( points );
						//insert replacement curves back into array of path segments
						pathArray.push( beziers );
					} else {
						 // rejoin the command code and the numerical values, place in array of path segments
						pathArray.push( segment + val );
	          					// find last x, y points, for feeding into Catmull-Rom conversion algorithm
						if ( "h" == command ) {
							lastX = val;
						} else if ( "v" == command ) {
							lastY = val;
						} else if ( "z" != command ) {
							var c = val.split(/[,\s]/);
							lastY = c.pop();
							lastX = c.pop();
						}
					}
				}
			}
			// recombine path segments and set new path description in DOM
			path.setAttribute( "d", pathArray.join(" ") );
		}
	};
	tools.curves.catmullRom2bezier = function( points ) {
		// alert(points)
		points = points + "";
		var crp = points.split(/[,\s]/);
		var d = "";
		for (var i = 0, iLen = crp.length; iLen - 2 > i; i+=2) {
			var p = [];
			if ( 0 == i ) {
				p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
				p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
				p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
				p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
			} else if ( iLen - 4 == i ) {
				p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
				p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
				p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
				p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
			} else {
				p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
				p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
				p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
				p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
			}
			// Catmull-Rom to Cubic Bezier conversion matrix 
			//    0       1       0       0
			//  -1/6      1      1/6      0
			//    0      1/6      1     -1/6
			//    0       0       1       0
			var bp = [];
			bp.push( { x: p[1].x,  y: p[1].y } );
			bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
			bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
			bp.push( { x: p[2].x,  y: p[2].y } );

			d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";
		}
		return d;
	};
	tools.translation = {};
	tools.translation.utftobinary = function(data) {
		//array holds the initial set of un-padded binary results
		var binArray = []
		//the string to hold the padded results
		var datEncode = "";
		//encode each character in data to it's binary equiv and push it into an array
		for (i=0; i < data.length; i++) { binArray.push(data[i].charCodeAt(0).toString(2)); } 
		//loop through binArray to pad each binary entry. 
		for (j=0; j < binArray.length; j++) { 
			//pad the binary result with zeros to the left to ensure proper 8 bit binary
			var pad = padding_left(binArray[j], '0', 8); //append each result into a string 
			datEncode += pad + ' '; 
		} 
		//function to check if each set is encoded to 8 bits, pad the left with zeros if not. 
		function padding_left(s, c, n) { 
			if (! s || ! c || s.length >= n) {return s;}
			var max = (n - s.length)/c.length;
			for (var i = 0; i < max; i++) { s = c + s; } 
			return s; 
		} //print array of unpadded results in console 
		//console.log(binArray); //string of padded results in console 
		//console.log(datEncode); 
		return datEncode;
	};
	return tools;
}

