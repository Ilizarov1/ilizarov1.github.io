# SVG

## 1. SVG与Canvas

- 两种绘图方式
- SVG图像可以绘制在Canvas上
- API 参考：[Canvas - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

## 2. Canvas绘制SVG

核心：drawImage()

[CanvasRenderingContext2D.drawImage() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)

PS：有一个实验中的API Path2D() 可以直接绘制SVG路径

[Path2D() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Path2D/Path2D)

```javascript
  function handleDraw(multi) {
    return () => {
      const svgImg = imgRef.current; // 使用svg作为src的image标签
      const canvas = canvasRef.current;// canvas元素
      const ctx = canvas.getContext('2d'); // 获取2d图像绘制功能
      let width = svgImg.clientWidth * multi;// multi: 放大倍数
      let height = svgImg.clientHeight * multi;
      canvas.width = width;// 设置canvas的大小
      canvas.height = height;
      ctx.drawImage(svgImg, 0, 0, width, height);
    };
  }  
  /**
   * 使用Path2D API绘制SVG Paths
   */
  function handleSVGPaths() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pureSvg = svgRef.current;
    const paths = pureSvg.childNodes;
    ctx.clearRect(0, 0, 48, 48);
    ctx.scale(2 / 3, 2 / 3); // 不知道为什么画出来是48*48而不是32*32
    for (const p of paths) {
      const d = p.getAttribute('d');
      const stroke = p.getAttribute('stroke');
      const strokeWidth = p.getAttribute('stroke-width');
      const strokeLinejoin = p.getAttribute('stroke-linejoin'); // 获取各种属性
      const p2d = new Path2D(d); // 创建svg path
      ctx.strokStyle = stroke; // 设置颜色宽度连接方式等
      ctx.lineWidth = (Number(strokeWidth) * 2) / 3;
      ctx.lineJoin = strokeLinejoin;
      ctx.stroke(p2d); // 绘制
    }
  }
```

```html
        <svg ref={svgRef} width='32' height='32' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M5 7L10 9V37L5 39V7Z' fill='none' stroke='#333' strokeWidth='4' strokeLinejoin='round' />
          <path d='M16 23L21 25V37L16 39V23Z' fill='none' stroke='#333' strokeWidth='4' strokeLinejoin='round' />
          <path d='M27 21L32 19V35L27 33V21Z' fill='none' stroke='#333' strokeWidth='4' strokeLinejoin='round' />
          <path d='M38 9L43 11V37L38 39V9Z' fill='none' stroke='#333' strokeWidth='4' strokeLinejoin='round' />
        </svg>
```

## 3.  SVG导出为PNG

核心：通过DataUrl创建链接进行下载

```javascript
  function handle2PNG() {
    const canvas = document.getElementById('canvas');
    const data = canvas.toDataURL('image/png', 1); // 类型,图片质量
    const a = document.createElement('a'); // 创建下载链接
    a.href = data;
    a.download = 'svgDemo.png';
    a.click();
  }
```

## 4.  SVG转换为PNG Uri

核心：SVG -> SVG Base64 Uri -> \<image/> -> canvas -> toDataURL(‘image/png’)

1. 对SVG进行预处理
   
   1. 处理内部的\<image/>
   2. 处理CSS

2. 把SVG转换为base64编码的Uri
   
   1. API window.btoa() [WindowOrWorkerGlobalScope.btoa() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/btoa)

3. 通过获得的SVG DataUri，新建\<image/>

4. image加载成功时，利用回调，转换为PNG Uri：
   
   1. 创建canvas
   2. 利用drawImage() 把\<image />绘制在canvas上
   3. 利用canvas.toDataURL(‘image/png’,1) 转换为PNG Uri

5. 参考：npm 包 save-svg-as-png [exupero/saveSvgAsPng: Save SVGs as PNGs from the browser. (github.com)](https://github.com/exupero/saveSvgAsPng)

```javascript
  /**
   * 保存为png，原理是动态创建canvas标签，利用toDataURL()创建下载链接
   * @param {object} src image
   * @param {number} width image.width
   * @param {number} height image.height
   */

  function convertToPng(src, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.drawImage(src, 0, 0);

    const png = canvas.toDataURL('image/png', 1);

    const a = document.createElement('a');
    a.href = png;
    a.download = 'saveAsPng';
    a.click();
  }

  /**
   * 保存为png简单Demo
   */
  function saveAsPng() {
    const pureSvg = svgRef.current;
    const s = new XMLSerializer();
    const src = s.serializeToString(pureSvg); // 对svg进行序列化，转为字符串
    const doctype =
      '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>';
    const svgUri = `data:image/svg+xml;base64,${window.btoa(doctype + src)}`; // 转为base64编码的dataUri
    const image = new Image();
    image.onload = () => {
      convertToPng(image, image.width, image.height);
    };
    image.onerror = () => {
      console.log('image load error');
    };
    image.src = svgUri;
  }
```

## 5. SVG字符串与SVG元素的互相转换

1. SVG字符串 -> SVG元素

```javascript
  /**
   * 把SVG字符串转换为XML
   * @param {string} str svg字符串
   * @returns XML
   */
  function str2svg(str) {
    return new DOMParser().parseFromString(str, 'text/xml');
  }
  const svgNode = str2svg(svg).documentElement;
  ParentDIV.appendChild(svgNode); // 添加svg元素
```

2. SVG元素 -> SVG字符串

```javascript
    const pureSvg = svgRef.current; // 获取svg元素
    const s = new XMLSerializer();
    const src = s.serializeToString(pureSvg); // 对svg进行序列化，转为字符串
    const doctype =
      '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>';
    const svgString = doctype + src; // 拼接
```

## 6. 对图标的一些属性的简单修改

核心：使用setAttribute()对svg元素进行简单的设置

1. 代码

```javascript
 /**
   * 简单修改svg元素的属性
   * @param {object} config svg设置
   * @param {HTMLElement} svgNode svg元素
   * @returns
   */
  function setConfig(config, svgNode) {
    const {
      size = '3em',
      strokeWidth = '4',
      strokeLinejoin = 'round',
      stroke = '#333'
    } = config || {};
    if (svgNode == null) return;
    svgNode.setAttribute('width', size);
    svgNode.setAttribute('height', size);
    for (const child of svgNode.childNodes) {
      child.setAttribute('stroke-width', strokeWidth);
      child.setAttribute('stroke-linejoin', strokeLinejoin);
      child.setAttribute('stroke', stroke);
    }
  }
```

2. Demo地址：[Ilizarov1/react_blog (github.com)](https://github.com/Ilizarov1/react_blog)

# Lottie

可以对AE转出的json格式动画进行实时渲染

## 1. 简单使用

1. 主要使用了react-lottie库，该库将 lottie-web 进行了一些封装，便于在react中使用

2. [chenqingspring/react-lottie: Render After Effects animations on React based on lottie-web (github.com)](https://github.com/chenqingspring/react-lottie)

3. ```javascript
   import Lottie from 'react-lottie';
   import * as LineAnimation from '../public/LineAnimation.json';
   
   const MyLottie = (props) => {
     const options = {
       loop: true,
       autoPlay: true,
       animationData: LineAnimation,
       rendererSettings: {
         preserveAspectRatio: 'xMidYMid slice'
       }
     };
     return <Lottie options={options} />;
   };
   ```
