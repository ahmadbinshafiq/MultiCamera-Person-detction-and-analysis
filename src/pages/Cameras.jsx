
import React,{useState} from 'react'
import { useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import axios from "axios"
export default function Cameras(props) {
  const [ip,setip]=useState()
   const ip1=[{"camera":1,"cam":1},{"camera":2,"cam":2}]
  const ip2=["11","22"]

  const camera="104"
  const camera1="217"

useEffect(()=>{
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
        console.log('ip', ip[1].camera_ip)
    })
    .catch(err => console.log(err))
},[])

/* useEffect(()=>{
  axios.get(`/video_feed/getemp`)
    .then(async (res)=>{
      setip(res.camera_ip)
      console.log(res.camera_ip)
    })
},[]) */
  return (
    <div className='col mx-5'>
        <div className="container">
        <div className="card col mx-5 mt-5 bg-body" style={{width:'18rem'}}>
        {/* <button onClick={handleSubmit}>Submit</button> */}
        {/* {ip1.map(x=><h1 key={x.camera}>{x.camera}</h1>)} */}
        {ip?.map(x=> <img
    src={`http://localhost:8000/video_feed/cam/${x.camera}`}
    alt="Video"
   />)}
{        <iframe width="auto" height="auto"
        src="https://www.youtube.com/embed/tgbNymZ7vqY">
          
        </iframe>}
{/*         <iframe width="auto" height="auto"
        src="http://localhost:5000/video_feed">
          
        </iframe> */}
{/*         <video width="auto" height="auto"
        src="http://localhost:5000/video_feed">
          
        </video> */}

{/*            <img
    src={`http://localhost:8000/video_feed/cam/${camera1}`}
    alt="Video"
   /> */}
        {/* <a href="site2.html" target="demo"><button>site2</button></a> */}

        {/* <video width="auto" height="auto" controls>
  <source src="https:/ /www.youtube.com/embed/tgbNymZ7vqY"></source>
  </video> */}

            {/* <div className="card-body ">
                <h5 style={{color:"red"}}>Name: {props.name}</h5>
                <p style={{color:"red"}}>Ip: {props.ip}</p>
                <a href="#" style={{color:"red"}}><FaEye/></a>
            </div> */}
        </div>
        </div>
    </div>
  )
}