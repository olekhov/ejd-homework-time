/*
	This script intercepts particular json requests and injects
	additional information into one of the fields.
*/
let HomeworkCache = [];
const mem = 100;
const HomeworkInterceptor = (details) => {
	let filter = browser.webRequest.filterResponseData(details.requestId);
	const decoder = new TextDecoder("utf-8");
	const encoder = new TextEncoder();

	requestId = details.requestId ;
	filter.onstart = (e) => {
		HomeworkCache[requestId%mem]="";
	};
	filter.ondata = (e) => {
		HomeworkCache[requestId%mem]+=decoder.decode(e.data,{stream:true});
	}
	filter.onstop = (e) => {
		hw=JSON.parse(HomeworkCache[requestId%mem]);
		for(const i in hw) {
			a_on=hw[i].homework_entry.homework.date_assigned_on;
			c_on=hw[i].homework_entry.homework.created_at;
			add=browser.i18n.getMessage("createdMessage", c_on);
			hw[i].homework_entry.homework.date_assigned_on = a_on+add;
		}
		filter.write(encoder.encode(JSON.stringify(hw)));
		filter.disconnect();
	};
};

browser.webRequest.onBeforeRequest.addListener(
	HomeworkInterceptor,
	{urls: ["https://dnevnik.mos.ru/core/api/student_homeworks?*"]},
	["blocking","requestBody"]
);
