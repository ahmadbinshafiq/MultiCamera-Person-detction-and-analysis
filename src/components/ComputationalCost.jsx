import React,{useState} from 'react'
import {motion} from 'framer-motion';
import { BsCpuFill } from "react-icons/bs";
import { FiCpu } from "react-icons/fi";
import { TbDeviceComputerCameraOff } from "react-icons/tb";
import { HiOutlineVideoCamera,HiOutlineVideoCameraSlash } from "react-icons/hi";
function ComputationalCost() {
  const [colo,setcolo]=useState()
  const colorcpu='8ed118'
  const colorgpu='orange'
  const colorworking='cyan'
  const colordefacted='red'
  return (
    <div className='container' style={{marginTop:"20px"}}>
      <div className='row' style={{justifyContent: "center"}}>
      <motion.div className="col-md-2" style={{border: "1px solid lightgray",textAlign:"center"}}
      animate={{
        x:0,
        rotate:360
      }}
      initial={{
        x:200  
      }}
      transition={{
        type:"spring",
        stiffness:60
      }}
      whileHover={{
        scale:1.1,
        borderColor:"rgb(255, 99, 132)",
        
      }}
      whileTap={{
        scale:0.9
      }}>
        <div className='row'>
        <BsCpuFill className='col-md-6 mt-3' color={colorcpu}/>
        <div className='col-md-6'>
        <text>CPU</text>
        <h6>20</h6>
        </div>
        </div>
      </motion.div>

      <motion.div className="col-md-2 ms-5" style={{border: "1px solid lightgray",textAlign:"center"}}
      animate={{
        x:0,
        rotate:360
      }}
      initial={{
        x:200
        
      }}
      transition={{
        type:"spring",
        stiffness:60
      }}
      whileHover={{
        scale:1.1,
        borderColor:"rgb(255, 99, 132)"
      }}
      whileTap={{
        scale:0.9
      }}>
        <div className='row'>
        <FiCpu className='col-md-6 mt-3' color={colorgpu}/>
        <div className='col-md-6'>
        <text>GPU</text>
        <h6>20</h6>
        </div>
        </div>
      </motion.div>

      <motion.div className="col-md-2 ms-5" style={{border: "1px solid lightgray",textAlign:"center"}}
      animate={{
        x:0,
        rotate:360
      }}
      initial={{
        x:200
        
      }}
      transition={{
        type:"spring",
        stiffness:60
      }}
      whileHover={{
        scale:1.1,
        borderColor:"rgb(255, 99, 132)"
      }}
      whileTap={{
        scale:0.9
      }}>
        <div className='row'>
        <HiOutlineVideoCamera className='col-md-6 mt-3' color={colorworking}/>
        <div className='col-md-6'>
        <text>Working</text>
        <h6>24</h6>
        </div>
        </div>
      </motion.div>

      <motion.div className="col-md-2 ms-5" style={{border: "1px solid lightgray",textAlign:"center"}}
      animate={{
        x:0,
        rotate:360
      }}
      initial={{
        x:200
        
      }}
      transition={{
        type:"spring",
        stiffness:60
      }}
      whileHover={{
        scale:1.1,
        borderColor:"rgb(255, 99, 132)"
      }}
      whileTap={{
        scale:0.9
      }}>
        <div className='row'>
        <TbDeviceComputerCameraOff className='col-md-6 mt-3' color={colordefacted}/>
        <div className='col-md-6'>
        <text>Defacted</text>
        <h6>3</h6>
        </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}

export default ComputationalCost
