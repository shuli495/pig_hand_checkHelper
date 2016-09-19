//签到集合
function webArry() {
	var arry = [
		//**********************社区 start**********************
		{
			"title": "百度贴吧(一键签到)",
			"category": "shequ",
			"url": "http://tieba.baidu.com/",
			"success": "签到成功",
			"step": [{
				"type": "class",
				"index": 0,
				"value": "onekey_btn"
			}, {
				"type": "class",
				"index": 0,
				"value": "sign_btn_nonmember"
			}]
		}, {
			"title": "百度贴吧(关注签到)",
			"category": "shequ",
			"url": "http://tieba.baidu.com/",
			"custom": true,
			"custom_js": "baiduTieBa.js"
		}, {
			"title": "人人网",
			"category": "shequ",
			"url": "http://www.renren.com/",
			"success": "inactive",
			"step": [{
				"type": "id",
				"value": "assembleBtn"
			}]
		}, {
			"title": "按键精灵论坛",
			"category": "shequ",
			"url": "http://bbs.anjian.com/",
			"success": "qdGreen",
			"step": [{
				"type": "id",
				"value": "pper_a"
			}, {
				"type": "id",
				"value": "Buttonaddsignin"
			}]
		},
		//**********************社区 end**********************


		//**********************分享 start**********************
		{
			"title": "马蜂窝",
			"category": "fenxiang",
			"url": "http://www.mafengwo.cn",
			"success": "每日任务",
			"step": [{
				"type": "id",
				"value": "head-btn-daka"
			}]
		}, {
			"title": "什么值得买",
			"category": "fenxiang",
			"url": "http://www.smzdm.com/qiandao",
			"success": "今日已领",
			"step": [{
				"type": "id",
				"value": "user_info_tosign"
			}]
		}, {
			"title": "中关村",
			"category": "fenxiang",
			"url": "http://my.zol.com.cn",
			"success": "已签到",
			"step": [{
				"type": "id",
				"value": "hasSign"
			}]
		},
		//**********************分享 end**********************


		//**********************商城 start**********************
		{
			"title": "淘金币",
			"category": "gouwu",
			"url": "https://taojinbi.taobao.com/index.htm",
			"success": "已领",
			"step": [{
				"type": "class",
				"index": 0,
				"value": "J_GoTodayBtn"
			}]
		}, {
			"title": "阿里旅行",
			"category": "gouwu",
			"url": "http://www.alitrip.com/mytrip/",
			"success": "恭喜您获得",
			"step": [{
				"type": "class",
				"index": 0,
				"value": "sign-btn"
			}]
		}, {
			"title": "同程网",
			"category": "gouwu",
			"url": "http://www.ly.com/vip/activity/",
			"success": "明日可领取",
			"step": [{
				"type": "id",
				"value": "memSignIn"
			}]
		}, {
			"title": "华强北商城",
			"category": "gouwu",
			"url": "http://my.okhqb.com/my/home.html?utml=member",
			"success": "sign_out",
			"step": [{
				"type": "id",
				"value": "sign_btn"
			}]
		}, {
			"title": "lifeVC",
			"category": "gouwu",
			"url": "https://account.lifevc.com/UserCenter",
			"success": "signAlready",
			"step": [{
				"type": "class",
				"index": 0,
				"value": "MemberSug"
			}, {
				"type": "class",
				"index": 0,
				"value": "signbt"
			}]
		},
		//**********************商城 end**********************


		//**********************其他 start**********************
		{
			"title": "2345技术员",
			"category": "other",
			"url": "http://jifen.2345.com/index.php",
			"success": "签到成功",
			"step": [{
				"type": "id",
				"value": "btnSign"
			}]
		}
		//**********************其他 end**********************
	];
	return arry;
}

//根据名称获取信息
function getItemByName(name) {
	for (var i = 0; i < webArry().length; i++) {
		if (name == webArry()[i]["title"]) {
			return webArry()[i]
		}
	}

	return null;
}