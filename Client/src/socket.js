import {io} from 'socket.io-client';

export const initsocket =async ()=>{
    const option ={
        'force new connection': true,
        'reconnectionAttempts' :"Infinity",
        timeout: 10000,
        transports: ['websocket'],  
    
    }
    return io(process.env.REACT_APP_BAKEND_URL || 'http://localhost:5000' ,option);
}