import React, { useState } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { motion } from 'framer-motion';
import { Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
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
      fill: true,
    },
    {
      label: "Female",
      backgroundColor: "rgb(170, 251, 251,0.5)",
      borderColor: "cyan",
      data: [10, 0, 15, 22, 2, 13, 15],
      fill: true,
    },
  ],
};


export default function Timestampanalysis() {

  const [modal, setmodal] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const [male1, setmale1] = React.useState("10");
  const [female1, setfemale1] = React.useState("60");
  const [others1, setothers1] = React.useState("95");

  const [male2, setmale2] = React.useState("12");
  const [female2, setfemale2] = React.useState("16");
  const [others2, setothers2] = React.useState("75");

  const [startDate, setStartDate] = React.useState(new Date);
  const [endDate, setEndDate] = React.useState(new Date);

  const [dateTo, setdateTo] = React.useState();
  const [dateFrom, setdateFrom] = React.useState();
  const [timeFrom, settimeFrom] = React.useState();
  const [timeTo, settimeTo] = React.useState();

  const twoDaysComparisonBarGraphOptions = {
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

  const selectedDateTime = {
    "date_start": dateFrom,
    "date_end": dateTo,
    "time_start": timeFrom,
    "time_end": timeTo
  }

  const donutGraph_firstDayData = {
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

  const donutGraph_secondDayData = {
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

  const twoDaysComparisonData = {
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

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const changemodal = () => {
    setmodal(!modal)
  }

  const changemodal1 = () => {

    setmodal(!modal)
    console.log("posting datetime data: ", selectedDateTime)

    fetch(`/analytics/timestamp_based_analytics_per_day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedDateTime)
    })
      .then(res => res.json())
      .then(data => {

        console.log("first_day: ", data.first_day)
        console.log("second_day: ", data.second_day)

        setmale1(data.first_day.males_count)
        setfemale1(data.first_day.females_count)
        setothers1(data.first_day.unknown_count)
        setmale2(data.second_day.males_count)
        setfemale2(data.second_day.females_count)
        setothers2(data.second_day.unknown_count)
      })
      .catch(err => console.log(err))
  }

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
  const buttonstyle1 = {
    borderRadius: "25px ",
    border: "red",
    padding: "5px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isHover ? 'white' : 'black',
    color: isHover ? 'black' : 'white',
  };


  return (
    <>
      <div className="mt-4">
        <button
          size="15rem"
          onClick={changemodal}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          style={buttonstyle}
        >
          +Add Filters
        </button>
      </div>

      <div className="col-md-4 mt-2">
        <motion.div
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.9 }}
        >
          <Doughnut data={donutGraph_firstDayData} options={{
            responsive: true,
            maintainAspectRatio: false
          }} style={{ backgroundColor: "#FFFFFF", borderRadius: "5%", height: "300px" }} />
        </motion.div>
      </div>

      <div className="col-md-4 mt-2">
        <motion.div
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.9 }}
        >
          <Doughnut data={donutGraph_secondDayData} options={{
            responsive: true,
            maintainAspectRatio: false
          }} style={{ backgroundColor: "#FFFFFF", borderRadius: "5%", height: "300px" }} />
        </motion.div>
      </div>

      <div className="col-md-4 mt-2">
        <motion.div
          animate={{ x: 0, rotate: 360 }}
          initial={{ x: 200 }}
          transition={{ type: "spring", stiffness: 60 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bar data={twoDaysComparisonData} options={{ twoDaysComparisonBarGraphOptions }} style={{ backgroundColor: "#FFFFFF", borderRadius: "5%", height: "300px" }} />
        </motion.div>
      </div>


      <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>

        <ModalHeader toggle={() => setmodal(!modal)}>
          Add Filters
        </ModalHeader>

        <ModalBody>

          <Row style={{ marginLeft: "1px", marginBottom: '5px' }}>Select Start Date </Row>
          <Row style={{ marginLeft: "4px", marginBottom: '5px' }}>
            <DatePicker
              selected={startDate}
              onChange={date => {
                setStartDate(date)
                var startdateBeforeIncrement = date;
                startdateBeforeIncrement.setDate(startdateBeforeIncrement.getDate() + 1)
                var startdate1 = startdateBeforeIncrement.toISOString().substring(0, 10)
                setdateFrom(startdate1)
              }}
              name="From Date"
              dateFormat="yyyy-MM-dd"
            /> </Row>

          <Row style={{ marginLeft: "1px", marginBottom: '5px' }}>Select End Date </Row>

          <Row style={{ marginLeft: "4px", marginBottom: '15px' }}>
            <DatePicker
              selected={endDate}
              onChange={enddate => {
                setEndDate(enddate)
                var enddateBeforeIncrement = enddate;
                enddateBeforeIncrement.setDate(enddateBeforeIncrement.getDate() + 1)
                var enddate1 = enddateBeforeIncrement.toISOString().substring(0, 10)
                setdateTo(enddate1)
              }}
              name="To Date"
              dateFormat="yyyy-MM-dd"
            />
          </Row>

          <Row>
            <br />
            <p>Starting Time: {timeFrom || '-'}</p>
            <TimePicker
              placeholder="Select Start Time"
              showSeconds
              focusOnOpen={true}
              format="hh:mm:ss"
              onChange={e => {
                settimeFrom(e.toISOString().substring(0, 10))
                var starttime1 = e.format('LTS')
                var starttime2 = starttime1.substring(0, starttime1.length - 3);
                //time2+=":01"
                settimeFrom(starttime2)
                console.log("time selected is --", e.toISOString())
                console.log("time 2 is", starttime2)
              }
              }
            /></Row>


          <Row>
            <br />
            <p>Ending Time: {timeTo || '-'}</p>

            <TimePicker

              placeholder="Select End Time"
              showSeconds
              focusOnOpen={true}
              format="hh:mm:ss"
              onChange={e => {
                var endtime1 = e.format('LTS')
                var endtime2 = endtime1.substring(0, endtime1.length - 3);
                settimeTo(endtime2)
              }}
            />
          </Row>

          <Col className="mt-2">
            <button
              onClick={changemodal1}
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={buttonstyle1}
            >
              Apply
            </button>

          </Col>

        </ModalBody>
      </Modal>

    </>
  )
}
