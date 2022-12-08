import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { BsCpuFill } from "react-icons/bs";
import { FiCpu } from "react-icons/fi";
import { TbDeviceComputerCameraOff } from "react-icons/tb";
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from "react-icons/hi";
import { axios } from 'axios';



function ComputationalCost() {

  const colorcpu = '8ed118';
  const colorgpu = 'orange';
  const colorworking = 'cyan';
  const colordefacted = 'red';

  const [navbarData, setnavbarData] = useState({
    cpu_temp: '0',
    cpu_usage: '0',
    working_cams: '0',
    defective_cams: '0'
  });

  useEffect(() => {
    handleAPICall();
  }, [])

  const handleAPICall = async () => {
    try {
      const res = await axios.get('/camera/test_all_feeds/');
      console.log(res.data);
      setnavbarData({
        cpu_temp: res.data.cpu_temp,
        cpu_usage: res.data.cpu_usage,
        working_cams: res.data.working_cams,
        defective_cams: res.data.defective_cams
      })
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className='container' style={{ marginTop: "20px" }}>
      <div className='row' style={{ justifyContent: "center" }}>

        <motion.div className="col-md-2" style={{ backgroundColor: "white", border: "1px solid lightgray", textAlign: "center" }}
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.1, borderColor: "rgb(255, 99, 132)" }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='row'>
            <BsCpuFill className='col-md-3 mt-3' color={colorcpu} />
            <div className='col-md-6'>
              <text>CPU Temp</text>
              <h6>{navbarData.cpu_temp}</h6>
            </div>
          </div>
        </motion.div>

        <motion.div className="col-md-2 ms-5" style={{ backgroundColor: "white", border: "1px solid lightgray", textAlign: "center" }}
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.1, borderColor: "rgb(255, 99, 132)" }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='row'>
            <FiCpu className='col-md-3 mt-3' color={colorgpu} />
            <div className='col-md-6'>
              <text>CPU Load</text>
              <h6>{navbarData.cpu_usage}</h6>
            </div>
          </div>
        </motion.div>

        <motion.div className="col-md-2 ms-5" style={{ backgroundColor: "white", border: "1px solid lightgray", textAlign: "center" }}
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.1, borderColor: "rgb(255, 99, 132)" }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='row'>
            <HiOutlineVideoCamera className='col-md-3 mt-3' color={colorworking} />
            <div className='col-md-6'>
              <text>Working Cams</text>
              <h6>{navbarData.working_cams}</h6>
            </div>
          </div>
        </motion.div>

        <motion.div className="col-md-2 ms-5" style={{ backgroundColor: "white", border: "1px solid lightgray", textAlign: "center" }}
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.1, borderColor: "rgb(255, 99, 132)" }}
          whileTap={{ scale: 0.9 }}
        >
          <div className='row'>
            <TbDeviceComputerCameraOff className='col-md-3 mt-3' color={colordefacted} />
            <div className='col-md-6'>
              <text>Defacted Cams</text>
              <h6>{navbarData.defective_cams}</h6>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default ComputationalCost;
