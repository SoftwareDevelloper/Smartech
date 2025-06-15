import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../../i18n'
import i18n from '../../i18n'
const Enseignant = () => {
  const{t} = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
   const navigate = useNavigate();
 const [formData , setformData] = useState({
      fullname:"",
      email:"",
      password:"",
      phone:"",
      about:"",
      role:"ENSEIGNMENT"
    });
     const changeHandler = (e) =>{
          setformData({...formData, [e.target.name]:e.target.value});
      }
  const generatePassword = () => {
    const chars ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setformData({ ...formData, password }); 
  };
 
        const AddTeacher = async () =>{
          const { fullname, email, password,role } = formData;
        if (!fullname || !email || !password || !role ) {
          toast.error("Please fill all required fields");
          return;
        }
      
          console.log('sign up function executed : ' , formData)
          try{
          const response = await fetch('https://smartech-production-1020.up.railway.app/api/AddTeacher' ,{
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
              toast.success('Teachers added successfully');
                navigate('/Dashboard');
              
              
          } else{
            toast.error(responseData.errors || 'Creation failed');
          }
      
          }catch(error) {
            console.error('Error during Creation ', error);
            toast.error('Please try again');
          }
        }
  return (
    <div className="p-4 bg-white sm:ml-64"style={{display:"flex",flexDirection:"column",fontFamily:"Montserrat, sans-serif"}}>
      <div className="p-4 bg-white rounded-lg">
        <div className="grid grid-cols-12 gap-4 mb-4 bg-white">
          
        <h2 className="subpixel-antialiased text-2xl font-semibold text-gray-800 "> {t('AddTeachers')} </h2>
        <form class="w-full max-w-lg " onSubmit={(e) => {e.preventDefault(); AddTeacher() }} >
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-fullname">
        {t('Fullname')}
      </label>
      <input class="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"  
      name='fullname'
      value={formData.fullname}
      onChange={changeHandler}
      type="text" placeholder=""/>
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
        {t('Email')}
      </label>
      <input class="appearance-none block w-full  bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      name='email'
      value={formData.email}
      onChange={changeHandler}
      type="email" placeholder="xxxxxx@gmail.com"/>
    </div>
    <div class="w-full md:w-1/2 px-3">
    
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
        {t('Password')}
      </label>
      <input class="appearance-none block w-full  bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      name="password"
      value={formData.password}
      onChange={changeHandler}
      type="password" placeholder="••••••••"/>
      <button type="button" onClick={generatePassword} className="mt-2 px-5 py-2 text-white bg-blue-800 rounded">
        Generate Password
      </button>
  </div>
  <div class="w-full md:w-1/2 px-3">
    
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
      {t('Tel')}
    </label>
    <input class="appearance-none block w-full  bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    name="phone"
    value={formData.phone}
    onChange={changeHandler}
    type="Tel" placeholder="+(216)"/>
  
</div>
<div class="w-full md:w-1/2 px-3">
    
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
      {t('About')}
    </label>
    <textarea class="appearance-none block w-full  bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    name="about"
    value={formData.about}
    onChange={changeHandler}
    type="text" placeholder="   "></textarea>
  
</div>
  <div class="w-full md:w-1/2 px-3">
    
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
      {t('Role')}
    </label>
    <input class="appearance-none block w-full  bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
    name='role'
    value={formData.role}
    onChange={changeHandler}
    type="text" placeholder="••••••••" readOnly/>
    </div>
    </div>
    <button className='py-3 px-8 me-2 mb-2 text-sm font-medium text-blue-800 focus:outline-none bg-white rounded-full border border-blue-800 hover:bg-blue-800 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-blue-800 dark:bg-white dark:text-blue-800 dark:border-blue-800 dark:hover:text-white dark:hover:bg-blue-800'style={{marginLeft:"3%"}}>Confirm</button>
    </form>
    </div>
    </div>
    </div>
  )
}

export default Enseignant
