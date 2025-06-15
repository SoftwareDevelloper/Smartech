import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'swiper/css';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CartContext } from '../../Context/CartContext';
import '../../i18n';
import '../DisplayCourse/DisplayCourse.css';
const DisplayCourse = () => {
    const [course,setCourse]=useState([])
    const [ens, setEns] = useState({ fullname: '' });
    const { id } = useParams();     
    const [relatedCourses, setRelatedCourses] = useState([]);
    const{t,i18n} = useTranslation()
        const currentLanguage = i18n.language; 
          useEffect(()=>{
            window.document.dir = i18n.dir();
          },[currentLanguage])
    useEffect(() => {
        fetch(`https://smartech-production-1020.up.railway.app/api/GetFormationsById/${id}?lang=${currentLanguage}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(`Course fetched for ${id}:`, data);
                setCourse(data); 
            })
            .catch((error) => {
                console.error(`Error fetching course for ${id}:`, error);
            });
    }, [currentLanguage,id]);
    useEffect(() => {
        if (course.category) {
          fetch(`https://smartech-production-1020.up.railway.app/api/GetCourse/${course.category}?lang=${currentLanguage}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(`Related courses fetched for category ${course.category}:`, data);
              if (Array.isArray(data)) {
                setRelatedCourses(data);
            }
            })
            .catch((error) => {
              console.error(`Error fetching related courses for category ${course.category}:`, error);
            });
        }
      }, [course]); 
      useEffect(() => {
        if (course && course.id) {
            fetch(`https://smartech-production-1020.up.railway.app/api/fullnameEns/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(`Instructor name fetched for course ${id}:`, data);
                    if (data && data.fullname) {
                        setEns(data); 
                    } else {
                        console.error(`Instructor name is missing in the response for course ${id}`);
                    }})}
    }, [course, id]); 
        useEffect(() => {
        if (ens && ens.fullname) {
            console.log(`Instructor Name in state after update:`, ens.fullname);
        }
    }, [ens]); 
        const { addToCart } = useContext(CartContext);
            const handleAddToCart = () => {
            addToCart(course);
            };
  return (
    <>
        <ToastContainer/>
        <div className='DisplayCours'>
                    {course ? ( 
                    <>
                    <div className="rights">
                        <h1 className='courseTitle'>{currentLanguage === 'fr'
                            ? course.titleFr
                            : currentLanguage === 'ar'
                            ? course.titleAr
                            : course.titleEn}
                        </h1>
                        <hr />
                        <div className="ensfullname">
                            <span class="bg-yellow-500 text-yellow-800 text-xs font-medium  px-1 py-0.5 rounded-sm" style={{width:"100px"}}>
                                By {ens?.fullname}
                            </span>
                        </div>
                        <p className='courseDesc'>
                            {
                                currentLanguage === 'fr'
                                ? course.descriptionFr
                                : currentLanguage === 'ar'
                                ? course.descriptionAr
                                : course.descriptionEn
                            }
                        </p>
                        <span className='coursePrice'> 
                            {course.price}  
                            {
                                currentLanguage === 'fr'
                                ? "TND"
                                : currentLanguage === 'ar'
                                ? " دينار"
                                : "TND"
                            }
                        </span>
                        <p className="category">
                            <span class="bg-yellow-500 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-500 dark:text-yellow-900">
                                {currentLanguage === 'fr'
                                ? course.categoryFr
                                : currentLanguage === 'ar'
                                ? course.CategoryAr
                                : course.category}
                            </span>
                        </p>
                        <div className="inscription">
                            <button className='inscrire' onClick={handleAddToCart}>
                            {t('AddToCart')}
                            </button>
                        </div>  
                    </div>
                    <div className="left">
                        <img src={course.image} alt={course.titleEn} width={"500px"} />
                    </div>
                    </>
                    ) : (
                        <button disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            Loading...
                        </button>
                    )}
        </div>
        <div className='relatedHR'>
            <h1> {t('RelatedCourses')} </h1>
            <hr  />
        </div>
        <div className="DisplayCourseRelated">
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={20} slidesPerView={1}
                    breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    className="mySwiper">
                {
                    relatedCourses.map(relatedCourse=>(
                        <>
                            <SwiperSlide key={relatedCourse.id}>
                            
                                <div className='lefts' key={relatedCourse.id}>
                                    <Link to={`/Cours/${relatedCourse.id}`}>
                                        <img src={relatedCourse.image} alt=""  />
                                    </Link>    
                                </div>
                            </SwiperSlide>
                        </>
                    ))
                }
            </Swiper>
        </div>
    </>
  )
}
export default DisplayCourse
