import React,{useState} from "react";
import { Line,Bar,Doughnut,Pie } from "react-chartjs-2";
import {motion} from 'framer-motion';
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import { FaCircle } from "react-icons/fa";

import AsyncSelect from "react-select/async";

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
    const [modal,setmodal]=useState(false);
    const [isHover, setIsHover] = useState(false);
    const [male, setmale] = React.useState("10");
    const [female, setfemale] = React.useState("60");
    const [others, setothers] = React.useState("95");
    const [dateopt,setdateopt]=React.useState([{}]);
    const [dateopt1,setdateopt1]=React.useState([{}]);
    const [dayfirst,setdayfirst]=React.useState();
    const [daysecond,setdaysecond]=React.useState();
    const [timeStamp1,settimeStamp1]=React.useState();
    const [timeStamp2,settimeStamp2]=React.useState();
    const data1 = {
      labels: [
        'female',
        'male',
        'others'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [female, male, others],
        backgroundColor: [
          
          '#B880FF',
          '#90FFFF',
          '#FFD66B'
        ],
        
      }]
    };
    const loadOptions=(searchValue,callback)=>{
      setTimeout(()=>{
        const filterOption=dateopt.filter(option=>option.label.toLowerCase().includes(searchValue.toLowerCase()))
      callback(filterOption)
      },2000)
    }
    const loadOptions1=(searchValue,callback)=>{
      setTimeout(()=>{
        const filterOption=dateopt1.filter(option=>option.label.toLowerCase().includes(searchValue.toLowerCase()))
      callback(filterOption)
      },2000)
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
        setdateopt(data["counts1"])
        setdateopt1(data["counts2"])
        var dataa=dateopt
        //console.log("ffff",dataa)
        //console.log("ffffr",dateopt[0])
        setmale(data["counts"]["male_count"])
        setfemale(data["counts"]["female_count"])
        setothers(data["counts"]["unknown_count"])
        
      }
      ws.onclose = () => {
        console.log('disconnected');
      }
    }, []);
    const handleMouseEnter = () => {
       setIsHover(true);
    }; 
    const handleMouseLeave = () => {
       setIsHover(false);
    };
    const buttonstyle = {
     borderRadius: "25px ",
        border:"red",
        padding:"5px",      
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isHover ? '#f2f4ff':'#EDEFFF' ,
        color: isHover ? '#bbc2f9' : '#bbc2f9',
      };
      const buttonstyle1 = {
        borderRadius: "25px ",
           border:"red",
           padding:"5px",      
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           cursor: 'pointer',
           backgroundColor: isHover ? 'white' : 'black',
           color: isHover ? 'black' : 'white',
         };

    
    const changemodal=()=>{
            setmodal(!modal)          
        }

    const optionz = [
          { value: '4 Dec', label: '4 Dec' },
          { value: '5 Dec', label: '5 Dec' }, 
          { value: '6 Dec', label: '6 Dec' },   
        ]
    const optionz1 = [
          { value: '1', label: '1'},
          { value: '2', label: '2' }, 
          { value: '3', label: '3' },   
        ]

    const handlechange1=(selectedOption)=>{
      console.log("handlechange1",selectedOption)
      setdayfirst(selectedOption)
    }
    const handlechange2=(selectedOption)=>{
      console.log("handlechange2",selectedOption)
      setdaysecond(selectedOption)
    }
    const handlechange3=(selectedOption)=>{
      console.log("handlechange3",selectedOption)
      settimeStamp1(selectedOption.value)
      console.log("handlechange3",selectedOption.value)
      //var timeStamp1=timeStamp
      //console.log("handlechange3 timestamp",timeStamp1)
      //here we add filter options in state
    }
    const handlechange4=(selectedOption)=>{
      console.log("handlechange4",selectedOption)
      settimeStamp2(selectedOption.value)
    }
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
      <div className="mt-4">
      <button size="15rem"  onClick={changemodal} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}  style={buttonstyle}>
        +Add Filters</button> 
      </div>
  <div className="col-md-4 mt-2">
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
<div className="col-md-4 mt-2">
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
<div className="col-md-4 mt-2">
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
    <Modal size="lg" isOpen={modal} toggle={()=>setmodal(!modal)}>
      <ModalHeader toggle={()=>setmodal(!modal)}>
        Add Filters
      </ModalHeader>
      <ModalBody>
      
          
            <Row style={{marginLeft:"2px"}}>Select First Day </Row>
            <Row><AsyncSelect loadOptions={loadOptions} onChange={handlechange1}/></Row>
            <Row style={{marginLeft:"2px"}}>Select Second Day 2</Row>
            <Row><AsyncSelect loadOptions={loadOptions} onChange={handlechange2}/></Row>
            <Row style={{marginLeft:"2px"}} >From(TimeStamp)</Row>
            <Row><AsyncSelect loadOptions={loadOptions1} onChange={handlechange3}/></Row>
            <Row style={{marginLeft:"2px"}} >To(TimeStamp)</Row>
            <Row><AsyncSelect loadOptions={loadOptions1} onChange={handlechange4}/></Row>
            <Col className="mt-2">
              <button onClick={changemodal} type="submit" onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}  style={buttonstyle1} >Apply</button>
            </Col>
          
     
      </ModalBody>
    </Modal>

    </>
  );
};

export default LineChartAnalytics;