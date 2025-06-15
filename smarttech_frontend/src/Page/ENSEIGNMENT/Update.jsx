import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../../i18n';
import './css/style.css';
const Update = () => {
    const{t,i18n} = useTranslation()
     const navigate = useNavigate();
    const [formData , setformData] = useState({
          fullname:"",
          email:"",
          password:"",
          phone:"",
          about:"",
          specialitee:""
        });
        const changeHandler = (e) =>{
            setformData({...formData, [e.target.name]:e.target.value});
        } 
        const update = async()=>{
          const token = localStorage.getItem("auth-token");
            let id=''
            if(token){
              const decodedToken = jwtDecode(token);
              id = decodedToken.sub; 
            }
            try {
              const response = await fetch(`https://smartech-production-1020.up.railway.app/api/updateInfo/${id}`,{
                method:"PUT",
                headers :{
                  Accept:'application/json',
                  'Content-Type':"application/json"
                },
                body:JSON.stringify(formData),
                });
                const responseData = await response.json();
                if (response.ok) {
                  toast.success("Your information was updated successfully")
                } else {
                  toast.error(responseData.errors || 'update informations failed');
                }      
                } catch (error) {
                  console.error('Error during update informations', error);
                  toast.error('Something went wrong . please try again');
                }}
  return (
        <div className='p-4 sm:ml-64'>
          <div className="flex flex-col md:flex-row justify-center items-center min-h-screen p-4 bg-cover bg-center bg-no-repeat"  >
            <ToastContainer/>
            <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5  p-4 md:p-8" >
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                    <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 bg-transparent bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
                        <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-8 relative group">
                            <span class="relative inline-block">
                              <span class="text-blue-800">
                                {t('EditYourInformations')}
                              </span>
                              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                            </span>
                        </h2>
                        <form class="w-full" onSubmit={(e) => {e.preventDefault(); update() }} >
                            <div class="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                              <div class="w-full ">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-fullname">
                                  {t('Fullname')}
                                </label>
                                <input class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"  
                                  name='fullname'
                                  value={formData.fullname}
                                  onChange={changeHandler}
                                  type="text" placeholder=""/>
                              </div>
                              <div class="w-full">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                                  {t('Email')}
                                </label>
                                <input class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                  name='email'
                                  value={formData.email}
                                  onChange={changeHandler}
                                  type="email" placeholder="xxxxxx@gmail.com"/>
                              </div>
                              <div class="w-full ">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                  {t('Password')}
                                </label>
                                <input class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                  name="password"
                                  value={formData.password}
                                  onChange={changeHandler}
                                  type="password" placeholder="••••••••"/>
                            </div>
                            <div class="w-full">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                {t('Tel')}
                              </label>
                              <input class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                name="phone"
                                value={formData.phone}
                                onChange={changeHandler}
                                type="Tel" placeholder="+(216)"/>
                            </div>
                            <div class="w-full">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                {t('About')}
                              </label>
                              <textarea class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                name="about"
                                value={formData.about}
                                onChange={changeHandler}
                                type="text">
                              </textarea>
                            </div>
                              <div className="w-full">
                              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                {t('Speciality')}
                              </label>
                                <select name="specialitee" id="specialitee"  class="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" value={formData.specialitee} onChange={changeHandler} >
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
                            </div>
                            <div className="flex justify-center md:justify-end mt-8">
                              <button className="py-3 px-8 text-sm font-medium text-white rounded-lg bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"> {t('Savechanges')} </button>
                            </div>
                      </form>
                    </div>
                  </div>
               
            </div>
          </div>
        </div>
        </div>
  )
}
export default Update
