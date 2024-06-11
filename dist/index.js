class AlphaVideo {
    options = {
        src: '',
        autoplay: true,
        loop: true,
        canvas: document.createElement('canvas'),
        width: 375,
        height: 300,
        onError: function () { },
        onPlay: function () { }
    };
    radio;
    video = document.createElement('video');
    playing = false;
    canvas = document.createElement('canvas');
    gl = this.canvas.getContext('webgl');
    constructor(options) {
        this.options = Object.assign(this.options, options);
        const { autoplay, canvas, width, height } = this.options;
        this.radio = window.devicePixelRatio;
        this.canvas = canvas;
        this.canvas.width = width * this.radio;
        this.canvas.height = height * this.radio;
        this._initVideo();
        this._initWebgl();
        if (autoplay) {
            this.video.play();
        }
    }
    _initVideo() {
        const { onPlay, onError, loop = false, src } = this.options;
        const video = this.video;
        video.autoplay = false;
        video.muted = true;
        video.volume = 0;
        video.muted = true;
        video.loop = loop;
        video.setAttribute('x-webkit-airplay', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.style.display = 'none';
        video.src = src;
        video.crossOrigin = 'anonymous';
        video.addEventListener('canplay', () => {
            this.playing = true;
            onPlay && onPlay();
        });
        video.addEventListener('error', () => {
            onError && onError();
        });
        video.addEventListener('play', () => {
            window.requestAnimationFrame(() => {
                this._drawFrame();
            });
        });
        document.body.appendChild(video);
        this.video = video;
    }
    _drawFrame() {
        if (this.playing) {
            this._drawWebglFrame();
        }
        window.requestAnimationFrame(() => {
            this._drawFrame();
        });
    }
    _drawWebglFrame() {
        const gl = this.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    play() {
        this.playing = true;
        this.video.play();
    }
    pause() {
        this.playing = false;
        this.video.pause();
    }
    _initWebgl() {
        if (!this.canvas) {
            const { width, height } = this.options;
            this.canvas = document.createElement('canvas');
            this.canvas.width = width * this.radio;
            this.canvas.height = height * this.radio;
            this.gl = this.canvas.getContext('webgl');
            document.body.appendChild(this.canvas);
        }
        this.canvas.addEventListener('click', () => {
            this.play();
        });
        const gl = this.gl;
        gl.viewport(0, 0, this.options.width * this.radio, this.options.height * this.radio);
        const program = this._initShaderProgram(gl);
        gl.linkProgram(program);
        gl.useProgram(program);
        const buffer = this._initBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        const aPosition = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.texture);
        const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
        gl.enableVertexAttribArray(aTexCoord);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
        const texture = this._initTexture(gl);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const scaleLocation = gl.getUniformLocation(program, 'u_scale');
        gl.uniform2fv(scaleLocation, [this.radio, this.radio]);
        this.gl = gl;
    }
    _createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(shader);
        }
        return shader;
    }
    _initShaderProgram(gl) {
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            uniform vec2 u_scale;
            void main(void) {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        const fsSource = `
        precision lowp float;
        varying vec2 v_texCoord;
        uniform sampler2D u_sampler;
        void main(void) {
            gl_FragColor = vec4(texture2D(u_sampler, v_texCoord).rgb, texture2D(u_sampler, v_texCoord+vec2(-0.5, 0)).r);
        }
        `;
        const vsShader = this._createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fsShader = this._createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        gl.linkProgram(program);
        return program;
    }
    _initBuffer(gl) {
        const positionVertice = new Float32Array([
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0
        ]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionVertice, gl.STATIC_DRAW);
        const textureBuffer = gl.createBuffer();
        const textureVertice = new Float32Array([
            0.5, 1.0,
            1.0, 1.0,
            0.5, 0.0,
            1.0, 0.0
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, textureVertice, gl.STATIC_DRAW);
        return {
            position: positionBuffer,
            texture: textureBuffer
        };
    }
    _initTexture(gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
}

export { AlphaVideo as default };
