Flag `{PASTEBIN_LFG_BSIDES_LDN}`

Clue `Why Doesn't the app send an email!?`

There are a few ways to get the flag on this one 
![[Bsides_guide.apk]]
The easiest way is just install the application and run logcat whilst using it:
![[Pasted image 20231117003406.png]]

The other way is to open the application in JADX and follow through the code.
A quick glance at the code shows a _getFlag_ function which sends a request to a URL

```Kotlin
    public final String getFlag() {
        RequestQueue queue = Volley.newRequestQueue(this);
        Intrinsics.checkNotNullExpressionValue(queue, "newRequestQueue(this)");  
        String url = getString(R.string.pbin);  
        Intrinsics.checkNotNullExpressionValue(url, "getString(R.string.pbin)");  
        final Ref.ObjectRef retVal = new Ref.ObjectRef();
        retVal.element = "";
        StringRequest stringRequest = new StringRequest(0, url + getString(R.string.slug), new Response.Listener() { // from class: com.bsides.london.ctf.MainActivity$$ExternalSyntheticLambda0
  
            @Override // com.android.volley.Response.Listener
            public final void onResponse(Object obj) {
                  MainActivity.getFlag$lambda$0(Ref.ObjectRef.this, (String) obj);
              }
          }, new Response.ErrorListener() { // from class: com.bsides.london.ctf.MainActivity$$ExternalSyntheticLambda1
              @Override // com.android.volley.Response.ErrorListener
              public final void onErrorResponse(VolleyError volleyError) {
                  MainActivity.getFlag$lambda$1(Ref.ObjectRef.this, volleyError);
              }
          });
          queue.add(stringRequest);
          return (String) retVal.element;
      }
```

from the above code we can see that the URL is built from two strings stored in `R.string.pbin` and `R.string.slug`

using Frida we can dump those values to the console using a script.
First things first we need to find the identifier of our package, with can be done using the following command
`frida-ps -Uai`

![[Pasted image 20231117014615.png]]
As we can see above our identifier is `com.bsides.london.ctf`.
Next we create our blank script:
```JavaScript
// CTF-script.js
Java.perform(function(){
	console.log("[*] - Starting Script");
});
```
Then we can start putting together our script
`frida -U -l CTF-script.js -f com.bsides.london.ctf`

We know from the code we saw in Jadx that the url is built by calling the `getString` function passing in the id from `R.string`, the finalised script below overrides the implementation of `getString` to log the value held to the screen

```javascript
// CTF-script.js
Java.perform(function(){
	console.log("[*] - Starting Script");
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
```

Our final output is below
```bash
[*] - Starting Script
getString('2131820698') called
Value is: 'https://www.pastebin.com/raw/'
getString('2131820707') called
Value is: 'DTGDa6Pi'
```

We can add both these together and using curl gives us the flag:
![[Pasted image 20231117020203.png]]