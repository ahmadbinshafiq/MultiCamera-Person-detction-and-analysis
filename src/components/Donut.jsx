import React from 'react'
import {motion} from 'framer-motion';
import { Line,Bar,Doughnut } from "react-chartjs-2";
export default function Donut() {
    const data1 = {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          
        }]
      };
  return (
    <>
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
    </>
  )
}
