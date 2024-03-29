import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
import Services from '../';

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
    this.doesUsernameExist = this.doesUsernameExist.bind(this)
    this.generateUIDNotMoreThan1million = this.generateUIDNotMoreThan1million.bind(this)

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

            // report account activity metric
            ga('send', {
              hitType: 'event',
              eventCategory: 'Account Activity',
              eventAction: 'logged-in',
              eventLabel: 'Logged In'
            });

            browserHistory.replace('/')

            resolve('success');

          })

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

            var data = {}

            if (profile.user_metadata)
              data.user_metadata = profile.user_metadata
            else {
              
              // if a user signed up, then the full name is in local storage
              // if the user logged in through facebook or google, then the full name is a property in the profile
              let name = localStorage.getItem('fullname') || profile.name

              data.user_metadata = {
                fullname: name
              }

            }


            if (profile.user_metadata)
              data.app_metadata = profile.app_metadata
            else {
              
              data.app_metadata = {}

              // if user logged in with facebook or google
              // if username is not set
                // set their username as a variation of their email address
              if (profile.user_id !== undefined) {
                if (profile.user_id.indexOf('facebook') !== -1 || profile.user_id.indexOf('google') !== -1) {
                    let default_username = profile.given_name + '_' + profile.family_name
                    default_username = default_username.toLowerCase().replace(/[ .]/g,'_') + '_' + this.generateUIDNotMoreThan1million()
                    //data.username = default_username
                    data.app_metadata.username = default_username
                } else
                  data.app_metadata.username = profile.username
              }

              // set role

              if (profile.email !== undefined)
                data.app_metadata.roles = [( profile.email.indexOf('@hairpiq.com') > -1 ? 'admin' : 'user')]

            }

            // report account activity metric
            ga('send', {
              hitType: 'event',
              eventCategory: 'Account Activity',
              eventAction: 'account-created',
              eventLabel: 'Account Created'
            });

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

  setProfile(profile, suppressSetUserDataCall = false) {

    let id = profile.sub || profile.user_id;
    let _this = this;

    this.getProfileById(id).then(function(p){
      
      // sync user data to piqtionary db
      // so that username can be looked up without being logged in
      // this is needed for profile links to work (ie: hairpiq.com/shinavia)

      let params = {
        auth0_user_id: id,
        username: p.app_metadata !== undefined ? p.app_metadata.username : '',
        fullname: p.user_metadata !== undefined ? p.user_metadata.fullname : '',
        picture: p.picture || ''
      }

      // suppressSetUserDataCall is true when setProfile is called from the Settings Page
      
      if (!suppressSetUserDataCall) {


        Services.setUserData(params).then(function(result) {

          // Saves profile data to localStorage
          localStorage.setItem('profile', JSON.stringify(p))
          // Triggers profile_updated event to update the UI
          _this.emit('profile_updated', p)

        })

      } else {

        // Saves profile data to localStorage
        localStorage.setItem('profile', JSON.stringify(p))
        // Triggers profile_updated event to update the UI
        _this.emit('profile_updated', p)

      }

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
    localStorage.removeItem('is_admin')
    localStorage.clear()
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

          //console.log(resp);
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
  updateProfile(userId, data, suppressSetUserDataCall = false) {

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

        Services.auth0.updateUser(params).then(newProfile => { 
          
          _this.setProfile(newProfile, suppressSetUserDataCall)

          resolve(newProfile)

        });

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

  // the new updateProfile
  doesUsernameExist(username) {

    let _this = this;

    return new Promise(function(resolve, reject){

      _this.getManagementAccessToken().then(function(result) {
          
        var options = {
          method: 'GET',
          url: `https://${config.AUTH0_DOMAIN}/api/v2/users?fields=app_metadata.username`,
          headers: { authorization: 'Bearer ' + result.access_token}
        }

        var params = {
          options : JSON.stringify(options),
          username: username
        }

        Services.auth0.doesUsernameExist(params)
        .then(result => {

          let r = JSON.parse(result)
          
          resolve(r);

        });

      });

     })

  }

  // the new updateProfile
  deleteProfile(userId) {

    let _this = this;

    return new Promise(function(resolve, reject){

      var _params = {
        auth0_user_id: userId 
      }

      Services.deleteUserData(_params).then(function(result) {

        _this.getManagementAccessToken().then(function(result) {
            
          var options = {
            method: 'DELETE',
            url: `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
            headers: { authorization: 'Bearer ' + result.access_token}
          }

          var params = {
            options : JSON.stringify(options)
          }

          Services.auth0.deleteUser(params).then(() => { 

            // report account activity metric
            ga('send', {
              hitType: 'event',
              eventCategory: 'Account Activity',
              eventAction: 'delete-acount',
              eventLabel: 'Delete Account'
            })
            
            _this.logout()
            browserHistory.push('/logout');

            resolve('deleted!')

          });

        });

      });

     })

  }

  generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }

}