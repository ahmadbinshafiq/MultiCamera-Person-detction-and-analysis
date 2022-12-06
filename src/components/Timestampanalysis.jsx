import React,{useState} from "react";
import { Line,Bar,Doughnut,Pie } from "react-chartjs-2";
import {motion} from 'framer-motion';
import {Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import AsyncSelect from "react-select/async";
import DatePicker from 'react-datepicker'; 
import timepicker from 'react-time-picker';  
import "react-datepicker/dist/react-datepicker.css"; 
import TimePicker from "rc-time-picker";
import 'rc-time-picker/assets/index.css';  
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


export default function Timestampanalysis() {

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
    const [male1, setmale1] = React.useState("10");
    const [female1, setfemale1] = React.useState("60");
    const [others1, setothers1] = React.useState("95");
    const [male2, setmale2] = React.useState("12");
    const [female2, setfemale2] = React.useState("16");
    const [others2, setothers2] = React.useState("75");
    const [dateTo,setdateTo]=React.useState();
    const [dateFrom,setdateFrom]=React.useState();
    const [startdate1,setstartdate1]=React.useState(new Date);
    const [enddate1,setenddate1]=React.useState(new Date);
    const [timeFrom,settimeFrom]=React.useState();
    const [timeTo,settimeTo]=React.useState();
    const data5 = {
      "date_start": dateTo,
      "date_end": dateFrom,
      "time_start": timeFrom,
      "time_end": timeTo
  }
    const data1 = {
      labels: [
        'female',
        'male',
        'others'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [female1, male1, others1],
        backgroundColor: [
          
          '#B880FF',
          '#90FFFF',
          '#FFD66B'
        ],
        
      }]
    };
    const data2 = {
      labels: labels2,
      datasets: [
        {
          label: "Previous Day",
          backgroundColor: "#B880FF",
          borderColor: "rgb(255, 99, 132)",
          data: [male1, female1, others1],
        },
        {
            label: "Current Day",
            backgroundColor: "cyan",
            borderColor: "cyan",
            data: [male2, female2, others2],
          },
      ],
    };
    const data3 = {
        labels: [
          'female',
          'male',
          'others'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [female2, male2, others2],
          backgroundColor: [
            
            '#B880FF',
            '#90FFFF',
            '#FFD66B'
          ],
          
        }]
      };


    
/*     React.useEffect(()=>{
      console.log("wwwww")
      fetch(`/analytics/interval_based_analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data5)
    })
        .then(res => res.json())
        .then(data => {
          console.log("dataaaa",data)
           
            //console.log('ip', ip[1].camera_ip)
        })
        .catch(err => console.log(err))
    },[]) */
    
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
      const changemodal1=()=>{
        console.log("wwwww")
        console.log("data5 is",data5)
        setmodal(!modal) 
        fetch(`/analytics/timestamp_based_analytics_per_day`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data5)
      })
          .then(res => res.json())
          .then(data => {
            console.log("dataaaa",data.first_day.adult_count)
              setmale1(data.first_day.males_count)
              setfemale1(data.first_day.females_count)
              setothers1(data.first_day.unknown_count)
              setmale2(data.second_day.males_count)
              setfemale2(data.second_day.females_count)
              setothers2(data.second_day.unknown_count)
              //console.log('ip', ip[1].camera_ip)
          })
          .catch(err => console.log(err))  }       
     /*    fetch(`/analytics/interval_based_analytics`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data5)
      })
          .then(res => res.json())
          .then(data => {
            console.log("dataaaa",data)
             
              //console.log('ip', ip[1].camera_ip)
          })
          .catch(err => console.log(err)) */
        

   

  
  return (
    <>
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
              <Doughnut data={data3} options={{responsive: true,
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


    <Modal size="lg" isOpen={modal} toggle={()=>setmodal(!modal)}>
      <ModalHeader toggle={()=>setmodal(!modal)}>
        Add Filters
      </ModalHeader>
      <ModalBody>       
          <Row style={{marginLeft:"1px"}}>Select Date From </Row>
            <Row style={{marginLeft:"4px"}}>          
              <DatePicker  
              selected={ startdate1 }  
              onChange={ date =>{
                setstartdate1(date)
                console.log("printing date:", date.toISOString().substring(0, 10))
                console.log("printing date type:", typeof date.toISOString().substring(0, 10))
                var date1=date.toISOString().substring(0, 10)
                setdateFrom(date1)
              } }    
              name="From Date"  
              dateFormat="yyyy-MM-dd"  
          /> </Row> 
            
          <Row style={{marginLeft:"1px"}}>Select Date To </Row>
            <Row style={{marginLeft:"4px"}}>          
              <DatePicker  
              selected={ enddate1 }  
              onChange={ date =>{
                setenddate1(date)
                console.log("printing date:", date.toISOString().substring(0, 10))
                console.log("printing date type:", typeof date.toISOString().substring(0, 10))
                var date1=date.toISOString().substring(0, 10)
                setdateTo(date1)
              } }     
              name="To Date"  
              dateFormat="yyyy-MM-dd"  
            /> </Row>

            <Row>
              <br />
              <p>From(TimeStamp): {timeFrom || '-'}</p>
              <TimePicker
                  placeholder="Select Time"
                  showSeconds
                  focusOnOpen={true}
                  format="hh:mm:ss"
                  onChange={e => 
                    { settimeFrom(e.toISOString().substring(0, 10))
                      var time1=e.format('LTS')
                      var time2=time1.substring (0, time1.length - 3);
                      //time2+=":01"
                      settimeFrom(time2)
                      console.log("time selected is --", e.toISOString())
                      console.log("time 2 is", time2)}
                  }
              /></Row>


            <Row>
              <br />
              <p>To(TimeStamp): {timeTo || '-'}</p>
              <TimePicker
                  placeholder="Select Time"
                  showSeconds
                  focusOnOpen={true}
                  format="hh:mm:ss"
                  onChange={e => 
                    { 
                      //console.log("time selected is ",typeof e)
                      //console.log("time selected is ", e.format('LT'))
                      //console.log("time selected is -", timeTo)
                      var time1=e.format('LTS')
                      var time2=time1.substring (0, time1.length - 3);
                      //time2+=":01"
                      settimeTo(time2)
                      console.log("time selected is --", e.toISOString())
                      console.log("time 2 is", time2)
                      //console.log("time selected is --", e.toISOString().substring(11, 16))
                    }
                  }
            /></Row>

            <Col className="mt-2">
              <button onClick={changemodal1} type="submit" onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}  style={buttonstyle1} >Apply</button>
            </Col>
      </ModalBody>
    </Modal>

    </>
  )
}
