var platform = chrome;
var supasell_config = {
	'debug' : false,
	'name' : platform.runtime.getManifest().name,
	'homepage' : platform.runtime.getManifest().homepage_url,
	'privacypolicy': 'https://www.supasell.com/privacy-policy',
	'tos' : 'https://www.supasell.com/terms-of-service',
	'lostpassword' : 'https://cms.supasell.com/lostpassword/',
	'register' : 'https://cms.supasell.com/register/',
	'captcha' : 'https://cms.supasell.com/captcha/',
	'api' : 'https://cms.supasell.com/router/',
	'apierror' : 'Şu anda sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.',
	'version' : platform.runtime.getManifest().version,
	'extensionid' : platform.runtime.id,
	'icons' : platform.runtime.getManifest().icons,
};