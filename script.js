
let ctx;
let angleTop = 0;
const INTERVAL_ANGLE = Math.PI / 6;

const nodes = [
    "a","b","c"
];

document.addEventListener("DOMContentLoaded", (event) => {
    const canvas = document.getElementById('canvas'); // Canvasの取得
    ctx = canvas.getContext('2d'); // Canvasからコンテキスを取得
    _loop(); // ループ処理
});


function _loop() {
    window.requestAnimFrame(_loop);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //-----------------------------------------------
    // パソコンなのかスマホなのか調べる
    let isMobileMode = false;
    if( document.body.clientWidth > document.body.clientHeight ){
        isMobileMode = false; // パソコンモード
    }
    else {
        isMobileMode = true; // スマホモード
    }
    //-----------------------------------------------
    angleTop += _getScroll({ isMobileMode }) * 0.001;
    if( isMobileMode ){
        // スマホモード
        if( angleTop > Math.PI/2 ){
            angleTop = Math.PI/2;
        }
        let angleBottom = angleTop + ((nodes.length-1)*INTERVAL_ANGLE);
        if( angleBottom < Math.PI/2 ){
            angleBottom = Math.PI/2;
            angleTop = Math.PI/2 - (nodes.length-1)*INTERVAL_ANGLE;
        }
    }
    else{
        // パソコンモード
        if( angleTop > 0 ){
            angleTop = 0;
        }
        let angleBottom = angleTop + ((nodes.length-1)*INTERVAL_ANGLE);
        if( angleBottom < 0 ){
            angleBottom = 0;
            angleTop = -(nodes.length-1)*INTERVAL_ANGLE;
        }
    }
    //-----------------------------------------------
    // 座標変換
    ctx.save(); // 座標系を保存する
    ctx.translate(1000, 500);   // 原点を中央に移動する
    if( isMobileMode ){
        // スマホモード
        ctx.translate(0, -300);   // 原点を移動する
    }
    else{
        // パソコンモード
        ctx.translate(-350, 0);   // 原点を移動する
    }
    //-----------------------------------------------
    // ここにアニメーションの処理を書く
    _drawCircle({ x:0, y:0, isSaved:true, size:20, text:"犯罪係数" });
    for( let i=0; i<nodes.length; i++ ){
        const node = nodes[i];
        const angle = angleTop+(i*INTERVAL_ANGLE);
        if( angle<-Math.PI*0.75 || Math.PI*1.25<angle ){
            continue;
        }
        _drawCircle({ 
            x: 400 * Math.cos(angle),
            y: 400 * Math.sin(angle),
            isSaved:false,
            size:20,
            text:node
        });
    }
    //-----------------------------------------------
    ctx.restore();  // 直近に保存した座標系に戻す
}


//#############################################################################################
// _loop関数の中から呼び出しているサブ関数


// 円を描画する関数
function _drawCircle({ x, y, isSaved, size, text }){
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    if( isSaved ){
        ctx.fillStyle = "rgba(0,0,255,0.1)";
        ctx.strokeStyle = 'deepskyblue';
        ctx.shadowColor = '#0000ff';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 5;
    }
    else{
        ctx.fillStyle = "rgba(0,0,255,0.1)";
        ctx.strokeStyle = 'deepskyblue';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
    }
    ctx.stroke();
    ctx.fill();
    //
    // 文字を描画する
    ctx.font = "24px serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(100,200,255)";
    ctx.fillText(text, x, y+size*2.5);
}

//#############################################################################################
// requestAnimationFrame未対応のブラウザ対策
window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();


//#############################################################################################

let scrollDeltaX = 0;   // X軸方向のスクロール距離
let scrollDeltaY = 0;   // Y軸方向のスクロール距離

// スクロール量を取得する関数
function _getScroll({ isMobileMode }){
    // 左スワイプに対応するためMath.abs()で+に変換
    const distanceX = Math.abs(scrollDeltaX);
    const distanceY = Math.abs(scrollDeltaY);
    let answer = 0; // 左右関係ないスクロール量
    if( isMobileMode ){
        // スマホモード かつ 左右のスワイプ距離の方が上下より長い
        if (distanceX > distanceY) {
            answer = scrollDeltaX;  // 左右スワイプ
        }
    }
    else{
        // パソコンモード かつ 上下のスワイプ距離の方が左右より長い
        if (distanceX < distanceY) {
            answer = scrollDeltaY;  // 上下スワイプ
        }
    }
    if ( Math.abs(answer) < 30) {
        answer = 0; // 小さなスワイプは検知しないようにする
    }
    scrollDeltaX = 0;
    scrollDeltaY = 0;
    return answer;
}

// スワイプ開始時の座標
let touchStartX = 0
let touchStartY = 0

// スワイプ開始
window.addEventListener('touchstart', (e) =>  {
    touchStartX = e.touches[0].pageX;
    touchStartY = e.touches[0].pageY;
    return false;   // 進む＆戻るを無効化
});

// スワイプ終了
window.addEventListener('touchend', (e) =>  {
    touchStartX = -1;
    touchStartY = -1;
});

// スワイプ中
window.addEventListener('touchmove', (e) =>  {
    if( touchStartX === -1 || touchStartY === -1 ){
        return false;   // 進む＆戻るを無効化
    }
    scrollDeltaX = -(e.changedTouches[0].pageX - touchStartX);
    scrollDeltaY = -(e.changedTouches[0].pageY - touchStartY);
    return false;   // 進む＆戻るを無効化
})

// マウスホイール
window.addEventListener('wheel', (event) => {
    scrollDeltaX = 0;
    scrollDeltaY += event.deltaY;
});

//#############################################################################################
