import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import Approved from '../../assest/approved.png';
import rejected from '../../assest/rejected.png';
import '../../i18n';
import '../ENSEIGNMENT/css/style.css';
import './CSS/admin.css';

const Formations = () => {
         const{t,i18n} = useTranslation()
      const currentLanguage = i18n.language; 
      useEffect(()=>{
        window.document.dir = i18n.dir();
      },[currentLanguage])
    const [allcourse,setAllcourse] =useState([]);
    const [image,setimage] = useState(false);
    const [video,setvideo] = useState(false);
    const [pdfCoursFile, setPdfCoursFile] = useState(null);
    const [pdfTDFile, setPdfTDFile] = useState(null);
    const [pdfTest, setPdfTest] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
     const [categories, setCategories] = useState([]);
     const [selectedTitle, setSelectedTitle] = useState('');
     const [Title, setTitle] = useState([]);
     useEffect(() => {
      if (allcourse.length > 0) {
        const uniqueCategories = [...new Set(allcourse.map(course => course.category))];
        const uniqueTitle = [...new Set(allcourse.map(course => course.titleEn))];
        setCategories(uniqueCategories);
        setTitle(uniqueTitle);

      }
    }, [allcourse]);
    useEffect(() => {
      const fetchCourses = async () => {
        const token = localStorage.getItem("auth-token");
        let status = '';
        if (token) {
          const decodedToken = jwtDecode(token);
          status = decodedToken.status || true;
        }
    
        try {
          const url = selectedCategory 
            ? `https://smartech-production-1020.up.railway.app/api/GetCourse/${selectedCategory}?lang=${currentLanguage}`
            : `https://smartech-production-1020.up.railway.app/api/GetAllFormations/${status}?lang=${currentLanguage}`;    
          const response = await fetch(url);
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
    
      fetchCourses();
    }, [currentLanguage, selectedCategory]); 


    useEffect(() => {
      const fetchCoursesbyTitle = async () => {
        const token = localStorage.getItem("auth-token");
        let status = '';
        if (token) {
          const decodedToken = jwtDecode(token);
          status = decodedToken.status || true;
        }
    
        try {
          const url = selectedTitle
            ? `https://smartech-production-1020.up.railway.app/api/GetCourseByTitle/${selectedTitle}?lang=${currentLanguage}`
            : `https://smartech-production-1020.up.railway.app/api/GetAllFormations/${status}?lang=${currentLanguage}`;    
          const response = await fetch(url);
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
      fetchCoursesbyTitle();
    }, [currentLanguage, selectedTitle]); 
    const [formData,SetFormData] = useState({
      titleEn:"",
      titleFr:"",
      titleAr:"",
      descriptionEn:"",
      descriptionFr:"",
      descriptionAr:"",
      image:"",
      price:"",
    })
    const imageHandler = (e) =>{setimage(e.target.files[0]);}
    const changeHandler = (e) =>{SetFormData({...formData, [e.target.name]:e.target.value});} 
    const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
    const [allEnseignant, setEnseignant] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCours, setSelectedCours] = useState(null);
    useEffect(()=>{window.document.dir = i18n.dir();},[currentLanguage])
    const toggleModal = () => {setIsModalOpen(!isModalOpen); };
    const markAsCompleted = (id) => {
      fetch(`https://smartech-production-1020.up.railway.app/api/formations/${id}/complete`, {
        method: "PUT",
      })
        .then((res) => {
          if (res.ok) toast.success("Formation marked as completed!");
        });
    };
    useEffect(() => {
      const token = localStorage.getItem("auth-token");
      let status=''
      if(token){
        const decodedToken = jwtDecode(token);
        status = decodedToken.status || true;
      }
      fetch(`https://smartech-production-1020.up.railway.app/api/GetAllFormations/${status}?lang=${currentLanguage}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched course:', data);
        if (Array.isArray(data)) {
          setAllcourse(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setAllcourse([]);
        }
      })
      .catch(error => {
        console.error("Error fetching course:", error);
        setAllcourse([]);
      });
    }, [currentLanguage]);
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
  const handleAssignEnseignant = (enseignant_id,formation_id) => {
    if (!enseignant_id){
      console.error("enseignant must be selected.");
      return;
    }
    fetch(`https://smartech-production-1020.up.railway.app/api/assignFormationToTeacher/${enseignant_id}/${formation_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json() )
      .then(data => {
        toast.success('Formations assigned successfully');
        console.log('Formations assigned successfully:', data );
      })
      .catch(error => {
        console.error('Error assigning enseignant:', error);
        toast.error("Failed to assign formation");
      });
  };
  useEffect(() => {
    fetch("https://smartech-production-1020.up.railway.app/api/enseignant")
      .then(response => response.json())
      .then(data => {
        console.log('Fetched enseignants:', data);
        if (Array.isArray(data)) {
          setEnseignant(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setEnseignant([]);
        }
      })
      .catch(error => {
        console.error("Error fetching enseignants:", error);
        setEnseignant([]);
      });
  }, []);
  const handleEnseignantSelectChange = (e) => {
    const enseignantId = e.target.value;
    setSelectedEnseignantId(enseignantId);
  };
  const handleEditClick = (course) => {
    setSelectedCours(course);
    toggleModal();
  };

  const updatedCourse = async (event) => {
    event.preventDefault();
    if (!selectedCours) {
      console.error("No course selected for update.");
      return;
    }

    console.log("Selected Course ID:", selectedCours.id);
    console.log("Form Data:", formData);
    try {
      let course = { ...formData }; 
      if(pdfCoursFile){
        let formDataforfilecours = new FormData();
      formDataforfilecours.append('pdf',pdfCoursFile);
      const filecoursUploadResponse = await fetch('https://smartech-production-1020.up.railway.app/api/upload_files', {
        method: 'POST',
        body: formDataforfilecours,
      });

      if (!filecoursUploadResponse.ok) {
        throw new Error('Failed to upload cours ');
      }

      const filecoursUploadData = await filecoursUploadResponse.json();
      console.log("cours upload response:", filecoursUploadData);

      if (filecoursUploadResponse.ok) {
        course.pdfCours = filecoursUploadData.fileUrl;
      } else {
        throw new Error('Failed to upload files');
      }
      }
      if(pdfTDFile){
        let formDataforfiletd = new FormData();
        formDataforfiletd.append('pdf',pdfTDFile);
        const filetdUploadResponse = await fetch('https://smartech-production-1020.up.railway.app/api/upload_files', {
         method: 'POST',
         body: formDataforfiletd,
        });

      if (!filetdUploadResponse.ok) {
        throw new Error('Failed to upload cours ');
      }

      const filetdUploadData = await filetdUploadResponse.json();
      console.log("td upload response:", filetdUploadData);

      if (filetdUploadResponse.ok) {
        course.pdfTD = filetdUploadData.fileUrl;
      } else {
        throw new Error('Failed to upload files');
      }
      }
      if(pdfTest){
        let formDataforfiletest = new FormData();
      formDataforfiletest.append('pdf',pdfCoursFile);
      const filetestUploadResponse = await fetch('https://smartech-production-1020.up.railway.app/api/upload_files', {
        method: 'POST',
        body: formDataforfiletest,
      });

      if (!filetestUploadResponse.ok) {
        throw new Error('Failed to upload test ');
      }

      const filetestUploadData = await filetestUploadResponse.json();
      console.log("test upload response:", filetestUploadData);

      if (filetestUploadResponse.ok) {
        course.pdfTest = filetestUploadData.fileUrl;
      } else {
        throw new Error('Failed to upload files');
      }
      }

      if (image) {
        let formDataForImage = new FormData();
        formDataForImage.append('file', image); 
  
        const imageUploadResponse = await fetch('https://smartech-production-1020.up.railway.app/api/upload-image', {
          method: 'POST',
          body: formDataForImage,
        });
  
        if (!imageUploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
  
        const imageUploadData = await imageUploadResponse.json();
        console.log("Image upload response:", imageUploadData);
  
        if (imageUploadResponse.ok) {
          course.image = imageUploadData.imageUrl; 
        } else {
          throw new Error('Failed to upload image');
        }
      }
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/UpdateFormation/${selectedCours.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error('Failed to update course');
      }

      const data = await response.json();
      console.log('Course updated successfully:', data);
      toast.success("Course updated successfully");
      setAllcourse((prevCourse) =>
        prevCourse.map((course) =>
          course.id === selectedCours.id ? { ...course, ...data } : course
        )
      );

      toggleModal();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error("Failed to update course");
    }
  };
  return (
    <div className="p-4 sm:ml-64" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="p-4">
        {/* Approved Users Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="filter" >
          <form className='max-w mx-auto' style={{display:'flex',justifyContent:"right",alignItems:"end",marginRight:"3%",gap:"8px"}}>
          <label for="underline_select" class="sr-only">Filter</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} id="underline_select" className="block py-2.5 px-50 w-250 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="Filter By Category ...">Filter By Category ...</option>
            <option value="">{t('ALL')}</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)} id="underline_select" className="block py-2.5 px-50 w-250 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="Filter By Title ...">Filter By Title ...</option>
            <option value="">{t('ALL')}</option>
              {Title.map(title => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
          </select>
          </form>
          <div className="bg-white text-gray-500 text-sm p-4 sm:p-6 rounded-lg shadow-md shadow-white-500/50 overflow-x-auto">
                  <h2 className="text-lg font-medium font-serif mb-4"> {t('ApprovedCourses')} </h2>
                  <table id="search-table" className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-indigo-300 text-white">
                        <th className="border-2 border-white px-4 py-2"> {t('Title')} </th>
                        <th className="border-2 border-white px-4 py-2 " > {t('Description')} </th>
                        <th className="border-2 border-white px-8 py-2"> {t('Price')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Category')} </th>
                        <th className="border-2 border-white px-4 py-2" > {t('Class')} </th>
                        <th className="border-2 border-white px-4 py-2" > {t('Published Date')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Actions')} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        allcourse.map(course=>(
                          <tr key={course.id}>
                          <td className="border-2 border-white px-2 py-2" > {currentLanguage === 'fr'
                            ? course.titleFr
                            : currentLanguage === 'ar'
                            ? course.titleAr
                            : course.titleEn} </td>
                          <td className="border-2 border-white px-1 py-2" > {currentLanguage === 'fr'
                            ? course.descriptionFr
                            : currentLanguage === 'ar'
                            ? course.descriptionAr
                            : course.descriptionEn} </td>
                          <td className="border-2 border-white px-2 py-2" > {course.price} {currentLanguage === 'fr'
                            ? "TND"
                            : currentLanguage === 'ar'
                            ? " دينار"
                            : "TND"} </td>
                          <td className="border-2 border-white px-2 py-2" > {course.category} </td>
                          <td className="border-2 border-white px-2 py-2" > {course.classe} </td>
                          <td className="border-2 border-white px-2 py-2" > {course.publisheddate} </td>
                          <td className="border-2 border-white px-1 py-2">
                            <button onClick={() => handleEditClick(course)} className="bg-blue-50 text-white px-3 py-1 rounded mr-2">
                            <svg class="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v3m5-3v3m5-3v3M1 7h7m1.506 3.429 2.065 2.065M19 7h-2M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 13H6v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L8 16Z"/>
                            </svg>
                            </button>
                            {isModalOpen && (
                              <div
                                id="crud-modal"
                                tabIndex="-1"
                                aria-hidden="true"
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 sm:p-6"
                              >
                                <div className="relative w-full max-w-lg max-h-full overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-gray-800">
                                  {/* Header */}
                                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      Update Course
                                    </h3>
                                    <button
                                      type="button"
                                      onClick={toggleModal}
                                      aria-label="Close modal"
                                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition"
                                    >
                                      <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Form */}
                                  <form className="space-y-6 p-6" onSubmit={updatedCourse}>
                                    {/* Submit button */}
                                    <div className="flex justify-end">
                                      <button
                                        type="submit"
                                        className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition"
                                      >
                                        <svg
                                          className="mr-2 h-5 w-5"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Confirm
                                      </button>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                      <label
                                        htmlFor="image-input"
                                        className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-blue-500 focus-within:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400 transition"
                                      >
                                        {image ? (
                                          <img
                                            src={URL.createObjectURL(image)}
                                            alt="Course Upload Preview"
                                            className="h-40 w-40 rounded-md object-cover"
                                          />
                                        ) : (
                                          <div className="flex flex-col items-center justify-center text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-12 w-12"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M4 20h16"
                                              />
                                            </svg>
                                            <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                              Click to upload image
                                            </span>
                                          </div>
                                        )}
                                        <input
                                          type="file"
                                          name="image"
                                          id="image-input"
                                          accept="image/*"
                                          onChange={imageHandler}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>

                                    {/* Inputs Grid */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                      {/* Course Title EN */}
                                      <div>
                                        <label
                                          htmlFor="titleEn"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Title (EN)
                                        </label>
                                        <input
                                          type="text"
                                          id="titleEn"
                                          name="titleEn"
                                          value={formData.titleEn}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition"
                                        />
                                      </div>

                                      {/* Course Title AR */}
                                      <div>
                                        <label
                                          htmlFor="titleAr"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Title (AR)
                                        </label>
                                        <input
                                          type="text"
                                          id="titleAr"
                                          name="titleAr"
                                          value={formData.titleAr}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition"
                                        />
                                      </div>

                                      {/* Course Title FR */}
                                      <div>
                                        <label
                                          htmlFor="titleFr"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Title (FR)
                                        </label>
                                        <input
                                          type="text"
                                          id="titleFr"
                                          name="titleFr"
                                          value={formData.titleFr}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition"
                                        />
                                      </div>

                                      {/* Description EN */}
                                      <div className="sm:col-span-2">
                                        <label
                                          htmlFor="descriptionEn"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Description (EN)
                                        </label>
                                        <textarea
                                          id="descriptionEn"
                                          name="descriptionEn"
                                          value={formData.descriptionEn}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          rows={3}
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition resize-none"
                                        />
                                      </div>

                                      {/* Description AR */}
                                      <div className="sm:col-span-2">
                                        <label
                                          htmlFor="descriptionAr"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Description (AR)
                                        </label>
                                        <textarea
                                          id="descriptionAr"
                                          name="descriptionAr"
                                          value={formData.descriptionAr}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          rows={3}
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition resize-none"
                                        />
                                      </div>

                                      {/* Description FR */}
                                      <div className="sm:col-span-2">
                                        <label
                                          htmlFor="descriptionFr"
                                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                          Course Description (FR)
                                        </label>
                                        <textarea
                                          id="descriptionFr"
                                          name="descriptionFr"
                                          value={formData.descriptionFr}
                                          onChange={changeHandler}
                                          placeholder="Type here..."
                                          rows={3}
                                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:text-white transition resize-none"
                                        />
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>

                              
                            )}
                            <button onClick={() =>RemoveFormations(course.id)} className="px-3 py-1 rounded mr-2">
                              <img src={rejected} alt="" width={"20px"} height={"20px"}/>
                            </button>
                            <button onClick={() => markAsCompleted(course.id)}>
                              <span className="flex items-center gap-1 text-green-600 font-semibold">
                                  <FaCheckCircle className="text-green-600 text-xl inline-block mr-2" /> Completed
                              </span>
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
       <div className="grid grid-cols-12 gap-4 mb-4 bg-white">

                <div className="bg-white text-gray-500 text-sm p-6 rounded-lg shadow-md shadow-white-500/50">
                  <h2 className="text-lg font-medium font-serif mb-4"> {t('TeachersAssignments')} </h2>
                  <table className="w-full border-collapse border border-gray-50">
                    <thead>
                      <tr className="bg-indigo-300 text-white">
                        <th className="border-2 border-white px-4 py-2"> {t('Formations')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Teacher')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Actions')} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allcourse.map(course => (
                        <React.Fragment key={course.id}>
                          <tr>
                            <td className="border-2 border-white px-4 py-2">{currentLanguage === 'fr'
                    ? course.titleFr
                    : currentLanguage === 'ar'
                    ? course.titleAr
                    : course.titleEn} </td>
                            <td className="border-2 border-white px-4 py-2">
                              <select onChange={handleEnseignantSelectChange} className="border-none rounded text-sm">
                                <option value="">Choose...</option>
                                {allEnseignant.map(enseignant => (
                                  <option key={enseignant.id} value={enseignant.id}>
                                    {enseignant.fullname}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="border-2 border-white px-4 py-2">
                              <button onClick={() => handleAssignEnseignant(selectedEnseignantId,course.id)} className="bg-blue-50 text-white px-3 py-1 rounded mr-2">
                                <img src={Approved} alt="" width={"20px"} height={"20px"} />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4 mb-4 bg-white">
              


    </div>
    </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />

   </div>
  )
}

export default Formations
