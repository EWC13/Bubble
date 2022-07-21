//https://github.com/jfriend00/docReady
//http://stackoverflow.com/a/9899701/1660185
(function(funcName, baseObj) {
    "use strict";
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of 
    // window.docReady(...)
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    
    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }
    
    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    
    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);
// modify this previous line to pass in your own method name 
// and object for the method to be attached to

function initAuth() {
  let userManager = {};
  let userManagerRegister = {};
  let user = {};


  const process = {
    "env" : {
     "VV_AUTHORITY": 'https://bubbly.2faez.com',
     "VV_CLIENT_ID": 'LhZUN78Yupl55A_-',
     "VV_CALLBACK_URI": 'https://vaultvisiontester.bubbleapps.io/version-test/oidc_callback',
     "VV_POST_LOGOUT_URI": 'https://vaultvisiontester.bubbleapps.io/version-test',
     "SIGNIN_PAGE": "version-test/signin",
     "SIGNUP_PAGE": "version-test/signup",
     "LOGOUT_PAGE": "version-test/logout",
     "PROFILE_PAGE": "version-test/profile",
    }
  };

  const oidcConfig = {
    authority: process.env.VV_AUTHORITY,
    client_id: process.env.VV_CLIENT_ID,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: process.env.VV_CALLBACK_URI,
    loadUserInfo: 'true',
    post_logout_redirect_uri: process.env.VV_POST_LOGOUT_URI,
    automaticSilentRenew: false,
    monitorSession: false,
  };

  try {
    /**
     * Create the UserManager
     */

    // Log.logger = console;
    // Log.level = Log.DEBUG;

    userManager = new window.Oidc.UserManager(oidcConfig);
    userManagerRegister = new window.Oidc.UserManager({
      ...oidcConfig,
      extraQueryParams: { vv_action: 'register' },
    });


  } catch(error) {
    throw new Error("oidc-client not found - " + error.message);
  }

  console.log(location.pathname.toLowerCase());
  console.log(process.env.SIGNIN_PAGE.toLowerCase());

  if (location.pathname.toLowerCase() === process.env.SIGNIN_PAGE.toLowerCase()) {
    userManager.signinRedirect();
  } else if (location.pathname.toLowerCase() === process.env.SIGNUP_PAGE.toLowerCase()) {
    userManagerRegister.signinRedirect();
  } else if (location.pathname.toLowerCase() === process.env.LOGOUT_PAGE.toLowerCase()) {
    userManager.signoutRedirect();
  } else if (window.location.origin.toLowerCase() + window.location.pathname.toLowerCase() === process.env.VV_CALLBACK_URI.toLowerCase()) {
    userManager.signinCallback().then((user) => {
      window.vv_user = user;
      window.location.assign(process.env.PROFILE_PAGE);
    });
  } else {
    userManager.getUser().then((user) => {
      window.vv_user = user;
      if (document.getElementById("profileDiv"))
      {
        document.getElementById("profileDiv").innerText = JSON.stringify(user, null, 2);
      }

      console.log("user");
      console.log(JSON.stringify(user, null, 2));
    });
    console.log("here in else");
  }
} 

docReady(initAuth);

