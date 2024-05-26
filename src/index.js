export default class GameStats{
	constructor(options = {}){
		const defaultConfig = {
			autoPlace:true,
			targetFPS: 60,
			redrawInterval: 50,
			maximumHistory: 100,
			scale: 1.0,
			memoryUpdateInterval: 1000,
			memoryMaxHistory: 60 * 10, // 10 minutes of memory measurements

			// COLORS
			FONT_FAMILY: 'Arial',
			COLOR_FPS_BAR: '#34cfa2',
			COLOR_FPS_AVG: '#FFF',
			COLOR_TEXT_LABEL: '#FFF',
			COLOR_TEXT_TO_LOW: '#eee207',
			COLOR_TEXT_BAD: '#d34646',
			COLOR_TEXT_TARGET: '#d249dd',
			COLOR_BG:'#333333',
		}

		this.config = Object.assign(defaultConfig, options)

		this.dom;
		this.canvas;
		this.ctx;
		this.currentTime;
		this.prevTime;
		this.shown = true;
		this.lastMSAverage;
		this.lastMemoryMeasure = -Number.POSITIVE_INFINITY;
		this.labels = {};
		this.labelColors = {'ms':this.config.COLOR_FPS_BAR, 'memory':this.config.COLOR_FPS_BAR};
		this.labelOrder = [];
		this.graphYOffset = 0;

		this.extensions = {};

		this.config.baseCanvasWidth = 100 * this.config.scale;
		this.config.baseCanvasHeight = 150 * this.config.scale;

		this.msGraph = {
			width: this.config.baseCanvasWidth,
			height: this.config.baseCanvasHeight * 0.4,
			drawY: this.config.baseCanvasHeight * 0.16,
			barWidth: this.config.baseCanvasWidth / this.config.maximumHistory,
		}
		this.memoryGraph = {
			width: this.config.baseCanvasWidth,
			height: this.config.baseCanvasHeight * 0.2,
			drawY: this.config.baseCanvasHeight * 0.76,
			barWidth: this.config.baseCanvasWidth / this.config.memoryMaxHistory
		}

		this.init();
	}

	init(){
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.config.baseCanvasWidth;
		this.canvas.height = this.config.baseCanvasHeight;
		this.canvas.style.cssText = `width:${this.config.baseCanvasWidth}px;height:${this.config.baseCanvasHeight}px;background-color:${this.config.COLOR_BG}`;


		this.ctx = this.canvas.getContext('2d');
		this.dom = document.createElement('div');

		this.dom.appendChild(this.canvas);
		this.dom.setAttribute('data', 'gamestats');
		this.dom.style.cssText = `position:fixed;left:0;top:0;display: flex;flex-direction: column;gap: 5px;`;



		if(this.config.autoPlace){
			document.body.appendChild(this.dom);
		}

		if(performance && performance.memory){
			this.labels['memory'] = [];
		}
		this.update = this.update.bind(this);
		this.update();
	}

	begin(label, color){
		if(['ms', 'fps', 'memory'].includes(label)) throw `jsgraphy: label ${label} is reserved`;
		if(!label) label = 'ms';

		if(label === 'ms' && this.currentTime) this.prevTime = this.currentTime;

		if(label !== 'ms' && !this.labelColors[label]){
			// register new label
			this.labelColors[label] = color || this.stringToColor(label);
			this.labelOrder.push(label);
		}

		if(!this.labels[label]) this.labels[label] = [];
		const labelMeasures = this.labels[label];
		labelMeasures.push(performance.now());
		if(labelMeasures.length> this.config.maximumHistory) labelMeasures.shift();

		if(label === 'ms'){
			this.currentTime = performance.now();
			if(this.prevTime){
				if(!this.labels['fps']) this.labels['fps'] = [];
				const fpsMeasures = this.labels['fps'];
				fpsMeasures.push(this.currentTime-this.prevTime);
				if(fpsMeasures.length> this.config.maximumHistory) fpsMeasures.shift();
			}
		}
	}

	show(visible){
		this.shown = visible;
		this.dom.style.display = visible ? 'flex' : 'none';
	}

	end(label='ms'){
		const labelMeasures = this.labels[label];
		if(labelMeasures){
			const beginTime = labelMeasures[labelMeasures.length-1];
			labelMeasures[labelMeasures.length-1] = performance.now()-beginTime;
		}
		if(label === 'ms'){
			for (const key in this.extensions) {
				this.extensions[key].endFrame();
			}
		}
	}

	update(){
		if(this.shown) this.draw(); // don't draw if we are not shown

		if(performance && performance.memory && performance.now()-this.lastMemoryMeasure > this.config.memoryUpdateInterval){
			const memoryMeasures = this.labels['memory'];
			memoryMeasures.push(performance.memory.usedJSHeapSize / TOMB);
			if(memoryMeasures.length > this.config.memoryMaxHistory) memoryMeasures.shift();
			this.lastMemoryMeasure = performance.now();
		}
		if(this.canvas && this.canvas.parentNode){
			setTimeout(this.update, this.config.redrawInterval);
		}
		for (const key in this.extensions) {
			this.extensions[key].update();
		}
	}

	draw(){
		if(!this.prevTime) return;

		// shift everything to the left:
		const ctx = this.ctx;
		const imageData = ctx.getImageData(1, 0, ctx.canvas.width-this.msGraph.barWidth, ctx.canvas.height);
		ctx.putImageData(imageData, 0, 0);
		ctx.clearRect(ctx.canvas.width-this.msGraph.barWidth, 0, this.msGraph.barWidth, ctx.canvas.height);

		// clear fps text
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height*0.16);
		// clear memory if needed
		if(performance.memory) ctx.clearRect(0, ctx.canvas.height*0.6, ctx.canvas.width, ctx.canvas.height*0.16);

		this.drawGraph('ms', 1000/this.config.targetFPS);
		this.drawFPS();
		this.graphYOffset = 0;

		for (let label of this.labelOrder)  this.drawGraph(label, this.previousMaxMS, true);

		this.drawLines();

		if(performance && performance.memory){
			this.drawMemory();
		}
	}
	
	drawLines(){
		const config = this.config;
		const ctx = this.ctx;

		const targetFPS = 1000/config.targetFPS

		const average = this.previousAverageMS;
		const max = this.previousMaxMS;

		ctx.fillStyle = config.COLOR_FPS_AVG;
		if(average > targetFPS * 1.66) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(average > targetFPS * 1.33) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		const averageH = (average / max) * this.msGraph.height;
		const averageY = this.msGraph.drawY + this.msGraph.height-averageH;
		ctx.fillRect(this.msGraph.width-this.msGraph.barWidth, averageY, this.msGraph.barWidth, this.msGraph.barWidth);

		ctx.fillStyle = config.COLOR_TEXT_TARGET;
		const targetH = (targetFPS / max) * this.msGraph.height;
		const targetY = this.msGraph.drawY + this.msGraph.height-targetH;
		ctx.fillRect(this.msGraph.width-this.msGraph.barWidth, targetY, this.msGraph.barWidth, this.msGraph.barWidth);
	}

	drawGraph(label, minMaxValue, doYOffsets){
		const labelMeasures = this.labels[label];

		let {max, average} = this.getMMA(labelMeasures)

		max = Math.max(average * 1.5, max);
		if(minMaxValue) max = Math.max(minMaxValue, max);

		const config = this.config;

		const ctx = this.ctx;

		const lastIndex = labelMeasures.length-1;
		const measure = labelMeasures[lastIndex];

		let yOffset = 0;
		if(doYOffsets && this.graphYOffset) yOffset += this.graphYOffset;

		let x = config.maximumHistory * this.msGraph.barWidth - this.msGraph.barWidth;
		let y = this.msGraph.drawY;
		let w = this.msGraph.barWidth;
		let h = (measure / max) *this.msGraph.height;
		y += (this.msGraph.height-h)-yOffset;

		ctx.globalAlpha = 0.5;
		ctx.fillStyle = this.labelColors[label];
		ctx.fillRect(x, y, w, h);

		ctx.globalAlpha = 1.0;
		ctx.fillRect(x, y, w, w);

		if(doYOffsets){
			this.graphYOffset = (this.graphYOffset || 0) + h;
		}

		if(label === 'ms'){
			this.previousAverageMS = average;
			this.previousMaxMS = max;
		}
	}
	drawFPS(){
		const ctx = this.ctx;
		const config = this.config;

		const fpsMeasures = this.labels['fps'];
		if(!fpsMeasures) return;

		const {min, max, average} = this.getMMA(fpsMeasures);

		const averageFPS = Math.round(1000/average);
		const maxFPS = Math.round(1000/min);
		const minFPS = Math.round(1000/max);

		const msMeasures = this.labels['ms'];
		const ms = (msMeasures[msMeasures.length-1]).toFixed(1);

		const FPS = Math.round(1000 / fpsMeasures[fpsMeasures.length-1]);

		// magic numbers :)

		const padding = config.baseCanvasHeight * 0.01;

		// avg min max
		ctx.textAlign = 'left';
		let fontSize = config.baseCanvasWidth * 0.09;
		ctx.font = `${fontSize}px ${config.FONT_FAMILY}`;
		ctx.textBaseline = 'top';
		ctx.fillStyle = config.COLOR_TEXT_LABEL;
		ctx.fillText('avg min max', padding, padding);

		//fps
		fontSize = config.baseCanvasWidth * 0.12;
		if(FPS < config.targetFPS * 0.33) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(FPS < config.targetFPS * 0.66) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		ctx.font = `${fontSize}px ${config.FONT_FAMILY}`;
		ctx.textAlign = 'right';
		ctx.fillText(`${FPS} fps`, config.baseCanvasWidth-padding, padding);

		//ms
		fontSize = config.baseCanvasWidth * 0.1;
		ctx.font = `${fontSize}px ${config.FONT_FAMILY}`;
		const msYOffset = config.baseCanvasWidth * 0.12;
		ctx.fillText(`${ms}ms`, config.baseCanvasWidth-padding, msYOffset+padding);

		//avg min max
		fontSize = config.baseCanvasWidth * 0.09;
		ctx.font = `${fontSize}px ${config.FONT_FAMILY}`;

		const avgMinMaxOffsetX = config.baseCanvasWidth * 0.175;
		const avgMinMaxOffsetY = config.baseCanvasWidth * 0.1;

		const badFPS = config.targetFPS * 0.33;
		const toLowFPS = config.targetFPS * 0.66;

		ctx.fillStyle = config.COLOR_FPS_BAR;
		if(averageFPS<badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(averageFPS<toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		ctx.fillText(`${averageFPS}`, avgMinMaxOffsetX-padding, avgMinMaxOffsetY+padding);

		ctx.fillStyle = config.COLOR_FPS_BAR;
		if(minFPS<badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(minFPS<toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		ctx.fillText(`${minFPS}`, avgMinMaxOffsetX * 2.1 -padding * 2, avgMinMaxOffsetY+padding);

		ctx.fillStyle = config.COLOR_FPS_BAR;
		if(maxFPS<badFPS) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(maxFPS<toLowFPS) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		ctx.fillText(`${maxFPS}`, avgMinMaxOffsetX * 3.3 -padding * 3, avgMinMaxOffsetY+padding);
	}

	drawMemory(){
		const config = this.config;
		const ctx = this.ctx;

		const padding = config.baseCanvasHeight * 0.01;
		const memoryTextY = config.baseCanvasHeight * 0.60;
		// avg min max
		ctx.textAlign = 'left';
		let fontSize = config.baseCanvasWidth * 0.09;
		ctx.font = `${fontSize}px ${config.FONT_FAMILY}`;
		ctx.textBaseline = 'top';
		ctx.fillStyle = config.COLOR_TEXT_LABEL;
		ctx.fillText('reserved', padding, memoryTextY+padding);

		ctx.fillStyle = config.COLOR_TEXT_TARGET;
		ctx.textAlign = 'right';
		const reservedMemory = (performance.memory.jsHeapSizeLimit / TOMB).toFixed(1);
		ctx.fillText(`${reservedMemory}MB`, config.baseCanvasWidth-padding, memoryTextY+padding);

		ctx.textAlign = 'left';
		ctx.fillStyle = config.COLOR_TEXT_LABEL;
		ctx.fillText('allocated', padding, memoryTextY*1.12+padding);

		ctx.textAlign = 'right';
		const allocatedMemory = (performance.memory.usedJSHeapSize / TOMB).toFixed(1);

		ctx.fillStyle = config.COLOR_FPS_BAR;
		if(allocatedMemory > reservedMemory * .9){
			ctx.fillStyle = config.COLOR_TEXT_BAD;
		}else if(allocatedMemory > reservedMemory * .66){
			ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		}

		ctx.fillText(`${allocatedMemory}MB`, config.baseCanvasWidth-padding, memoryTextY*1.12+padding);

		const targetMemory = (performance.memory.jsHeapSizeLimit / TOMB);

		const memoryMeasures = this.labels['memory'];
		const lastValue = memoryMeasures[memoryMeasures.length-1];

		let x = this.memoryGraph.width - this.memoryGraph.barWidth * 6;
		let y = this.memoryGraph.drawY;
		let w = this.memoryGraph.barWidth * 6;
		let h = (lastValue / targetMemory) *this.memoryGraph.height;
		y += (this.memoryGraph.height-h);

		ctx.globalAlpha = 0.5;
		ctx.fillStyle = this.labelColors['memory'];
		ctx.fillRect(x, y, w, h);

		ctx.globalAlpha = 1.0;
		ctx.fillRect(x, y, w, w);

		const {average} = this.getMMA(this.labels['memory']);

		ctx.fillStyle = config.COLOR_FPS_AVG;
		if(average > targetMemory * 0.9) ctx.fillStyle = config.COLOR_TEXT_BAD;
		else if(average > targetMemory * 0.66) ctx.fillStyle = config.COLOR_TEXT_TO_LOW;
		const averageH = (average / targetMemory) * this.memoryGraph.height;
		const averageY = this.memoryGraph.drawY + this.memoryGraph.height-averageH;
		ctx.fillRect(this.memoryGraph.width-this.memoryGraph.barWidth*6, averageY, this.memoryGraph.barWidth*6, this.memoryGraph.barWidth*6);

		ctx.fillStyle = config.COLOR_TEXT_TARGET;
		const targetH = this.memoryGraph.height;
		const targetY = this.memoryGraph.drawY + this.memoryGraph.height-targetH;
		ctx.fillRect(this.memoryGraph.width-this.memoryGraph.barWidth*6, targetY, this.memoryGraph.barWidth*6, this.memoryGraph.barWidth*6);
	}

	getMMA(measures){
		let min = Number.POSITIVE_INFINITY;
		let max = -Number.POSITIVE_INFINITY;
		let average = 0;

		for (let measure of measures){
			if(measure<min) min = measure;
			if(measure>max) max = measure;
			average += measure;
		}

		average /= measures.length;
		return {min, max, average}
	}

	stringToColor(str){
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
		return `#${"00000".substring(0, 6 - c.length)}${c}`;
	}

	async enableExtension(name, params){
		if(this.extensions[name]) return null;
		try{
			const module = await import(`./gamestats-${name}.module.js`);
			const extension = new module.default(this, ...params);
			this.extensions[name] = extension;
		}catch(e){
			console.log(e);
			return null;
		}
	}
}

const TOMB = 1048576;
