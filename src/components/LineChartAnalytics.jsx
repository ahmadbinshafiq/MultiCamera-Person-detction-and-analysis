import React,{useState} from "react";
import { Line,Bar,Doughnut,Pie } from "react-chartjs-2";
import {motion} from 'framer-motion';
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import { FaCircle } from "react-icons/fa";
import Filters from "./Filters";


const labels = ["0", "1", "2", "3", "4", "5"];
const labels2 = ["Others", "Female", "Male"];
const data = {
  labels: labels,
  datasets: [
    {
      label: "Male",
      backgroundColor: "rgb(252, 171, 171,0.5)",
      borderColor: "#FF3737",
      data: [0, 10, 5, 2, 20, 30, 45],
      fill:true,
    },
    {
        label: "Female",
        backgroundColor: "rgb(170, 251, 251,0.5)",
        borderColor: "cyan",
        data: [10, 0, 15, 22, 2, 13, 15],
        fill:true,
      },
  ],
};


const LineChartAnalytics = () => {
  const colorothers='FFD66B'
  const colorfemale='B880FF'
  const colormale='90FFFF'
    const options={
        plugins:{
        title: {
            display:true,
            text:'line chart'
        },

    },
    scales:{
      y:
          {       min:0,
                  max:59,
                  stepSize:10            
          }      
  }
    }

    
    React.useEffect(() => {
      const ws = new WebSocket('ws://localhost:8000/ws');
  
      ws.onopen = () => {
        console.log('connected');
        ws.send('start');
      }
      ws.onmessage = evt => {
        // console.log(evt.data);
        //console.log("image received");
        var data = JSON.parse(evt.data);
        //console.log(data["counts1"][0].value)

        
      }
      ws.onclose = () => {
        console.log('disconnected');
      }
    }, []);

    
  return (
    <>
<div className="row" >
  <div className="col-md-12"> 
    <text style={{color:"#585858"}}>29 october</text>
    </div>
    <text style={{color:"#585858",fontSize:"24px"}}><strong>Overall Feed</strong></text>
    </div>
    
<div className="container">
      <div className="row" >
      <motion.div className="col-md-10" 
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
        scale:1.01
        
      }}
      whileTap={{
        scale:0.9
      }}>
        <Line data={data} options={options} style={{backgroundColor:"#FFFFFF",borderRadius:"5%"}}/>
      </motion.div>
      <div className="col-md-2">
        <div className="row" style={{backgroundColor:"#FFFFFF",borderRadius:"5%"}}>
        <h1 style={{color:"gray", fontFamily:"Garamond"}}>Analysis</h1>
          <motion.div style={{padding:"13px",textAlign:"left"}}
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
            <FaCircle size={28} color={colorothers}/>
            <text style={{marginLeft:"6px"}}>Others
                20
            </text>
            </motion.div>

            <motion.div style={{padding:"13px",textAlign:"left"}}
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
            <FaCircle size={28} color={colorfemale}/>
            <text style={{marginLeft:"6px"}}>Female
                20 
            </text>
            </motion.div>
            <motion.div style={{padding:"13px",textAlign:"left"}}
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
            <FaCircle size={28} color={colormale}/>
            <text style={{marginLeft:"6px"}}>Male
                20
            </text>
            </motion.div>     
        </div>
      </div>
      
<Filters />
      </div>
    </div>
   
    </>
  );
};

export default LineChartAnalytics;