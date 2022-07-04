mp = null; // MainPanel オブジェクト
gp = null; // GamePanel オブジェクト
gp0 = null; // GamePanel オブジェクト
pimg = new Array();
pimg[0] = new Image();
pimg[1] = new Image();
pimg[2] = new Image();
pimg[3] = new Image();
pimg[4] = new Image();
to_ck = 0; // ぬりつぶしか黒点か
pimg[0].src = "img/redp.png";
pimg[1].src = "img/bluep.png";
pimg[2].src = "img/greenp.png";
pimg[3].src = "img/yellowp.png";
pimg[4].src = "img/purplep.png";
startstr = "";

let mouseX = 0;
let mouseY = 0;
let buttonStart = null;
let xx = 0;
let yy = 0;
let lc = 0;

window.addEventListener("load", init, false);

gp = new GamePanel(); // GamePanel オブジェクト

function init() {
	if (g_mobiledevice == true) { //ボタンタイプ
		buttonStart = 'touchstart';
	} else if (g_browsername == "MSIE" && window.navigator.msPointerEnabled) {
		buttonStart = 'MSPointerDown';
	} else {
		buttonStart = 'mousedown';
	}
	document.getElementById('canvas_e').addEventListener('touchstart', function() {event.preventDefault();});
	document.getElementById('canvas_e').addEventListener(buttonStart, mouseDownHandler, false);
}

function setMouseXY(e) {
	let rect;
	if (g_mobiledevice) {
		rect = e.currentTarget.getBoundingClientRect();
		mouseX = e.touches[0].pageX - rect.left;
		mouseY = e.touches[0].pageY - rect.top;
	} else if (g_browsername == 'MSIE' || g_browsername == 'Opera') {
		rect = document.getElementById("canvas_e").getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	} else if (g_browsername == 'Firefox') {
		rect = document.getElementById("canvas_e").getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	} else {
		rect = e.currentTarget.getBoundingClientRect();
		mouseX =  e.clientX - rect.left;
		mouseY =  e.clientY - rect.top;
	}
}

function mouseDownHandler(e) {
	setMouseXY(e);
	xx = Math.floor(mouseX / 40);
	yy = Math.floor(mouseY / 40);
	if (to_ck == 0) {
		gp.py.p[yy][xx] = lc;
		gp.py.ck[yy][xx] = 0;
	} else {
		if (gp.py.ck[yy][xx] == 0) {
			gp.py.ck[yy][xx] = 1;
		} else {
			gp.py.ck[yy][xx] = 0;
		}
	}
	gp.py.draw();
	gp.py.draw2();
}

function SaveToFile(FileName,Stream) {
	if (window.navigator.msSaveBlob) {
		window.navigator.msSaveBlob(new Blob([Stream], { type: "text/plain" }), FileName);
	} else {
		let a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([Stream], { type: "text/plain" }));
		//a.target   = '_blank';
		a.download = FileName;
		document.body.appendChild(a) //  FireFox specification
		a.click();
		document.body.removeChild(a) //  FireFox specification
	}
}

function download(){    
	let stream = "";
	for (let i3 = 0; i3 < gp.py.row; i3++) {
		for (let i4 = 0; i4 < gp.py.col; i4++) stream = stream + "" + gp.py.p[i3][i4];
	}
	SaveToFile('ball.txt',stream);
}

function init_pp() {
	for (let i3 = 0; i3 < gp.py.row; i3++) { // 全ての pp を 0 にしてから始める
		for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.pp[i3][i4] = 0;
	}
}

// MainPanel の開始
function mp_start() {
	// キャンバス情報
	let canvas = document.getElementById('canvas_e'); // キャンバス要素の取得
	let ctx = canvas.getContext('2d'); // キャンバスからコンテキストを取得
	mp = new MainPanel(canvas, ctx); // MainPanel オブジェクト
	st_start(); // StartPanel の表示

	if (startstr.length == 96) {
		let strs = startstr.split('');
		let i = 0;
		for (let i3 = 0; i3 < gp.py.row; i3++) {
			for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.p[i3][i4] = strs[i++];
		}
		for (let i3 = 0; i3 < gp.py.row; i3++) {
			for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.ck[i3][i4] = strs[i++];
		}
		gp.py.draw();
		gp.py.draw2();
	}
}

// MainPanel オブジェクト（プロパティ）
function MainPanel(canvas, ctx) {
	this.canvas = canvas; // キャンバス要素
	this.ctx = ctx; // キャンバスのコンテキスト
	return this;
}

// StartPanel の開始
function st_start() {
	mp.ctx.fillStyle = "rgb(125, 125, 125)";
	mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height); // キャンバスのクリア
	// ボタンの表示制御
	document.getElementById('start').style.display = ""; // "none"で消える
	document.getElementById('start').innerHTML = "消去開始";

	init_pp();
	gp.py.draw();
	gp.py.draw2();
	// ゲームタイトルの表示
	mp.ctx.font = "40px 'ＭＳ ゴシック'";
	mp.ctx.textBaseline = "middle";
	mp.ctx.textAlign = "center";
	mp.ctx.fillStyle = "rgb(0, 0, 0)";
	mp.ctx.fillText("ボールを", mp.canvas.width/2, mp.canvas.height/2-20);
	mp.ctx.fillText("消そう！", mp.canvas.width/2, mp.canvas.height/2+20);
}

// GamePanel の開始
function gp_start() {
	if (del_none() > 0) {
		gp.py.draw();
		gp.py.draw2();
	} else {
		let ct = 0;
		let ct_max = 0;
		init_pp();
		for (let i1 = gp.py.row-1; i1 >= 0; i1--) {
			for (let i2 = 0; i2 < gp.py.col; i2++) {
				if (gp.py.p[i1][i2] > 0 && gp.py.pp[i1][i2] == 0) {
					gp.py.pp[i1][i2] = 1;
					ct = gp.py.search(i1, i2, 1);
					if (ct >= gp.py.d_no) { // ぷよを消すべきなら、pp を 4 以上にしておく
						gp.py.pp[i1][i2] = ct;
						ct_max = ct;
						for (let i3 = 0; i3 < gp.py.row; i3++) {
							for (let i4 = 0; i4 < gp.py.col; i4++)
								if (gp.py.pp[i3][i4] == 1) gp.py.pp[i3][i4] = ct_max;
						}
					} else {
						for (let i3 = 0; i3 < gp.py.row; i3++) {
							for (let i4 = 0; i4 < gp.py.col; i4++)
								if (gp.py.pp[i3][i4] == 1) gp.py.pp[i3][i4] = 0; // 探索で仮に 1 となった場所を 0 に戻す
						}
					}
				}
			}
		}
		if (ct_max >= gp.py.d_no){
			gp.py.del();
			gp.py.draw();
			gp.py.draw2();
		}
	}

	// ボタンの表示制御
	document.getElementById('start').style.display = "";
	document.getElementById('start').innerHTML = "消去開始";
}

// GamePanel オブジェクト（プロパティ）
function GamePanel() {
	this.timerID = -1;
	this.in_game = true;   // ゲーム中か否か
	this.py = new Circ();
	return this;
}

// Circ オブジェクト（プロパティ）
function Circ() {
	this.p_x; // 左または上のピースの座標（横）
	this.p_y; // 左または上のピースの座標（縦）
	this.row = 6; // ゲーム画面の行数
	this.col = 8; // ゲーム画面の列数
	this.width = 40; // ピースの幅と高さ
	this.rot; // 0:横，1:縦
	this.p = new Array(); // 画面の状態（0:存在しない，1:赤，2:青，3:緑，4:黄, 5:紫）修正 2016/7
	for (let i1 = 0; i1 < this.row; i1++) {
		this.p[i1] = new Array();
		for (let i2 = 0; i2 < this.col; i2++)	this.p[i1][i2] = 0;
	}
	this.ck = new Array(); // 画面の状態（0:透明，1:黒点)
	for (let i1 = 0; i1 < this.row; i1++) {
		this.ck[i1] = new Array();
		for (let i2 = 0; i2 < this.col; i2++)	this.ck[i1][i2] = 0;
	}
	this.d_no = 4; // 同じ色のピースがd_no以上連続すると消去
	this.pp = new Array(); // work
	for (let i1 = 0; i1 < this.row; i1++) this.pp[i1] = new Array();
	return this;
}

// 同じ色のピースを探す
//      k1,k2 : 対象としているピース
//      c1 : 同じ色のピースの数
//      return : 同じ色のピースの数
Circ.prototype.search = function(k1, k2, c1) {
	let ct = c1;
	if (k1 > 0 && gp.py.p[k1-1][k2] == gp.py.p[k1][k2] && gp.py.pp[k1-1][k2] == 0) {
		gp.py.pp[k1-1][k2] = 1;
		ct = gp.py.search(k1-1, k2, ct+1);
	}
	if (k1 < gp.py.row-1 && gp.py.p[k1+1][k2] == gp.py.p[k1][k2] && gp.py.pp[k1+1][k2] == 0) {
		gp.py.pp[k1+1][k2] = 1;
		ct = gp.py.search(k1+1, k2, ct+1);
	}
	if (k2 > 0 && gp.py.p[k1][k2-1] == gp.py.p[k1][k2] && gp.py.pp[k1][k2-1] == 0) {
		gp.py.pp[k1][k2-1] = 1;
		ct = gp.py.search(k1, k2-1, ct+1);
	}
	if (k2 < gp.py.col-1 && gp.py.p[k1][k2+1] == gp.py.p[k1][k2] && gp.py.pp[k1][k2+1] == 0) {
		gp.py.pp[k1][k2+1] = 1;
		ct = gp.py.search(k1, k2+1, ct+1);
	}
	return ct;
}

// 同じ色のピースを削除
Circ.prototype.del = function() {
	// 削除
	for (let i1 = 0; i1 < gp.py.row; i1++) {
		for (let i2 = 0; i2 < gp.py.col; i2++) {
			if (gp.py.pp[i1][i2] > 0) gp.py.p[i1][i2] = 0;
		}
	}
	// 詰める
	for (let i1 = 0; i1 < gp.py.col; i1++) {
		k1 = 1;
		for (let i2 = gp.py.row-1; i2 > 0 && k1 >= 0; i2--) {
			if (gp.py.p[i2][i1] == 0) {
				k1 = -1;
				for (i3 = i2-1; i3 >= 0 && k1 < 0; i3--) {
					if (gp.py.p[i3][i1] > 0) k1 = i3;
				}
				if (k1 >= 0) {
					k2 = i2;
					k3 = k2 - k1;
					while (k1 >= 0) {
						gp.py.p[k2][i1] = gp.py.p[k1][i1];
						k1--;
						k2--;
					}
					k1++;
					for (i3 = 0; i3 < k3; i3++) gp.py.p[i3][i1] = 0;
				}
			}
		}
	}
}

// Circ オブジェクト（メソッド draw）
Circ.prototype.draw = function() {
	mp.ctx.fillStyle = "rgb(125, 125, 125)";
	mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height); // キャンバスのクリア
	// 描画
	for (let i1 = 0; i1 < gp.py.row; i1++) {
		for (let i2 = 0; i2 < gp.py.col; i2++) {
			if (gp.py.p[i1][i2] > 0) {
				mp.ctx.drawImage(pimg[gp.py.p[i1][i2] - 1], i2*gp.py.width, i1*gp.py.width);
			} else {
				mp.ctx.beginPath();
				mp.ctx.fillStyle = "rgb(147, 169, 188)";
				mp.ctx.fillRect(i2*gp.py.width, i1*gp.py.width, gp.py.width-1, gp.py.width-1);
				mp.ctx.fill();
			}
		}
	}
}

// Circ オブジェクト（メソッド 必ず draw の後)
Circ.prototype.draw2 = function() {
	mp.ctx.fillStyle = "rgb(0, 0, 0)";
	// 描画
	for (let i1 = 0; i1 < gp.py.row; i1++) {
		for (let i2 = 0; i2 < gp.py.col; i2++) {
			if (gp.py.ck[i1][i2] > 0) {
				mp.ctx.beginPath();
				mp.ctx.fillRect(i2*gp.py.width+(gp.py.width-10)/2, i1*gp.py.width+(gp.py.width-10)/2, 10, 10);
				mp.ctx.fill();
			}
		}
	}
}

// 追加の関数
function setcolor(num) {
	to_ck = 0;
	lc = num;
}

function setcolor2() {
	to_ck = 1;
}

function map_save() {
	gp0 = new GamePanel(); // GamePanel オブジェクト
	for (let i3 = 0; i3 < gp.py.row; i3++) {
		for (let i4 = 0; i4 < gp.py.col; i4++) gp0.py.p[i3][i4] = gp.py.p[i3][i4];
	}
	for (let i3 = 0; i3 < gp.py.row; i3++) {
		for (let i4 = 0; i4 < gp.py.col; i4++) gp0.py.ck[i3][i4] = gp.py.ck[i3][i4];
	}
}

function map_load() {
	for (let i3 = 0; i3 < gp.py.row; i3++) {
		for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.p[i3][i4] = gp0.py.p[i3][i4];
	}
	for (let i3 = 0; i3 < gp.py.row; i3++) {
		for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.ck[i3][i4] = gp0.py.ck[i3][i4];
	}
	gp.py.draw();		
	gp.py.draw2();		
}

function del_none() {
	let del = 0;
	for (let i3 = 0; i3 < gp.py.row; i3++) { // 全ての ck を 白 に置き換えてから始める
		for (let i4 = 0; i4 < gp.py.col; i4++) {
			if (gp.py.ck[i3][i4] > 0) {
				gp.py.ck[i3][i4] = 0;
				gp.py.p[i3][i4] = 0;
			}
		}
	}
	for (let i4 = 0; i4 < gp.py.col; i4++) { // x
		let none = 1;
		let i3_0 = 0;
		for (let i3 = gp.py.row - 1; i3 >= 0; i3--) { // y
			if (gp.py.p[i3][i4] == 0 && none == 1) {
				none = 0;
				i3_0 = i3;
			} else if (gp.py.p[i3][i4] > 0 && none == 0) {
				let i5, i6, i7;
				for (i5 = i3_0, i6 = i3; i6 >= 0; i5--, i6--) {
					gp.py.p[i5][i4] = gp.py.p[i6][i4];
				}
				for (i7 = i5; i7 >= 0; i7--) {
					gp.py.p[i7][i4] = 0;
				}
				i3 = i3_0;
				none = 1;
				del = 1;
			}
		}
	}
	return del;
}
