import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';



function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const genrateRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success('Room Id Genrated', { duration: 2000 });
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Please Enter both Room Id and UserName', { duration: 2000 });
      return;
    }
    // window.location.href=`/editor/${roomId}?userName=${userName}`;
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success('Joining Room', { duration: 2000 });
  }
  return (
    <>
      <div className='container-fluid bg-dark w-full min-vh-100'>
        {/* <div className='row justify-content-center w-full align-items-center min-vh-100'>
          <div className='col-12 col-md-6 '>
            <div className='card p-1 mb-6 bg-secondary rounded-lg'>
              <div className='card-body text-center bg-dark px-5 py-4'>
                <img className='img-fluid mx-auto d-block mb-3 rounded' src="/images/logo.png" style={{ maxWidth: '180px' }} />

                <h4 className='text-light text-center mb-3'>Enter The Room Id</h4>

                <div className='form-group mb-3'>
                  <input type='text' className='form-control' placeholder='Room ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                </div>
                <div className='form-group mb-3'>
                  <input type='text' className='form-control' placeholder='UserName' value={username} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <button className='btn btn-success btn-lg btn-block' onClick={joinRoom}>Join</button>
                <p className='mt-3 text-light'>Dont have a room id? <span className='text-success p-2' style={{ cursor: 'pointer' }} onClick={genrateRoomId}>New Room</span></p>
              </div>
            </div>
          </div>
          
        </div> */}
        <div className='text-white text-center'>
          <img className='img-fluid d-block py-2' src="/images/logo.png" style={{ maxWidth: '130px' }} alt="Logo" />
        </div>
        <div className='d-flex flex-column flex-md-row mt-5 justify-content-center align-items-center w-100'>

          <div className='col-12 col-md-6 d-flex justify-content-center align-items-center text-white'>
            <div>
              <img className='img-fluid mx-auto d-block mb-3 rounded' src="/images/HomeImage.png" style={{ maxWidth: '85%' }} alt="Home" />
            </div>
          </div>

          <div className='col-12 col-md-6 d-flex bg-dark justify-content-center align-items-center text-white'>
            <div className='card border-0 p-3 mb-6 bg-dark w-100'>
              <div className='card-body text-center bg-transparent px-5 py-4'>
                <h2 className='text-light text-center mb-3'>Enter The Room Id</h2>
                <div className='form-group mb-3'>
                  <input
                    type='text'
                    className='form-control border-0'
                    placeholder='Room ID'
                    value={roomId}
                    style={{ height: "50px" }}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>
                <div className='form-group mb-3'>
                  <input
                    type='text'
                    className='form-control border-0' // Ensure no border
                    placeholder='UserName'
                    value={username}
                    style={{ height: "50px" }}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <button className='btn btn-success btn-lg w-100' onClick={joinRoom}>Join</button>
                <p className='mt-3 text-light'>
                  Don't have a room id?
                  <span className='text-success p-2' style={{ cursor: 'pointer', fontWeight: "bold" }} onClick={genrateRoomId}> New Room</span>
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

export default Home