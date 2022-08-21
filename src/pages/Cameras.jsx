
import React from 'react'
import { FaEye } from "react-icons/fa";
export default function Cameras(props) {
  const cam=[
    {ip:"197.3.4.3",
  camname:"1",},
  {ip:"197.3.4.3",
  camname:"1",}
    ]
  return (
    <div className='col mx-5'>
        <div className="container">
        <div className="card col mx-5 mt-5 bg-body" style={{width:'18rem'}}>
        <iframe width="auto" height="auto"
        src="https://www.youtube.com/embed/tgbNymZ7vqY">
        </iframe>
            <div className="card-body ">
                <h5 style={{color:"red"}}>Name: {props.name}</h5>
                <p style={{color:"red"}}>Ip: {props.ip}</p>
                <a href="#" style={{color:"red"}}><FaEye/></a>
            </div>
        </div>
        </div>
    </div>
  )
}