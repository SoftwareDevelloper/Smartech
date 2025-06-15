import React from 'react'
import Notfound from '../../assest/404-error-removebg-preview.png'
import './notFound.css'
const ErrorPage = () => {
  return (
    <div className='notFound'>
       <img src={Notfound} alt="" />
    </div>
  )
}

export default ErrorPage
