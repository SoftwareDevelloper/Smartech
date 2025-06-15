import { BarChart } from '@mui/x-charts/BarChart';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

const TeachersStudent = () => {
  const{t,i18n} = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  const [allStudent, setAllStudent] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], notes: [], niveaux: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  const niveauMapping = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const fetchStudent = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth-token");
      let enseignantId = "";
  
      if (token) {
        const decodedToken = jwtDecode(token);
        enseignantId = decodedToken.sub;
      }
  
      const response = await fetch(`http://localhost:9000/api/AllUser/${enseignantId}`);
      const data = await response.json();
  
      setAllStudent(data);
  
      const labels = data.map(student => student.fullname);
      const notes = data.map(student => Number(student.note) || 0);
      const niveaux = data.map(student => niveauMapping[student.proficiencyLevel] || 0);
      const formations = data.map(student => student.formationsSuivies || []);

      setChartData({ labels, notes, niveaux, formations });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"> {t('StudentDashboard')} </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800"> {t('PerformanceOverview')} </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-600"> {t('ProficiencyLevel')} </span>
                </div>
              </div>
              <div className="h-80">
                <BarChart
                  xAxis={[{ 
                    id: 'students', 
                    data: chartData.labels, 
                    scaleType: 'band',
                    label: 'Students',
                    tickLabelStyle: {
                      angle: 45,
                      textAnchor: 'start',
                      fontSize: 12,
                    },
                  }]}
                  yAxis={[{
                    label: 'Proficiency Level',
                  }]}
                  series={[
                    { 
                      id: 'niveau', 
                      data: chartData.niveaux, 
                      label: 'Proficiency Level', 
                      color: '#3b82f6', // Blue color
                    },
                  ]}
                  margin={{ top: 30, bottom: 100, left: 60, right: 30 }}
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800"> {t('StudentDetails')} </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {t('Student')} </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {t('Email')} </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {t('Level')} </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {t('Courses')} </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allStudent.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {student.fullname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.fullname}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="truncate max-w-xs">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${student.proficiencyLevel === 'Beginner' ? 'bg-green-100 text-green-800' : 
                              student.proficiencyLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                            {student.proficiencyLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {student.formationsSuivies?.length > 0 ? (
                            <div className="space-y-1">
                              {student.formationsSuivies.slice(0, 2).map((formation, i) => (
                                <div key={i} className="text-sm text-gray-700 truncate max-w-xs">
                                  {formation.titleEn}
                                </div>
                              ))}
                              {student.formationsSuivies.length > 2 && (
                                <div className="text-xs text-blue-500">
                                  +{student.formationsSuivies.length - 2} {t('more')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400"> {t('Nocourses')} </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeachersStudent;