window.history.pushState = new Proxy(window.history.pushState, {
	apply: (target, thisArg, argArray) => {
		if(thisArg.state!=null && thisArg.state.hasOwnProperty('page') && (thisArg.state.page == 'spp-revieworder' || thisArg.state.page == 'spp-prime')){
			window.postMessage({
				'type':'trigger', 
				'name':'supasell_revieworder'
			});
		}else{
			console.log('supasell--- history thisArg',thisArg);
			console.log('supasell--- history target',target);
			console.log('supasell--- history argArray',argArray);
		}
		return target.apply(thisArg, argArray);
	},
});