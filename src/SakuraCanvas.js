import React, { useEffect, useRef, useState } from 'react';
import Petal from './Petal'; // 注意路径要根据你的项目结构调整

const SakuraCanvas = () => {
    const canvasRef = useRef(null);
    const petals = useRef([]);
    const petalImages = useRef([]);
    const numPetals = 60;
    const petalNames = [
        "petal1",
        "petal2",
        "petal3",
        "petal4",
        "petal5",
        "petal6",
        "petal7",
        "petal8"
    ];
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // 加载单张图片
    const loadImage = (name) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // 根据你的项目，把图片放在 public 或者 src 下，并调整路径
            img.src = require(`./images/${name}.png`);
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    // 监听窗口变化，更新 canvas 尺寸
    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        const ctx = canvas.getContext('2d');

        // 加载所有花瓣图片，构造图片数组
        const loadImages = async () => {
            let images = [];
            // 这里我们重复使用图片达到所需数量
            for (let i = 0; i < numPetals; i++) {
                let name = petalNames[i % petalNames.length];
                try {
                    let img = await loadImage(name);
                    images.push(img);
                } catch (e) {
                    console.error("加载图片失败:", name, e);
                }
            }
            return images;
        };

        loadImages().then((imgs) => {
            petalImages.current = imgs;
            // 初始化花瓣数组
            petals.current = [];
            for (let i = 0; i < numPetals; i++) {
                petals.current.push(new Petal(canvas.width, canvas.height));
            }
            // 开始动画
            animate();
        });

        const animate = () => {
            // 清除整个画布（只在每一帧开始时清空）
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 更新并绘制每一个花瓣
            petals.current.forEach((petal, index) => {
                // 更新花瓣的 canvas 宽高（防止窗口改变时判断不准确）
                petal.canvasW = canvas.width;
                petal.canvasH = canvas.height;
                petal.move();
                // 使用对应的图片绘制花瓣
                const img = petalImages.current[index % petalImages.current.length];
                petal.draw(ctx, img);
            });
            requestAnimationFrame(animate);
        };
    }, [canvasSize]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none', // 不阻挡其他页面交互
                zIndex: -1 // 放在最底层
            }}
        />
    );
};

export default SakuraCanvas;