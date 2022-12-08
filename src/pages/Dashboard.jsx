import React from 'react'
import Linechart from "../components/Linechart";
import ComputationalCost from "../components/ComputationalCost";
import CameraView from "../components/CameraView";
import Cameras from "../pages/Cameras";
import Footer from "../components/Footer";
import CameraAdd from '../components/CameraAdd';
import ComputationalCostFrame from '../components/ComputationalCostFrame';


function Dashboard() {

  return (
    <>
      <div style={{ backgroundColor: "#F7F8FC" }} >
        <Linechart />
        {/* <ComputationalCost /> */}
        {/* <CameraAdd/> */}

        <ComputationalCostFrame />

        <CameraView />

        {/* <Footer/> */}
      </div>

    </>
  )
}

export default Dashboard
