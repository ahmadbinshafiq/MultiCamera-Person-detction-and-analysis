import React, { useState } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { motion } from 'framer-motion';
import { Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { FaCircle } from "react-icons/fa";
import Timestampanalysis from "./Timestampanalysis";
import DatePicker from "react-datepicker";
import LineChart from "./Linechart";


const LineChartAnalytics = () => {

  const colorothers = 'FFD66B'
  const colorfemale = 'B880FF'
  const colormale = '90FFFF'

  const [isHover, setIsHover] = useState(false);
  const [modal, setmodal] = useState(false);
  const [labels, setlabels] = useState([1, 2, 3, 4, 5, 100]);

  const [male1, setmale1] = useState([20, 10, 5, 2, 20, 30, 45]);
  const [female1, setfemale1] = useState([10, 0, 15, 22, 2, 13, 15]);
  const [others1, setothers1] = useState([15, 20, 65, 7, 6, 13, 17]);

  const [startdate1, setstartdate1] = React.useState(new Date);
  const [enddate1, setenddate1] = React.useState(new Date);

  const [startdate2, setstartdate2] = React.useState();
  const [enddate2, setenddate2] = React.useState();

  const labels2 = ["Others", "Female", "Male"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Male",
        backgroundColor: "rgb(252, 171, 171,0.5)",
        borderColor: "#FF3737",
        data: male1,
        fill: true,
      },
      {
        label: "Female",
        backgroundColor: "rgb(170, 251, 251,0.5)",
        borderColor: "cyan",
        data: female1,
        fill: true,
      },
      {
        label: "Others",
        backgroundColor: "rgb(231, 208, 148,0.5)",
        borderColor: "#FFD66B",
        data: others1,
        fill: true,
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'line chart'
      },

    },
    scales: {
      y:
      {
        min: 0,
        max: 900,
        stepSize: 100
      }
    }
  }

  const changemodal1 = () => {
    console.log("wwwww")
    setmodal(!modal)
    fetch(`/analytics/days_counts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data5)
    })
      .then(res => res.json())
      .then(data => {
        console.log("dataaaa", data)
        console.log("dataaaa", data.labels)
        setlabels(data.labels)
        setmale1(data.males_count)
        setfemale1(data.females_count)
        setothers1(data.unknown_counts)
        /*    setmale1(data.first_day.males_count)
           setfemale1(data.first_day.females_count)
           setothers1(data.first_day.unknown_count)
           setmale2(data.second_day.males_count)
           setfemale2(data.second_day.females_count)
           setothers2(data.second_day.unknown_count) */
        //console.log('ip', ip[1].camera_ip)
      })
      .catch(err => console.log(err))
  }

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const buttonstyle = {
    borderRadius: "25px ",
    border: "red",
    padding: "5px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isHover ? '#f2f4ff' : '#EDEFFF',
    color: isHover ? '#bbc2f9' : '#bbc2f9',
  };
  const data5 = {
    "date_start": startdate2,
    "date_end": enddate2,
    "time_start": "02:00:00",
    "time_end": "23:00:59"
  }

  return (
    <>
      <div className="row" >
        <div className="col-md-12">
          <text style={{ color: "#585858" }}>29 october</text>
        </div>
        <text style={{ color: "#585858", fontSize: "24px" }}><strong>All Floors Analytics</strong></text>
      </div>

      <button size="15rem" onClick={changemodal1} onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} style={buttonstyle}>
        +Add Filters
      </button>

      <div className="container">
        <div className="row" >
          <motion.div className="col-md-10"
            animate={{ x: 0, rotate: 360 }}
            initial={{ x: 200 }}
            transition={{ type: "spring", stiffness: 60 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* <Line data={data} options={options} style={{ backgroundColor: "#FFFFFF", borderRadius: "5%" }} /> */}
            <LineChart />
          </motion.div>
          {/* 
          <div className="col-md-2">
            <div className="row" style={{ backgroundColor: "#FFFFFF", borderRadius: "5%" }}>
              <h1 style={{ color: "gray", fontFamily: "Garamond" }}>Analysis</h1>
              <motion.div style={{ padding: "13px", textAlign: "left" }}
                animate={{ x: 0, rotate: 360 }}
                initial={{ x: 200 }}
                transition={{ type: "spring", stiffness: 60 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCircle size={28} color={colorothers} />
                <text style={{ marginLeft: "6px" }}>Others:
                  {others1[0]}
                </text>
              </motion.div>

              <motion.div style={{ padding: "13px", textAlign: "left" }}
                animate={{ x: 0, rotate: 360 }}
                initial={{ x: 200 }}
                transition={{ type: "spring", stiffness: 60 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCircle size={28} color={colorfemale} />
                <text style={{ marginLeft: "6px" }}>Female:
                  {female1[0]}
                </text>
              </motion.div>
              <motion.div style={{ padding: "13px", textAlign: "left" }}
                animate={{ x: 0, rotate: 360 }}
                initial={{ x: 200 }}
                transition={{ type: "spring", stiffness: 60 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCircle size={28} color={colormale} />
                <text style={{ marginLeft: "6px" }}>Male:
                  {male1[0]}
                </text>
              </motion.div>
            </div>
          </div> */}

          <Timestampanalysis />
        </div>
      </div>


      <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
        <ModalHeader toggle={() => setmodal(!modal)}>
          Add Filters
        </ModalHeader>
        <ModalBody>
          <Row style={{ marginLeft: "2px" }}>Select Date From </Row>
          <Row>
            <DatePicker
              selected={startdate1}
              onChange={date => {
                setstartdate1(date)
                console.log("printing date: ", date.toISOString().substring(0, 10))
                console.log("printing date type: ", typeof date.toISOString().substring(0, 10))
                var date1 = date.toISOString().substring(0, 10)
                setstartdate2(date1)
                console.log("date1 is ", date1)
                console.log("date1 is -------")
              }}
              name="From Date"
              dateFormat="yyyy-MM-dd"
            /> </Row>

          <Row style={{ marginLeft: "2px" }}>Select Date To </Row>
          <Row>
            <DatePicker
              selected={enddate1}
              onChange={date => {
                setenddate1(date)
                var date1 = date.toISOString().substring(0, 10);
                setenddate2(date1)
              }}
              name="To Date"
              dateFormat="yyyy-MM-dd"
            /> </Row>
          <Col className="mt-2">
            <button onClick={changemodal1} type="submit" onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave} style={buttonstyle} >Apply</button>
          </Col>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LineChartAnalytics;