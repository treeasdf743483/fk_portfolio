/*JavaScript file clickable_canvas.js version.1.3.0 last modified 11/05/02
 * 
 * 前バージョンからの変更点??
 * バ�?ジョン1.2のバグを修正�?
 */

(function(jQuery) {
	var self, settings, ctx, shapes, uuReady, mouseover, mouseBtn, topmostShape, draggables,
		interval, updated, forEach, extend, proxy, isArray, isFunction, isObject,
		abs, sqrt, sin, cos, tan, atan, asin, acos, round, kappa, stopTimer, px, py, prevPx, prevPy, transitions;
	
	jQuery.fn.clickableCanvas = function(options) {
		self = this;
		settings = jQuery.extend({}, jQuery.fn.clickableCanvas.defaultOptions, options);
		
		return this.each(function(index) {
			var canvas = document.createElement('CANVAS'),
				offset = jQuery(this).offset();
			
			px = 0;
			py = 0;
			mouseover = false;
			mouseBtn = {
				left: false,
				center: false,
				right: false
			};
			
			if (settings.width == 'inherit') settings.width = jQuery(this).width();
			if (settings.height == 'inherit') settings.height = jQuery(this).height();
			
			jQuery(this).append(
				jQuery(canvas).attr({
					id: 'clickable_canvas',
					width: settings.width,
					height: settings.height
				})
				.css({
					position: 'absolute',
					left: 0,
					top: 0,
					zIndex: settings.zIndex
				})
			)
			.mousemove(function(e) {
				px = e.pageX - offset.left;
				py = e.pageY - offset.top;
			})
			.mousedown(function(e) {
				if (!jQuery.support.opacity) {
					if (e.button == 1) mouseBtn.left = true;
					else if (e.button == 4) mouseBtn.center = true;
					else if (e.button == 2) mouseBtn.right = true;
				}
				else {
					if (e.button == 0) mouseBtn.left = true;
					else if (e.button == 1) mouseBtn.center = true;
					else if (e.button == 2) mouseBtn.right = true;
				}
			})
			.mouseup(function(e) {
				if (!jQuery.support.opacity) {
					if (e.button == 1) mouseBtn.left = false;
					else if (e.button == 4) mouseBtn.center = false;
					else if (e.button == 2) mouseBtn.right = false;
				}
				else {
					if (e.button == 0) mouseBtn.left = false;
					else if (e.button == 1) mouseBtn.center = false;
					else if (e.button == 2) mouseBtn.right = false;
				}
			})
			.mouseover(function(e) {
				mouseover = true;
			})
			.mouseout(function(e) {
				mouseover = false;
			});
			
			jQuery(this).bind('contextmenu', function(event) {
				event.preventDefault();
			});
			
			if (!jQuery.support.opacity) {
				if (settings.flashCanvas && typeof FlashCanvas != 'undefined') {
					settings.uuCanvas = false;
					FlashCanvas.initElement(canvas);
					ctx = canvas.getContext('2d');
					setupCanvas();
				}
				else if (settings.uuCanvas && typeof uu != 'undefined') {
					settings.flashCanvas = false;
					uuReady = false;
					jQuery(canvas).addClass('svg silverlight flash vml');
					
					window.xcanvas = function(uu, canvasNodes) {
						ctx = canvasNodes[0].getContext('2d');
						setupCanvas();
						uuReady = true;
					};
				}
				else if (typeof G_vmlCanvasManager != 'undefined') {
					canvas = G_vmlCanvasManager.initElement(canvas);
					ctx = canvas.getContext('2d');
					setupCanvas();
				}
			}
			else {
				if (settings.uuCanvas && typeof uu != 'undefined') {
					uuReady = false;
					jQuery(canvas).addClass('svg silverlight flash vml');
					
					window.xcanvas = function(uu, canvasNodes) {
						ctx = canvasNodes[0].getContext('2d');
						setupCanvas();
						uuReady = true;
					};
				}
				else {
					ctx = canvas.getContext('2d');
					setupCanvas();
				}
			}
		});
	};
	
	jQuery.fn.clickableCanvas.defaultOptions = {
		width: 'inherit',
		height: 'inherit',
		zIndex: 1000,
		sensitivity: 100,
		flashCanvas: false,
		uuCanvas: false
	};
	
	jQuery.fn.clickableCanvas.defaultAttr = {
		shapeZIndex: 0,
		visibility: true,
		cursor: 'pointer',
		coordMode: 'absolute'
	};
	
	jQuery.fn.createShape = function(shape) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.createShape, this), shape), 500);
			return;
		}
		
		var image, initX, initY;
		shape = jQuery.extend({}, shape, {
			attr: jQuery.extend({}, jQuery.fn.clickableCanvas.defaultAttr, shape.attr),
			mouseDown: false,
			mouseOver: false,
			rightMouseDown: false,
			state: 'idle',
			normal: {},
			active: {},
			hover: {},
			animation: { state: 'idle' }
		});
		
		if (shape.image) {
			shape.image.offset = shape.image.offset || [0, 0];
			shape.image.interlocked = !!shape.image.interlocked;
			
			image = new Image();
			image.src = shape.image.url;
			shape.image.object = null;
			image.onload = function() {
				shape.image.object = image;
				updated = false;
			};
		}
		
		if (shape.attr.coordMode == 'relative') {
			initX = shape.coords[0].x;
			initY = shape.coords[0].y;
			shape.coords = jQuery.map(shape.coords, function(object, index) {
				if (index === 0) return { x: initX, y: initY };
				return { x: object.x + initX, y: object.y + initY };
			});
		}
		
		if (shape.gradient) addGradient(shape);
		if (shape.hoverGradient) addGradient(shape, 'hover');
		if (shape.activeGradient) addGradient(shape, 'active');
		
		shapes[shapes.length] = shape;
		shapes[shape.name] = shape;
		
		shapes.sort(function(a, b) {
			var za = a.attr.shapeZIndex,
				zb = b.attr.shapeZIndex;
			return za < zb ? -1 : za > zb ? 1 : 0;
		});
		
		normalShape(shape);
		renderShape(shape, shape.normal);
		
		return this;
	};
	
	jQuery.fn.deleteShape = function(name) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.deleteShape, this), name), 500);
			return;
		}
		
		var shape = isObject(name) ? name: shapes[name],
			sIndex = -1;
		
		jQuery.each(shapes, function(index, object) {
			if (object.name == shape.name) {
				sIndex = index;
				return false;
			}
		});
		
		if (sIndex > -1) shapes.splice(sIndex, 1);
		
		return this;
	};
	
	jQuery.fn.copyShape = function(original, copyname, prop) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.copyShape, this), original, copyname, prop), 500);
			return;
		}
		
		if (shapes[copyname]) return this;
		
		var original = shapes[original],
			copyShape = jQuery.extend(true, {}, original, prop),
			image, initX, initY;
		
		if (copyShape.image) {
			copyShape.image.offset = copyShape.image.offset || [0, 0];
			copyShape.image.interlocked = !!copyShape.image.interlocked;
			
			image = new Image();
			image.src = copyShape.image.url;
			copyShape.image.object = null;
			image.onload = function() {
				copyShape.image.object = image;
				updated = false;
			};
		}
		
		if (copyShape.attr.coordMode == 'relative') {
			initX = copyShape.coords[0].x;
			initY = copyShape.coords[0].y;
			copyShape.coords = jQuery.map(copyShape.coords, function(object, index) {
				if (index === 0) return { x: initX, y: initY };
				return { x: object.x + initX, y: object.y + initY };
			});
		}
		
		if (copyShape.gradient) addGradient(copyShape);
		if (copyShape.hoverGradient) addGradient(copyShape, 'hover');
		if (copyShape.activeGradient) addGradient(copyShape, 'active');
		
		copyShape.name = copyname;
		shapes.push(copyShape);
		shapes[copyname] = copyShape;
		
		shapes.sort(function(a, b) {
			var za = a.attr.shapeZIndex,
				zb = b.attr.shapeZIndex;
			return za < zb ? -1 : za > zb ? 1 : 0;
		});
		
		normalShape(copyShape);
		renderShape(copyShape, copyShape.normal);
		
		return this;
	};
	
	jQuery.fn.readyCanvas = function(userFunc) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.readyCanvas, this), userFunc), 500);
			return;
		}
		
		jQuery.proxy(userFunc, this)();
		updated = false;
	};
	
	jQuery.fn.getPropertyValue = function(name, propname) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.setProperty, this), name, propname), 500);
			return;
		}
		
		var shape = isObject(name) ? name: shapes[name];
		return shape[propname];
	};
	
	jQuery.fn.setPropertyValue = function(name, propname, propvalue) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.setProperty, this), name, propname, propvalue), 500);
			return;
		}
		
		var shape = isObject(name) ? name: shapes[name], image, initX, initY;;
		shape[propname] = propvalue;
		
		if (propname == 'coords' && shape.attr.coordMode == 'relative') {
			initX = shape.coords[0].x;
			initY = shape.coords[0].y;
			shape.coords = jQuery.map(shape.coords, function(object, index) {
				if (index === 0) return { x: initX, y: initY };
				return { x: object.x + initX, y: object.y + initY };
			});
		}
		if (propname == 'style' || propname == 'gradient') {
			normalShape(shape);
		}
		else if (propname == 'hoverStyle' || propname == 'hoverGradient') {
			hoverShape(shape);
		}
		else if (propname == 'activeStyle' || propname == 'activeGradient') {
			activeShape(shape);
		}
		
		if (propname == 'image') {
			shape.image.offset = shape.image.offset || [0, 0];
			shape.image.interlocked = !!shape.image.interlocked;
			
			image = new Image();
			image.src = shape.image.url;
			shape.image.object = null;
			image.onload = function() {
				shape.image.object = image;
				updated = false;
			};
		}
		updated = false;
		
		return propvalue;
	};
	
	jQuery.fn.setAttribute = function(name, attrName, attrValue) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.setProperty, this), name, attrName, attrValue), 500);
			return;
		}
		
		var shape = isObject(name) ? name: shapes[name];
		shape.attr[attrName] = attrValue;
		
		if (attrName == 'shapeZIndex') {
			shapes.sort(function(a, b) {
				var za = a.attr.shapeZIndex,
					zb = b.attr.shapeZIndex;
				return za < zb ? -1 : za > zb ? 1 : 0;
			});
		}
		updated = false;
		
		return this;
	};
	
	jQuery.fn.setProperties = jQuery.fn.setProperty = function(name, prop) {
		if (settings.uuCanvas && !uuReady) {
			setTimeout(curryTimerCallback(jQuery.proxy(this.setProperty, this), name, prop), 500);
			return;
		}
		
		var shape = isObject(name) ? name: shapes[name];
		shape = jQuery.extend(shape, prop);
		return prop;
	};
	
	jQuery.fn.animateShape = function(name, animation) {
		var shape = isObject(name) ? name: shapes[name],
			startcoord, endcoord, currentcoord, initX, initY;
		
		if (shape.animation.state == 'idle') {
			updated = false;
			if (animation.endcoord) {
				if (shape.attr.coordMode == 'relative') {
					if (animation.startcoord) {
						initX = animation.startcoord[0].x;
						initY = animation.startcoord[0].y;
						animation.startcoord = jQuery.map(animation.startcoord, function(object, index) {
							if (index === 0) return { x: initX, y: initY };
							return { x: object.x + initX, y: object.y + initY };
						});
					}
					if (animation.endcoord) {
						initX = animation.endcoord[0].x;
						initY = animation.endcoord[0].y;
						animation.endcoord = jQuery.map(animation.endcoord, function(object, index) {
							if (index === 0) return { x: initX, y: initY };
							return { x: object.x + initX, y: object.y + initY };
						});
					}
				}
				startcoord = animation.startcoord || ( isArray(shape.coords) ?
					jQuery.map(shape.coords, function(object, index) { return jQuery.extend({}, object); }) : jQuery.extend({}, shape.coords) );
				endcoord = animation.endcoord || startcoord;
				shape.animation.cc = stepAnim(
					shape,
					startcoord,
					endcoord,
					animation.duration || 1000,
					transitions[animation.transition] || transitions.linear
				);
			}
			if (animation.endcolor) {
				startcolor = animation.startcolor || {};
				shape.animation.ss = colorFading(
					shape,
					startcolor.strokeStyle || shape.normal.strokeStyle,
					animation.endcolor.strokeStyle,
					animation.duration || 1000,
					transitions[animation.transition] || transitions.linear
				);
				shape.animation.fs = colorFading(
					shape,
					startcolor.fillStyle || shape.normal.fillStyle,
					animation.endcolor.fillStyle,
					animation.duration || 1000,
					transitions[animation.transition] || transitions.linear
				);
				
				shape.animation.endcolor = animation.endcolor;
			}
			
			shape.animation.afterFinish = animation.afterFinish;
			shape.animation.state = 'running';
		}
		
		return this;
	};
	
	function addGradient(name, witch) {
		var shape = isObject(name) ? name: shapes[name], gradient, object,
			grad, startFrom, coords, co, rad, xs, ys, top, right, bottom, left, i, len;
		
		if (witch == 'hover') {
			gradient = shape.hoverGradient;
			object = shape.hover;
		}
		else if (witch == 'active') {
			gradient = shape.activeGradient;
			object = shape.active;
		}
		else {
			gradient = shape.gradient;
			object = shape.normal;
		}
		
		if (shape.type == 'circle' || shape.type == 'arc') {
			co = shape.coords;
			rad = sin(45 * Math.PI / 180);
			startFrom = gradient.startFrom;
			if (startFrom == 'top') coords =				[co.x, co.y - (co.r / 3 * rad), 0, co.x, co.y - (co.r / 3 * rad), co.r * (4 / 3)];
			else if (startFrom == 'right-top') coords =		[co.x + (co.r / 3 * rad), co.y - (co.r / 3 * rad), 0, co.x + (co.r / 3 * rad), co.y - (co.r / 3 * rad), co.r * (4 / 3)];
			else if (startFrom == 'right') coords =			[co.x + (co.r / 3 * rad), co.y, 0, co.x + (co.r / 3 * rad), co.y, co.r * (4 / 3)];
			else if (startFrom == 'right-bottom') coords =	[co.x + (co.r / 3 * rad), co.y + (co.r / 3 * rad), 0, co.x + (co.r / 3 * rad), co.y + (co.r / 3 * rad), co.r * (4 / 3)];
			else if (startFrom == 'bottom') coords =		[co.x, co.y + (co.r / 3 * rad), 0, co.x, co.y + (co.r / 3 * rad), co.r * (4 / 3)];
			else if (startFrom == 'left-bottom') coords =	[co.x - (co.r / 3 * rad), co.y + (co.r / 3 * rad), 0, co.x - (co.r / 3 * rad), co.y + (co.r / 3 * rad), co.r * (4 / 3)];
			else if (startFrom == 'left') coords =			[co.x - (co.r / 3 * rad), co.y, 0, co.x - (co.r / 3 * rad), co.y, co.r * (4 / 3)];
			else if (startFrom == 'left-top') coords =		[co.x - (co.r / 3 * rad), co.y - (co.r / 3 * rad), 0, co.x - (co.r / 3 * rad), co.y - (co.r / 3 * rad), co.r * (4 / 3)];
			else coords =									[co.x, co.y, 0, co.x, co.y, co.r];
			
			grad = ctx.createRadialGradient(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);
			
		}
		else {
			if (shape.type == 'line' || shape.type == 'lines' || shape.type == 'polygon') {
				xs = jQuery.map(shape.coords, function(value) { return value.x; });
				ys = jQuery.map(shape.coords, function(value) { return value.y; });
				
				top = arrayMin(ys);
				right = arrayMax(xs);
				bottom = arrayMax(ys);
				left = arrayMin(xs);
			}
			else if (shape.type == 'rect' || shape.type == 'round-rect') {
				top = shape.coords.y;
				right = shape.coords.x + shape.coords.w;
				bottom = shape.coords.y + shape.coords.h;
				left = shape.coords.x;
			}
			
			startFrom = gradient.startFrom;
			if (startFrom == 'left') coords = [left, top, right, top];
			else if (startFrom == 'top') coords = [left, top, left, bottom];
			else if (startFrom == 'left-top') coords = [left, top, right, bottom];
			else if (startFrom == 'right-top')  coords = [right, top, left, bottom];
			
			grad = ctx.createLinearGradient(coords[0], coords[1], coords[2] ,coords[3]);
		}
		
		for (i = 0, len = gradient.position.length; i < len; i++) grad.addColorStop(gradient.position[i], gradient.color[i]);
		
		object.gradStrokeStyle = gradient.strokeStyle || grad;
		object.gradFillStyle = grad;
		
	}
	
	function setupCanvas() {
		if (typeof ctx != 'undefined') {
			ctx.clearRect(0, 0, settings.width, settings.height);
			
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
			
			ctx.save();
			
			shapes = [];
			interval = 30;
			updated = false;
			
			topmostShape = null;
			draggables = [];
			forEach = jQuery.each;
			extend = jQuery.extend;
			proxy = jQuery.proxy;
			isArray = jQuery.isArray;
			isFunction = jQuery.isFunction;
			isObject = jQuery.isPlainObject;
			
			abs = Math.abs;
			sqrt = Math.sqrt;
			sin = Math.sin;
			cos = Math.cos;
			tan = Math.tan;
			atan = Math.atan;
			asin = Math.asin;
			acos = Math.acos;
			round = Math.round;
			kappa = 2 * Math.PI / 12;
			
			loop();
		}
	}
	
	function normalShape(name) {
		var shape = isObject(name) ? name: shapes[name],
			style = (shape.gradient || shape.style) || {},
			transparent = { strokeStyle: 'rgba(0,0,0,0)', fillStyle: 'rgba(0,0,0,0)' };
		
		shape.normal = extend(shape.normal, transparent, style);
		shape.state = 'idle';
	}
	
	function hoverShape(name) {
		var shape = isObject(name) ? name: shapes[name],
			transparent = { strokeStyle: 'rgba(0,0,0,0)', fillStyle: 'rgba(0,0,0,0)' };
		shape.hover = extend(shape.hover, transparent, (shape.hoverGradient || shape.hoverStyle));
		
		if (!shape.hoverGradient) {
			shape.hover.ss = colorFading(shape, shape.normal.strokeStyle, shape.hover.strokeStyle || shape.normal.strokeStyle,
				shape.hover.fadeSpeed || 300, transitions[shape.hover.transition] || transitions.linear);
			shape.hover.fs = colorFading(shape, shape.normal.fillStyle, shape.hover.fillStyle || shape.normal.fillStyle,
				shape.hover.fadeSpeed || 300, transitions[shape.hover.transition] || transitions.linear);
		}
		shape.state = 'hover';
	};
	
	function activeShape(name) {
		var shape = isObject(name) ? name: shapes[name],
			transparent = { strokeStyle: 'rgba(0,0,0,0)', fillStyle: 'rgba(0,0,0,0)' };
		shape.active = extend(shape.active, transparent, (shape.activeGradient || shape.activeStyle));
		shape.state = 'active';
	};
	
	function renderShape(name, style) {
		var shape = isObject(name) ? name: shapes[name],
			i, shapeLen, x, y, coords, start, end, anticlockwise, cx, cy, horizontal, ratio, st, et, ox, oy, ex, ey, mx, my;
		if (!shape.attr.visibility) return;
		
		ctx.save();
		
		ctx.lineWidth = style.lineWidth || 1;
		ctx.strokeStyle = style.gradStrokeStyle || style.strokeStyle;
		ctx.fillStyle = style.gradFillStyle || style.fillStyle;
		ctx.shadowBlur = style.shadowBlur || 0;
		ctx.shadowColor = style.shadowColor || 'rgba(0,0,0,0)';
		ctx.shadowOffsetX = style.shadowOffsetX || 0;
		ctx.shadowOffsetY = style.shadowOffsetY || 0;
		
		switch (shape.type) {
			case 'line':
			case 'lines':
				for (i = 0, shapeLen = shape.coords.length; i < shapeLen; i++) {
					coords = shape.coords[i];
					if (i === 0) {
						ctx.beginPath();
						ctx.moveTo(coords.x, coords.y);
					}
					else {
						ctx.lineTo(coords.x, coords.y);
					}
				}				
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? shape.coords[0].x : 0;
					y = shape.image.interlocked ? shape.coords[0].y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					ctx.stroke();
					ctx.restore();
				}
				
				if (shape.textStyle) drawText(shape, shape.coords[0]);
				
				break;
				
			case 'rect':
				ctx.beginPath();
				coords = shape.coords;
				
				ctx.rect(coords.x, coords.y, coords.w, coords.h);
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
				
			case 'round-rect':
				coords = shape.coords;
				
				ctx.beginPath();
				coords.lt ? ctx.moveTo(coords.x, coords.y) : ctx.moveTo(coords.x + coords.r, coords.y);
				
				ctx.lineTo(coords.x + coords.w - coords.r, coords.y);
				coords.rt ? ctx.lineTo(coords.x + coords.w, coords.y) : ctx.quadraticCurveTo(coords.x + coords.w, coords.y, coords.x + coords.w, coords.y + coords.r);
				ctx.lineTo(coords.x + coords.w, coords.y + coords.h - coords.r);
				coords.rb ? ctx.lineTo(coords.x + coords.w, coords.y + coords.h) : ctx.quadraticCurveTo(coords.x + coords.w, coords.y + coords.h, coords.x + coords.w - coords.r, coords.y + coords.h);
				ctx.lineTo(coords.x + coords.r, coords.y + coords.h);
				coords.lb ? ctx.lineTo(coords.x, coords.y + coords.h) : ctx.quadraticCurveTo(coords.x, coords.y + coords.h, coords.x, coords.y + coords.h - coords.r);
				ctx.lineTo(coords.x, coords.y + coords.r);
				coords.lt ? ctx.lineTo(coords.x, coords.y) : ctx.quadraticCurveTo(coords.x, coords.y, coords.x + coords.r, coords.y);
				ctx.closePath();
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
				
			case 'polygon':
				for (i = 0, shapeLen = shape.coords.length; i < shapeLen; i++) {
					coords = shape.coords[i];
					if (i === 0) {
						ctx.beginPath();
						ctx.moveTo(coords.x, coords.y);
					}
					else {
						ctx.lineTo(coords.x, coords.y);
					}
				}
				ctx.closePath();
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? shape.coords[0].x : 0;
					y = shape.image.interlocked ? shape.coords[0].y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, shape.coords[0]);
				
				break;
				
			case 'circle':
				coords = shape.coords;
				ctx.beginPath();
				
				ctx.arc(coords.x, coords.y, coords.r, 0, Math.PI * 2, false);
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
			
			case 'sector':
			case 'arc':
				coords = shape.coords;
				start = coords.start || 0;
				end = coords.add ? start + coords.add : coords.end || 360;
				anticlockwise = coords.anticlockwise || false;
				
				start = start * Math.PI / 180;
				end = end * Math.PI / 180;
				
				ctx.beginPath();
				ctx.moveTo(coords.x, coords.y);
				ctx.arc(coords.x, coords.y, coords.r, start, end, anticlockwise);
				
				ctx.closePath();
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
				
			case 'ellipse':
				coords = shape.coords;
				cx = coords.w / 2;
				cy = coords.h / 2;
				ox = cx * kappa;
				oy = cy * kappa;
				ex = coords.x + coords.w;
				ey = coords.y + coords.h;
				mx = coords.x + cx;
				my = coords.y + cy;
				
				ctx.beginPath();
				ctx.moveTo(coords.x, my);
				ctx.bezierCurveTo(coords.x, my - oy, mx - ox, coords.y, mx, coords.y);
				ctx.bezierCurveTo(mx + ox, coords.y, ex, my - oy, ex, my);
				ctx.bezierCurveTo(ex, my + oy, mx + ox, ey, mx, ey);
				ctx.bezierCurveTo(mx - ox, ey, coords.x, my + oy, coords.x, my);
				ctx.closePath();
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
				
			case 'ellipse-sector':
			case 'ellipse-arc':
				coords = shape.coords;
				cx = coords.w / 2;
				cy = coords.h / 2;
				horizontal = cx >= cy;
				ratio = horizontal ? cy / cx : cx / cy;
				
				start = coords.start || 0;
				end = coords.add ? start + coords.add : coords.end || 360;
				anticlockwise = coords.anticlockwise || false;
				
				start *= Math.PI / 180;
				end *= Math.PI / 180;
				
				st = tan(start);
				et = tan(end);
				if (horizontal) {
					if (cos(start) >= 0) {
						start = atan(st * cx / cy);
					}
					else {
						start = atan(st * cx / cy) + (180 * Math.PI / 180);
					}
					if (cos(end) >= 0) {
						end = atan(et * cx / cy);
					}
					else {
						end = atan(et * cx / cy) + (180 * Math.PI / 180);
					}
				}
				else {
					if (cos(start) >= 0) {
						start = atan(st * cx / cy);
					}
					else {
						start = atan(st * cx / cy) + (180 * Math.PI / 180);
					}
					if (cos(end) >= 0) {
						end = atan(et * cx / cy);
					}
					else {
						end = atan(et * cx / cy) + (180 * Math.PI / 180);
					}
				}
				
				ctx.beginPath();
				ctx.translate(coords.x, coords.y);
				
				ctx.moveTo(cx, cy);
				if (horizontal) {
					ctx.scale(1, ratio);
				}
				else {
					ctx.scale(ratio, 1);
				}
				ctx.arc((horizontal ? cx : cy), (horizontal ? cx : cy), (horizontal ? cx : cy), start, end, anticlockwise);
				ctx.closePath();
				
				if (shape.image && shape.image.object) {
					x = shape.image.interlocked ? coords.x : 0;
					y = shape.image.interlocked ? coords.y : 0;
					
					ctx.clip();
					ctx.drawImage(shape.image.object, x + shape.image.offset[0], y + shape.image.offset[1]);
				}
				else {
					if (style.gradFillStyle || style.fillStyle) ctx.fill();
					if (style.gradStrokeStyle || style.strokeStyle) ctx.stroke();
				}
				ctx.restore();
				
				if (shape.textStyle) drawText(shape, coords);
				
				break;
		}
	};
	
	function update() {
		if (updated && prevPx == px && prevPy == py) return;
		updated = true;
		
		var shape, coords, result, style, animation, currentcoord, strokeStyle, fillStyle,
			i, j, k, shapeLen, coordLen, len, a, b, ap, bp, ab, innerProduct, outerProduct, totalAngle, angle, ta,
			diff, start, end, anticlockwise, cp, sx, sy, ex, ey, sop, eop, count, cx, cy, m1, m2, horizontal, c, f1, f2, pf1, pf2, r, index;
		
		ctx.clearRect(0, 0, settings.width, settings.height);
		
		for (i = 0, shapeLen = shapes.length; i < shapeLen; i++) {
			shape = shapes[i];
			coords = shape.coords;
			result = false;
			if (!shape.attr.visibility) continue;
			
			switch (shape.type) {
				case 'line':
				case 'lines':
					loop:for (j = 0, coordLen = coords.length; j < coordLen; j++) {
						if (j + 1 < coordLen) {
							a = coords[j];
							b = coords[j + 1];
							innerProduct = (px - a.x) * (b.x - a.x) + (py - a.y) * (b.y - a.y);
							
							ap = sqrt((px - a.x) * (px - a.x) + (py - a.y) * (py - a.y));
							ab = sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
							
							if (ab >= ap && abs(ab * ap - innerProduct) < settings.sensitivity) {
								result = true;
								break loop;
							}
						}
					}
					
					break;
				
				case 'rect':
				case 'round-rect':
					if (px >= coords.x && px <= coords.x + coords.w &&
						py >= coords.y && py <= coords.y + coords.h) {
						result = true;
					}
					break;
					
				case 'polygon':
					/* 通常の方�? */
					/*totalAngle = 0;
					angle = 0;
					for (j = 0, coordLen = coords.length; j < coordLen; j++) {
						a = coords[j];
						b = coords[((j + 1) % coordLen)];
						ap = ((px - a.x) * (px - a.x)) + ((py - a.y) * (py - a.y));
						bp = ((px - b.x) * (px - b.x)) + ((py - b.y) * (py - b.y));
						innerProduct = ((px - a.x) * (px - b.x)) + ((py - a.y) * (py - b.y));
						outerProduct = (((px - a.x) * (py - b.y)) - ((py - a.y) * (px - b.x)));
						
						if (ap * bp === 0) {
							result = true;
							break;
						}
						
						angle = abs(acos(innerProduct / sqrt(ap * bp)));
						if (outerProduct > 0) {
							angle =  -1 * angle;
						}
						else if (outerProduct < 0) angle = angle;
						else {
							result = true;
							break;
						}
						
						totalAngle += angle;
					}
					
					totalAngle = (totalAngle + '').indexOf('e') != -1 ? 0 : totalAngle;
					
					ta = abs(totalAngle / (2 * Math.PI));
					if (ta - 1 < 0.00001 && ta - 1 > -0.00001) result = true;*/
					/* 通常の方法ここまで */
					
					/* 特許参�?の方�? http://www.j-tokkyo.com/1999/G06T/JP11144041.shtml */
					count = 0;
					for (j = 0, coordLen = coords.length; j < coordLen; j++) {
						a = coords[j];
						b = coords[((j + 1) % coordLen)];
						m1 = (px - a.x) * (px - b.x);
						
						if (m1 < 0) {
							m2 = (px - a.x) * (((px - a.x) * (b.y - a.y)) - ((py - a.y) * (b.x - a.x)));
							if (m2 < 0) count++;
						}
						
					}
					if(count % 2 !== 0) result = true;
					/* 特許参�?の方法ここまで */
					break;
				
				case 'circle':
					ap = sqrt((px - coords.x) * (px - coords.x) + (py - coords.y) * (py - coords.y));
					
					result = coords.r + 2 >= ap;
					break;
				
				case 'sector':
				case 'arc':
					start = coords.start;
					end = coords.add ? start + coords.add : coords.end;
					anticlockwise = coords.anticlockwise;
					cp = sqrt(((px - coords.x) * (px - coords.x)) + ((py - coords.y) * (py - coords.y)));
					sx = coords.r * cos(start * Math.PI / 180);
					sy = coords.r * sin(start * Math.PI / 180);
					ex = coords.r * cos(end * Math.PI / 180);
					ey = coords.r * sin(end * Math.PI / 180);
					sop = (sx * (py - coords.y)) - (sy * (px - coords.x));
					eop = (ex * (py - coords.y)) - (ey * (px - coords.x));
					
					if (!anticlockwise) {
						diff = end - start > 0 ? end - start : 360 - start + end;
						if (diff <= 180) {
							if (sop > 0 && eop < 0 && coords.r >= cp) result = true;
						}
						else {
							if ((sop > 0 || eop < 0) && coords.r >= cp) result = true;
						}
					}
					else {
						diff = start - end > 0 ? start - end : 360 - end + start;
						if (diff <= 180) {
							if (sop < 0 && eop > 0 && coords.r >= cp) result = true;
						}
						else {
							if ((sop < 0 || eop > 0) && coords.r >= cp) result = true;
						}
					}
					break;
				
				case 'ellipse':
					cx = coords.w / 2;
					cy = coords.h / 2;
					horizontal = cx >= cy;
					c = horizontal ? sqrt((cx * cx) - (cy * cy)) : sqrt((cy * cy) - (cx * cx));
					f1 = (horizontal ? coords.x + cx : coords.y + cy) + c;
					f2 = (horizontal ? coords.x + cx : coords.y + cy) - c;
					pf1 = horizontal ? (sqrt((px - f1) * (px - f1) + (py - (coords.y + cy)) * (py - (coords.y + cy)))) :
						(sqrt((py - f1) * (py - f1) + (px - (coords.x + cx)) * (px - (coords.x + cx))));
					pf2 = horizontal ? (sqrt((px - f2) * (px - f2) + (py - (coords.y + cy)) * (py - (coords.y + cy)))) :
						(sqrt((py - f2) * (py - f2) + (px - (coords.x + cx)) * (px - (coords.x + cx))));
					result = pf1 + pf2 <= (horizontal ? cx : cy) * 2;
					break;
					
				case 'ellipse-sector':
				case 'ellipse-arc':
					cx = coords.w / 2;
					cy = coords.h / 2;
					horizontal = cx >= cy;
					
					c = horizontal ? sqrt((cx * cx) - (cy * cy)) : sqrt((cy * cy) - (cx * cx));
					f1 = (horizontal ? coords.x + cx : coords.y + cy) + c;
					f2 = (horizontal ? coords.x + cx : coords.y + cy) - c;
					pf1 = horizontal ? (sqrt((px - f1) * (px - f1) + (py - (coords.y + cy)) * (py - (coords.y + cy)))) :
						(sqrt((py - f1) * (py - f1) + (px - (coords.x + cx)) * (px - (coords.x + cx))));
					pf2 = horizontal ? (sqrt((px - f2) * (px - f2) + (py - (coords.y + cy)) * (py - (coords.y + cy)))) :
						(sqrt((py - f2) * (py - f2) + (px - (coords.x + cx)) * (px - (coords.x + cx))));
					
					start = coords.start;
					end = coords.add ? start + coords.add : coords.end;
					anticlockwise = coords.anticlockwise;
					
					if (horizontal) {
						a = cos(start * Math.PI / 180) / cx;
						b = sin(start * Math.PI / 180) / cy;
						r = sqrt(1 / (a * a + b * b));
						
						sx = r * cos(start * Math.PI / 180);
						sy = r * sin(start * Math.PI / 180);
						
						a = cos(end * Math.PI / 180) / cx;
						b = sin(end * Math.PI / 180) / cy;
						r = sqrt(1 / (a * a + b * b));
						
						ex = r * cos(end * Math.PI / 180);
						ey = r * sin(end * Math.PI / 180);
					}
					else {
						a = cos(start * Math.PI / 180) / cy;
						b = sin(start * Math.PI / 180) / cx;
						r = sqrt(1 / (a * a + b * b));
						
						sx = r * cos(start * Math.PI / 180);
						sy = r * sin(start * Math.PI / 180);
						
						a = cos(end * Math.PI / 180) / cy;
						b = sin(end * Math.PI / 180) / cx;
						r = sqrt(1 / (a * a + b * b));
						
						ex = r * cos(end * Math.PI / 180);
						ey = r * sin(end * Math.PI / 180);
					}
					sop = (sx * (py - (coords.y + cy))) - (sy * (px - (coords.x + cx)));
					eop = (ex * (py - (coords.y + cy))) - (ey * (px - (coords.x + cx)));
					
					if (!anticlockwise) {
						diff = end - start > 0 ? end - start : 360 - start + end;
						if (diff <= 180) {
							if (sop > 0 && eop < 0 && pf1 + pf2 <= (horizontal ? cx : cy) * 2) result = true;
						}
						else {
							if ((sop > 0 || eop < 0) && pf1 + pf2 <= (horizontal ? cx : cy) * 2) result = true;
						}
					}
					else {
						diff = start - end > 0 ? start - end : 360 - end + start;
						if (diff <= 180) {
							if (sop < 0 && eop > 0 && pf1 + pf2 <= (horizontal ? cx : cy) * 2) result = true;
						}
						else {
							if ((sop < 0 || eop > 0) && pf1 + pf2 <= (horizontal ? cx : cy) * 2) result = true;
						}
					}
					break;
			}
			
			if (shape.onMouseMove) {
				updated = false;
				proxy(shape.onMouseMove, self)(shape, getMouseXY());
			}
			
			if (result) onHitShape(shape);
			else {
				shape.state = 'idle';
				shape.mouseOver = false;
				shape.mouseDown = false;
				shape.rightMouseDown = false;
			}
			
			if (shape.state == 'hover') {
				style = shape.hover;
				style.strokeStyle = shape.hover.ss && shape.hover.ss();
				style.fillStyle = shape.hover.fs && shape.hover.fs();
			}
			else if (shape.state == 'active') {
				style = shape.active;
				if (shape.hoverGradient || shape.hoverStyle) shape.state = 'hover';
				else shape.state = 'idle';
			}
			else style = shape.normal;
			
			if (shape.animation.state == 'running') {
				updated = false;
				animation = shape.animation;
				currentcoord = animation.cc && animation.cc();
				if (animation.ss) style.strokeStyle = animation.ss();
				if (animation.fs) style.fillStyle = animation.fs();
				
				if (currentcoord) {
					if (isArray(currentcoord)) {
						for (k = 0, len = currentcoord.length; k < len; k++) {
							extend(shape.coords[k], currentcoord[k]);
						}
					}
					else {
						extend(shape.coords, currentcoord);
					}
				}
				
				if (shape.gradient && shape.state == 'idle') addGradient(shape);
				else if (shape.hoverGradient && shape.state == 'hover') addGradient(shape, 'hover');
				else if (shape.activeGradient && shape.state == 'active') addGradient(shape, 'active');
			}
			if (shape.animation.state == 'finished') {
				shape.animation.state = 'idle';
				
				if (shape.animation.endcolor) {
					style.strokeStyle = shape.animation.endcolor.strokeStyle;
					style.fillStyle = shape.animation.endcolor.fillStyle;
				}
				if (shape.animation.afterFinish) proxy(shape.animation.afterFinish, self)();
			}
			
			renderShape(shape, style);
		}
		
		if (draggables.length) {
			for (index = 0, len = draggables.length; index < len; index++) {
				if (index === 0) name = draggables[index];
				if (shapes[draggables[index]].attr.shapeZIndex > shapes[name].attr.shapeZIndex) name = draggables[index];
			}
			draggables.length = 0;
			topmostShape = name;
			
			self.get(0).style.cursor = shape.attr.cursor;
		}
		else self.get(0).style.cursor = 'default';
		
		prevPx = px;
		prevPy = py;
	}
	
	function loop() {
		stopTimer = false;
		var timer = setInterval(function() {
			if (stopTimer) clearInterval(timer);
			
			update();
		}, interval);
	}
	
	function onHitShape(shape) {
		updated = false;
		draggables[draggables.length] = shape.name;
		
		if (!shape.mouseOver) {
			shape.mouseOver = true;
			if (shape.hoverGradient || shape.hoverStyle) hoverShape(shape);
			if (shape.onMouseOver) proxy(shape.onMouseOver, self)(shape, getMouseXY());
		}
		
		if (isMouseBtn('left')) {
			if (!shape.mouseDown) {
				shape.mouseDown = true;
				if (shape.onMouseDown) proxy(shape.onMouseDown, self)(shape, getMouseXY(), topmostShape);
			}
		}
		if (isMouseBtn('right')) {
			if (!shape.rightMouseDown) {
				shape.rightMouseDown = true;
				if (shape.onMouseDown) proxy(shape.onMouseDown, self)(shape, getMouseXY(), topmostShape);
			}
		}
		
		if (!isMouseBtn('left')) {
			if (shape.mouseDown) {
				shape.mouseDown = false;
				if (shape.activeGradient || shape.activeStyle) activeShape(shape);
				if (shape.onClick) proxy(shape.onClick, self)(shape, getMouseXY(), topmostShape);
			}
		}
		if (!isMouseBtn('right')) {
			if (shape.rightMouseDown) {
				shape.rightMouseDown = false;
				if (shape.activeGradient || shape.activeStyle) activeShape(shape);
				if (shape.onClick) proxy(shape.onClick, self)(shape, getMouseXY(), topmostShape);
			}
		}
	}
	
	function drawText(shape, coord) {
		var textStyle = shape.textStyle,
			text = textStyle.content,
			x = coord.x + (textStyle.offset[0] || 0),
			y = coord.y + (textStyle.offset[1] || 0),
			measure;
		
		ctx.save();
		
		ctx.font = shape.textStyle.font || 'bold 20px "Meiryo", "MS PGothic", "ヒラギノ角ゴ Pro W3", "Osaka", "Verdana", "arial", "sans-serif"';
		ctx.textAlign = shape.textStyle.textAlign || 'start';
		ctx.textBaseline = shape.textStyle.textBaseline || 'alphabetic';
		
		measure = ctx.measureText(text);
		
		ctx.lineWidth = textStyle.lineWidth || 1;
		ctx.strokeStyle = textStyle.strokeStyle || '#000';
		ctx.fillStyle = textStyle.fillStyle || '#FFF';
		ctx.shadowBlur = textStyle.shadowBlur || 0;
		ctx.shadowColor = textStyle.shadowColor || '#000';
		ctx.shadowOffsetX = textStyle.shadowOffsetX || 0;
		ctx.shadowOffsetY = textStyle.shadowOffsetY || 0;
		
		if (textStyle.strokeStyle) ctx.strokeText(text, x, y, measure.width);
		if (textStyle.fillStyle) ctx.fillText(text, x, y, measure.width);
		
		ctx.restore();
	}
	
	function isMouseBtn(btnName) {
		return mouseBtn[btnName];
	}
	
	function getMouseXY() {
		var coord = [px, py];
		coord.x = px;
		coord.y = py;
		return coord;
	}
	
	function hexToRGBa(hexString, type, alpha) {
		var array, hexColor, rgbColor, rgb, a, i;
		if (hexString.slice(0, 4) == 'rgb(' || hexString.slice(0, 5) == 'rgba(') {
			if (type == 'string') {
				if (hexString.slice(0, 4) == 'rgb(') {
					array = hexString.slice(4, -1).split(',');
					array.push(1);
					return 'rgba(' + array.join(',') + ')';
				}
				return hexString;
			}
			if (hexString.slice(0, 4) == 'rgb(') {
				array = hexString.slice(4, -1).split(',');
				array.push(1);
				return array;
			}
			array = hexString.slice(5, -1).split(',');
			return array;
		}
		
		hexString = hexString.slice(0, 1) == '#' ? hexString.slice(1) : hexString;
		type = type || 'string';
		hexColor = '';
		rgb = [];
		a = alpha || 1.0;
		if (hexString.length == 3) for (i = 0; i < 3; i++) hexColor += (hexString.charAt(i) + hexString.charAt(i)).toLowerCase();
		if (hexString.length == 6) hexColor = hexString.toLowerCase();
		
		rgb[0] = hexColor.slice(0, 2);
		rgb[1] = hexColor.slice(2, 4);
		rgb[2] = hexColor.slice(4, 6);
		
		if (type == 'string') {
			rgbColor = 'rgba(' + parseInt(rgb[0], 16) + ', ' + parseInt(rgb[1], 16) + ', ' + parseInt(rgb[2], 16) + ', ' + a + ')';
		}
		else {
			rgbColor = [];
			for (i = 0; i < 3; i++) {
				rgbColor[i] = parseInt(rgb[i], 16);
			}
			rgbColor[3] = a;
		}
		
		return rgbColor;
	}
	
	function colorFading(shape, startcolor, endcolor, duration, transition) {
		var startColor = hexToRGBa(startcolor, 'array'),
			endColor = hexToRGBa(endcolor, 'array'),
			currentColor,
			delta = [endColor[0] - startColor[0] - 0, endColor[1] - startColor[1] - 0, endColor[2] - startColor[2] - 0, endColor[3] - startColor[3] - 0],
			currentFrame = 0, totalFrames = round(duration / interval), position;
		
		return function() {
			position = currentFrame++ / totalFrames;
			if (position > 1) {
				if (shape.state != 'hover') shape.animation.state = 'finished';
				return endcolor;
			}
			
			position = transition(position);
			currentColor = [startColor[0] - 0 + (delta[0] * position), startColor[1] - 0 + (delta[1] * position), startColor[2] - 0 + (delta[2] * position), startColor[3] - 0 + (delta[3] * position)];
			return 'rgba(' + round(currentColor[0]) + ', ' + round(currentColor[1]) + ', ' + round(currentColor[2]) + ', ' + currentColor[3] + ')';
		};
	}
	
	function stepAnim(shape, startcoord, endcoord, duration, transition) {
		var keys = [], currentFrame = 0, totalFrames = round(duration / interval), delta, currentCoord, position, i, len;
		if (isArray(endcoord)) {
			delta = [];
			currentCoord = [];
			forEach(endcoord[0], function(key, value) { keys[keys.length] = key; });
			for (i = 0, len = endcoord.length; i < len; i++) {
				delta[i] = {};
				currentCoord[i] = {};
				forEach(keys, function(index, value) {
					delta[i][value] = endcoord[i][value] - startcoord[i][value] - 0;
					
				});
			}
			
			return function() {
				var i, len;
				position = currentFrame++ / totalFrames;
				if (position > 1) {
					shape.animation.state = 'finished';
					return;
				}
				for (i = 0, len = endcoord.length; i < len; i++) {
					forEach(keys, function(index, value) {
						currentCoord[i][value] = startcoord[i][value] - 0 + (delta[i][value] * position);
						
					});
				}
				return currentCoord;
			};
		}
		else {
			delta = {};
			currentCoord = {};
			forEach(endcoord, function(key, value) { keys[keys.length] = key; });
			
			forEach(keys, function(index, value) {
				delta[value] = endcoord[value] - startcoord[value] - 0;
			});
			
			return function() {
				var i, len;
				position = currentFrame++ / totalFrames;
				if (position > 1) {
					shape.animation.state = 'finished';
					return false;
				}
				
				position = transition(position);
				forEach(keys, function(index, value) {
					currentCoord[value] = startcoord[value] - 0 + (delta[value] * position);
				});
				return currentCoord;
			};
		}
	}
	
	function arrayMax(array) {
		return Math.max.apply(this, array);
	}
	
	function arrayMin(array) {
		return Math.min.apply(this, array);
	}
	
	function curryTimerCallback() {
		var userFunc = arguments[0],
			args = Array.prototype.slice.call(arguments, 1);
		
		return function() {
			return userFunc.apply(this, args);
		};
	}
	
	/* Transitions */
	var transitions = {
		linear: function(pos) { return pos; },
		sinoidal: function(pos) { return (-cos(pos * Math.PI) / 2) + 0.5; },
		full: function(pos) { return 1; }
	};
	
})(jQuery);