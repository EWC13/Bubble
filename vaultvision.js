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

const onStart = () => {
  
  let i = setInterval(function () {
    if (window.Oidc && window.Oidc.UserManager) {
      clearInterval(i);
      initAuth();
    }
  }, 70);

}

onStart();
