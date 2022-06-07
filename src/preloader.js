Callback.addCallback("ModsPreLoaded", function(){
	let Loader = WRAP_JAVA("com.reider.ModLoader");
	Loader.addPreLoad(__dir__);
});