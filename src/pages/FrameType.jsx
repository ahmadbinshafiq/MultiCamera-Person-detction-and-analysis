import React,{ useState }  from 'react';
import {motion} from 'framer-motion';
import Linechart from "../components/Linechart";
import ComputationalCostFrame from "../components/ComputationalCostFrame";
import ComputationalCost from "../components/ComputationalCost";
import CameraView from "../components/CameraView";
import { FaCircle } from "react-icons/fa";
import {link} from 'react-router-dom';
import { BiCctv } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineCameraIndoor } from "react-icons/md";
import { MdCameraOutdoor } from "react-icons/md";
import { MdOtherHouses } from "react-icons/md";
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import Messages from './Messages';
import DonutFrame from '../components/DonutFrame';
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
    const [colorcircle,setcolorcircle]=useState("#800000");

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

    const changeColorindoor=()=>{
      
      if (colorin==="black"){
        setcolorin("grey")
      }
      else{
        setcolorin("black")
        setcolorout("grey")
        setcolorothers("grey")
      }
    }
    const changeColoroutdoor=()=>{
     
      if (colorout==="black"){
        setcolorout("grey")
      }
      else{
        setcolorout("black")
        setcolorin("grey")
        setcolorothers("grey")
      }
    }
    const changeColorothers=()=>{
     
      if (colorothers==="black"){
        setcolorothers("grey")
      }
      else{
        setcolorothers("black")
        setcolorin("grey")
        setcolorout("grey")
      }
    }
    const changemodal=()=>{

        setmodal(true)
      
    }
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
       setIsHover(true);
    };
 
    const handleMouseLeave = () => {
       setIsHover(false);
    };
 
    const boxStyle = {
       backgroundColor:"black", borderRadius: "15px",
       padding:"3px",      
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',     
       cursor: 'pointer',
       backgroundColor: isHover ?  'black':'white' ,
       color: isHover ?   'white':'black',
    };
  return (
    <>

    <div className="conatiner" >
      <div style={{color:"#F7F8FC"}} ><h1>ffffffffffffffffffffffffffffffffffffffffffhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjj</h1></div>
    </div>
    <div>
      <div className='container'>
      <div className='row'>
        <h6 className='col-md-1'>Computational Cost</h6>
        <FaCircle className='col-md-1' size={12} color={colorcircle}/>
      </div>
      <ComputationalCostFrame/>
      </div>
      </div>
     
      <Messages/>
      

      {/* <Footer/> */}
   
      <Modal size="lg" isOpen={modal} toggle={()=>setmodal(!modal)}>
      <ModalHeader toggle={()=>setmodal(!modal)}>
        Fill the Required Information
      </ModalHeader>
      <ModalBody>
        <form action="">
          <Row>
            <Col lg={12}>
              <div className='img-fluid shadow-4-strong'>
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
<div style={{float:"right"}}>
      {/*   <button size="3rem"  onClick={changemodal} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} style={boxStyle}>
        Add Frame</button>  */}
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