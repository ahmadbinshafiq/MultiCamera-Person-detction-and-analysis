import React from 'react'
import {motion} from 'framer-motion';
function ComputationalCost() {
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
        borderColor:"rgb(255, 99, 132)"
      }}
      whileTap={{
        scale:0.9
      }}>
        <text>CPU</text>
        <h6>20</h6>
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
        <text>GPU</text>
        <h6>20</h6>
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
        <text>Working</text>
        <h6>24</h6>
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
        <text>Defacted</text>
        <h6>3</h6>
      </motion.div>
      </div>
    </div>
  )
}

export default ComputationalCost
