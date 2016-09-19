//根据网址执行签到方法
function checkMain(checkItem) {
	if (checkItem["step"].length > 0) {
		begChk(checkItem);
	} else {
		chkSuccess(checkItem["parent_title"], checkItem["title"], checkItem["success"]);
	}
}

//签到
function begChk(checkItem) {
	var stepIndex = 0;

	var stepArry = checkItem["step"];
	var parentName = checkItem["parent_title"];
	var name = checkItem["title"];
	var success = checkItem["success"];

	var moNode = document.body;
	if (typeof(checkItem["moNode"]) != 'undefined' && checkItem["moNode"] != '') {
		moNode = eval(checkItem["moNode"]);
	}

	var stepMO = new MutationObserver(function(e) {
		setTimeout(function() {
			stepIndex++;
			if (stepIndex < stepArry.length) {
				runStep(stepArry[stepIndex]);
			} else {
				chkSuccess(parentName, name, success);
			}
		}, 1000);
	});

	stepMO.observe(moNode, {
		attributes: true,
		childList: true,
		characterData: true,
		subtreeL: true
	});

	runStep(stepArry[stepIndex]);
}

function runStep(step) {
	var type = step["type"];
	var value = step["value"];

	if (type == "id") {
		document.getElementById(value).click();
	} else if (type == "class") {
		var idxNum = 0;
		if (typeof(step["index"]) != 'undefined') {
			idxNum = step["index"];
		}

		document.getElementsByClassName(value)[idxNum].click();
	}

	var js = step["js"];
	if (typeof(js) != 'undefined' && js != "") {
		eval(js);
	}
}

//签到结束后操作
function chkSuccess(parentName, name, successFlag) {
	//检查是否成功
	var isSuccess = false;
	if (document.body.innerHTML.indexOf(successFlag) != -1) { //成功
		isSuccess = true;
	}

	chrome.storage.local.get("today", function(todayVal) {
		var today = todayVal["today"];

		var chkInfo = new Array();
		if (typeof(today) != 'undefined') {
			chkInfo = today["chkInfo"];
		}

		//当天签到信息中有数据，修改或新增
		if (chkInfo.length > 0) {
			//存在当前网站签到信息，修改
			var isSaveInfo = false;

			for (var i = 0; i < chkInfo.length; i++) {
				if (typeof(parentName) != 'undefined' && parentName != '') {
					if (chkInfo[i]["name"] == parentName) {
						isSaveInfo = true;
						var subTrue = chkInfo[i]["sub_true"];
						var subFalse = chkInfo[i]["sub_false"];

						if (isSuccess) {
							for (var j = 0; j < subFalse.length; j++) {
								if (subFalse[j] == name) {
									subFalse.splice(j, 1);
									break;
								}
							}

							var isAdd = false;
							for (var j = 0; j < subTrue.length; j++) {
								if (subTrue[j] == name) {
									isAdd = true;
									break;
								}
							}
							if (!isAdd) {
								subTrue[subTrue.length] = name;
							}
						} else {
							for (var j = 0; j < subTrue.length; j++) {
								if (subTrue[j] == name) {

									var isAdd = false;
									for (var k = 0; k < subFalse.length; k++) {
										if (subFalse[k] == name) {
											isAdd = true;
											break;
										}
									}
									if (!isAdd) {
										subFalse[subFalse.length] = name;
									}
									break;
								}
							}
						}

						break;
					}
				} else {
					if (chkInfo[i]["name"] == name) {
						isSaveInfo = true;
						chkInfo[i]["success"] = isSuccess;
						break;
					}
				}
			}

			//不存在当前网站签到信息，新增
			if (!isSaveInfo) {
				chkInfo[chkInfo.length] = formatChkHistory(parentName, name, isSuccess);
			}
		} else { //当天签到信息中无数据，新增
			chkInfo[0] = formatChkHistory(parentName, name, isSuccess);
		}

		//保存成功信息
		var now = new Date();
		chrome.storage.local.set({
			"today": {
				"date": String(now.getFullYear()) + String(now.getMonth()) + String(now.getDate()),
				"chkInfo": chkInfo
			}
		}, function() {
			chkNext();
		});
	});
}

function formatChkHistory(parentName, name, isSuccess) {
	if (typeof(parentName) == 'undefined' || parentName == '') {
		return {
			"name": name,
			"success": isSuccess
		};
	} else {
		if (isSuccess) {
			return {
				"name": parentName,
				"sub_true": [name],
				"sub_false": []
			};
		} else {
			return {
				"name": parentName,
				"sub_true": [],
				"sub_false": [name]
			};
		}
	}
}

//本次网站签到完毕，执行下个签到
var isChkingNext = false; //签到控制开关，页面变化出发多次事件调用，开关控制只返回1次
function chkNext() {
	if (!isChkingNext) {
		isChkingNext = true;
		window.close();

		//调用background执行下次签到
		chrome.extension.sendRequest({
			type: "chkNext"
		}, function(response) {});
	}
}