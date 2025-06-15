import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import teacher_profile from '../../assest/user_teacher.png';
import '../../i18n';
import './Teachers.css';



const Teachers = () => {
      const{t,i18n} = useTranslation()
      const currentLanguage = i18n.language; 
      const [imagePreview, setImagePreview] = useState(teacher_profile);
      useEffect(()=>{
        window.document.dir = i18n.dir();
      },[currentLanguage])
      const [Enseignant,setEnseignant] = useState([]);

            useEffect(() => {
              fetch(`https://smartech-production-1020.up.railway.app/api/enseignant?lang=${currentLanguage}`)
                .then(response => response.json())
                .then(data => {
                  console.log('Fetched Teachers:', data);
                  if (Array.isArray(data)) {
                    setEnseignant(data);
                  } else {
                    console.error("Fetched data is not an array:", data);
                    setEnseignant([]);
                  }
                })
                .catch(error => {
                  console.error("Error fetching Teachers:", error);
                  setEnseignant([]); 
                })
            }, [currentLanguage]);
            const ball = {
                width: 1450,
                backgroundColor: "#FFFFFFFF",
                borderRadius: "50%",
            }
            const navigate=useNavigate();
            const navigateTo = (teacherId) => {
                navigate(`/ProfileENS/${teacherId}`);
              };
  return (
    
    <section  className="py-16 px-6 md:px-12 lg:px-24 dark-bg dark-text"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "350px",
      marginTop: "15%"
    }} >
        
            <div className='w-full md:w-1/2 space-y-6 dark-bg dark-text'>
                <h2 id="titleSection" className='text-xl font-semibold  text-center tracking-wider dark-text' style={{marginTop:"2%",color:"#fdc401",fontFamily:"Baloo 2,sans-serif"}}>{t('ExploreOurTeachers')}</h2>
                <p id="titleSlogan"   className='section-subtitle text-3xl text-center font-semibold dark-text' style={{color:"#03619f",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}} >
                    {t('ExploreNow')}
                </p>
                
                <div 
                    className="teachers-swiper-wrapper">
                    <Swiper
                    modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={5} slidesPerView={1}
                    breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    className="teachers-swiper"
                    >

                    {
                        Enseignant.map(teachers=>(
                            <SwiperSlide key={teachers.id}>

                           
                            <div  
                            key={teachers.id}     
                             className='containers_teachers dark-bg dark-text'>
                                <div className="teachers_image">
                                <img src={teachers.image || imagePreview} alt="" className='rounded-full border border-gray-300 dark-bg dark-text'/>
                                    
                                </div>
                                    <div class="teacher_info">
                                        <p className='teachers_name dark-text'>{teachers.fullname}</p>
                                        <p className="teacher-bio  dark-text">{teachers.about}</p>
                                    </div>
                                    <button type="button"  onClick={() => navigateTo(teachers.id)}  className="view-profile-btn dark-hover dark-text">👉 {t('viewMore')} </button>
                            
                            </div>
                            </SwiperSlide>
                        ))
                    }
                    </Swiper>
                </div>

            </div>

  </section>
  )
}

export default Teachers
