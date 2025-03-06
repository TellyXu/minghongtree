// Petal.js
const randNum = (min, max) => {
    return Math.random() * (max - min) + min;
}

const calculateXY = (w, h) => {
    return new Promise((resolve, reject) => {
        let x = randNum(-h + 100, w - 100);
        let y = randNum(-h + 100, h - 100);
        let b = 60; // 加偏移量，防止初始化时恰好在边缘
        if (w >= h) {
            let a = w - h;
            if (x > -b && y > -b) {
                x = randNum(-h + b, a - b);
                y = randNum(-h + b, -b);
            } else if (x > a - b && y < -(h - (x - a) + b)) {
                y = randNum(-(h - (x - a) + b), -b);
            } else if (x < -b && y > h + x - b) {
                y = randNum(0, h + x - b);
            }
        } else {
            let a = h - w;
            if (x > -b && y > -b) {
                x = randNum(-w + b, -b);
                y = randNum(-w + b, a - b);
            } else if (x > -b && y < -(w - x) + b) {
                y = randNum(-(w - x) + b, -b);
            } else if (x < -b && y > h - x - b) {
                y = randNum(a, h - x - b);
            }
        }
        resolve({ x, y });
    });
}

export default class Petal {
    constructor(w, h) {
        this.canvasW = w;
        this.canvasH = h;
        this.w = 0;
        this.h = 0;
        // 随机初始化位置，保证初始时不在可视区边缘
        this.x = randNum(-h + 100, w - 100);
        this.y = randNum(-h + 100, h - 100);
        this.r = Math.random();
        this.scale = -Math.random();
        this.toLarge = false;
        this.speedX = Math.random() * 0.5 + 0.5;
        this.speedY = this.speedX;
        this.speedScale = Math.random() * 0.007;
        this.speedR = Math.random() * 0.03;
    }

    draw(ctx, img) {
        this.w = img.width;
        this.h = img.height;
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.r);
        ctx.scale(1, this.scale);
        ctx.drawImage(img, -this.w / 2, -this.h / 2);
        ctx.restore();
    }

    async init() {
        let xy = await calculateXY(this.canvasW, this.canvasH);
        this.x = xy.x;
        this.y = xy.y;
        this.r = Math.random();
        this.scale = -Math.random();
        this.speedX = Math.random() * 0.5 + 0.3;
        this.speedY = this.speedX;
        this.speedScale = Math.random() * 0.004;
        this.speedR = Math.random() * 0.03;
    }

    async move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.r += this.speedR;
        if (this.scale >= 1) {
            this.toLarge = false;
        } else if (this.scale <= 0) {
            this.toLarge = true;
        }
        if (this.toLarge) {
            this.scale += this.speedScale;
        } else {
            this.scale -= this.speedScale;
        }
        // 当花瓣移出可视区时，重新初始化
        if (this.x >= this.canvasW || this.y >= this.canvasH) {
            await this.init();
        }
    }
}