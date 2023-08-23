## save-svg-as-png 库的使用

### 简单介绍

这是一个把Svg保存为png的库，仅4KB大小，基于Promise，能够处理svg中的字体、css等。

[exupero/saveSvgAsPng: Save SVGs as PNGs from the browser. (github.com)](https://github.com/exupero/saveSvgAsPng)

### 简单使用

- 主要使用saveSvgAsPng和svgAsDataUri两个函数
- options：（ 部分属性，还有一些其他的选项值，感觉暂时用不上
  - width height，长宽，默认为svg自带的属性值
  - top left，图像在viewbox中的位置，默认为 0 0
  - scale，缩放，默认为1
  
  ---
  
  

```jsx
import React, { useEffect, useState } from 'react';
import { saveSvgAsPng, svgAsDataUri } from 'save-svg-as-png';
import { Bytedance } from '@icon-park/svg';
import { Button } from 'antd';

const SaveSvgAsPngDemo = (props) => {
  const showRef = React.createRef();
  // 从icon库中获取svg字符串
  const svgStr = Bytedance({ theme: 'filled' });

  useEffect(() => {
    // 初始化页面
    const xmlNode = new DOMParser().parseFromString(svgStr, 'text/xml').documentElement;
    xmlNode.setAttribute('width', '2em');
    xmlNode.setAttribute('height', '2em');
    showRef.current.appendChild(xmlNode);
  });

  function handleDownload() {
    const option = {
      backgroundColor: 'white', // 背景颜色，默认透明
      height: 100, // 大小
      width: 100,
      top: 0, // 在viewbox中的位置
      left: 0,
      scale: 1 // 缩放
    };
    // 转换成SvgUri
    svgAsDataUri(showRef.current.firstChild).then((res) => {
      console.log(res);
    });
    // 直接下载
    saveSvgAsPng(showRef.current.firstChild, 'test.png', option);
  }

  return (
    <div>
      <div style={{ fontSize: '16px' }} ref={showRef}></div>
      <div>
        <Button onClick={handleDownload}>一键下载</Button>
      </div>
    </div>
  );
};
```
