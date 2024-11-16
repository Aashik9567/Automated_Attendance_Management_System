import React from 'react'


const ImageDisplayer = (props) => {
  return (
    
      <div className="md:w-1/2 bg-blue-100 md:h-screen md:flex md:flex-col items-center text-center">
         <h1 className="text-2xl font-bold py-4 my-10 text-center">Automated Attendance Management System</h1>
          <img className="md:mt-12 mt-5 w-full max-w-sm " src={props.login} alt="login" />
    </div>
  )
}

export default ImageDisplayer
