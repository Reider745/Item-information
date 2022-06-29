ConfigureMultiplayer({
	isClientOnly: false
});
IMPORT("DependenceHelper");
new Dependence(__name__)
	.addDependence("CoreUtility")
	.setLaunch(function(api) {
		Launch(api.CoreUtility);
	});
