import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { authenticate, isAuth } from './helpers';
import { ToastContainer, toast } from 'react-toastify';
import Google from './Google';
import Facebook from './Facebook';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: 'annette@heaven.com',
    password: '123456',
    buttonText: 'Submit'
  });

  const { email, password, buttonText } = values;

  const handleChange = name => event => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = response => {
    authenticate(response, () => {
      isAuth() && isAuth().role === 'admin'
        ? history.push('/admin')
        : history.push('/private');
    });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password }
    })
      .then(response => {
        console.log('SIGNIN SUCCESS', response);
        // save the respone user in LS and token in cookie
        authenticate(response, () => {
          // callback func next in helper
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            buttonText: 'Enviado'
          });
          //toast.success(`Seja bem-vindo ${response.data.user.name}`);
          isAuth() && isAuth().role === 'admin'
            ? history.push('/admin')
            : history.push('/private');
        });
      })
      .catch(error => {
        console.log('SIGNIN ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Enviar' });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={handleChange('email')}
          value={email}
          type='email'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Senha</label>
        <input
          onChange={handleChange('password')}
          value={password}
          type='password'
          className='form-control'
        />
      </div>

      <div>
        <button className='btn btn-primary' onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      {/* {JSON.stringify(isAuth())} */}
      <div className='col-md-6 offset-md-3'>
        <ToastContainer />
        {isAuth() ? <Redirect to='/' /> : null}
        <h1 className='p-5 text-center'>Entrar</h1>
        <Google informParent={informParent} />
        <Facebook informParent={informParent} />
        {signinForm()}
        <br />
        <Link
          to='/auth/password/forgot'
          className='btn btn-sm btn-outline-danger'
        >
          Esqueci a senha
        </Link>
      </div>
    </Layout>
  );
};

export default Signin;
