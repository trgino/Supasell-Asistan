var platform = chrome;
var a_popover_root = setInterval(function(){
    if(document.getElementById('a-popover-root') && typeof supasell_first_touch == 'function'){
        supasell_first_touch('popover root');
        clearInterval(a_popover_root);
    }
},50);

setInterval(function(){
    if(typeof chrome.runtime.id == 'undefined'){
        window.location.reload(true);
    }
},1e3);