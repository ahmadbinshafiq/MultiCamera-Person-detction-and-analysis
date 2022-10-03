import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import {motion} from 'framer-motion';
const labels = ["0", "1", "2", "3", "4", "5"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Person Visits",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
    {
        label: "Person Visits",
        backgroundColor: "rgb(91, 24, 209)",
        borderColor: "rgb(116, 49, 236)",
        data: [10, 0, 15, 22, 2, 13, 15],
      },
  ],
};

const LineChart = () => {
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
  return (
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
        <Line data={data} options={options} />
      </motion.div>
      <div className="col-md-2">
        <div className="row">
        <h1 style={{color:"gray", fontFamily:"Garamond"}}>Analysis</h1>
          <motion.div style={{border: "1px solid lightgray",padding:"13px",textAlign:"center"}}
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
            <text>male</text>
            <h6>20</h6></motion.div>

            <motion.div style={{border: "1px solid lightgray",padding:"13px",textAlign:"center"}}
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
            <text>Female</text>
            <h6>20</h6></motion.div>
            
            <motion.div style={{border: "1px solid lightgray",padding:"13px",textAlign:"center"}}
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
            <text>Total Person</text>
            <h6>40</h6></motion.div>

            <motion.div style={{border: "1px solid lightgray",padding:"13px",textAlign:"center"}}
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
            <text>Unidentifiable</text>
            <h6>5</h6></motion.div>

            <motion.div style={{border: "1px solid lightgray",padding:"13px",textAlign:"center"}}
            animate={{
              x:0,
              rotate:360,
              /*  backgroundColor: ['hsl(0, 100, 50)', 'white']*/
            }}
            initial={{
              x:200,
              
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
            <motiontext>Accuracy</motiontext>
            <h6>20%</h6></motion.div>


         
        </div>
      </div>
      </div>
    </div>
  );
};

export default LineChart;