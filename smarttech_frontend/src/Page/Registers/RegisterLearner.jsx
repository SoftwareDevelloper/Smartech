import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Registerbanner from '../../assest/register.jpg';
import '../../i18n';
import './css/style.css';
const RegisterLearner = () => {
    const{t,i18n} = useTranslation()
    const currentLanguage = i18n.language; 
          useEffect(()=>{
            window.document.dir = i18n.dir();
          },[currentLanguage])
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData , setformData] = useState({
      fullname:"",
      email:"",
      password:"",
      niveau:"",
      cle:"",
      phone:"",
      specialitée:"",
      role:""
    });
  
    const changeHandler = (e) =>{
      setformData({...formData, [e.target.name]:e.target.value});
    } 
     const handlePhoneChange = (value) => {
        setformData({...formData, phone: value});
    }
    const Register = async () =>{
      const { fullname, email, password, niveau,phone, cle, role,specialitee } = formData;
      if (role === "APPRENANT" && (!niveau || !phone)) {
          toast.error("Niveau and Phone are required for Apprenant");
          return;
      }
      if (role === "ENSEIGNMENT" && (!phone || !specialitee)) {
          toast.error("Phone and Specialitée are required for Enseignement");
          return;
      }
      if (role === "ADMIN" && !cle) {
          toast.error("Cle is required for Admin");
          return;
      }
  
      console.log('sign up function executed : ' , formData)
      try{
        const filteredData = { fullname, email, password, role };

            if (role === "ADMIN") {
              filteredData.cle = cle;
            } else if (role === "APPRENANT") {
              filteredData.niveau = niveau;
              filteredData.phone = phone;
            } else if (role === "ENSEIGNMENT") {
              filteredData.phone = phone;
              filteredData.specialitee = specialitee;
            }

      const response = await fetch('https://smartech-production-1020.up.railway.app/api/Register' ,{
        method:"POST",
        headers :{
          Accept:'application/json',
          'Content-Type':"application/json"
        },
        body:JSON.stringify(filteredData),
      });
      const responseData = await response.json();
      if (response.ok) 
        {
          toast.success('Please wait the admin to validate your account');
           
            if (responseData.requiresApproval) {
                navigate('/approve'); // Redirect to approval waiting page
            } else {
                navigate('/login'); // Direct to login for auto-approved users (like ADMIN)
            }
      } else{
        toast.error(responseData.errors || 'Registration failed');
      }
  
      }catch(error) {
        console.error('Error during registration ', error);
        toast.error('Please try again');
      }
    }
  return (
    <div className='SignUp'>
       <div className="rightimg">
              <img src={Registerbanner} alt="" width={"450px"}/>
       </div>
      <form className='Sign_form' onSubmit={(e) => {e.preventDefault(); Register() }}>
        <h1>{t('Signup')}</h1>
        

        <div className="fullname">
          <input type="text" name="fullname" value={formData.fullname} onChange={changeHandler} id="fullname" placeholder={t('YourFullname')} />
        </div>

        <div className="emailadress">
          <input type="email" name="email" id="email" value={formData.email} onChange={changeHandler} placeholder='xxxx01@gmail.com' />
        </div>

        {formData.role === "ADMIN" && (
          <div className="cle">
            <input type='number' value={formData.cle} onChange={changeHandler} name="cle" id="cle" placeholder='0000' />
          </div>
        )}

        {formData.role === "APPRENANT" && (
          <>
          <div className="niveau">
            <input type='text' name="niveau" value={formData.niveau} onChange={changeHandler} id="niveau" placeholder={t('level')} />
          </div>
          <div className="phone-input">
            <PhoneInput
              international
              defaultCountry="TN"
              value={formData.phone}
              onChange={handlePhoneChange}
               placeholder={t('+(216)')}
            />          
          </div>
        </>
        )}
        {formData.role === "ENSEIGNMENT" && (
          <>
          <div className="phone-input">
            <PhoneInput
              international
              defaultCountry="TN"
              value={formData.phone}
              onChange={handlePhoneChange}
               placeholder={t('+(216)')}
            />          
          </div>

          <div className="Role">
            <select name="specialitee" id="specialitee" value={formData.specialitee} onChange={changeHandler} >
              <option value="">{t('ChooseYourSpecialitée')}</option>
              <option value="Mathématiques" >{ t('Mathématiques') }</option>
              <option value="Sciences" > {t('Sciences')} </option>
              <option value="Languages" > {t('Languages')} </option>
              <option value="Informatiques" >{ t('Informatiques') }</option>
              <option value="Programming" > {t('Programming')} </option>
              <option value="Histoire" > {t('Histoire')} </option>
              <option value="Geographie" > {t('Geographie')} </option>

            </select>
          </div>
          </>
        )}
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

        <div className="Role">
          <select name="role" id="role" value={formData.role} onChange={changeHandler} >
            <option value="">{t('ChooseYourRole')}</option>
            <option value="ADMIN" >{ t('ADMIN') }</option>
            <option value="APPRENANT" > {t('APPRENANT')} </option>
            <option value="ENSEIGNMENT" > {t('ENSEIGNMENT')} </option>
          </select>
        </div>

        <div className="btn-sign">
          <button type="submit" className='signIn_btn'> {t('Signup')} </button>
        </div>

        <div className="pSign">
          <p className='p'>
           {t('WithAccount')} <span className='login'><Link to={'/Login'}> {t('SignIn')} </Link></span>
          </p>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />

    </div>
  );
};

export default RegisterLearner;
