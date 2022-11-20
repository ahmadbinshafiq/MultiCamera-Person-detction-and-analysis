import React,{useState,useEffect} from 'react'
import LineChartAnalytics from "../components/LineChartAnalytics";
const Analytics = () => {
    return( 
  <>
      <div style={{backgroundColor:"#F7F8FC"}} >
    <div className="title"> Header Area</div>
    

    <LineChartAnalytics />
    
    </div>
  </>)
  };
  
  export default Analytics