import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import student from '../../assest/audience.png';
import classroom from '../../assest/classroom.png';
import lesson from '../../assest/lesson.png';
import TeachersStudent from '../../component/TeachersStudents/TeachersStudent';
import '../../i18n';

const DashboardENS = () => {
  const [totalcourse, settotalcourse] = useState(0);
  const [totalStudent, settotalStudent] = useState(0);
  const [classe, setClasse] = useState(0);
  const [allcourse, setAllcourse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      let enseignantId = '';
      
      if (token) {
        const decodedToken = jwtDecode(token);
        enseignantId = decodedToken.sub;
      }

      await Promise.all([
        fetchCourses(enseignantId),
        TotalLessons(enseignantId),
        TotalStudent(enseignantId),
        TotalClass(enseignantId)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentLanguage]);

  const TotalLessons = async (enseignantId) => {
    try {
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/CountCourseENS/${enseignantId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      settotalcourse(data);
    } catch (error) {
      console.error('Error fetching total lessons:', error);
    }
  };

  const TotalStudent = async (enseignantId) => {
    try {
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/CountStudent/${enseignantId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      settotalStudent(data);
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  const fetchCourses = async (enseignantId) => {
    try {
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/GetFormationsbyENS/${enseignantId}?lang=${currentLanguage}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllcourse(data);
      } else {
        setAllcourse([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllcourse([]);
    }
  };

  const TotalClass = async (enseignantId) => {
    try {
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/CountCourseENS/${enseignantId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setClasse(data);
    } catch (error) {
      console.error('Error fetching total classes:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen sm:ml-64" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="p-4">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Class Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="bg-indigo-100 p-4 rounded-full mr-4">
              <img src={classroom} alt="Classroom" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{t('Class')}</h3>
              <p className="text-2xl font-bold text-gray-800">{classe}</p>
            </div>
          </div>

          {/* Students Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="bg-indigo-100 p-4 rounded-full mr-4">
              <img src={student} alt="Students" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{t('Students')}</h3>
              <p className="text-2xl font-bold text-gray-800">{totalStudent}</p>
            </div>
          </div>

          {/* Lessons Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="bg-indigo-100 p-4 rounded-full mr-4">
              <img src={lesson} alt="Lessons" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{t('TotalLessons')}</h3>
              <p className="text-2xl font-bold text-gray-800">{totalcourse}</p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('MYCourses')}</h2>
          {allcourse.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allcourse.map(course => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-indigo-100 h-32 flex items-center justify-center">
                    <img 
                      src={course.image || "https://via.placeholder.com/300x200?text=Course"} 
                      alt={currentLanguage === 'fr' ? course.titleFr : currentLanguage === 'ar' ? course.titleAr : course.titleEn}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-1 truncate">
                      {currentLanguage === 'fr' ? course.titleFr :
                       currentLanguage === 'ar' ? course.titleAr :
                       course.titleEn}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {currentLanguage === 'fr'
                          ? course.categoryFr
                          : currentLanguage === 'ar'
                          ? course.categoryAr
                          : course.category
                        }
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {course.price}{" "} 
                        {currentLanguage === 'fr'
                          ? "dt"
                          : currentLanguage === 'ar'
                          ? "دينار"
                           : "TND"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">{t('Nocoursesfound')}</p>
            </div>
          )}
        </div>

        {/* Teachers/Students Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('Students')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <TeachersStudent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardENS;
