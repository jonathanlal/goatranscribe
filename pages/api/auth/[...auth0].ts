import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
} from '@auth0/nextjs-auth0';
export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'https://goatranscribe.com', // or AUTH0_AUDIENCE
      // Add the `offline_access` scope to also get a Refresh Token
      scope: 'openid profile email read:messages offline_access', // or AUTH0_SCOPE
    },
    returnTo: `${process.env.AUTH0_BASE_URL}/transcribe`, // or AUTH0_REDIRECT_URI
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL,
  }),
  onError(req, res, error) {
    console.log('error', error);
    res.writeHead(302, {
      Location: '/error',
    });
    // res.status(error.status || 500).end(error.message);
  },
});
