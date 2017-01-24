import React, { PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import AuthService from '../services/AuthService';
//import styles from './styles.module.css'

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  getAuthParams() {
    return {
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value
    }
  }

  login(e) {
    e.preventDefault()
    const { email, password } = this.getAuthParams()
    this.props.auth.login(email, password)
  }

  signup() {
    const { email, password } = this.getAuthParams()
    this.props.auth.signup(email, password)
  }

  loginWithGoogle() {
    this.props.auth.loginWithGoogle();
  }

  render() {
    return (
      <div>
        Login
      </div>
    )
  }
}

export default Login;