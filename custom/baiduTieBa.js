//根据网址执行签到方法
function checkMain(parentTitle) {
	var url = document.getElementsByClassName("media_left")[0].href;

	//调用background执行下次签到
	chrome.extension.sendRequest({
		type: "chkSelf",
		url: url,
		func: "getChkArry('" + parentTitle + "');"
	}, function(response) {
		window.close();
	});
}

function getChkArry(parentTitle) {
	var stepMO = new MutationObserver(function(e) {
		setTimeout(function() {
			var classDoms = document.getElementsByClassName("unsign");
			var customArry = new Array();
			var success = "signstar_signed";
			var moNode = "document.getElementsByClassName('j_succ_info')[0]";
			var step = [{
				"type": "class",
				"index": 0,
				"value": "j_cansign"
			}];

			for (var i = 0; i < classDoms.length; i++) {
				customArry[customArry.length] = {
					"parent_title": parentTitle,
					"title": classDoms[i].title,
					"url": classDoms[i].href,
					"moNode": moNode,
					"success": success,
					"step": step
				}
			}

			window.close();

			//调用background执行下次签到
			chrome.extension.sendRequest({
				type: "chkCustom",
				custom: customArry
			}, function(response) {});

		}, 1000);
	});
	stepMO.observe(document.body, {
		attributes: true,
		childList: true
	});

	document.getElementsByClassName("j_show_more_forum")[0].click();
}