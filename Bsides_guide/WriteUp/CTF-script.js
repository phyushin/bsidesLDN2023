Java.perform(function(){
	console.log("[*] - Starting Script");
	//var MainActivity = Java.use('bsides.london.ctf.MainActivity');
	const String = Java.use("java.lang.String");
	const System = Java.use("java.lang.System");
	const Resources = Java.use("android.content.res.Resources");
	
	var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
	const getStringMethod = Resources.getString.overload('int'); 

	getStringMethod.implementation = function (resId) {
    console.log("getString('" + resId.toString() + "') called" );
    const ret = getStringMethod.call(this, resId);
		console.log("Value is: '" + ret + "'");
        return ret;
    }
	
	
   
});