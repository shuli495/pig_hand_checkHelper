var chkSuccessArry = {
	"web": [],
	"sub": []
};
init();

//初始化
function init() {
	//显示签到列表
	chrome.storage.local.get("chkWebs", function(chkWebsVal) {
		var chkWebArry = webArry(); //签到网站列表
		var chkWebs = chkWebsVal["chkWebs"]; //已选中网站的名称

		for (var i = 0; i < chkWebArry.length; i++) {
			var webName = chkWebArry[i]["title"]; //网站名称
			var webType = chkWebArry[i]["category"]; //网站类别
			var webUrl = chkWebArry[i]["url"]; //网站url

			//获取是否选中
			var checked = "";
			if (chkWebs && chkWebs.indexOf(webName) != -1) {
				checked = "checked";
			}

			//添加控件
			var divDom = document.getElementById(webType);

			divDom.innerHTML += "<div class='webNameDiv'><input type='checkbox' id='" + webName + "' " + checked + "/><a target='_blank' href='" + webUrl + "'>" + webName + "</a></div>"
		}

		//显示当日签到信息
		chrome.storage.local.get("today", function(todayVal) {
			var now = new Date();
			var nowDate = String(now.getFullYear()) + String(now.getMonth()) + String(now.getDate());

			var today = todayVal["today"]; //今日签到记录

			var todayChkInfoDom = "今日未进行签到！</br>";

			if (typeof(today) != 'undefined' && today != "") {
				var todayDate = today["date"]; //签到日期
				var todayChkInfo = today["chkInfo"]; //签到信息

				if (typeof(todayDate) != 'undefined' && todayDate != "") {
					if (todayDate == nowDate) {
						if (todayChkInfo.length > 0) {
							todayChkInfoDom = "</br>";
							for (var i = 0; i < todayChkInfo.length; i++) {
								if (typeof(todayChkInfo[i]["success"]) != 'undefined') {
									//网站名称
									todayChkInfoDom += todayChkInfo[i]["name"] + "&nbsp;-&nbsp;";

									//成功标志
									if (todayChkInfo[i]["success"]) {
										todayChkInfoDom += "成功";
										chkSuccessArry["web"][chkSuccessArry["web"].length] = todayChkInfo[i]["name"];
									} else {
										todayChkInfoDom += "<font class='chk_fail'>失败</font>";
									}
								} else {
									if (todayChkInfo[i]["sub_true"].length > 0) {
										todayChkInfoDom += todayChkInfo[i]["name"] + "：";

										var sub = "";
										for (var j = 0; j < todayChkInfo[i]["sub_true"].length; j++) {
											if (todayChkInfo[i]["sub_true"][j] == "") {
												continue;
											}

											if (sub != "") {
												sub += "、";
											}
											sub += todayChkInfo[i]["sub_true"][j];
										}

										todayChkInfoDom += sub + "&nbsp;-&nbsp;成功";
										chkSuccessArry["sub"][chkSuccessArry["sub"].length] = {
											"parent": todayChkInfo[i]["name"],
											"web": todayChkInfo[i]["sub_true"]
										};
									}

									if (todayChkInfo[i]["sub_false"].length > 0) {
										if (todayChkInfoDom != "</br>") {
											todayChkInfoDom += "</br>";
										}
										todayChkInfoDom += todayChkInfo[i]["name"] + "：";

										var sub = "";
										for (var j = 0; j < todayChkInfo[i]["sub_false"].length; j++) {
											if (todayChkInfo[i]["sub_false"][j] == "") {
												continue;
											}

											if (sub != "") {
												sub += "、";
											}
											sub += todayChkInfo[i]["sub_false"][j];
										}

										todayChkInfoDom += sub + "&nbsp;-&nbsp;<font class='chk_fail'>失败</font>";
									}
								}

								todayChkInfoDom += "</br>";
							}
						}
					} else {
						setToday(nowDate);
					}
				} else {
					setToday(nowDate);
				}
			} else {
				setToday(nowDate);
			}
			document.getElementById("today").innerHTML = todayChkInfoDom;
		});
	});

	//按钮绑定事件
	document.getElementById("titleMaker").onclick = function() {
		window.open(this.href);
	}; //作者点击
	document.getElementById("fk").onclick = function() {
		window.open(this.href);
	}; //反馈点击
	document.getElementById("chkAllBut").onclick = function() {
		chkAll()
	}; //全选
	document.getElementById("chkNoBut").onclick = function() {
		chkNo()
	}; //反选
	document.getElementById("saveBut").onclick = function() {
		save()
	}; //保存
	document.getElementById("begChkBut").onclick = function() {
		begChk()
	}; //开始签到
}

//设置今日签到数据
function setToday(nowDate) {
	chrome.storage.local.set({
		"today": {
			"date": nowDate,
			"chkInfo": []
		}
	}, function() {});
}

//全选
function chkAll() {
	var inpts = document.getElementsByTagName("input");
	for (var i = 0; i < inpts.length; i++) {
		if (inpts[i].type == "checkbox") {
			inpts[i].checked = true;
		}
	}
}

//取消
function chkNo() {
	var inpts = document.getElementsByTagName("input");
	for (var i = 0; i < inpts.length; i++) {
		if (inpts[i].type == "checkbox") {
			inpts[i].checked = false;
		}
	}
}

//签到项提取设置，保存用
function setSave() {
	var inpts = document.getElementsByTagName("input");
	var chkWebs = new Array(); //要签到网站的名称字符串，以","分割

	//拼接签到列表
	for (var i = 0; i < inpts.length; i++) {
		if (inpts[i].type == "checkbox" && inpts[i].checked) {
			chkWebs[chkWebs.length] = inpts[i].id;
		}
	}

	return chkWebs;
}

//保存
function save() {
	chrome.storage.local.set({
		"chkWebs": setSave()
	}, function() {
		alert("保存完成！");
	});
}

//开始签到 调用background
function begChk() {
	//签到前先保存设置
	chrome.storage.local.set({
		"chkWebs": setSave()
	}, function() {
		//签到
		chrome.extension.sendRequest({
			type: "begChk",
			successWebs : chkSuccessArry
		}, function(response) {});
	});
}