import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken'
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Reset = ({ match }) => {// props.match from react-router-dom
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Alterar senha'
  });

  useEffect(() => { // to get token from url
    let token = match.params.token
    let {name} = jwt.decode(token)
    if(token) {
      setValues({...values, name, token})
    }
  }, [])

  const { name, buttonText, token, newPassword } = values;

  const handleChange = event => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    //console.log('send request');
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: {newPassword, resetPasswordLink: token}
    })
      .then(response => {
        console.log('RESET PASSWORD SUCCESS', response);
        toast.success(response.data.message);
        setValues({ ...values, buttonText: 'Feito!' });
      })
      .catch(error => {
        console.log('RESET PASSWORD ERROR', error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: 'Alterar senha' });
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Nova Senha</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type='password'
          className='form-control'
          placeholder='Escreva sua nova senha'
          required
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
        <h1 className='p-5 text-center'>Olá {name}, escreva sua nova senha.</h1>
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default Reset;
