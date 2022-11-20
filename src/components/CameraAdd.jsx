import React,{ useState }  from 'react';
import {motion} from 'framer-motion';
import {link} from 'react-router-dom';
import { BiCctv } from "react-icons/bi";
import { AiOutlineMobile } from "react-icons/ai";
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";

function CameraAdd() {
    const [modal,setmodal]=useState(false);
    const [colorcctv,setcolorcctv]=useState("grey");
    const [colormob,setcolormob]=useState("grey");
    const [camname,setcamname]=useState("");
    const [camip,setcamip]=useState("");
    const [camport,setcamport]=useState("");
    const [isHover, setIsHover] = useState(false);
    const handleMouseEnter = () => {
       setIsHover(true);
    };
 
    const handleMouseLeave = () => {
       setIsHover(false);
    };
    const buttonstyle = {
     borderRadius: "35px ",
  
        padding:"5px",      
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isHover ? '#8ed118':'white' ,
        color: isHover ? 'black' : 'black',
      };
    const buttonstylesubmit = {
         borderRadius: "12px",
        padding:"5px",      
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isHover ? 'white' : 'black',
        color: isHover ? 'black' : 'white',
      };

    
        const handleSubmit = (event) => {
          console.log('Called handleSubmit')
          console.log(camname)
          event.preventDefault()
          fetch(`/video_feed/emp/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  camera_ip: camip,
                  camera_name:camname,
                  camera_port:camport
              })
          })
              .then(res => res.json())
    
              .catch(err => console.log(err))
              setmodal(false)
      }
        const changeColorcctv=()=>{
          
          if (colorcctv==="black"){
            setcolorcctv("grey")
          }
          else{
            setcolorcctv("black")
            setcolormob("grey")
            setmodal(true)
          }
        }
        const changeColormob=()=>{
         
          if (colormob==="black"){
            setcolormob("grey")
          }
          else{
            setcolormob("black")
            setcolorcctv("grey")
            setmodal(true)
          }
        }
        const handleInputname=(event)=>{
          const name=event.target.name
          const value=event.target.value
          console.log(name,value)
          setcamname(event.target.value)
          console.log(camname)
        }
        const handleInputip=(event)=>{
          const name=event.target.name
          const value=event.target.value
          console.log(name,value)
          setcamip(event.target.value) 
          console.log("camip ",camip)
        }
        const handleInputport=(event)=>{
          const name=event.target.name
          const value=event.target.value
          console.log(name,value)
          setcamport(event.target.value) 
          console.log("camport ",camport)
        }
        const changemodal=()=>{
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
                <label htmlFor="name"> Camera Name</label>
                <input type="text" className='form-control' name={camname} placeholder='Enter Unique Name' onChange={handleInputname} />
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Ip Address</label>
                <input type="text" className='form-control' name={camip} placeholder='Enter Camera Ip Address' onChange={handleInputip}/>
              </div>
            </Col>
            <Row style={{marginLeft:"2px"}}>  Type of frame</Row>
            <Row>
            <Col lg={4}>
              <Row>
              <div>
              <BiCctv size="5rem" color={colorcctv} onClick={changeColorcctv}/>
              </div>
              <div style={{marginLeft:"15px"}}>
              <text>Cctv</text>
              </div>
              </Row>
            </Col>
            <Col lg={4}>
              <div>
              <AiOutlineMobile size="5rem" color={colormob} onClick={changeColormob}/>
              </div>
              <div style={{marginLeft:"15px"}}>
              <text className='col-md-2'>Mobile</text>
              </div>
            </Col>
            </Row>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Port </label>
                <input type="text" className='form-control' name={camport} placeholder='Enter Camera Port e.g 8080' onChange={handleInputport}/>
              </div>
            </Col>
            <Col>
              <button style={buttonstylesubmit} onClick={handleSubmit}>Submit</button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
    <button size="15rem"  onClick={changemodal} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} style={buttonstyle}>
        Add Camera</button>   
              
    </>
  )
}

export default CameraAdd
