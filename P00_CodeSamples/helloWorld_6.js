var start = Date.now();
console.log('time at start? ' + start);

console.log('calling #1');
setTimeout(function() {
	console.log('seconds elapsed at #1 function? '+ (Date.now()-start));
	for (var i=0;i<10000000000; i++) { /* do nothing, but blocks the execution */ }
}, 1000);

console.log('calling #2');
setTimeout(function() {
	console.log('seconds elapsed at #2 function? '+ (Date.now()-start));
}, 2000);

console.log('EOF');