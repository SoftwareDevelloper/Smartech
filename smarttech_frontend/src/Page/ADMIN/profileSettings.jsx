import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ProfileSettings = () => {
        const{t,i18n} = useTranslation()
            const navigate = useNavigate();
            const [formData , setformData] = useState({
                fullname:"",
                email:"",
                password:"",
                phone:"",
                about:""
                });
                const changeHandler = (e) =>{
                    setformData({...formData, [e.target.name]:e.target.value});
                } 
                const updateinfo = async()=>{
                    const token = localStorage.getItem("auth-token");
                        let id=''
                        if(token){
                        const decodedToken = jwtDecode(token);
                        id = decodedToken.sub; 
                        }
                        try {
                            const response = await fetch(`http://localhost:9000/api/updateInfosAdmin/${id}`,{
                                method:"PUT",
                                headers :{
                                Accept:'application/json',
                                'Content-Type':"application/json"
                                },
                                body:JSON.stringify(formData),
                            });
                            const responseData = await response.json();
                            if (response.ok) 
                            {
                                toast.success("Your information was updated successfully")
                            } else {
                                toast.error(responseData.errors || 'update informations failed');
                            }      
                        } catch (error) {
                            console.error('Error during update informations', error);
                            toast.error('Something went wrong . please try again');
                        }
                        }
  return (
        <div className="p-4 bg-white sm:ml-64"style={{display:"flex",flexDirection:"column",fontFamily:"Montserrat, sans-serif"}} >
        <ToastContainer/>
        <div className="p-4 bg-white rounded-lg">
        <div className="grid grid-cols-12 gap-4 mb-4 bg-white">
            
        <h2 className="subpixel-antialiased text-2xl font-semibold text-gray-800 "> {t('Edit Your Informations')} </h2>
        <form class="w-full max-w-lg " onSubmit={(e) => {e.preventDefault(); updateinfo() }} >
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
            </div>
            <button className='py-3 px-8 me-2 mb-2 text-sm font-medium text-white focus:outline-none rounded-lg'style={{marginLeft:"3%",backgroundColor:"#0084db"}}>Save changes</button>
        </form>
        </div>
        </div>
        </div>
  )
}

export default ProfileSettings
