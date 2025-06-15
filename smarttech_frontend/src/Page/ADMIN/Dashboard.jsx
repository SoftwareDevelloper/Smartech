import { PieChart } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Approved from '../../assest/approved.png';
import rejected from '../../assest/rejected.png';
import '../../i18n';
const Dashboard = () => {
  
  const [users,setUsers] = useState(0);
  const{t,i18n} = useTranslation()
  const [allUser,setAllUser] =useState([]);
  const [approved,setapproved] = useState(0);
  const [totalcourse,settotalcourse] = useState(0);
  const [allcourse,setAllcourse] =useState([]);
  const currentLanguage = i18n.language; 
  const [earnings, setEarnings] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [chartData, setChartData] = useState({
    userDistribution: [
      { id: 0, value: 15, label: t('Students') },
      { id: 1, value: 8, label: t('Teachers') },
      { id: 2, value: 3, label: t('Admins') },
    ],
    courseEnrollments: [
      { course: t('Mathematics'), enrollment: 120 },
      { course: t('Web Development'), enrollment: 85 },
      { course: t('Language'), enrollment: 65 },
      { course: t('Science'), enrollment: 45 },
    ]
  });

useEffect(() => {
  fetch('https://smartech-production-1020.up.railway.app/api/formations-with-enrollments')
    .then(response => response.json())
    .then(data => {
      setEnrollmentData(data);
    })
    .catch(error => console.error('Error fetching enrollment data:', error));
}, []);
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])
  const TotalUsers = async () => {
    try {
      const response = await fetch('https://smartech-production-1020.up.railway.app/api/TotalUsers', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json();
      setUsers(data); 
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };
  useEffect(() => {
    TotalUsers();
  }, []); 

  const fetchEarnings = async () => {
    try {
      const response = await fetch('https://smartech-production-1020.up.railway.app/api/v1/total-earnings', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log('Fetched earnings data:', data);
  
      setEarnings(data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };
  useEffect(() => {
    fetchEarnings();
  }, []);
  const TotalApprovalsPending = async () => {
    try {
      const response = await fetch('https://smartech-production-1020.up.railway.app/api/TotalPendingApprovals', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setapproved(data); 
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };
  useEffect(() => {
    TotalApprovalsPending();
  }, []);

  const TotalCourse = async () => {
    try {
      const response = await fetch('https://smartech-production-1020.up.railway.app/api/TotalCourse', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      settotalcourse(data); 
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };
  useEffect(() => {
    TotalCourse();
  }, []); 

useEffect(() => {
  const token = localStorage.getItem("auth-token");
  let status=''
  if(token){
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub; 
    const emailaddress = decodedToken.email;
    status = false;
    console.log("id of user:",userId);
    console.log("email:", emailaddress);
    console.log("status:",status);
  }
  fetch(`https://smartech-production-1020.up.railway.app/api/allUser/${status}`)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched users:', data);
      if (Array.isArray(data)) {
        setAllUser(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setAllUser([]);
      }
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      setAllUser([]);
    });
}, []);
//Pending Formations
useEffect(() => {
    let status = false;
  fetch(`https://smartech-production-1020.up.railway.app/api/GetAllFormations/${status}`)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched formations:', data);
      if (Array.isArray(data)) {
        setAllcourse(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setAllcourse([]);
      }
    })
    .catch(error => {
      console.error("Error fetching formations:", error);
      setAllcourse([]);
    });
}, []);
//Approve Formations

const approveCourse = (id) => {
  fetch(`https://smartech-production-1020.up.railway.app/api/approveformations/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      setAllcourse((prevCourse) =>
        prevCourse.map((course) =>
          course.id === id ? { ...course, status: true } : course
        )
      );
      toast.success("course approved successfully");
    })
    .catch((error) => {
      console.error("Error approving course:", error);
    });
};
//Approve Users
const approveUser = (id) => {
  fetch(`http://localhost:9000/api/approve/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      setAllUser((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: true } : user
        )
      );
      toast.success("User approved successfully");
    })
    .catch((error) => {
      console.error("Error approving user:", error);
    });
};

//Remove Formations 
    const RemoveFormations = async(id) =>{
      setAllcourse((prev)=> prev.filter((course)=>course.id !== id));
      if(localStorage.getItem("auth-token"))
        {
          fetch(`https://smartech-production-1020.up.railway.app/api/DeleteFormations/${id}`,{
            method:"DELETE",
            headers :{
                Accept : 'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-type':'application/json',
            },
            body:JSON.stringify({course:id})
        })
        .then((response) =>response.json(),toast.success('formations Rejected successfully'))
        .then((data) => console.log(data))
        .catch((error) => console.error('Error rejected formations',error))
    }else{
      toast.info("just admin has access to remove formations")
    }
  }

  useEffect(() => {
  // Fetch user distribution
  fetch('https://smartech-production-1020.up.railway.app/api/user-distribution')
    .then(res => res.json())
    .then(data => {
      setChartData(prev => ({
        ...prev,
        userDistribution: [
          { id: 0, value: data.APPRENANT, label: t('Student') },
          { id: 1, value: data.ENSEIGNMENT, label: t('Teacher') },
          { id: 2, value: data.ADMIN, label: t('Admin') }
        ]
      }));
    });

  // Fetch course enrollments
  fetch('https://smartech-production-1020.up.railway.app/api/course-enrollments')
    .then(res => res.json())
    .then(data => {
      setChartData(prev => ({
        ...prev,
        courseEnrollments: data.map(item => ({
          course: item.title,
          enrollment: item.enrollments
        }))
      }));
    });
}, [t]);
  return (
  <div class="p-4 bg-white sm:ml-64" style={{fontFamily:"Montserrat, sans-serif"}}>
    <div class="p-4 ">
        <div class="grid grid-cols-4 gap-3 mb-5 ">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg  shadow-blue-500/50" style={{width:"270px"}}>
            <h3 className="text-xl font-semibold"> {t('TotalUsers')} </h3>
            <p className="text-xl font-bold">{ users }</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg shadow-green-500/50" style={{width:"270px"}} >
            <h3 className="text-xl font-semibold"> {t('Courses')} </h3>
            <p className="text-xl font-bold">{totalcourse}</p>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg  shadow-red-500/50"  style={{width:"270px"}}>
            <h3 className="text-xl font-semibold"> {t('PendingApprovals')} </h3>
            <p className="text-xl font-bold"> {approved}</p>
          </div>
          <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg  shadow-yellow-500/50" style={{width:"270px"}}>
            <h3 className="text-xl font-semibold"> {t('Earning')} </h3>
            <p className="text-xl font-bold"> {earnings}   {currentLanguage === 'fr'? "TND": currentLanguage === 'ar'? "دينار": "TND"}</p>
          </div>
        </div>
          {/* Add these new sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* User Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">{t('UserDistribution')}</h2>
            <PieChart
              series={[
                {
                  data: chartData.userDistribution,
                  innerRadius: 30,
                  outerRadius: 130,
                  paddingAngle: 1.5,
                  cornerRadius: 1,
                }
              ]}
              colors={['#FD7171FF', '#3BB0FEFF', '#FCC53AFF', '#4BC0C0', '#9966FF', '#FF9F40']} 
              width={500}
              height={400}
               slotProps={{
                  legend: {
                    direction: 'column',
                    position: {
                      vertical: 'middle',
                      horizontal: 'right',
                    },
                    itemMarkWidth:20,
                    itemMarkHeight: 20,
                    markGap:5,
                    itemGap:10,
                    padding: { left: 0 },
                  }
                }}
            />
          </div>

          {/* Course Enrollment Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">{t('CourseEnrollments')}</h2>
            <BarChart
              xAxis={[
                {
                  id: 'courses',
                  data: chartData.courseEnrollments.map(item => item.course),
                  scaleType: 'band',
                }
              ]}
              series={[
                {
                  data: chartData.courseEnrollments.map(item => item.enrollment),
                  color: '#03619f',
                }
              ]}
              width={500}
              height={400}
            />
          </div>
        </div>
        <br />
        <div class="grid grid-cols-12 gap-4 mb-4">
        <div className="bg-white text-gray-500  text-sm p-6 rounded-lg shadow-md shadow-white-500/50 " >
          <h2 className="text-lg font-medium font-serif mb-4"> {t('PendingUserApprovals')} </h2>
          <table className="w-full border-collapse border border-gray-50">
            <thead>
              <tr className="bg-indigo-300 text-white" >
                <th className="border-2 border-white px-4 py-2"> {t('Name')} </th>
                <th className="border-2 border-white px-4 py-2"> {t('Email')} </th>
                <th className="border-2 border-white px-4 py-2"> {t('Role')} </th>
                <th className="border-2 border-white px-4 py-2">{t('Actions')} </th>
              </tr>
            </thead>
            <tbody>
              {
                allUser.map(user=>(
                  <tr key={user.id}>
                  <td className="border-2 border-white px-4 py-2"> {user.fullname} </td>
                  <td className="border-2 border-white px-4 py-2"> {user.email} </td>
                  <td className="border-2 border-white px-4 py-2"> {user.role} </td>
                  <td className="border-2 border-white px-4 py-2">
                    <button   onClick={() => approveUser(user.id)} className="bg-white text-white px-3 py-1 rounded mr-2">
                      <img  src={Approved} alt="" width={"20px"} height={"20px"}/>
                    </button>
                    <button className="bg-white text-white px-3 py-1 rounded mr-2">
                    <img src={rejected} alt="" width={"20px"} height={"20px"}/>
                    </button>
                  </td>
                </tr>
                ))
              }
            </tbody>
          </table>
      </div>
      </div>


              <div class="grid grid-cols-12 gap-4 mb-4">
                <div className="bg-white text-gray-500  text-sm p-6 rounded-lg shadow-md shadow-white-500/50 " >
                  <h2 className="text-lg font-medium font-serif mb-4"> {t('PendingFormationApprovals')} </h2>
                  <table className="w-full border-collapse border border-gray-50">
                    <thead>
                      <tr className="bg-indigo-300 text-white" >
                        <th className="border-2 border-white px-4 py-2"> {t('Title')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Description')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Category')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Price')} </th>
                        <th className="border-2 border-white px-4 py-2">{t('Actions')} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        allcourse.map(course=>(
                          <tr key={course.id}>
                          <td className="border-2 border-white px-4 py-2">
                            {currentLanguage === 'fr'
                            ? course.titleFr
                            : currentLanguage === 'ar'
                            ? course.titleAr
                            : course.titleEn}                       
                          </td>
                          <td className="border-2 border-white px-4 py-2">  
                            {currentLanguage === 'fr'
                            ? course.descriptionFr
                            : currentLanguage === 'ar'
                            ? course.descriptionAr
                            : course.descriptionEn} 
                          </td>
                          <td className="border-2 border-white px-4 py-2"> 
                            {currentLanguage === 'fr'
                            ? course.categoryFr
                            : currentLanguage === 'ar'
                            ? course.categoryAr
                            : course.category}   
                          </td>
                          <td className="border-2 border-white px-4 py-2">
                            {course.price}{" "}
                            {currentLanguage === 'fr'
                            ? "dt"
                            : currentLanguage === 'ar'
                            ? "دينار"
                            : "dt"}
                          </td>
                          <td className="border-2 border-white px-4 py-2">
                            <button   onClick={() => approveCourse(course.id)} className="bg-white text-white px-3 py-1 rounded mr-2">
                              <img  src={Approved} alt="" width={"20px"} height={"20px"}/>
                            </button>
                            <button onClick={()=> RemoveFormations(course.id)} className="bg-white text-white px-3 py-1 rounded mr-2">
                            <img src={rejected} alt="" width={"20px"} height={"20px"}/>
                            </button>
                          </td>
                        </tr>
                        ))
                      }
                    </tbody>
                  </table>
              </div>
      </div>








    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />
   </div>
  )
}

export default Dashboard
