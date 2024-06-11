export interface IAlphaVideoConfig {
    src: string;
    autoplay?: boolean;
    loop?: boolean;
    canvas: HTMLCanvasElement | null;
    width?: number;
    height?: number;
    onError?: () => void;
    onPlay?: () => void;
}
export interface IAlphaVideo {
    options: IAlphaVideoConfig;
    radio: number;
    video: HTMLVideoElement;
    playing: boolean;
    canvas: HTMLCanvasElement | null;
    gl: WebGLRenderingContext | null;
    _initVideo: () => void;
    _drawFrame: () => void;
    _drawWebglFrame: () => void;
    play: () => void;
    pause: () => void;
    _initWebgl: () => void;
    _createShader: (gl: WebGLRenderingContext, type: number, source: string) => void;
    _initShaderProgram: (gl: WebGLRenderingContext) => void;
    _initBuffer: (gl: WebGLRenderingContext) => void;
    _initTexture: (gl: WebGLRenderingContext) => void;
}
