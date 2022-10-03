import React from 'react'
import Linechart from "../components/Linechart";
import ComputationalCost from "../components/ComputationalCost";
import CameraView from "../components/CameraView";
function Dashboard() {
  return (
    <>
    <div >
      <Linechart />
      <ComputationalCost/>
      <CameraView />
    </div>

    </>
  )
}

export default Dashboard
