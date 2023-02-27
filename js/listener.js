window.addEventListener('message',function(event) {
    let _json = event.data;
    if(_json && _json.hasOwnProperty('type')){
        console.log('addEventListener message _json',_json);
        if(_json.type=='set'){
            window[_json.name] = _json.value;
        }else if(_json.type=='changeLocalStorage'){
            let _new_data = {};
            _new_data[_json.name] = _json.value;
            platform.storage.local.set(_new_data,function(){
                window[_json.name] = _json.value;
                if(_json.hasOwnProperty('function')){
                    _json.function();
                }
            });
        }else if(_json.type=='trigger'){
            $(window).trigger(_json.name);
        }else if(_json.type=='loadback'){
            $(window).trigger('postmsg_load', [_json.name]);
        }
    }else{
        console.log('addEventListener message no_json',event.data);
    }
},false);

$(window).on('auto_address_country_click',function(e, _data, _job_key, _count, _data_address, _manuel, _cb){
    supasell_log('auto_address_country_click--e:',e);
    supasell_log('auto_address_country_click--_data:',_data);
    supasell_log('auto_address_country_click--_job_key:',_job_key);
    supasell_log('auto_address_country_click--_count:',_count);
    var auto_address_country_click = new MutationObserver(function(mList, _obs){
        for (const mList_in of mList) {
            if( mList_in.type=='childList' && mList_in.target.classList.contains('a-popover-inner') ){
                _obs.disconnect();
                supasell_log('auto_address_country_click - OK - '+_count);
                supasell_log('address_country_selectOption - START');
                address_country_selectOption(_data_address, function(){
                    supasell_auto_addAddress(_data, _job_key, 1, _manuel, _cb);
                });
            }
        }
    });
    auto_address_country_click.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_addCart_buybox',function(e, _data,  _cb){
    supasell_log('auto_addCart_buybox--e:',e);
    supasell_log('auto_addCart_buybox--_data:',_data);
    var auto_addCart_buybox = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_addCart_buybox - mList_in:',mList_in);
            if(mList_in.target.getAttribute('id')=='attach-added-to-cart-message'){
                supasell_log('auto_addCart_buybox - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_addCart_buybox.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_addCart_choices',function(e, _data,  _cb){
    supasell_log('auto_addCart_choices--e:',e);
    supasell_log('auto_addCart_choices--_data:',_data);
    var auto_addCart_choices = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_addCart_choices - mList_in:',mList_in);
            if(mList_in.target.getAttribute('id')=='aod-filter-string' && mList_in.removedNodes.length==0){
                supasell_log('auto_addCart_choices - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_addCart_choices.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_addCart_filter',function(e, _data,  _cb){
    supasell_log('auto_addCart_filter--e:',e);
    supasell_log('auto_addCart_filter--_data:',_data);
    var auto_addCart_filter = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_addCart_filter - mList_in:',mList_in);
            if(mList_in.target.getAttribute('id')=='aod-recommendations'){
                supasell_log('auto_addCart_filter - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_addCart_filter.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_addCart_lowest',function(e, _data,  _cb){
    supasell_log('auto_addCart_lowest--e:',e);
    supasell_log('auto_addCart_lowest--_data:',_data);
    var auto_addCart_lowest = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_addCart_lowest - mList_in:',mList_in);
            if(mList_in.target.getAttribute('id')=='aod-offer-added-to-cart-1'){
                supasell_log('auto_addCart_lowest - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_addCart_lowest.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_cart_quantity',function(e, _data,  _cb){
    supasell_log('auto_cart_quantity--e:',e);
    supasell_log('auto_cart_quantity--_data:',_data);
    var auto_cart_quantity = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_cart_quantity - mList_in:',mList_in);
            if(mList_in.type=='childList' &&  mList_in.target.getAttribute('id')=='sc-saved-cart-caption'){
                supasell_log('auto_cart_quantity - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_cart_quantity.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('auto_cart_gift',function(e, _data,  _cb){
    supasell_log('auto_cart_gift--e:',e);
    supasell_log('auto_cart_gift--_data:',_data);
    var auto_cart_gift = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            supasell_log('auto_cart_gift - mList_in:',mList_in);
            if(mList_in.type=='childList' &&  mList_in.target.getAttribute('id')=='sc-saved-cart-caption'){
                supasell_log('auto_cart_gift - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                        _cb();
                    },500);
                }
            }
        }
    });
    auto_cart_gift.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('address_popup',function(e, _data,  _cb){
    supasell_log('address_popup--e:',e);
    supasell_log('address_popup--_data:',_data);
    var address_popup = new MutationObserver(function(mList,_obs){
        for (const mList_in of mList) {
            //supasell_log('address_popup - mList_in:',mList_in);
            if(mList_in.type=='childList' && mList_in.target.classList && mList_in.target.classList.contains('a-popover-inner')){
                supasell_log('last --> address_popup',mList_in);
                supasell_log('address_popup - OK');
                _obs.disconnect();
                supasell_log('GLUXAddressList before',$('#GLUXAddressList li').length);

                setTimeout(function(){
                    supasell_log('GLUXAddressList after',$('#GLUXAddressList li').length);
                    $('#GLUXAddressList li').each(function(){
                        _h_data = $(this).html().toString().toLowerCase();
                        supasell_log('_h_data',_h_data);
                        if( (_data.postalCode!=null && _h_data.indexOf((_data.postalCode).toLowerCase())>=0) || 
                        (_data.city!=null && _h_data.indexOf((_data.city).toLowerCase())>=0) || 
                        (_data.stateOrRegion!=null && _h_data.indexOf((_data.stateOrRegion).toLowerCase())>=0) ||
                        (_data.county!=null!=null && _h_data.indexOf((_data.county).toLowerCase())>=0) ){ 
                            $(this).find('.a-button-input').click();
                            setTimeout(function(){
                                if(typeof _cb === 'function'){ _cb(); }
                            },500);
                        }
                    });
                },1500);
                
            }
        }
        //GLUXAddressList
    });
    address_popup.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('checkout_giftChange',function(e, _cb){
    supasell_log('checkout_giftChange--e:',e);
    var checkout_giftChange = new MutationObserver(function(mList, _obs){
        for (const mList_in of mList) {
            supasell_log('checkout_giftChange - mList_in:',mList_in);
            if(mList_in.type=='childList' && mList_in.target.tagName=='FORM'){
                supasell_log('checkout_giftChange - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                         _cb();
                    },300);
                }
            }
        }
        //GLUXAddressList
    });
    checkout_giftChange.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('checkout_usePayment',function(e, _cb){
    supasell_log('checkout_usePayment--e:',e);
    var checkout_usePayment = new MutationObserver(function(mList, _obs){
        for (const mList_in of mList) {
            supasell_log('checkout_usePayment - mList_in:',mList_in);
            if(mList_in.target.tagName=='FORM' || mList_in.target.getAttribute('id')=='payment'){
                supasell_log('checkout_usePayment - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                         _cb();
                    },300);
                }
            }
        }
    });
    checkout_usePayment.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('paymentPlan_continue',function(e, _cb){
    supasell_log('paymentPlan_continue--e:',e);
    var paymentPlan_continue = new MutationObserver(function(mList, _obs){
        for (const mList_in of mList) {
            supasell_log('paymentPlan_continue - mList_in:',mList_in);
            /*if(mList_in.target.tagName=='FORM' || mList_in.target.getAttribute('id')=='payment'){
                supasell_log('paymentPlan_continue - OK');
                _obs.disconnect();
                if(typeof _cb === 'function'){
                    setTimeout(function(){
                         _cb();
                    },300);
                }
            }*/
        }
    });
    paymentPlan_continue.observe($('body')[0], {attributes: true, childList: true, subtree: true});
});

$(window).on('supasell_revieworder',function(e){
    supasell_log('supasell--- supasell_revieworder started --> e:',e);
    platform.storage.local.get('lastorderid',function(data){
        if(data.hasOwnProperty('lastorderid')){
            setTimeout(function(){
                supasell_log('supasell_revieworder supasell_used_remote_order');
                supasell_used_remote_order(data.lastorderid);
            },500);
        }else{
            supasell_log('supasell_revieworder lastorderid',data);
        }
    });
});

$(window).on('postmsg_load', function(e, _which){
    if(window._p_load_msg.hasOwnProperty(_which)){
        let _thiz = window._p_load_msg[_which];
        supasell_post_messsage(_thiz.window, _thiz.data, _thiz.url, _which);
        delete window._p_load_msg[_which];
    }
});

$(document).on('change','#supasell-settings-modal select[name="buytype"]',function(e){
    $('.supasell-settings-modal-buytype').text($('option:selected',this).attr('title'));
});
$(document).on('change','#supasell-settings-modal select[name="lateship"]',function(e){
    if(this.value == 'active'){
        $('.supasell-settings-modal-lateship-settings').removeClass('d-none');
    }else{
        $('.supasell-settings-modal-lateship-settings').addClass('d-none');
    }
});

$(window).on('resize',function(e){
    supasell_on_resize();
});

chrome.storage.local.onChanged.addListener(function(changes, area){
    if(changes.hasOwnProperty('background-message')){
        if(changes['background-message'].hasOwnProperty('newValue')){
            console.log('chrome.storage.local.onChanged changes:',changes['background-message'].newValue);
            if(changes['background-message'].newValue.hasOwnProperty('run')){
                _run = changes['background-message'].newValue.run;
                if(_run=='loginCheck'){
                    supasell_check_local_login(function(){
                        supasell_order_list();
                        if(!$('.supasell-body').hasClass('supasell-body-padding')){
                            $('.supasell .supasell-logo-wrapper').trigger('click');
                        }
                    },function(){
                        supasell_order_clearall(function(){
                            supasell_toast('Supasell Bildirim','Çıkış Yapıldı.','success');
                            supasell_order_list();
                        }, false);
                    });
                }
            }
        }
    }
});
