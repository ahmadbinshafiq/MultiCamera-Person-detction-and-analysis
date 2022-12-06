
import ws from 'ws';
import React from 'react';
import DonutFrame from '../components/DonutFrame';
import { Line,Bar,Doughnut } from "react-chartjs-2";
import {useLocation} from "react-router-dom";

function Messages() {
  const location=useLocation();
  
  console.log("props",location.floor_id)
  const image_buffer = "data:image/png;base64,"

  const [image, setImage] = React.useState("data:image/png;base64,");
  const [image1, setImage1] = React.useState("data:image/png;base64,");
  const [image2, setImage2] = React.useState("data:image/png;base64,");
  const [image3, setImage3] = React.useState("data:image/png;base64,");
  const [random, setrandom] = React.useState("");
  const [chartType,setchartType ] = React.useState("Doughnut");
  const [active1,setactive1 ] = React.useState(true);
  const [active2,setactive2 ] = React.useState(false);
 
  const [male, setmale] = React.useState("10");
  const [female, setfemale] = React.useState("60");
  const [others, setothers] = React.useState("95");
  const [child, setchild] = React.useState("95");
  const [teen, setteen] = React.useState("65");
  const [adult, setadult] = React.useState("35");


  console.log(image.slice(0, 10));
  const boxStyle = {
    backgroundColor:"black", borderRadius: "15px",
    padding:"3px",      
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',     
    cursor: 'pointer',
    backgroundColor: 'blue' ,
    color: 'black',
 };
 const boxStyle1 = {
  borderRadius: "15px",
  backgroundColor: active1 ?  'rgb(252, 171, 171)':'white' ,
  color: active1 ?   'white':'black',
};
const boxStyle2 = {
   borderRadius: "15px",

  backgroundColor: active2 ?  'rgb(252, 171, 171)':'white' ,
  color: active2 ?   'white':'black',
};

  const handlechange=()=>{
    if (chartType=="Doughnut"){
      setchartType("Bar")
      setactive1(true)
      setactive2(false)
    }
    else{
      setchartType("Doughnut")
      setactive1(false)
      setactive2(true)
    }
  }
  const data1 = {
    labels: [
      'male',
      'female',
      'others'
    ],
    datasets: [{
      label: 'Comparison 1',
      data: [male, female, others],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      
    }]
  };
  const data2 = {
    labels: [
      'adult',
      'teen',
      'child'
    ],
    datasets: [{
      label: 'Comparison 2',
      data: [child, teen, adult],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      
    }]
  };

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('connected');
      ws.send('start');
    }
    ws.onmessage = evt => {
      // console.log(evt.data);
      console.log("image received");
      var data = JSON.parse(evt.data);
      setImage(image_buffer + data['image']);
      setImage1(image_buffer + data['image1']);
      setImage2(image_buffer + data['image2']);
      setImage3(image_buffer + data['image3']);
      setrandom(data["counts"]);
      console.log("ffgggg "+data["counts"]["total_people"])
      setmale(data["counts"]["male_count"])
      setfemale(data["counts"]["female_count"])
      setothers(data["counts"]["unknown_count"])
      setadult(data["counts"]["adult_count"])
      setteen(data["counts"]["child_count"])
      setchild(data["counts"]["teen_count"])
    }
    ws.onclose = () => {
      console.log('disconnected');
    }
  }, []);
  
  // create a button on pressing that button it will send a message to the server
  // and the server will send a message back to the client

  const handleButtonClick = () => {
    // ws.send("start");
    console.log("button clicked");

  }
  if (chartType=="Doughnut"){
    return (
      <>
      <div className="row mt-3">

<img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image}
alt="Video" 
/>
{/*    <div className='col-md-6'>
<DonutFrame/></div> */}
   <img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image2}
alt="Video" 
/>
   <img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image3}
alt="Video" 
/>





</div>

<div className='row'>
<div className='col-md-5'></div>
  <div className='col-md-2 mt-2'>
    <div class="btn-group btn-toggle"> 
      <button class="btn btn-sm " style={boxStyle1} onClick={handlechange}>Doughnut</button>
      <button class="btn btn-sm " style={boxStyle2} onClick={handlechange}>Bar Chart</button>
    </div>
  </div>
  </div>
  <div className='col-md-5'></div>
<div className='row'>

<div className='col-md-6 mt-2'>
  <Doughnut data={data1} options={{responsive: true,
    maintainAspectRatio: false}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"auto",width:"auto"}}/>
</div>
<div className='col-md-6 mt-2'>
  <Doughnut data={data2} options={{responsive: true,
    maintainAspectRatio: false}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"auto",width:"auto"}}/>
</div>
</div>
      </>
    ) 
  }
  if (chartType=="Bar"){
    return (
      <>
      <div className="row mt-3">

<img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image}
alt="Video" 
/>
{/*    <div className='col-md-6'>
<DonutFrame/></div> */}
   <img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image2}
alt="Video" 
/>
   <img className='my-2 mx-2' style={{borderRadius:"25px",width: "20rem",boxshadow: "1px 2px 3px 4px rgba(20,20,20,0.4)"}}
src={image3}
alt="Video" 
/>





</div>

<div className='row'>
<div className='col-md-5'></div>
  <div className='col-md-2 mt-2'>
    <div class="btn-group btn-toggle"> 
      <button class="btn btn-sm " style={boxStyle1} onClick={handlechange}>Doughnut</button>
      <button class="btn btn-sm " style={boxStyle2} onClick={handlechange}>Bar Chart</button>
    </div>
  </div>
  </div>
  <div className='col-md-5'></div>
  <div className='row'>
<div className='col-md-6'>
<Bar data={data1} options={{responsive: true,
    maintainAspectRatio: false}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"auto",width:"auto"}}/>
</div>
<div className='col-md-6 mt-2'>
  <Bar data={data2} options={{responsive: true,
    maintainAspectRatio: false}} style={{backgroundColor:"#FFFFFF",borderRadius:"5%",height:"auto",width:"auto"}}/>
</div></div>
      </>
    ) 
  }


    
      
}


  
  export default Messages;