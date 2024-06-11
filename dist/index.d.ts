import { IAlphaVideoConfig } from './types/index';
declare class AlphaVideo {
    options: {
        src: string;
        autoplay: boolean;
        loop: boolean;
        canvas: HTMLCanvasElement;
        width: number;
        height: number;
        onError: () => void;
        onPlay: () => void;
    };
    private radio;
    private video;
    private playing;
    private canvas;
    private gl;
    constructor(options: IAlphaVideoConfig);
    private _initVideo;
    private _drawFrame;
    private _drawWebglFrame;
    play(): void;
    pause(): void;
    private _initWebgl;
    private _createShader;
    private _initShaderProgram;
    private _initBuffer;
    private _initTexture;
}
export default AlphaVideo;
