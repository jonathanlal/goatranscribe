import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'https://goatranscribe.com', // or AUTH0_AUDIENCE
      // Add the `offline_access` scope to also get a Refresh Token
      scope: 'openid profile email read:messages', // or AUTH0_SCOPE
    },
    returnTo: 'http://localhost:3000/profile', // or AUTH0_REDIRECT_URI
  }),
  logout: handleLogout({
    returnTo: 'http://localhost:3000',
  }),
});
