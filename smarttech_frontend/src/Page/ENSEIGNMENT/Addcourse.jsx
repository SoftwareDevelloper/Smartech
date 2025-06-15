import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Upload from '../../assest/upload_image.png';
import i18n from '../../i18n';
import './css/style.css';

const AddNewcourse = () => {
  const currentLanguage = i18n.language; 
  const{t} = useTranslation()
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])
    const [image,setimage] = useState(false);
    const [formData,SetFormData] = useState({
      titleEn:"",
      titleFr:"",
      titleAr:"",
      descriptionEn:"",
      descriptionFr:"",
      descriptionAr:"",
      image:"",
      price:"",
      category:"",
      categoryAr:"",
      categoryFr:"",
      classe:"",
      level:"",
      publisheddate:"",
      
    })
    const imageHandler = (e) =>{
      setimage(e.target.files[0]);
    }
    const changeHandler = (e) =>{
      SetFormData({...formData, [e.target.name]:e.target.value});
    } 
    const AddCourse = async (e) => {
      try {
          let course = { ...formData }; 
                  if (image) {
                    let formDataForImage = new FormData();
                    formDataForImage.append('file', image); 
              
                    const imageUploadResponse = await fetch('http://localhost:9000/api/upload-image', {
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
                   const token = localStorage.getItem("auth-token");
                    let enseignantId=''
                    const decodedToken = jwtDecode(token);
                    enseignantId = decodedToken.sub; 
                    const courseResponse = await fetch(`http://localhost:9000/api/AddFormationsByENS/${enseignantId}`, {

                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(course),
                  });
              
                  if (!courseResponse.ok) {
                    throw new Error('Failed to add course');
                  }
                  const courseData = await courseResponse.json();
                  if (courseData.success) {
                    toast.success('Course waiting for approver');
                  } else {
                    toast.success('Course waiting for approver');
                  }
                } catch (error) {
                  console.error('Error adding course:', error);
                  toast.error('An error occurred while adding the course');
                }
              };
  return (
    
    <div class="p-4  bg-white sm:ml-64">
      <ToastContainer/>
      <div class="p-4 bgwhite   rounded-lg ">
      <div class="grid grid-cols-12 grid-row-12 gap-4 mb-4">
          <div className='addProduct'>
           <h1 className='addCourse_title'> {t('AddNewCourse')} </h1>
           <hr  className='add_course_hr'/>
            <div className="addproduct-itemfield">
             <p> {t('CoursTitleEn')} </p>
             <input value={formData.titleEn} onChange={changeHandler} type="text" name='titleEn' placeholder={t('TypeHere')} />
            </div>
            <div className="addproduct-itemfield">
              <p> {t('CoursTitleAr')} </p>
              <input value={formData.titleAr} onChange={changeHandler} type="text" name='titleAr' placeholder={t('TypeHere')}/>
            </div>
            <div className="addproduct-itemfield">
              <p> {t('CoursTitleFr')} </p>
              <input value={formData.titleFr} onChange={changeHandler} type="text" name='titleFr' placeholder={t('TypeHere')}/>
            </div>
            <div className="addproduct-itemfield">
              <p> {t('Coursedescription(EN)')} </p>
              <input value={formData.descriptionEn} onChange={changeHandler} type="text" name='descriptionEn' placeholder={t('TypeHere')}/>
            </div>
            <div className="addproduct-itemfield">
              <p> {t('Coursedescription(AR)')} </p>
              <input value={formData.descriptionAr} onChange={changeHandler} type="text" name='descriptionAr' placeholder={t('TypeHere')}/>
            </div>
            <div className="addproduct-itemfield">
              <p> {t('Coursedescription(FR)')} </p>
              <input value={formData.descriptionFr} onChange={changeHandler} type="text" name='descriptionFr' placeholder={t('TypeHere')}/>
            </div>
            <div className="addproduct-itemfield">
                  <p> {t('Price')} </p>
                  <input value={formData.price} onChange={changeHandler} type="text" name="price"placeholder={t('TypeHere')} />
            </div>
          <div className="addproduct-itemfield">
            <p> {t('Level')} </p>
            <select 
                value={formData.level} 
                onChange={changeHandler} 
                name="level" 
                className='add-product-selector'>
                <option value=""> {t('Choosealevel')} </option>
                <option value={t('Primary')}> {t('Primary')} </option>
                <option value={t('HighSchool')}> {t('HighSchool')} </option>
                <option value={t('Secondary')}> {t('Secondary')} </option>
            </select>
        </div>
          <div className="addproduct-itemfield">
              <p> {t('Class')} </p>
              <select 
                  value={formData.classe} 
                  onChange={changeHandler} 
                  name="classe" 
                  className='add-product-selector'
                  disabled={!formData.level} // Disable until level is selected
              >
                <option value=""> {t('Class')} </option>
                  {formData.level === "Primary" && (
                      <>
                          <option value="1Primary">1ère</option>
                          <option value="2Primary">2ème</option>
                          <option value="3Primary">3ème</option>
                          <option value="4Primary">4ème</option>
                          <option value="5Primary">5ème</option>
                          <option value="6Primary">6ème</option>
                      </>
                  )}
                  {formData.level === "HighSchool" && (
                      <>
                          <option value="7HS">7ème</option>
                          <option value="8HS">8ème</option>
                          <option value="9HS">9ème</option>
                      </>
                  )}
                  {formData.level === "Secondary" && (
                      <>
                          <optgroup label="2ème">
                              <option value="2Lettre">2Lettre</option>
                              <option value="2Eco">2Eco</option>
                              <option value="2Sci">2Sci</option>
                              <option value="2Math">2Math</option>
                              <option value="2Tech">2Tech</option>
                              <option value="2Info">2Info</option>
                          </optgroup>
                          <optgroup label="3ème">
                              <option value="3Lettre">3Lettre</option>
                              <option value="3Eco">3Eco</option>
                              <option value="3Sci">3Sci</option>
                              <option value="3Math">3Math</option>
                              <option value="3Tech">3Tech</option>
                              <option value="3Info">3Info</option>
                          </optgroup>
                          <optgroup label="Bac">
                              <option value="BLettre">Bac Lettre</option>
                              <option value="BEco">Bac Eco</option>
                              <option value="BSci">Bac Sci</option>
                              <option value="BMath">Bac Math</option>
                              <option value="BTech">Bac Tech</option>
                              <option value="BInfo">Bac Info</option>
                          </optgroup>
                      </>
                  )}
              </select>
          </div>

      <div className="addproduct-itemfield">
        <p> {t('Category')} </p>
        <select value={formData.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="choose a category" > choose a category </option>
            <option value="LANGUAGES">LANGUAGES</option>
            <option value="SCIENCE">SCIENCE</option>
            <option value="MATEMATIQUES">MATEMATIQUES</option>
            <option value="TECHNOLOGIES">TECHNOLOGIES</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <select value={formData.categoryFr} onChange={changeHandler} name="categoryFr" className='add-product-selector'>
            <option value="choisir une catégorie">choisir une catégorie</option>
            <option value="LANGUES">LANGUES</option>
            <option value="SCIENCE">SCIENCE</option>
            <option value="MATH">MATH</option>
            <option value="TECHNOLOGIES">TECHNOLOGIES</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
      {/* Arabic category */}
          <select value={formData.categoryAr} onChange={changeHandler} name="categoryAr" className='add-product-selector'>
              <option value="اختر فئة">اختر فئة</option>
              <option value="اللغات">اللغات</option>
              <option value="علوم">علوم</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="التقنيات">التقنيات</option>
          </select>
      </div>
      <div className="addproduct-itemfield">
            <p> {t('PublishedDate')} </p>
            <input value={formData.publisheddate} onChange={changeHandler} type='date' name="publisheddate" placeholder={t('Typehere')} />
        </div>
        <div className="addproduct-itemfield">
  <p> {t('Image')} </p>
  <label htmlFor="image-input">
    <img
      src={image ? URL.createObjectURL(image) : Upload}
      alt="Upload"
      className="addproduct-thumnail-img"
    />
  </label>
  <input
    onChange={imageHandler}
    type="file"
    name="image"
    id="image-input"
    accept="image/*"
    hidden
  />
</div>
      <button onClick={()=>{AddCourse()}} className='addproduct-btn'>{t('ADD')} </button>
    </div>
    </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default AddNewcourse
