## 安装

```bash
 npm i @yuanjianming/video-to-canvas
```

## 使用

```html
<canvas class="video_canvas" id="videoCanvas" width="1680" height="2368"></canvas>
```

```javascript

        //.....
        const videoCanvas = new AlphaVideo({
            src: "http://f1.iplay.126.net/LTg4MDA1/c62f8e1f15e98ff9eb9a094d015db380.mp4",
            width: 140,
            height: 200,
            loop: true, // 是否循环播放
            canvas: document.getElementById('videoCanvas'),
        });
        videoCanvas.play();

```

## 选项

| 选项 | 是否必填  | 类型 | 默认值 | 备注 |
|:--------|:------:|-----:|-----:|-----:|
| src | 是 | string | '' | 视频地址（url）|
| autoplay | 否 | boolean | true | 是否自动播放 |
| loop | 否 | boolean | true | 是否循环播放 |
| canvas | 是 | HTMLCanvasElement  | null | canvas元素实例 |
| width | 否 | number | 375 | canvas标签宽度属性 |
| height | 否 | number | 300 | canvas标签高度属性 |
| onError | 否 | function | ()=>{} | 视频播放报错回调函数 |
| onPlay | 否 | function | ()=>{} | 视频播放回调函数 |
