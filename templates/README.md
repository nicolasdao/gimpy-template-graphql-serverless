
# appconfig.json
The appconfig.json allows you to configure your mini server to achieve 2 main goals:
1. Configuring CORS using the _headers_ property.
2. Configuring one or many deployment environments using the _env_ property.

Let's have a look to a basic example:

```
{
	"headers": {
		"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS, POST",
		"Access-Control-Allow-Headers": "Authorization, Origin, X-Requested-With, Content-Type, Accept",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Max-Age": "1296000"
	},
	"hosting": "googlecloud",
	"env": {
		"active": "default",
		"default": {
			"functionName": "YourAwesomeAPI",
			"trigger": "--trigger-http",
			"entryPoint": "main",
			"project": "your-google-project",
			"bucket": "your-bucket"
		},
		"build": {
			"functionName": "YourAwesomeAPI",
			"trigger": "--trigger-http",
			"entryPoint": "main",
			"project": "your-google-project",
			"bucket": "your-bucket"
		}
	}
}
```

The above configuration can be read as follow:

_**headers**_
- Restrict access to your API to the following verbs only: _GET, HEAD, OPTIONS, POST_. A PUT would through a 403 error. 
- Allow the client to pass the following headers in its request: _Authorization, Origin, X-Requested-With, Content-Type, Accept_. 
- Allow access to your API to any client (aka Cross-Origin Resource Sharing). That's what the '*' means.
- Cache any preflight request in the clients for maximum 1296000 seconds (i.e. 15 days). However, the caching time to live is ultimately controlled by each browser. They might not allow such a long period.

_**hosting**_
- The web server can either be hosted on Google Cloud Functions ("hosting": "googlecloud") or Firebase ("hosting": "firebase").

_**env**_
- "active". This flag is set to _default_, which means that the current active environment is the "default" one. If it is set to _build_, the "build" settings would be used.