import React,{useState,useEffect} from 'react'
import CameraAdd from './CameraAdd'

function CameraView() {
    //const ip=["11","22","33","333"]
    const ip1=["1","2","3"]
    var ipp=[];
    const [ip,setip]=useState()
    const [motion,setmotion]=useState("cam")
    const image_buffer = "data:image/png;base64,"
    const [image, setImage] = React.useState("data:image/png;base64,");
    const [image1, setImage1] = React.useState("data:image/png;base64,");
    const [image2, setImage2] = React.useState("data:image/png;base64,");
    const [image3, setImage3] = React.useState("data:image/png;base64,");
    const [images, setImages] = React.useState([]);

    const [feedtype,setfeedtype]=useState("View Motion Detection")
    const [colormotion,setcolormotion]=useState("white")
    const [colorfeed,setcolorfeed]=useState("black")
    const showlive=()=>{
      if (motion=="camm"){
        setmotion("cam")
        setfeedtype("View Live Feed")
      }
      else{
        setmotion("camm")
        setfeedtype("View Motion Detection")
      }
      console.log("motion is "+motion)
    }


  /*   useEffect(()=>{
      console.log("wwwww")
      fetch(`/video_feed/getemp`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
          console.log("dataaaa")
            setip(data)
            //console.log('ip', ip[1].camera_ip)
        })
        .catch(err => console.log(err))
    },[ip]) */
    React.useEffect(() => {
      const ws = new WebSocket('ws://localhost:8000/ws');
  
      ws.onopen = () => {
        console.log('connected');
        ws.send('start');
      }
      ws.onmessage = evt => {
        // console.log(evt.data);
        console.log("image received");
        var data = JSON.parse(evt.data);
        const frames = data['frames_arr'];
      // console.log(frames);
      // set frames in the state

      setImage(frames);

      }
      ws.onclose = () => {
        console.log('disconnected');
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
       backgroundColor:"black", borderRadius: "25px",
       padding:"12px",      
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
     
       cursor: 'pointer',
       backgroundColor: isHover ?  'black':'white' ,
       color: isHover ?   'white':'black',
    };
  return (

      <div className="container my-5">
        <div className='row'>
          <div className='col-md-10'>
          {/* <button onClick={showlive} style={boxStyle} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>{feedtype}</button> */}</div>
          <div className='col'>
          <CameraAdd/>
          </div>
        </div>

    
        <div className='row'>
    
{/* {ip?.map(x=> <div className="card col-md-6 my-3 mx-4" style={{backgroundColor:"white",boxshadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",justifyContent:"center",alignItems:"center"}}>
            */}
  {/*           {image.map((frame,index)=><img className='my-2 mx-2' style={{borderRadius:"25px",width: "28rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
    src={image_buffer + frame}
    alt="Video" 
   />)}  */}
   {/*             {ip?.map(x=><img className='my-2 mx-2' style={{borderRadius:"25px",width: "28rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
    src={`http://localhost:8000/video_feed/${motion}/${x.camera_ip}`}
    alt="Video" 
   />)} */}
       
         {/* <button >Submit</button>  */}
        {/* {ip1.map(x=><h1 key={x.camera}>{x.camera}</h1>)} */}



      {/* </div>)} */} 
{/*          <div className="card col-md-6 my-3 mx-4" style={{width: "18rem"}}>
        <img
    src={`http://localhost:8000/video_feed/${motion}/${108}`}
    alt="Video"
   />  
</div> */}


   </div>
{/* {        <iframe width="auto" height="auto"
        src="https://www.youtube.com/embed/tgbNymZ7vqY">
          
        </iframe>}
        <img
    src={"https://th.bing.com/th/id/R.d46fc0d0e3674cd6b0f9c53f66d63cec?rik=er1Nez7zpRNzOg&pid=ImgRaw&r=0"}
    alt="Video" style={{borderRadius:"10%",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
   /> */}
       
        </div>
/* {
"camera_ip": "108"
} */
  )
}

export default CameraView
