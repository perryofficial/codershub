import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas properties
    context.strokeStyle = 'black'; // Line color
    context.lineWidth = 2; // Line width
    context.lineCap = 'round'; // Line cap style

    // Socket setup
    socketRef.current = io.connect('http://localhost:5000'); // Adjust the URL as needed
    console.log("Connected to the whiteboard socket");

    // Handle drawing
    const draw = (x0, y0, x1, y1) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
      context.closePath();
    };

    const handleMouseDown = (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      socketRef.current.emit('drawing-start', { roomId, offsetX, offsetY });
    };

    const handleMouseMove = (e) => {
      if (e.buttons !== 1) return; // Only draw when the mouse is down
      const { offsetX, offsetY } = e.nativeEvent;
      socketRef.current.emit('drawing', { roomId, offsetX, offsetY });
    };

    const handleMouseUp = () => {
      socketRef.current.emit('drawing-end', { roomId });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    socketRef.current.on('drawing-start', (data) => {
      context.beginPath();
      context.moveTo(data.offsetX, data.offsetY);
    });

    socketRef.current.on('drawing', (data) => {
      draw(data.offsetX, data.offsetY, data.offsetX, data.offsetY);
    });

    socketRef.current.on('drawing-end', () => {
      context.closePath();
    });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      socketRef.current.disconnect();
    };
  }, [roomId]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ border: '1px solid black', touchAction: 'none' }} // Prevents touch scrolling on mobile
    />
  );
};

export default Whiteboard;
