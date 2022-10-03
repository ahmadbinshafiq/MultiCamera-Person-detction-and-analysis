import React from 'react'

function CameraView() {
    const ip=["11","22","33","333"]
  return (

      <div className="container my-5">
        <div className='row'>
    
        {ip?.map(x=> <div className="card col-md-6 my-3 mx-4" style={{width: "18rem"}}>
          
        {/* <button onClick={handleSubmit}>Submit</button> */}
        {/* {ip1.map(x=><h1 key={x.camera}>{x.camera}</h1>)} */}

         
        <img
    src={`http://localhost:8000/video_feed/cam/${x.camera}`}
    alt="There is a Problem while fetching the live feed from the server" style={{height:"auto",width:"auto",borderRadius:"10%",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
   />
   


   </div>)}
   </div>
{/* {        <iframe width="auto" height="auto"
        src="https://www.youtube.com/embed/tgbNymZ7vqY">
          
        </iframe>}
        <img
    src={"https://th.bing.com/th/id/R.d46fc0d0e3674cd6b0f9c53f66d63cec?rik=er1Nez7zpRNzOg&pid=ImgRaw&r=0"}
    alt="Video" style={{borderRadius:"10%",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
   /> */}
       
        </div>

  )
}

export default CameraView
