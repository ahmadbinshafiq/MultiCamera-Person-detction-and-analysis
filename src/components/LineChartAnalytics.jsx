import React,{useState} from "react";
import Chart from "chart.js/auto";
import { Line,Bar,Doughnut,Pie } from "react-chartjs-2";
import {motion} from 'framer-motion';

import { FaCircle } from "react-icons/fa";
import { TbSum } from "react-icons/tb";

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
const data2 = {
  labels: labels2,
  datasets: [
    {
      label: "Previous Day",
      backgroundColor: "#B880FF",
      borderColor: "rgb(255, 99, 132)",
      data: [20, 30, 45],
    },
    {
        label: "Current Day",
        backgroundColor: "cyan",
        borderColor: "cyan",
        data: [2, 13, 15],
      },
  ],
};
const data1 = {
  labels: [
    'female',
    'male',
    'others'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      
      '#B880FF',
      '#90FFFF',
      '#FFD66B'
    ],
    
  }]
};

const LineChartAnalytics = () => {
  const colorothers='FFD66B'
  const colorfemale='B880FF'
  const colormale='90FFFF'
  const colorunidentify='orange'
  const coloraccuracy='cyan'
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
    const options2 = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart'
          }
        }
      },
    };

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
          <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Others
                20
            </text>
            </motion.div>

            <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Female
                20
            </text>
            </motion.div>
            <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Male
                20
            </text>
            </motion.div>     
        </div>
      </div>
<div className="col-md-2 mt-5">
        <div className="row" style={{backgroundColor:"#FFFFFF",borderRadius:"5%"}}>
        <h1 style={{color:"gray", fontFamily:"Garamond"}}>Analysis</h1>
          <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Others
                20
            </text>
            </motion.div>

            <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Female
                20
            </text>
            </motion.div>
            <motion.div style={{padding:"13px",textAlign:"center"}}
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
            <text>Male
                20
            </text>
            </motion.div>     
        </div>
      </div>
<div className="col-md-5 mt-5">
      <motion.div 
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
        <Doughnut data={data1} options={{responsive: true,
          maintainAspectRatio: false}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"300px"}}/>
      </motion.div>
</div>
<div className="col-md-5 mt-5">
      <motion.div 
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
        <Bar data={data2} options={{options2}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"300px"}}/>
      </motion.div>
</div>

      </div>
    </div>
    

    </>
  );
};

export default LineChartAnalytics;