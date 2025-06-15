import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import loginbanner from '../../assest/Login.jpg';
import '../../i18n';

import './CSS/LoginLearner.css';

const Login = ({ onLogin }) => {
  
    const{t,i18n} = useTranslation()
        const currentLanguage = i18n.language; 
          useEffect(()=>{
            window.document.dir = i18n.dir();
          },[currentLanguage])
    const navigate = useNavigate();
       const [showPassword, setShowPassword] = useState(false);

      const [formData , setformData] = useState({
        email:"",
        password:"",
      });
      const changeHandler = (e) =>{
        setformData({...formData, [e.target.name]:e.target.value});
      } 
      const Login = async () =>{
        const { email, password} = formData;
      if (!email || !password) {
        toast.error("Please fill all required fields.");
        return;
      }
        console.log('sign up function executed : ' , formData)
        try{
        const response = await fetch('https://smartech-production-1020.up.railway.app/api/login' ,{
          method:"POST",
          headers :{
            Accept:'application/json',
            'Content-Type':"application/json"
          },
          body:JSON.stringify(formData),
        });
        const responseData = await response.json();
        if (response.ok) 
          {
            const { token, role } = responseData;
            localStorage.setItem('auth-token',token);
            toast.success('Login successfully 🙆‍♂️');
            onLogin(token);
            if (responseData.role === 'ADMIN') {
              navigate('/Dashboard'); 
            } else if (responseData.role === 'ENSEIGNMENT') {
              navigate('/DashboardENS'); 
            } else if (responseData.role === 'APPRENANT') {
              navigate('/VerifyOTP');
            } else {
              toast.error('Unknown role. Please contact support.');
            }
          } else {
            toast.error(responseData.errors || 'Login failed');
          }
        }catch(error) {
          console.error('Error during registration ', error);
          toast.error('Email ou password incorrect');
        }
      }
  return (
    <div className='apprenantLogin' >
      <div className="rightimg">
        <img src={loginbanner} alt="" width={"450px"} />
      </div>
    <form className='login_apprenant_form' onSubmit={(e) => {e.preventDefault();Login() }}>
      <h1> {t('SignIn')} </h1>
     
      <div className="email">
      <input type="email" name="email" id="email" value={formData.email} onChange={changeHandler} placeholder='xxxx01@gmail.com' />
      </div>
        <div className="Password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={changeHandler}
            id="password"
            placeholder="••••••••"
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} style={{ marginTop: '2%' }} >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      <div className="login_btn">
      <button type="submit" className='login_apprenant'>{t('SignIn')}</button>
      </div>
      <p className='confirm'>{t('NoAccount')}  <span className='signUpLink'><Link to={'/SignUp'}> {t('Signup')} </Link></span></p>
    </form> 
    <ToastContainer   position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable  theme="light"    toastStyle={{ width: '200' }}/>
  </div>
  )
}

export default Login
