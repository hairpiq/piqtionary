import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
import Services from './';

const config = process.env;

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    this.auth0 = new auth0.WebAuth({
      clientID: config.AUTH0_CLIENT_ID,
      domain: config.AUTH0_DOMAIN,
      responseType: 'token id_token',
      redirectUri: config.AUTH0_REDIRECT_URI
    })

    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
    this.loginWithFacebook = this.loginWithFacebook.bind(this)
    this.loginWithGoogle = this.loginWithGoogle.bind(this)
    this.resetPassword = this.resetPassword.bind(this)

    this.getManagementAccessToken = this.getManagementAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
    this.getProfileById = this.getProfileById.bind(this)

  }

  login(username, password) {

    let _this = this;

    return new Promise (function(resolve, reject) {
      
      _this.auth0.client.login({
        realm: 'Username-Password-Authentication',
        username,
        password
      }, (err, authResult) => {
        if (err) {
          
          reject(err.description);
          
          alert('Error: ' + err.description)
          
          return
        }

        if (authResult && authResult.idToken && authResult.accessToken) {
          
          _this.setToken(authResult.accessToken, authResult.idToken)

          _this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {

            if (error) {
              console.log('Error loading the Profile', error)
            } else {
              _this.setProfile(profile)
            }
          })

          resolve('success');

          browserHistory.replace('/')

        }
      })

    });
  }

  signup(email, password, username, fullname) {

    let _this = this;

    return new Promise (function(resolve, reject) {

      _this.auth0.redirect.signupAndLogin({
        connection: 'Username-Password-Authentication',
        email,
        username,
        password,
      }, function(err) {
        if (err) {
          reject(err.description);
          alert('Error: ' + err.description)
        }

        resolve('success');

      });

    });
  }

  loginWithFacebook() {
    this.auth0.authorize({
      connection: 'facebook'
    })
  }

  loginWithGoogle() {
    this.auth0.authorize({
      connection: 'google-oauth2'
    })
  }

  parseHash(hash) {

    this.auth0.parseHash({ hash }, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setToken(authResult.accessToken, authResult.idToken)
        try {
          browserHistory.replace('//' + config.HOSTNAME);
        } catch (e) {
          console.log(e.message);
        }
        this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            console.log('Error loading the Profile', error)
          } else {

            this.setProfile(profile)

            var data = {
              user_metadata: {
                fullname: localStorage.getItem('fullname')
              }
            }

            // set role

            if (profile.email !== undefined)
              data.app_metadata = {
                roles: [( profile.email.indexOf('@hairpiq.com') > -1 ? 'admin' : 'user')]
              }

            this.updateProfile(profile.sub, data).then(function(result) {

              localStorage.removeItem('fullname');

            });

          }
        })
      } else if (authResult && authResult.error) {
        alert('Error: ' + authResult.error)
      }
    });

  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setToken(accessToken, idToken) {
    // Saves user access token and ID token into local storage
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('id_token', idToken)
  }

  setProfile(profile) {

    let id = profile.sub || profile.user_id;
    let _this = this;

    this.getProfileById(id).then(function(result) {

      // Saves profile data to localStorage
      localStorage.setItem('profile', JSON.stringify(result))
      // Triggers profile_updated event to update the UI
      _this.emit('profile_updated', result)

    })

    
  }

  getProfile() {

    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
  }

  resetPassword(email) {

    let _this = this;

    return new Promise (function(resolve, reject) {

      _this.auth0.changePassword({
        connection: 'Username-Password-Authentication',
        email: email
      }, function (err, resp) {
        if(err){
          
          console.log(err.message);
          reject(err.message);

        }else{

          console.log(resp);
          resolve(resp);
          
        }
      });

    });

  }

  getManagementAccessToken() {

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://" + config.AUTH0_DOMAIN + "/oauth/token",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
        data: JSON.stringify({
          client_id: config.AUTH0_MANAGEMENT_CLIENT_ID,
          client_secret: config.AUTH0_MANAGEMENT_CLIENT_SECRET,
          audience: 'https://' + config.AUTH0_DOMAIN + '/api/v2/',
          grant_type: 'client_credentials'
        })
      }

    return new Promise(function(resolve, reject){

      $.ajax(settings).done(function (response) {

        resolve(response);

      });

    });

  }

  // the new updateProfile
  updateProfile(userId, data) {

    let _this = this;

    return new Promise(function(resolve, reject){

      _this.getManagementAccessToken().then(function(result) {
          
        var options = {
          method: 'PATCH',
          url: `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
          headers: { authorization: 'Bearer ' + result.access_token},
          json: data
        }

        var params = {
          options : JSON.stringify(options)
        }

        Services.auth0.updateUser(params)
        .then(newProfile => _this.setProfile(newProfile))

      });

     })

  }

  // the new updateProfile
  getProfileById(userId) {

    let _this = this;

    return new Promise(function(resolve, reject){

      _this.getManagementAccessToken().then(function(result) {
          
        var options = {
          method: 'GET',
          url: `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
          headers: { authorization: 'Bearer ' + result.access_token}
        }

        var params = {
          options : JSON.stringify(options)
        }

        Services.auth0.getUser(params)
        .then(newProfile => {

          let p = JSON.parse(newProfile)
          
          resolve(p);

        });

      });

     })

  }

}