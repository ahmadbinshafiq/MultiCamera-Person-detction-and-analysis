import React,{ useState }  from 'react';
import {motion} from 'framer-motion';
import {link} from 'react-router-dom';
import { BiCctv } from "react-icons/bi";
import { AiOutlineMobile } from "react-icons/ai";
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
function CameraType() {
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
    const [colormob,setcolormob]=useState("grey");

    const postdata=()=>{
      console.log("DD")
      
    }
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
      
      if (colorcctv==="fed131"){
        setcolorcctv("grey")
      }
      else{
        setcolorcctv("fed131")
        setcolormob("grey")
        setmodal(true)
      }
    }
    const changeColormob=()=>{
     
      if (colormob==="fed131"){
        setcolormob("grey")
      }
      else{
        setcolormob("fed131")
        setcolorcctv("grey")
        setmodal(true)
      }
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
                <label htmlFor="name"> Camera Name</label>
                <input type="text" className='form-control' placeholder='Enter Unique Name' />
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Ip Address</label>
                <input type="text" className='form-control' placeholder='Enter Camera Ip Address' />
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Port </label>
                <input type="text" className='form-control' placeholder='Enter Camera Port e.g 8080' />
              </div>
            </Col>
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
            <motion.div className="card" style={{width:"20rem",borderColor:"2px solid black"}} 
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
              <h5 class="card-title">Ip Camera</h5>
            </motion.div>
          
            <motion.div className="card" style={{width:"20rem",marginLeft:"250px",borderColor:"2px solid black"}}
                          animate={{
                            y:0,
                            rotate:360
                          }}
                          initial={{
                            y:200
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
                  <AiOutlineMobile size="15rem" color={colormob} onClick={changeColormob}/>
              </div>
              <h5 class="card-title">Mobile Camera</h5>
            </motion.div>
{/*           <div class="col"style={{marginLeft:"100px",border:"3px solid grey"}}>
              <AiOutlineMobile size="15rem" color={colormob} onClick={changeColormob}/>
          </div> */}
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