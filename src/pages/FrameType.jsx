import React,{ useState }  from 'react';
import {motion} from 'framer-motion';
import {link} from 'react-router-dom';
import { BiCctv } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineCameraIndoor } from "react-icons/md";
import { MdCameraOutdoor } from "react-icons/md";
import { MdOtherHouses } from "react-icons/md";
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
function CameraType() {
  const ip2=["11"]
  const buttonstyle = {
    color: "white",
    backgroundColor: "black",
    fontFamily: "Arial",
    padding: "10px 60px",
    borderradius: "1px",
    margin: "10px 0px",
  };
    const [modal,setmodal]=useState(false);
    const [colorcctv,setcolorcctv]=useState("grey");
    const [colorin,setcolorin]=useState("grey");
    const [colorout,setcolorout]=useState("grey");
    const [colorothers,setcolorothers]=useState("grey");

    const handleSubmit = (event) => {
      console.log('Called handleSubmit')
      event.preventDefault()
      fetch(`/video_feed/emp/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              camera_ip: "24",
              camera_name:"ali",
              camera_port:14
          })
      })
          .then(res => res.json())

          .catch(err => console.log(err))
  }
    const changeColorcctv=()=>{
      
      if (colorcctv==="orange"){
        setcolorcctv("grey")
      }
      else{
        setcolorcctv("orange")
      }
    }
    const changeColorindoor=()=>{
      
      if (colorin==="orange"){
        setcolorin("grey")
      }
      else{
        setcolorin("orange")
        setcolorout("grey")
        setcolorothers("grey")
      }
    }
    const changeColoroutdoor=()=>{
     
      if (colorout==="orange"){
        setcolorout("grey")
      }
      else{
        setcolorout("orange")
        setcolorin("grey")
        setcolorothers("grey")
      }
    }
    const changeColorothers=()=>{
     
      if (colorothers==="orange"){
        setcolorothers("grey")
      }
      else{
        setcolorothers("orange")
        setcolorin("grey")
        setcolorout("grey")
      }
    }
    const addframe=()=>{

        setmodal(true)
      
    }
  return (
    <>
    <Modal size="lg" isOpen={modal} toggle={()=>setmodal(!modal)}>
      <ModalHeader toggle={()=>setmodal(!modal)}>
        Fill the Required Information
      </ModalHeader>
      <ModalBody>
        <form action="">
          <Row>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Frame Name</label>
                <input type="text" className='form-control' placeholder='Enter Unique Name' />
              </div>
            </Col>
            <Row style={{marginLeft:"2px"}}>  Type of frame</Row>
            <Row>
            <Col lg={4}>
              <Row>
              <div>
              <MdOutlineCameraIndoor size="5rem" color={colorin} onClick={changeColorindoor}/>
              </div>
              <div style={{marginLeft:"15px"}}>
              <text>Indoor</text>
              </div>
              </Row>
            </Col>
            <Col lg={4}>
              <div>
              <MdCameraOutdoor size="5rem" color={colorout} onClick={changeColoroutdoor}/>
              </div>
              <div style={{marginLeft:"15px"}}>
              <text className='col-md-2'>Outdoor</text>
              </div>
            </Col>
            <Col lg={4}>
              <div>
              <MdOtherHouses size="5rem" color={colorothers} onClick={changeColorothers}/>
              </div>
              <div style={{marginLeft:"15px"}}>
              <text style={{marginLeft:"2px"}}>Others</text>
              </div>
            </Col>
            </Row>
            <Col>
              <button style={buttonstyle} onClick={handleSubmit}>Submit</button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
        <motion.h1 
        animate={{
          x:100,
          
        }}
        initial={{
          x:0
        }}
        transition={{
          type:"spring",
          stiffness:60
        }}>
            Please select the type of Camera
        </motion.h1>
        <div class ="container">
          <div class="row" style={{marginTop:"150px"}}>
          {ip2?.map(x=><motion.div className="card" style={{width:"20rem",borderColor:"2px solid black",backgroundColor:"rgba(0,0,0,0.4)",marginLeft:"70px",marginBottom:"70px"}} 
                          animate={{
                            x:200,
                            rotate:360
                          }}
                          initial={{
                            x:0
                            
                          }}
                          transition={{
                            type:"spring",
                            stiffness:60
                          }}
                          whileHover={{
                            scale:1.1
                            
                          }}
                          whileTap={{
                            scale:0.9
                          }}>
                <div class="col" style={{marginLeft:"15px"}}>
                  <BiCctv size="15rem" color={colorcctv} onClick={changeColorcctv}/>   
              </div>
              <h5 class="card-title">Frame</h5>
            </motion.div>)}
            <motion.div className="card" style={{width:"20rem",borderColor:"2px solid black",backgroundColor:"rgba(0,0,0,0.4)",marginLeft:"70px",marginBottom:"70px"}} 
                          animate={{
                            x:200,
                            rotate:360
                          }}
                          initial={{
                            x:0
                            
                          }}
                          transition={{
                            type:"spring",
                            stiffness:60
                          }}
                          whileHover={{
                            scale:1.1
                            
                          }}
                          whileTap={{
                            scale:0.9
                          }}>
                <div class="col" style={{marginLeft:"15px"}}>
                  <AiOutlinePlusCircle size="15rem" color={colorcctv} onClick={addframe}/>   
              </div>
              <h5 class="card-title" style={{alignItems:"center"}}>Add New Frame</h5>
            </motion.div>
            
          </div>
        </div>

    </>
  )
}

export default CameraType

/* const handleSubmit = (event) => {
  console.log('Called handleSubmit')
  event.preventDefault()
  fetch(`/video_feed/getemp`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
      .then(res => res.json())
      .then(data => {
          console.log('data', data[1].employee_id)
          
      })
      .catch(err => console.log(err))
} */