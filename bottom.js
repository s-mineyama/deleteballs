let uploadfile = document.querySelector('#file');

uploadfile.onchange = function (){
	let fileList = file.files;
	let reader = new FileReader();
	reader.readAsText(fileList[0]);
	reader.onload = function  () {
		if (reader.result.length >= 48 && reader.result.length < 52) { // セキュリティチェック
			let ok = 1;
			for (i = 0; i < 48; i++) {
				if (reader.result.charCodeAt(i) < 48 || reader.result.charCodeAt(i) > 58) {
					ok = 0;
				}
			}
			if (ok == 1) {
				let strs = reader.result.split('');
				let i = 0;
				for (let i3 = 0; i3 < gp.py.row; i3++) {
					for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.p[i3][i4] = strs[i++];
				}
				for (let i3 = 0; i3 < gp.py.row; i3++) {
					for (let i4 = 0; i4 < gp.py.col; i4++) gp.py.ck[i3][i4] = 0;
				}
				gp.py.draw();
				gp.py.draw2();
			};
		};
	};
};
