import { GoogleLogin } from 'react-google-login';

const GoogleOauth = (props) => {
  const onSuccess = (res) => {
    console.log('login success! current user: ', res.profileObj);
  }
  
  const onFailure = (res) => {
    console.log('login failed! res: ', res);
  }
  
  return (
    <div id="signInButton">
    <GoogleLogin
      client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
    />
    </div>
  )
}

export default GoogleOauth;