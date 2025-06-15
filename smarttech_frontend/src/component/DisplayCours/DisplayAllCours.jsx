import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../../i18n';

const DisplayAllCours = () => {
    const [allcourse, setAllcourse] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Changed to 8 for better grid layout
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    useEffect(() => {
        window.document.dir = i18n.dir();
    }, [currentLanguage]);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:9000/api/formations/paginated?lang=${currentLanguage}&page=${currentPage}&size=${itemsPerPage}&sortBy=publisheddate&direction=desc`
                );
                const data = await response.json();
                
                if (data.formations && Array.isArray(data.formations)) {
                    setAllcourse(data.formations);
                    setTotalPages(data.totalPages);
                    setTotalItems(data.totalItems);
                } else {
                    console.error("Fetched data is not in expected format:", data);
                    setAllcourse([]);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                setAllcourse([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [currentLanguage, currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(0); // Reset to first page when changing items per page
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Items per page selector */}
            <div className="flex justify-end items-center mb-6 flex-wrap gap-4">
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600" style={{fontFamily:"Montserrat,sans-serif"}}>
                        {t('ItemsPerPage')}:
                    </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded px-3.1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                    </select>
                </div>
            </div>

            {/* Course grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {allcourse.map(course => (
                    <div key={course.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <Link to={`/Cours/${course.id}`}>
                            <img 
                                src={course.image} 
                                alt={currentLanguage === 'fr' ? course.titleFr : currentLanguage === 'ar' ? course.titleAr : course.titleEn} 
                                className="w-full h-45 object-cover"
                            />
                            <div className="flex justify-center items-center gap-2 mt-3 px-3 flex-wrap">
                                <span className="bg-yellow-200 text-yellow-500 text-xs font-medium px-3 py-0.5 rounded-sm">
                                    {currentLanguage === 'fr'
                                        ? course.categoryFr
                                        : currentLanguage === 'ar'
                                        ? course.categoryAr
                                        : course.category}
                                </span>
                                <span className="bg-gray-300 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-sm">
                                    {course.level}
                                </span>
                            </div>
                        </Link>
                        <div className="p-4">
                            <h1 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[3rem] mb-2">
                                {currentLanguage === 'fr'
                                    ? course.titleFr
                                    : currentLanguage === 'ar'
                                    ? course.titleAr
                                    : course.titleEn}
                            </h1>

                            <hr className="border-gray-100 my-2" />
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-red-600 font-medium text-sm">
                                    {course.price}{" "}
                                    {currentLanguage === 'fr'
                                        ? "dt"
                                        : currentLanguage === 'ar'
                                        ? "دينار"
                                        : "dt"}
                                </span>
                                <Link 
                                    to={`/Cours/${course.id}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                                >
                                    {t('viewMore')}→
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                    {t('showing')} {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, totalItems)} {t('of')} {totalItems} {t('courses')}
                </div>
                
                <div className="flex items-center space-x-1 order-1 sm:order-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
                        </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i;
                        } else if (currentPage <= 2) {
                            pageNum = i;
                        } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 5 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {pageNum + 1}
                            </button>
                        );
                    })}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-4 py-2 rounded-md ${currentPage >= totalPages - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisplayAllCours;