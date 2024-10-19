import React from 'react'
import Avatar from "react-avatar";
import { useLocation } from 'react-router-dom';
function Client({ username }) {
  const location = useLocation();
  // if(username === location.state?.username){
  //   console.log(username)
  // }
  return (
    <div className='d-flex align-items-center mb-3 '>
      <Avatar name={username.toString()} size={35} round="100%" className='mr-3' />
      {
        username === location.state?.username ?
          <span className='mx-2 fw-bold'>{username.toString().charAt(0).toUpperCase() + username.slice(1)} (You)</span>
          : <span className='mx-2'>{username.toString().charAt(0).toUpperCase() + username.slice(1)}</span>
      }
    </div>
  )
}

export default Client