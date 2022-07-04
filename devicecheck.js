let g_mobiledevice = false; //iPhone、iPad、Androidのときtrue
let g_browsername = 'unknown';
let g_browserver = -1;
 
if (checkUserAgent() == false) {
	window.alert('このブラウザは対象外です');
}
 
function checkUserAgent() {
	let ua = navigator.userAgent;
	let mstr = ua.match(/iPhone OS \d+/); //iPhoneか？
	if (mstr != null) {
		let vstr = mstr[0].match(/\d+/);
		if (parseInt(vstr[0]) >= 3) {
			g_mobiledevice = true;
			g_browsername = 'iPhone';
			return true;
		}
	}
	if (ua.indexOf('iPad') > -1) { //iPadか？
		mstr = ua.match(/CPU OS \d+/);
		if (mstr != null) {
			let vstr = mstr[0].match(/\d+/);
			if (parseInt(vstr[0]) >= 3) {
				g_mobiledevice = true;
				g_browsername = 'iPad';
				return true;
			}       
		}       
	}   
	mstr = ua.match(/Android \d+\.\d+/); //Androidか？ 
	if (mstr != null) {
		g_browsername = 'Android';
		let vstr = mstr[0].match(/\d+\.\d+/);
		g_browserver = parseFloat(vstr[0]);
		g_mobiledevice = true;
		if(pg_browserver > 2.1) {
			return true;
		}
	}
	mstr = ua.match(/Chrome\/\d+/); //Chromeか？
	if (mstr != null) {
		g_browsername = 'Chrome';
		let vstr = mstr[0].match(/\d+/);
		g_browserver = parseInt(vstr[0]);
		if (g_browserver >= 9) {
			return true;
		}       
	}
	if (ua.indexOf('Safari') > -1) { //Safariか？
		mstr = ua.match(/Version\/\d+/);
		if (mstr != null) {
			let vstr = mstr[0].match(/\d+/);
			if (parseInt(vstr[0]) >= 5) {
				g_browsername = 'Safari';
				return true;
			}
		}
	}
	mstr = ua.match(/rv\:\d+.\d\) like Gecko/); //Internet Explorer11以降か？
	if (mstr != null) {
		let vstr = mstr[0].match(/\d+/);
		if (parseInt(vstr[0]) >= 9) {
			g_browsername = 'MSIE';
			return true;
		}
	}
	mstr = ua.match(/MSIE \d+/); //Internet Explorerか？
	if (mstr != null) {
		let vstr = mstr[0].match(/\d+/);
		if (parseInt(vstr[0]) >= 9) {
			g_browsername = 'MSIE';
			return true;
		}       
	}
	mstr = ua.match(/Firefox\/\d+/); //Firefoxか？
	if (mstr != null) {
		let vstr = mstr[0].match(/\d+/);
		if (parseInt(vstr[0]) >= 4) {
			g_browsername = 'Firefox';
			return true;
		}       
	}
	if (ua.indexOf('Opera') > -1) { //Operaか？
		mstr = ua.match(/Version\/\d+/);
		if (mstr != null) {
			let vstr = mstr[0].match(/\d+/);
			if (parseInt(vstr[0]) >= 11) {
				g_browsername = 'Opera';
				return true;
			}       
		}       
	}
	return false;
}
