var chkWebsArry = new Array(); //签到列表数组（保存名称）
var chkCustomArry = new Array(); //自签到信息列表（签到属性）

//监听
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		chkStep(request);
		sendResponse({});
	});

//执行签到
function begChk() {
	//子项目签到
	if (chkCustomArry.length != 0) {
		chrome.tabs.create({
			url: chkCustomArry[0]["url"]
		}, function(tab) {
			var func = "checkMain(" + JSON.stringify(chkCustomArry[0]) + ");";
			runChkJS("check.js", func);
		});

		//根项目签到
	} else if (chkWebsArry.length != 0) {
		//根据名称获取签到网站信息
		var webItem = getItemByName(chkWebsArry[0]);

		if (webItem != null) {
			//打开签到网址，check.js根据网址执行签到
			chrome.tabs.create({
				url: webItem["url"]
			}, function(tab) {

				//一般签到
				if (typeof(webItem["custom"]) == 'undefined' || webItem["custom"] == false) {
					var func = "checkMain(" + JSON.stringify(webItem) + ");";
					runChkJS("check.js", func);
					//自定义签到
				} else {
					var func = "checkMain('" + webItem["title"] + "');";
					runChkJS("/custom/" + webItem["custom_js"], func);
				}
			});
		} else {
			alert(chkWebsArry[0] + "配置错误！");
			chkStep("chkNext");
		}
	} else {
		alert("签到完毕！");
	}
}

//判断签到步骤
function chkStep(request) {
	var type = request.type;

	//首页执行开始签到
	if (type == "begChk") {
		chrome.storage.local.get("chkWebs", function(valueArray) {
			var chkWebs = valueArray["chkWebs"];
			chkCustomArry = new Array();

			var noChkWebs = new Array();
			var successWebs = request.successWebs["web"];
			if (successWebs.length == 0) {
				noChkWebs = chkWebs;
			} else {
				for (var i = 0; i < chkWebs.length; i++) {
					if (successWebs.indexOf(chkWebs[i]) == -1) {
						noChkWebs[noChkWebs.length] = chkWebs[i];
					}
				}
			}

			chkWebsArry = noChkWebs;
			//执行签到
			begChk();
		});

		//上一个完成，执行下个签到
	} else if (type == "chkNext") {
		//去除当前已签到子项目
		chkCustomArry.shift();

		//子项目签到完成 或 无子项目签到 开始签到下个根签到
		if (chkCustomArry.length == 0) {
			chkWebsArry.shift();
		}

		//执行签到
		begChk();

	} else if (type == "chkCustom") {
		chkCustomArry = request.custom;
		if (chkCustomArry.length == 0) {
			chkWebsArry.shift();
		}

		//执行签到
		begChk();
	} else if (type == "chkSelf") {
		var url = request.url;
		var func = request.func;

		chrome.tabs.create({
			url: url
		}, function(tab) {
			var webItem = getItemByName(chkWebsArry[0]);
			var jsFile = "check.js";
			if (webItem["custom"]) {
				jsFile = "/custom/" + webItem["custom_js"];
			}

			runChkJS(jsFile, func);
		});
	}
}

//注入签到脚本执行签到
function runChkJS(jsFile, func) {
	//注入签到脚本
	chrome.tabs.executeScript(null, {
		file: jsFile
	}, function() {
		//注入执行签到脚本
		chrome.tabs.executeScript(null, {
			code: "window.onload = function() {" + func + "}"
		}, function() {});
	});
}