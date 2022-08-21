import React from 'react'
export default function Card(props) {
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
            <img src="..." className="card-img-top" alt="..."/>
            <div className="card-body ">
                <h5 className="card-title text-primary">Name: {props.name}</h5>
                <p className="card-text text-primary">Ip: {props.ip}</p>
                <a href="#" className="btn btn-primary">Watch</a>
            </div>
        </div>
        </div>
    </div>
  )
}
import React from 'react'
export default function Card(props) {
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
            <img src="..." className="card-img-top" alt="..."/>
            <div className="card-body ">
                <h5 className="card-title text-primary">Name: {props.name}</h5>
                <p className="card-text text-primary">Ip: {props.ip}</p>
                <a href="#" className="btn btn-primary">Watch</a>
            </div>
        </div>
        </div>
    </div>
  )
}
