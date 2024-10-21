import React, { useEffect, useRef, useState } from 'react'
import Client from './Client.js'
import Editor from './Editor.js'
import { initsocket } from '../socket.js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MdOutlineContentCopy } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { AiFillAudio } from "react-icons/ai";
import { FaVideo } from "react-icons/fa6";
import { CiVideoOff } from "react-icons/ci";
import AgoraRTC from 'agora-rtc-sdk-ng';

// Import ChatBox at the top
import ChatBox from './ChatBox';


function Editorpage() {
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, SetClients] = useState([]);


  // Adding Audio Feature
  const [mic, setMic] = useState(true);
  const [rtc, setRtc] = useState({
    localAudioTrack: null,
    client: null,
  });

  const options = {
    appId: "ee307a66fa1345db8099f3613c9e4998",
    channel: roomId,
    token: null,
    uid: Math.floor(Math.random() * 2032),
  };

  useEffect(() => {
    const initClient = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setRtc((prevRtc) => ({ ...prevRtc, client }));

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", async (user) => {
        // await client.unsubscribe(user);
        if (user.uid !== options.uid) { // Check if it's not the local user
          try {
            await client.unsubscribe(user);
          } catch (error) {
            console.error("Unsubscribe error:", error);
          }
        }
      });

      await client.join(options.appId, options.channel, options.token, options.uid);
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([localAudioTrack]);
      // localAudioTrack.play();
      setRtc((prevRtc) => ({ ...prevRtc, localAudioTrack }));

      // console.log("publish success!");
    };

    initClient();

    return () => {
      const leave = async () => {
        if (rtc.client) {
          await rtc.client.leave();
          rtc.localAudioTrack.close();
        }
      };
      leave();
    };
  }, []);

  const toggleMic = async () => {
    if (rtc.localAudioTrack) {
      if (mic) {
        await rtc.localAudioTrack.setEnabled(false);
      } else {
        await rtc.localAudioTrack.setEnabled(true);
      }
      setMic(!mic);
    }
  };




  // Toggle mic
  const [isOn, setIsOn] = useState(false);

  // Function to toggle the state
  const handleToggle = () => {
    setIsOn(prevState => !prevState);
  };


  // Toggle Video

  // Toggle mic
  const [videoOn, setVideoOn] = useState(false);

  // Function to toggle the state
  const handleToggleVideo = () => {
    // setVideoOn(prevState => !prevState);
    toast.error("Feature Coming Soon!")
  };


  // selecting value from select options (compiler language)
  const [selectedValue, setSelectedValue] = useState('Java');

  // Step 2: Handle change function
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // console.log(selectedValue);

  const handleError = (e) => {
    console.log('socket error', e);
    toast.error('Socket connection failed', { duration: 2000 });
    navigate('/');
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initsocket();
      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));

      socketRef.current.emit("join-room", { roomId, username: location.state?.username });
      // console.log(location.state.username)

      socketRef.current.on('joined-room', ({ clients, username, socketId }) => {
        // console.log('joined-room event fired:', { clients, username, socketId });
        if (username !== location.state?.username) {
          toast.success(`${username} has joined the room`, { duration: 2000 });
        }
        SetClients(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        });
      });

      // for dissconnecton yaha hum listen karenge
      socketRef.current.on('disconnected', (
        { socketId, username, }) => {
        toast.success(`${username} leave`);
        SetClients((prev) => {
          return prev.filter(
            (clients) => clients.socketId != socketId
          )
        })
      }
      )
    }
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    };

  }, []);



  if (!location.state) {
    navigate('/');
    return null;
  };


  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId copied successfully", { duration: 2000 });
    } catch (error) {
      toast.error("Unable to copy room id", { duration: 2000 });
    }
  }

  const leaveRoom = async () => {
    navigate('/');
  }

  

  return (
    <>
      <div className='container-fluid vh-100'>
        <div className='row '>

          <div className='col-md-2 bg-dark text-light d-flex flex-column' style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}>
            <img className='img-fluid mx-md-auto d-block mb-3 mt-3' src="/images/logo.png" style={{ maxWidth: '120px', marginTop: "0px" }} />
            <hr style={{ marginTop: "-0rem" }} />
            <div className='d-flex flex-column overflow-auto mb-3'>
              {clients.map((client) => (
                <Client key={client.socketid} username={client.username} />
              ))}
            </div>
            
             <div className='col-md-2 bg-dark text-light d-flex flex-column' style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}>
            {/* Other sidebar content */}
            <ChatBox socketRef={socketRef} roomId={roomId} username={location.state?.username} />
        </div>
            <div className='mt-auto d-none d-md-block'>
              <hr style={{}} />
              <p className='text-center text-secondary'></p>
            </div>
            
          </div>


          <div className='col-md-10  text-light d-flex flex-column ' >

            <div className='w-full py-2 px-2 bg-dark d-flex justify-content-between'>

              <div className='w-1/3' style={{width: "160px"}}>
                <select id="mySelect" value={selectedValue} onChange={handleChange} className="form-select" aria-label="Default select example">
                  <option value="Java">Java</option>
                  <option value="Cpp">C++</option>
                  <option value="C">C</option>
                  <option value="Python">Python</option>
                </select>
              </div>

              <div className='cursor-pointer d-flex mx-3'>

                <div className='mx-3 text-danger my-auto' style={{ cursor: "pointer" }}>
                  <div onClick={toggleMic} data-toggle="tooltip" data-placement="top" title={`${mic ? "Mic Off" : "Mic On"}`}>
                    {mic ?
                      <AiFillAudio size={"25px"} className='d-sm-inline' />
                      :
                      <AiOutlineAudioMuted style={{ color: "green" }} size={"25px"} />
                    }
                  </div>
                </div>


                <div className='d-none d-sm-block mx-3 text-danger my-auto' style={{ cursor: "pointer" }}>
                  <div onClick={handleToggleVideo} data-toggle="tooltip" data-placement="top" title={`${videoOn ? "Video Off" : "Video On"}`}>
                    {videoOn ?
                      <FaVideo style={{ font: "bold" }} size={"25px"} />
                      :
                      <CiVideoOff style={{ color: "green" }} size={"25px"} />
                    }
                  </div>
                </div>

                <div className='mx-3 text-success' style={{ cursor: "pointer" }}>
                  <button type="button" className='btn btn-success' data-toggle="tooltip" data-placement="top" title="Copy RoomId" onClick={copyRoomId}>
                    <MdOutlineContentCopy size={"20px"} />
                  </button>
                </div>
                <div className='mx-2 text-danger' style={{ cursor: "pointer" }}>
                  <button type="button" className='btn btn-danger' data-toggle="tooltip" data-placement="top" title="Leave Room" onClick={leaveRoom}>
                    <RiLogoutCircleLine size={"20px"} />
                  </button>
                </div>
              </div>
            </div>

            < Editor socketRef={socketRef} lang={selectedValue} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Editorpage