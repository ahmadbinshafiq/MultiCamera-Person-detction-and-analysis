import React, { useState, useEffect } from 'react'
import LineChartAnalytics from "../components/LineChartAnalytics";
import Linechart from "../components/Linechart";

const Analytics = () => {
  return (
    <>
      <div style={{ backgroundColor: "#F7F8FC" }} >
        <div className="title"> </div>
        <LineChartAnalytics />
        {/* <Linechart /> */}

      </div>
    </>)
};

export default Analytics