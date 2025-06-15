import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NoData from '../../assest/NoData.png';
import '../../i18n';
import '../css/filter.css';
const DisplayCoursbyCategory = ({ category,levels,classe,minPrice,maxPrice}) => {
    const [courses, setcourses]=useState([]);
    const [course, setcourse]=useState([]);
      const{t,i18n} = useTranslation()
        const currentLanguage = i18n.language; 
          useEffect(()=>{
            window.document.dir = i18n.dir();
          },[currentLanguage])
          useEffect(() => {
            const fetchCourses = async () => {
                try {
                    let data;
                    if (category) {
                        const response = await fetch(
                            `https://smartech-production-1020.up.railway.app/api/GetCourse/${category}?lang=${currentLanguage}`
                        );
                        data = await response.json();
                    } else if (levels) {
                        const response = await fetch(
                            `https://smartech-production-1020.up.railway.app/api/GetCourseBylevel/${levels}?lang=${currentLanguage}`
                        );
                        data = await response.json();
                    } 
                    else if(classe){
                        const response = await fetch(
                            `https://smartech-production-1020.up.railway.app/api/GetCourseByCourseClass/${classe}?lang=${currentLanguage}`
                        );
                        data = await response.json();
                    }
                    else {
                        const response = await fetch(
                            `https://smartech-production-1020.up.railway.app/api/GetCourse?lang=${currentLanguage}`
                        );
                        data = await response.json();
                    }
    
                    // Apply level filter if levels is provided
                    if (levels && Array.isArray(data)) {
                        data = data.filter(course => course.level === levels);
                    }

                    if(classe && Array.isArray(data)){
                        data= data.filter(course => course.classe === classe)
                    }
    
                    // Apply price range filter if minPrice and maxPrice are provided
                    if (minPrice !== undefined && maxPrice !== undefined && Array.isArray(data)) {
                        data = data.filter(course => course.price >= minPrice && course.price <= maxPrice);
                    }
                    // Update the courses state
                    if (Array.isArray(data)) {
                        setcourses(data);
                    }
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            };
            fetchCourses();
        }, [category, levels,classe, minPrice, maxPrice, currentLanguage]);
       
        
        
              useEffect(() => {
                fetch(`https://smartech-production-1020.up.railway.app/api/Top5Course?lang=${currentLanguage}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log('Fetched course:', data);
                    if (Array.isArray(data)) {
                      setcourse(data);
                    } else {
                      console.error("Fetched data is not an array:", data);
                      setcourse([]);
                    }
                  })
                  .catch(error => {
                    console.error("Error fetching course:", error);
                    setcourse([]); 
                  })
              }, [currentLanguage]);
const noCoursesMessage = courses.length === 0 && (
    <div className='NoCourseFilter'>
        <img src={NoData} alt="" />
        <span className='span'>{t('NoCourse')} </span>
        <span className='span2'> {t('OthersFormations')} </span>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 mt-8">
        {course.map(course => (
                    <div key={course.id} className="border border-gray-300 rounded-lg  overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-1" style={{width:"250px",height:"320px"}}>
                        <Link to={`/Cours/${course.id}`}>
                            <img src={course.image} alt={course.titleEn} className="w-full h-48 object-cover"/>
                            <div style={{display:'flex',justifyContent:"center",alignItems:'center',gap:"55px",marginTop:"5px"}}>
                            <span className="bg-yellow-200 text-yellow-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                               {currentLanguage === 'fr' ? course.categoryFr : currentLanguage === 'ar' ? course.categoryAr : course.category}
                            </span>

                            <span class="bg-gray-300 text-gray-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ">
                               {currentLanguage === 'fr'? course.level: currentLanguage === 'ar'? course.level: course.level}
                            </span>
                               
                            </div>
                        </Link>
                        <div className="p-4">
                            <h1 className="text-sm font-medium text-gray-700">
                                {currentLanguage === 'fr'
                                    ? course.titleFr
                                    : currentLanguage === 'ar'
                                    ? course.titleAr
                                    : course.titleEn}
                            </h1>
                            <hr className='text-sm text-gray-300'/>
                            <div className='grid grid-cols-2 place-content-between gap-4'>
                              <span className="text-red-500 font-medium text-sm ">
                                {course.price}{" "}{" "}{" "}{" "}
                                {currentLanguage === 'fr'
                                    ?   "dt"
                                    : currentLanguage === 'ar'
                                    ?   "دينار"
                                    :   "dt"}
                              </span>
                              <span className="text-gray-900 font-bold text-sm " >
                                <Link to={`/Cours/${course.id}`}>View More</Link>
                              </span>
                            </div>
                        </div>
                        
                    </div>
                ))}
        </div>
    </div>

);      
return (
                
    <>    
        {noCoursesMessage}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 ">
                {courses.map(course => (
                    <div key={course.id} className="border border-gray-300 rounded-lg  overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-1" style={{width:"250px",height:"320px"}}>
                        <Link to={`/Cours/${course.id}`}>
                            <img src={course.image} alt={course.titleEn} className="w-full h-48 object-cover"/>
                            <div style={{display:'flex',justifyContent:"center",alignItems:'center',gap:"55px",marginTop:"5px"}}>
                               <span class="bg-yellow-200 text-yellow-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ">
                                {currentLanguage === 'fr'? course.category: currentLanguage === 'ar'? course.category: course.category}
                               </span>
                               <span class="bg-gray-300 text-gray-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ">
                                {currentLanguage === 'fr'? course.level: currentLanguage === 'ar'? course.level: course.level}
                               </span>
                            </div>
                        </Link>
                        <div className="p-4">
                            <h1 className="text-sm font-medium text-gray-700">
                                {currentLanguage === 'fr'
                                    ? course.titleFr
                                    : currentLanguage === 'ar'
                                    ? course.titleAr
                                    : course.titleEn}
                            </h1>
                            <br />
                            <hr className='text-sm text-gray-300'/>
                            <div className='grid grid-cols-2 place-content-between gap-4'>
                              <span className="text-red-500 font-medium text-sm ">
                                {course.price}{" "}{" "}{" "}{" "}
                                {currentLanguage === 'fr'
                                    ?   "dt"
                                    : currentLanguage === 'ar'
                                    ?   "دينار"
                                    :   "dt"}
                              </span>
                              <span className="text-gray-900 font-bold text-sm " >
                                <Link to={`/Cours/${course.id}`}>View More</Link>
                              </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    </>
  )
}
export default DisplayCoursbyCategory
