!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).uuidv4=e()}(this,(function(){"use strict";var t,e=new Uint8Array(16);function o(){if(!t&&!(t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported.");return t(e)}var n=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function r(t){return"string"==typeof t&&n.test(t)}for(var i=[],u=0;u<256;++u)i.push((u+256).toString(16).substr(1));return function(t,e,n){var u=(t=t||{}).random||(t.rng||o)();if(u[6]=15&u[6]|64,u[8]=63&u[8]|128,e){n=n||0;for(var f=0;f<16;++f)e[n+f]=u[f];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(i[t[e+0]]+i[t[e+1]]+i[t[e+2]]+i[t[e+3]]+"-"+i[t[e+4]]+i[t[e+5]]+"-"+i[t[e+6]]+i[t[e+7]]+"-"+i[t[e+8]]+i[t[e+9]]+"-"+i[t[e+10]]+i[t[e+11]]+i[t[e+12]]+i[t[e+13]]+i[t[e+14]]+i[t[e+15]]).toLowerCase();if(!r(o))throw TypeError("Stringified UUID is invalid");return o}(u)}}));

var _p_load_msg = {};
var _lostpw = false;
var _register = false;
var _runcaptcha = false;
var eventz_source = false;
var eventz_origin = false;
var window_width = false;
var platform = chrome;
var _deviceID;

function supasell_log(msg, extra){
	if(supasell_config.debug){
		if(typeof extra !=='undefined'){
			return console.log(msg,extra);
		}else{
			return console.log(msg);
		}
	}
	return false;
}

function supasell_login_alert(_msg, _type){
	_type = (typeof _type == 'undefined' ? 'danger' : _type);
	$('#supasell-login-alert').html(
		$('<div>',{'class':'alert m-0 alert-'+_type,'role':'alert'}).append(
			_msg
		)
	).removeClass('d-none');
	return false;
}

function supasell_build_query(_query, _rand){
	if(_rand){
		_rand = {
			'current':btoa(window.location.href).slice(0,10),
			'next':btoa(window.location.href).slice(-10),
		};
		_query = $.extend(_rand,_query);
	}
	params = new URLSearchParams(_query);
	return params.toString();
}

function supasell_pre_request(_data, _success){
	if(_runcaptcha){
		chrome.windows.remove(_lostpw, function(){
			chrome.windows.create({
				url: supasell_config.captcha+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
				type: 'panel', 
				width:500, 
				height:90,
				top:100,
				left:window.window_width/2,
				setSelfAsOpener:true,
			}, function(window){
				supasell_log('window',window);
				_runcaptcha = window.id;
				_p_load_msg['runcaptcha'] = {
					'window' : _runcaptcha,
					'data' : {
                        'type':'runcaptcha',
                        'name':'runcaptcha',
                        'value':_deviceID,
                    },
					'url' : supasell_config.captcha
				};
			});
		});
	}else{
		chrome.windows.create({
			url: supasell_config.captcha+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
			type: 'panel', 
			width:500, 
			height:90,
			top:100,
			left:window.window_width/2,
			setSelfAsOpener:true,
		}, function(window){
			supasell_log('window',window);
			_runcaptcha = window.id;
			_p_load_msg['runcaptcha'] = {
				'window' : _runcaptcha,
				'data' : {
					'type':'runcaptcha',
					'name':'runcaptcha',
					'value':_deviceID,
				},
				'url' : supasell_config.captcha
			};
		});
	}

	$(window).one('captcha_callback',function(e, cb){
		_runcaptcha = false;
		let _new_data = {
			'_deviceID' : window._deviceID,
			'version' : supasell_config.version,
			'g-recaptcha-response':cb,
		};
		$.when($.each(_data,function(i, v){
			_new_data[v.name] = v.value;
		})).promise().then(function(){
			_success(_new_data);
		});
	});

	return false;
}

function supasell_popup_message(_msg){
	platform.storage.local.set({'background-message':{'run':_msg,'cache':$.now()}})
    return false;
}

function supasell_popup_clearall(_cb){
	platform.storage.local.remove('supasell',function(data){
		if(typeof _cb ==='function'){
			_cb();
		}
	});
	return false;
}

function supasell_popup_Save_OrderList(_data, _cb){
	var _i_list = [];
	var data = {};
	data.order_list = {}
	$.when($.each(_data,function(i, v){
		v['supasell_used'] = ((v.hasOwnProperty('supasell_used') && v.supasell_used === true) ? true : false);
		data.order_list[i] = v;
		_i_list.push(i);
	})).promise().then(function(){
		platform.storage.local.set({'supasell':data},function(){
			if(typeof _cb == 'function'){
				_cb();
			}
		});
	});
	return false;
}

function supasell_popup_Save_Settings(_data, _cb){
	chrome.storage.local.set({'supasell_settings':_data},function(){
		if(typeof _cb == 'function'){
			_cb();
		}
	});
	return false;
}

function supasell_popup_DeviceID(_cb){
	chrome.storage.local.get('window_width',function(data){
		if(data.hasOwnProperty('window_width')){
			window.window_width = data.window_width
		}else{
			window.window_width = 1000;
		}
	});
	chrome.storage.local.get('_deviceID',function(data){
        supasell_log('device id var');
		if(data.hasOwnProperty('_deviceID')){
            supasell_log('device id var',data._deviceID);
			window._deviceID = data._deviceID;
			if(typeof _cb == 'function'){
				_cb();
			}
		}else{
			let _temp_id = uuidv4();
            supasell_log('device id yok',_temp_id);
			chrome.storage.local.set({'_deviceID':_temp_id},function(){
				window._deviceID = _temp_id;
				if(typeof _cb == 'function'){
					_cb();
				}
			});
		}
	});
	return false;
}

function supasell_popup_Save_Login(key, _cb_success){
	chrome.storage.local.set({'supasell_login':key},function(){
		if(typeof _cb_success == 'function'){
			_cb_success(key);
		}
	});
	return false;
}

function supasell_popup_LoginCheck(_cb_success, _cb_fail){
	chrome.storage.local.get('supasell_login',function(data){
		supasell_log('supasell_popup_LoginCheck',data);
		if(data.hasOwnProperty('supasell_login')){
			supasell_log('supasell_check_local_login',data);
			if(typeof _cb_success == 'function'){
				_cb_success(data.supasell_login);
			}
		}else{
			supasell_log('supasell_check_local_login','_cb_fail');
			if(typeof _cb_fail == 'function'){
				_cb_fail();
			}
		}
	});
	return false;
}

function supasell_popup_LogOUT(_remote, _cb){
	supasell_popup_LoginCheck(function(_x){
		platform.storage.local.remove('supasell_login',function(){
			supasell_popup_LoginCheck(false, function(){
				$('#popup-login').removeClass('d-none');
				$('#popup-logged-in').addClass('d-none');
				if(_remote){
					supasell_popup_LogOUT_Remote(_x, function(){
						supasell_popup_message('loginCheck');
						if(typeof _cb == 'function'){
							_cb();
						}
					});
				}else{
					supasell_popup_message('loginCheck');
				}
			});
		});
	});
	return false;
}

function supasell_popup_LogOUT_Remote(_x, _cb){
    $.post(supasell_config.api, {
            action :'logout',
            _deviceID : window._deviceID,
            version : supasell_config.version,
            token : _x
        }, function(data){
        if(data.status){
            if(data.action=='logout'){
                supasell_popup_New_DeviceID();
                if(typeof _cb == 'function'){
                    _cb();
                }
				supasell_login_alert(data.msg);
            }else{
                supasell_popup_clearall(function(){
                    if(typeof _cb == 'function'){
                        _cb();
                    }
					supasell_login_alert('Çıkış Yapıldı', 'success');
                });
            }
        }else{
			supasell_popup_clearall(function(){
				if(typeof _cb == 'function'){
					_cb();
				}
			});
        }
    },'json').fail(function() {
        supasell_popup_clearall(function(){
			if(typeof _cb == 'function'){
				_cb();
			}
		});
		supasell_login_alert(supasell_config.apierror);
    });
	return false;
}

function supasell_popup_New_DeviceID(){
	let _new_data = {};
	_new_data['_deviceID'] = uuidv4();
	chrome.storage.local.set(_new_data,function(){
		window['_deviceID'] = _new_data['_deviceID'];
		supasell_popup_DeviceID(function(){
			supasell_popup_LogOUT(false);
		});
	});
	return false;
}

function supasell_popup_Remote_Login(){
	if(($('.supasell input[name="supasell-username"]').val()).indexOf('@')<0){
		supasell_login_alert('E-Posta adresinizi girmediniz.', 'warning');
	}else if($('.supasell input[name="supasell-password"]').val().length<8){
		supasell_login_alert('Şifrenizi girmediniz.', 'warning');
	}else{
		$('#version-alert').addClass('d-none');
		let _data = $('#popup-login').serializeArray();
		$('#popup-login input').prop('readonly', true);
		$('#popup-login button').prop('disabled', true);
		supasell_pre_request(_data,function(_data){
			$.post(supasell_config.api, _data, function(data){
				if(data.status){
					if(data.action=='logout'){
						supasell_popup_New_DeviceID();
						supasell_login_alert(data.msg);
					}else{
						supasell_popup_Save_Login(data.token,function(){
							$('#popup-login input').prop('readonly', false);
							$('#popup-login button').prop('disabled', false);
							supasell_popup_LoginCheck(function(){
								$('#popup-login').addClass('d-none');
								$('#popup-logged-in').removeClass('d-none');
								supasell_popup_Save_Settings(data.settings);
								if(Object.keys(data.orders).length){
									supasell_popup_Save_OrderList(data.orders);
								}
								supasell_popup_message('loginCheck');
								setTimeout(function(){
									window.close();
								},3e3);
							});
						});
					}
				}else{
					$('#popup-login input').prop('readonly', false);
					$('#popup-login button').prop('disabled', false);
					if(data.hasOwnProperty('extension')){
						supasell_login_alert(data.msg+' '+data.extension, 'info');
					}else{
						supasell_login_alert(data.msg);
					}
				}
			},'json').fail(function() {
				$('#popup-login input').prop('readonly', false);
				$('#popup-login button').prop('disabled', false);
				supasell_login_alert(supasell_config.apierror);
			});
		});
	}
	return false;
}


$(document).ready(function(){
	supasell_popup_DeviceID();

    supasell_popup_LoginCheck(function(){
		$('#popup-login').addClass('d-none');
		$('#popup-logged-in').removeClass('d-none');
	}, function(){
		$('#popup-login').removeClass('d-none');
		$('#popup-logged-in').addClass('d-none');
	});

    $(document).on('click','#popup-logged-in button',function(e){
        e.preventDefault();
        let _thiz = $(this).prop('disabled', true);
        supasell_popup_LogOUT(true, function(){
            _thiz.prop('disabled', false);
			$('#popup-login').removeClass('d-none');
			$('#popup-logged-in').addClass('d-none');
        });
    });

    $('#popup-login').submit(function(e){
        e.preventDefault();
        supasell_popup_Remote_Login();
    });

	$(document).on('click','#supasell-lostpassword',function(e){
		e.preventDefault();
		if(_lostpw){
			chrome.windows.remove(_lostpw, function(){
				chrome.windows.create({
					url: supasell_config.lostpassword+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
					type: 'panel', 
					width:500, 
					height:250,
					top:100,
					left:window.window_width/2,
					setSelfAsOpener:true,
				}, function(window){
					supasell_log('window',window);
					_lostpw = window.id;
					_p_load_msg['lostpw'] = {
						'window' : _lostpw,
						'data' : {
							'type':'set',
							'name':'_deviceID',
							'value':_deviceID,
							'selector':'lostpw'
						},
						'url' : supasell_config.lostpassword
					};
					_p_load_msg['lostpw2'] = {
						'window' : _lostpw,
						'data' : {
							'type':'set',
							'name':'version',
							'value':supasell_config.version,
							'selector':'lostpw2'
						},
						'url' : supasell_config.lostpassword
					};
					_p_load_msg['lostpw3'] = {
						'window' : _lostpw,
						'data' : {
							'type':'set',
							'name':'extensionid',
							'value':supasell_config.extensionid,
							'selector':'lostpw3'
						},
						'url' : supasell_config.lostpassword
					};
				});
	 
				
			});
		}else{
			chrome.windows.create({
				url: supasell_config.lostpassword+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
				type: 'panel', 
				width:500, 
				height:250,
				top:100,
				left:window.window_width/2,
				setSelfAsOpener:true,
			}, function(window){
				supasell_log('window',window);
				_lostpw = window.id;
				_p_load_msg['lostpw'] = {
					'window' : _lostpw,
					'data' : {
						'type':'set',
						'name':'_deviceID',
						'value':_deviceID,
						'selector':'lostpw'
					},
					'url' : supasell_config.lostpassword
				};
				_p_load_msg['lostpw2'] = {
					'window' : _lostpw,
					'data' : {
						'type':'set',
						'name':'version',
						'value':supasell_config.version,
						'selector':'lostpw2'
					},
					'url' : supasell_config.lostpassword
				};
				_p_load_msg['lostpw3'] = {
					'window' : _lostpw,
					'data' : {
						'type':'set',
						'name':'extensionid',
						'value':supasell_config.extensionid,
						'selector':'lostpw3'
					},
					'url' : supasell_config.lostpassword
				};
			});
		}
	});
	
	$(document).on('click','#supasell-register',function(e){
		e.preventDefault();
		if(_register){
			chrome.windows.remove(_register, function(){
				chrome.windows.create({
					url: supasell_config.register+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
					type: 'panel', 
					width:500, 
					height:250,
					top:100,
					left:window.window_width/2,
					setSelfAsOpener:true,
				}, function(window){
					supasell_log('window',window);
					_register = window.id;
					_p_load_msg['register'] = {
						'window' : _register,
						'data' : {
							'type':'set',
							'name':'_deviceID',
							'value':_deviceID,
							'selector':'register'
						},
						'url' : supasell_config.register
					};
					_p_load_msg['register2'] = {
						'window' : _register,
						'data' : {
							'type':'set',
							'name':'version',
							'value':supasell_config.version,
							'selector':'register2'
						},
						'url' : supasell_config.register
					};
					_p_load_msg['register3'] = {
						'window' : _register,
						'data' : {
							'type':'set',
							'name':'extensionid',
							'value':supasell_config.extensionid,
							'selector':'register3'
						},
						'url' : supasell_config.register
					};
				});
	 
				
			});
		}else{
			chrome.windows.create({
				url: supasell_config.register+'?'+supasell_build_query({'deviceID':_deviceID,'extensionid':supasell_config.extensionid},true), 
				type: 'panel', 
				width:500, 
				height:250,
				top:100,
				left:window.window_width/2,
				setSelfAsOpener:true,
			}, function(window){
				supasell_log('window',window);
				_register = window.id;
				_p_load_msg['register'] = {
					'window' : _register,
					'data' : {
						'type':'set',
						'name':'_deviceID',
						'value':_deviceID,
						'selector':'register'
					},
					'url' : supasell_config.register
				};
				_p_load_msg['register2'] = {
					'window' : _register,
					'data' : {
						'type':'set',
						'name':'version',
						'value':supasell_config.version,
						'selector':'register2'
					},
					'url' : supasell_config.register
				};
				_p_load_msg['register3'] = {
					'window' : _register,
					'data' : {
						'type':'set',
						'name':'extensionid',
						'value':supasell_config.extensionid,
						'selector':'register3'
					},
					'url' : supasell_config.register
				};
			});
		}
	});

	$(window).on('postmsg_load', function(e, _which){	
		if(window._p_load_msg.hasOwnProperty(_which)){
			supasell_log('_which',_which);
			let _thiz = window._p_load_msg[_which];
			supasell_log('_thiz_data',_thiz);
			supasell_log(eventz_source.postMessage(_thiz.data, eventz_origin));
			delete window._p_load_msg[_which];
		}
	});

	chrome.windows.getAll({populate:true,windowTypes:['popup']},function(_window){
		supasell_log('getall',_window);
		if(_window.length){
			_window.forEach(function(i,v){
				i.tabs.forEach(function(ii,vv){
					if(ii.url.indexOf('cms.supasell.com')>=0){
						chrome.windows.remove(ii.windowId);
					}
				});
			});
		}
	});
});

chrome.storage.local.onChanged.addListener(function(changes, area){
    if(changes.hasOwnProperty('content-message')){
        if(changes['content-message'].hasOwnProperty('newValue')){
           supasell_log('chrome.storage.local.onChanged changes:',changes['content-message'].newValue);
            if(changes['content-message'].newValue.hasOwnProperty('run')){
                _run = changes['content-message'].newValue.run;
                if(_run=='loginCheck'){
                    supasell_popup_LoginCheck(function(){
						$('#popup-login').addClass('d-none');
						$('#popup-logged-in').removeClass('d-none');
					}, function(){
						$('#popup-login').removeClass('d-none');
						$('#popup-logged-in').addClass('d-none');
					});
                }
            }
        }
    }
});

window.addEventListener('message',function(event) {
    let _json = event.data;
    if(_json && _json.hasOwnProperty('type')){
		eventz_source = event.source;
        eventz_origin = event.origin;
        supasell_log('addEventListener message _json',_json);
        if(_json.type=='loadback'){
            $(window).trigger('postmsg_load', [_json.name]);
        }else if(_json.type=='captcha_callback'){
            $(window).trigger('captcha_callback', [_json.value]);
        }
    }else{
        supasell_log('addEventListener message no_json',event.data);
    }
},false);