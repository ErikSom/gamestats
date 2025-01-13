class WebGLStats{
	constructor(main, options){
		this.main = main;

		const defaultConfig = {
			maxMemorySize: 350,
			COLOR_MEM_TEXTURE: '#8ddcff',
			COLOR_MEM_BUFFER: '#ffd34d',
		}

		this.config = Object.assign(defaultConfig, options)

		this.config.baseCanvasWidth = 100 * this.main.config.scale,
		this.config.baseCanvasHeight = 80 * this.main.config.scale,

		this.memGraph = {
			width: this.config.baseCanvasWidth,
			height: this.config.baseCanvasHeight * 0.38,
			drawY: this.config.baseCanvasHeight * 0.50,
			barWidth: this.config.baseCanvasWidth / this.main.config.maximumHistory,
		}

		this.prevMemValues = {
			textures: 0,
			buffers: 0
		}

		this.dom;
		this.canvas;
		this.ctx;
		this.graphYOffset = 0;
		this.tempDrawCalls = 0;
		this.drawCalls = 0;
		this.realGLDrawElements = null;

		this.init();
	}

	init(){
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.config.baseCanvasWidth;
		this.canvas.height = this.config.baseCanvasHeight;
		this.canvas.style.cssText = `width:${this.config.baseCanvasWidth}px;height:${this.config.baseCanvasHeight}px;background-color:${this.main.config.COLOR_BG}`;

		this.main.dom.appendChild(this.canvas);

		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		const profilers = new Map();
		HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
			const context = originalGetContext.call(this, contextType, contextAttributes);
			if (context instanceof WebGLRenderingContext || context instanceof WebGL2RenderingContext) {
				if (!profilers.has(context)) {
					const profiler = new WebGLProfiler(context);
					profilers.set(context, profiler);
					context.profiler = profiler;
				}
			}
			return context;
		};
		this.profilers = profilers;

		this.update();
	}

	collectStats() {
		const stats = this.profilers.values().map(profiler => profiler.getMetrics());

		let drawCalls = 0;
		let textures = 0;
		let buffers = 0;
		let textureTotalMem = 0;
		let bufferTotatlMem = 0;

		for (const stat of stats) {
			drawCalls += stat.drawCalls;
			textures += stat.activeTextureCount;
			textures += stat.activeCubemapCount;
			buffers += stat.activeBufferCount;
			textureTotalMem += stat.estimatedVRAM;
			bufferTotatlMem += stat.totalBufferSize;
		}

		return {
			count:  {
				drawCalls,
				textures,
				buffers
			},
			mem: {
				textures: textureTotalMem / (1024 * 1024),
				buffers: bufferTotatlMem / (1024 * 1024)
			}
		}
	}

	draw(){
		const stats = this.collectStats();
		this.drawCounts(stats.count);
		this.drawMem(stats.mem);
	}

	formatNum(n){
		if (n < 1e3) return n;
		if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
		if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
		return +(n / 1e9).toFixed(1) + "?";
	}

	drawCounts(counts){
		let { textures, buffers, drawCalls } = counts;

		const ctx = this.ctx;
		const config = this.config;
		const mainConfig = this.main.config;

		const padding = config.baseCanvasHeight * 0.02;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height*0.46);

		ctx.textAlign = 'left';
		let fontSize = config.baseCanvasWidth * 0.09;
		ctx.font = `${fontSize}px ${mainConfig.FONT_FAMILY}`;
		ctx.textBaseline = 'top';
		ctx.fillStyle = mainConfig.COLOR_TEXT_LABEL;
		ctx.fillText('textures buffers', padding*2, padding);

		fontSize = config.baseCanvasWidth * 0.09;
		ctx.font = `${fontSize}px ${mainConfig.FONT_FAMILY}`;

		const avgMinMaxOffsetX = config.baseCanvasWidth * 0.2;
		const avgMinMaxOffsetY = config.baseCanvasWidth * 0.1;

		ctx.textAlign = 'right';
		// textures
		let startX = padding+config.baseCanvasWidth * 0.33;
		ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
		ctx.fillText(`${this.formatNum(textures)}`, startX, avgMinMaxOffsetY+padding);

		// buffers
		ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
		ctx.fillText(`${this.formatNum(buffers)}`, startX + avgMinMaxOffsetX * 1.51, avgMinMaxOffsetY+padding);

		//draw calls
		ctx.textAlign = 'left';
		ctx.fillStyle = mainConfig.COLOR_TEXT_LABEL;
		ctx.fillText('drawcalls', padding*2, config.baseCanvasWidth*0.21);

		ctx.textAlign = 'right';
		ctx.fillStyle = mainConfig.COLOR_FPS_BAR;
		ctx.fillText(`${this.formatNum(drawCalls)}`, startX + padding * 4, config.baseCanvasWidth*0.3);
	}

	drawMem(mem){
		const { textures, buffers } = mem;

		const config = this.config;
		const mainConfig = this.main.config;

		// shift everything to the left:
		const ctx = this.ctx;
		const imageData = ctx.getImageData(1, 0, ctx.canvas.width-this.memGraph.barWidth, ctx.canvas.height);
		ctx.putImageData(imageData, 0, 0);
		ctx.clearRect(ctx.canvas.width-this.memGraph.barWidth, 0, this.memGraph.barWidth, ctx.canvas.height);

		this.drawMemGraph(textures, config.COLOR_MEM_TEXTURE, this.prevMemValues.textures);
		this.drawMemGraph(buffers, config.COLOR_MEM_BUFFER, this.prevMemValues.buffers);

		ctx.clearRect(0, ctx.canvas.height*0.87, ctx.canvas.width, ctx.canvas.height*0.2);

		const padding = config.baseCanvasHeight * 0.01;

		ctx.textAlign = 'left';
		let fontSize = config.baseCanvasWidth * 0.09;
		ctx.textBaseline = 'top';
		ctx.font = `${fontSize}px ${mainConfig.FONT_FAMILY}`;

		const avgMinMaxOffsetX = config.baseCanvasWidth * 0.2;
		const avgMinMaxOffsetY = config.baseCanvasHeight * 0.88;

		// mem-textures
		ctx.fillStyle = config.COLOR_MEM_TEXTURE;;
		ctx.fillText(`tex: ${textures.toFixed(0)}`, padding, avgMinMaxOffsetY+padding);

		// mem-buffers
		ctx.fillStyle = config.COLOR_MEM_BUFFER;;
		ctx.fillText(`buff: ${buffers.toFixed(0)}`, avgMinMaxOffsetX * 2.6 -padding * 2, avgMinMaxOffsetY+padding);

		this.graphYOffset = 0;

		this.prevMemValues.textures = textures;
		this.prevMemValues.buffers = buffers;
	}
	drawMemGraph(value, color, prevValue){
		const config = this.config;
		const mainConfig = this.main.config;

		const ctx = this.ctx;

		if(prevValue && (value + prevValue) > config.maxMemorySize) value = Math.max(0, config.maxMemorySize - prevValue);

		let yOffset = 0;
		if(this.graphYOffset) yOffset += this.graphYOffset;

		let x = mainConfig.maximumHistory * this.memGraph.barWidth - this.memGraph.barWidth;
		let y = this.memGraph.drawY;
		let w = this.memGraph.barWidth;
		let h = Math.min(1, (value / config.maxMemorySize)) *this.memGraph.height;
		y += (this.memGraph.height-h)-yOffset;

		ctx.globalAlpha = 0.5;
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);

		ctx.globalAlpha = 1.0;
		ctx.fillRect(x, y, w, w);

		this.graphYOffset = (this.graphYOffset || 0) + h;
	}

	update(){
		if(this.main.shown){
			this.draw();
		}
	}

	beginFrame(){
		this.profilers.forEach((profiler, gl) => {
			profiler.beginFrame();
		});
	}

	endFrame(){
		this.profilers.forEach((profiler, gl) => {
			if (gl.isContextLost()) {
				this.profilers.delete(gl);
			}
		});
	}
}


class WebGLProfiler {
    constructor(gl) {
        this.gl = gl;
        this.drawCalls = 0;
        this.estimatedVRAM = 0;
        this.originalFunctions = {};
        this.bufferSizes = new WeakMap();
        this.textureSizes = new WeakMap();
        this.cubemapSizes = new WeakMap();
        this.frameStats = {
            vramAllocatedThisFrame: 0,
            vramFreedThisFrame: 0
        };

        this.activeBuffers = new Set();
        this.activeTextures = new Set();
        this.activeCubemaps = new Set();

        this.wrapDrawFunctions();
        this.wrapResourceFunctions();
    }

    wrapDrawFunctions() {
        const drawFunctions = [
            'drawArrays',
            'drawElements',
            'drawArraysInstanced',
            'drawElementsInstanced'
        ];

        drawFunctions.forEach(funcName => {
            this.originalFunctions[funcName] = this.gl[funcName];
            this.gl[funcName] = (...args) => {
                this.drawCalls++;
                return this.originalFunctions[funcName].apply(this.gl, args);
            };
        });
    }

    wrapResourceFunctions() {
        this.wrapBufferFunctions();
        this.wrapTextureFunctions();
    }

    wrapBufferFunctions() {
        const originalCreateBuffer = this.gl.createBuffer;
        const originalDeleteBuffer = this.gl.deleteBuffer;
        const originalBufferData = this.gl.bufferData;

        this.gl.createBuffer = () => {
            const buffer = originalCreateBuffer.call(this.gl);
            this.bufferSizes.set(buffer, 0);
            this.activeBuffers.add(buffer);
            return buffer;
        };

        this.gl.deleteBuffer = (buffer) => {
            const size = this.bufferSizes.get(buffer) || 0;
            this.estimatedVRAM -= size;
            this.frameStats.vramFreedThisFrame += size;
            this.bufferSizes.delete(buffer);
            this.activeBuffers.delete(buffer);
            return originalDeleteBuffer.call(this.gl, buffer);
        };

        this.gl.bufferData = (target, data, usage) => {
            try {
                const buffer = this.gl.getParameter(
                    target === this.gl.ARRAY_BUFFER ?
                    this.gl.ARRAY_BUFFER_BINDING :
                    this.gl.ELEMENT_ARRAY_BUFFER_BINDING
                );

                if (!buffer) return originalBufferData.call(this.gl, target, data, usage);

                const newSize = data?.byteLength || data || 0;
                const oldSize = this.bufferSizes.get(buffer) || 0;

                this.estimatedVRAM += newSize - oldSize;
                this.frameStats.vramAllocatedThisFrame += Math.max(0, newSize - oldSize);
                this.bufferSizes.set(buffer, newSize);

                return originalBufferData.call(this.gl, target, data, usage);
            } catch (error) {
                console.warn('Error in bufferData tracking:', error);
                return originalBufferData.call(this.gl, target, data, usage);
            }
        };
    }

    wrapTextureFunctions() {
        const originalCreateTexture = this.gl.createTexture;
        const originalTexImage2D = this.gl.texImage2D;
        const originalDeleteTexture = this.gl.deleteTexture;

        this.gl.createTexture = () => {
            const texture = originalCreateTexture.call(this.gl);
            this.activeTextures.add(texture);
            return texture;
        };

		const trackTextureAllocation = (width, height, format, isCubemap) => {
			const texture2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
			const textureCubemap = this.gl.getParameter(this.gl.TEXTURE_BINDING_CUBE_MAP);
			const boundTexture = texture2D || textureCubemap;

			if (!boundTexture) return;

			if (width > 0 && height > 0) {
				const bytesPerPixel = this.getFormatSize(format);
				const newSize = Math.ceil(width * height * bytesPerPixel);

				if (textureCubemap) {
					const oldSize = this.cubemapSizes.get(textureCubemap) || 0;
					const faceSize = newSize;
					if (oldSize < faceSize * 6) {
						this.estimatedVRAM += faceSize;
						this.frameStats.vramAllocatedThisFrame += faceSize;
						this.cubemapSizes.set(textureCubemap, Math.min(faceSize * 6, oldSize + faceSize));
					}
					this.activeCubemaps.add(textureCubemap);
				} else {
					const oldSize = this.textureSizes.get(texture2D) || 0;
					this.estimatedVRAM += newSize - oldSize;
					this.frameStats.vramAllocatedThisFrame += Math.max(0, newSize - oldSize);
					this.textureSizes.set(texture2D, newSize);
				}
			}
		};

		this.gl.texImage2D = (...args) => {
			try {
				let width, height, format;
				if (args.length === 6 && !(this.gl instanceof WebGL2RenderingContext)) {
					const source = args[5];
					format = args[2];
					width = source?.width || source?.videoWidth || 0;
					height = source?.height || source?.videoHeight || 0;
				}
				else if (args.length === 9) {
					[, , , width, height, , format] = args;
				}

				trackTextureAllocation(width, height, format);
			} catch (error) {
				console.warn('Error in texImage2D tracking:', error);
			}
			return originalTexImage2D.apply(this.gl, args);
		};

		if (this.gl.compressedTexImage2D) {
			this.gl.compressedTexImage2D = (...args) => {
				try {
					const [, , format, width, height] = args;
					trackTextureAllocation(width, height, format);
				} catch (error) {
					console.warn('Error in compressedTexImage2D tracking:', error);
				}
				return originalCompressedTexImage2D.apply(this.gl, args);
			};
		}

        this.gl.deleteTexture = (texture) => {
            const textureSize = this.textureSizes.get(texture) || 0;
            const cubemapSize = this.cubemapSizes.get(texture) || 0;
            const totalSize = textureSize + cubemapSize;

            this.estimatedVRAM -= totalSize;
            this.frameStats.vramFreedThisFrame += totalSize;

            this.textureSizes.delete(texture);
            this.cubemapSizes.delete(texture);
            this.activeTextures.delete(texture);
            this.activeCubemaps.delete(texture);

            return originalDeleteTexture.call(this.gl, texture);
        };
    }

    getFormatSize(format) {
        const gl = this.gl;
        switch (format) {
            case gl.RGBA: return 4;
            case gl.RGB: return 3;
            case gl.LUMINANCE_ALPHA: return 2;
            case gl.LUMINANCE:
            case gl.ALPHA: return 1;
            case gl.DEPTH_COMPONENT: return 4;
            case gl.DEPTH_STENCIL: return 4;
        }
        const s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc');
        if (s3tc) {
            switch (format) {
                case s3tc.COMPRESSED_RGB_S3TC_DXT1_EXT: return 0.5;
                case s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT: return 0.5;
                case s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT: return 1;
                case s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT: return 1;
            }
        }
        const etc = gl.getExtension('WEBGL_compressed_texture_etc');
        if (etc) {
            switch (format) {
                case etc.COMPRESSED_RGB8_ETC2: return 0.5;
                case etc.COMPRESSED_RGBA8_ETC2_EAC: return 1;
                case etc.COMPRESSED_SRGB8_ETC2: return 0.5;
                case etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: return 1;
                case etc.COMPRESSED_R11_EAC: return 0.5;
                case etc.COMPRESSED_RG11_EAC: return 1;
            }
        }
        const astc = gl.getExtension('WEBGL_compressed_texture_astc');
        if (astc) {
            if (format === astc.COMPRESSED_RGBA_ASTC_4x4_KHR) return 1;
            if (format === astc.COMPRESSED_RGBA_ASTC_5x5_KHR) return 0.64;
            if (format === astc.COMPRESSED_RGBA_ASTC_6x6_KHR) return 0.44;
            if (format === astc.COMPRESSED_RGBA_ASTC_8x8_KHR) return 0.25;
            if (format === astc.COMPRESSED_RGBA_ASTC_10x10_KHR) return 0.16;
            if (format === astc.COMPRESSED_RGBA_ASTC_12x12_KHR) return 0.11;
        }
        const pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc');
        if (pvrtc) {
            switch (format) {
                case pvrtc.COMPRESSED_RGB_PVRTC_4BPPV1_IMG: return 0.5;
                case pvrtc.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: return 0.5;
                case pvrtc.COMPRESSED_RGB_PVRTC_2BPPV1_IMG: return 0.25;
                case pvrtc.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: return 0.25;
            }
        }
        if (this.gl instanceof WebGL2RenderingContext) {
            switch (format) {
                case gl.R8: return 1;
                case gl.R16F: return 2;
                case gl.R32F: return 4;
                case gl.RG8: return 2;
                case gl.RG16F: return 4;
                case gl.RG32F: return 8;
                case gl.RGB8: return 3;
                case gl.RGBA8: return 4;
                case gl.RGB16F: return 6;
                case gl.RGBA16F: return 8;
                case gl.RGB32F: return 12;
                case gl.RGBA32F: return 16;
            }
        }
        return 4;
    }

    beginFrame() {
        this.drawCalls = 0;
        this.frameStats = {
            vramAllocatedThisFrame: 0,
            vramFreedThisFrame: 0
        };
    }

    getTotalBufferSize() {
        let total = 0;
        for (const buffer of this.activeBuffers) {
            total += this.bufferSizes.get(buffer) || 0;
        }
        return total;
    }

    getMetrics() {
        const totalBufferSize = this.getTotalBufferSize();
        return {
            drawCalls: this.drawCalls,
            estimatedVRAM: this.estimatedVRAM,
            estimatedVRAMMB: Math.round(this.estimatedVRAM / (1024 * 1024) * 100) / 100,
            activeBufferCount: this.activeBuffers.size,
            activeTextureCount: this.activeTextures.size,
            activeCubemapCount: this.activeCubemaps.size,
            totalBufferSize: totalBufferSize,
            totalBufferSizeMB: Math.round(totalBufferSize / (1024 * 1024) * 100) / 100,
            frameStats: {
                ...this.frameStats,
                vramAllocatedThisFrameMB: Math.round(this.frameStats.vramAllocatedThisFrame / (1024 * 1024) * 100) / 100,
                vramFreedThisFrameMB: Math.round(this.frameStats.vramFreedThisFrame / (1024 * 1024) * 100) / 100
            }
        };
    }

    reset() {
        this.drawCalls = 0;
        this.estimatedVRAM = 0;
        this.activeBuffers.clear();
        this.activeTextures.clear();
        this.activeCubemaps.clear();
        this.bufferSizes = new WeakMap();
        this.textureSizes = new WeakMap();
        this.cubemapSizes = new WeakMap();
        this.beginFrame();
    }
}

window.gameStatsExtensions.webgl = WebGLStats;
