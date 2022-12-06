import React,{ useState }  from 'react';
import {motion} from 'framer-motion';
import {link} from 'react-router-dom';
import { BiCctv } from "react-icons/bi";
import { AiOutlineMobile } from "react-icons/ai";
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import { useFormik } from "formik";
import { camSchema } from "./schemas";

const initialValues = {
  camname: "",
  camip: "",
  camport: "",
 
};

function CameraAdd() {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
  useFormik({
    initialValues,
    validationSchema: camSchema,
    onSubmit: (values, action) => {
      console.log(
        "🚀 ~ file: Registration.jsx ~ line 11 ~ Registration ~ values",
        values
      );
      /* const a=values
      console.log(a) */
      action.resetForm();
      setmodal(false)
    },
  });
    const [modal,setmodal]=useState(false);
    const [colorcctv,setcolorcctv]=useState("grey");
    const [colormob,setcolormob]=useState("grey");
    const [FileBase64String1,setFileBase64String1]=useState();
    const [FileBase64String2,setFileBase64String2]=useState();
    const [FileBase64String3,setFileBase64String3]=useState();

    const [isHover, setIsHover] = useState(false);
    const handleMouseEnter = () => {
       setIsHover(true);
    };
 
    const handleMouseLeave = () => {
       setIsHover(false);
    };
    const buttonstyle = {
     borderRadius: "25px ",
        border:"red",
        padding:"5px",      
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isHover ? '#f2f4ff':'#EDEFFF' ,
        color: isHover ? '#bbc2f9' : '#bbc2f9',
      };
    const buttonstylesubmit = {
         borderRadius: "18px",
        marginTop:"13px",
        paddingLeft:"10px",
        paddingRight:"10px", 
        paddingTop:"1px",    
        paddingBottom:"2px", 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isHover ? 'white' : 'black',
        color: isHover ? 'black' : 'white',
      };

      const encodeFileBase641 = (file) => {
        var reader = new FileReader();
        console.log("\nfile", file);
        reader.readAsDataURL(file);
        reader.onload = () => {
          var Base64 = reader.result;
          console.log("Base64", Base64);
    setFileBase64String1(Base64);
        };
      }
      const encodeFileBase642 = (file) => {
        var reader = new FileReader();
        console.log("\nfile", file);
        reader.readAsDataURL(file);
        reader.onload = () => {
          var Base64 = reader.result;
          console.log("Base64", Base64);
    setFileBase64String2(Base64);
        };
      }
      const encodeFileBase643 = (file) => {
        var reader = new FileReader();
        console.log("\nfile", file);
        reader.readAsDataURL(file);
        reader.onload = () => {
          var Base64 = reader.result;
          console.log("Base64", Base64);
    setFileBase64String3(Base64);
        };
      }
        /* const handleSubmit = (event) => {
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
      } */
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
        <form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Name</label>
                <input type="text" className='form-control' name="camname" placeholder='Enter Unique Name' value={values.camname}
                      onChange={handleChange}
                      onBlur={handleBlur} />
                      {errors.camname && touched.camname ? (
                      <p className="form-error" style={{color:"red"}}>{errors.camname}</p>
                    ) : null}
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Camera Ip Address</label>
                <input type="text" className='form-control' name="camip" placeholder='Enter Camera Ip Address' value={values.camip}
                      onChange={handleChange}
                      onBlur={handleBlur}/>
                      {errors.camip && touched.camip ? (
                      <p className="form-error" style={{color:"red"}}>{errors.camip}</p>
                    ) : null}
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
                <input type="text" className='form-control' name="camport" placeholder='Enter Camera Port e.g 8080' value={values.camport}
                      onChange={handleChange}
                      onBlur={handleBlur}/>
                      {errors.camport && touched.camport ? (
                      <p className="form-error" style={{color:"red"}}>{errors.camport}</p>
                    ) : null}
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Choose File </label><br/>
                <input type="file" id="myfile" name="myfile" onChange={(e) => {
                  encodeFileBase641(e.target.files[0]);
                }}></input>
                     
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Choose File Heatmap </label><br/>
                <input type="file" id="myfile" name="myfile" onChange={(e) => {
                  encodeFileBase642(e.target.files[0]);
                }}></input>
                     
              </div>
            </Col>
            <Col lg={12}>
              <div>
                <label htmlFor="name"> Choose File Homography</label><br/>
                <input type="file" id="myfile" name="myfile" onChange={(e) => {
                  encodeFileBase643(e.target.files[0]);
                }}></input>
                     
              </div>
            </Col>
            <Col>
              <button style={buttonstylesubmit} type="submit" onClick={handleSubmit}>Submit</button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
    <button size="15rem"  onClick={changemodal} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}  style={buttonstyle}>
        +Add Camera</button>   
              
    </>
  )
}

export default CameraAdd;
