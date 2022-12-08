import React, { useState, useEffect } from 'react'
import CameraAdd from './CameraAdd'


function CameraView() {

  const image_buffer = "data:image/png;base64,"
  const [image, setImage] = React.useState([]);


  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ml/all_feeds');

    ws.onopen = () => {
      console.log('connected');
      ws.send(JSON.stringify({ "floor_id": "floor_id" }));
    }

    ws.onmessage = evt => {
      console.log("image received");
      var data = JSON.parse(evt.data);
      const frames = data['frames_arr'];
      setImage(frames);
      ws.send(JSON.stringify({ "testing": "abcdef" }));
    }

    ws.onclose = () => {
      console.log('disconnected');
    }

    // close socket when component unmounts
    return () => {
      ws.close();
    }
  }, []);

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const boxStyle = {
    backgroundColor: "black", borderRadius: "25px",
    padding: "12px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    cursor: 'pointer',
    backgroundColor: isHover ? 'black' : 'white',
    color: isHover ? 'white' : 'black',
  };

  return (

    <div className="container my-5">
      <div className='row'>
        <div className='col-md-10'>
          {/* <button onClick={showlive} style={boxStyle} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>{feedtype}</button> */}
        </div>
        <div className='col'>
          <CameraAdd />
        </div>
      </div>


      <div style={{ display: 'flex' }}>

        {
          image.map((frame, index) => {
            return (
              <div style={{ width: '100%' }} key={index}>
                <img
                  src={image_buffer + frame}
                  className='my-2 mx-2'
                  style={{ borderRadius: "25px", width: "20rem", boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)" }}
                  alt="logo"
                />
              </div>
            )
          })
        }

      </div>
    </div>
  )
}

export default CameraView
