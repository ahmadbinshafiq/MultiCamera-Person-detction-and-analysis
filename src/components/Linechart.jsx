import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { motion } from 'framer-motion';
import { BiMale, BiFemale } from "react-icons/bi";
import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";
import { AiOutlinePercentage } from "react-icons/ai";
import { TbSum } from "react-icons/tb";
import axios from "axios";

const labels = ["0", "1", "2", "3", "4", "5"];

const weekOldDates = {
  date_start: "2022-12-05",
  date_end: "2022-12-09"
}

const LineChart = () => {

  const colormale = '5b18d1';
  const colorfemale = 'ff6384';
  const colortotal = '8ed118';
  const colorunidentify = 'orange';
  const coloraccuracy = 'cyan';

  const [chartData, setChartData] = useState({
    labels: ["0", "1", "2", "3", "4", "5"],
    males_data: [0, 10, 5, 2, 20, 30, 45],
    females_data: [10, 0, 15, 22, 2, 13, 15],
    unknown_data: [5, 17, 45, 10, 0, 7, 15]
  });

  const [counts, setCounts] = useState({
    male_count: 0,
    female_count: 0,
    unknown_count: 0,
    total_count: 0
  });

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Male",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: chartData.males_data,
      },
      {
        label: "Female",
        backgroundColor: "cyan",
        borderColor: "cyan",
        data: chartData.females_data,
      },
      {
        label: "Unknown",
        backgroundColor: "yellow",
        borderColor: "yellow",
        data: chartData.unknown_data,
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
        max: 1000,
        stepSize: 10

      }
    }
  }

  useEffect(() => {
    getWeekOldData();
  }, []);

  const getWeekOldData = async () => {
    try {
      const response = await axios.post("/analytics/days_counts", weekOldDates);
      const jsonData = await response.data;
      console.log("chartData from API: ", jsonData);
      setChartData({
        labels: jsonData.labels,
        males_data: jsonData.males_count,
        females_data: jsonData.females_count,
        unknown_data: jsonData.unknown_counts
      });
      var sumOfMales = jsonData.males_count.reduce((a, b) => a + b, 0);
      var sumOfFemales = jsonData.females_count.reduce((a, b) => a + b, 0);
      var sumOfUnknown = jsonData.unknown_counts.reduce((a, b) => a + b, 0);
      var sumOfTotal = sumOfMales + sumOfFemales + sumOfUnknown;
      setCounts({
        male_count: sumOfMales,
        female_count: sumOfFemales,
        unknown_count: sumOfUnknown,
        total_count: sumOfTotal
      });


    } catch (err) {
      console.error(err.message);
    }
  };




  return (
    <div className="container">
      <div className="row" >
        <div className="col-md-12" style={{ textAlign: "center" }}>
          <h1 style={{ color: "gray", fontFamily: "Garamond" }}>Previous Week Analytics</h1>
        </div>


        <motion.div className="col-md-10"
          animate={{
            x: 0,
            rotate: 360

          }}
          initial={{
            x: 200

          }}
          transition={{
            type: "spring",
            stiffness: 60
          }}
          whileHover={{
            scale: 1.01

          }}
          whileTap={{
            scale: 0.9
          }}>
          <Line data={data} options={options} />
        </motion.div>
        <div className="col-md-2">
          <div className="row">
            <h3 style={{ color: "gray", fontFamily: "Garamond" }}>Tracking Logs</h3>
            <motion.div style={{ border: "1px solid lightgray", padding: "13px", textAlign: "center" }}
              animate={{
                x: 0,
                rotate: 360
              }}
              initial={{
                x: 200

              }}
              transition={{
                type: "spring",
                stiffness: 60
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "rgb(255, 99, 132)"
              }}
              whileTap={{
                scale: 0.9
              }}>
              <BiMale color={colormale} />
              <text>Total Persons</text>
              <h6>{counts.total_count}</h6></motion.div>

            <motion.div style={{ border: "1px solid lightgray", padding: "13px", textAlign: "center" }}
              animate={{
                x: 0,
                rotate: 360
              }}
              initial={{
                x: 200

              }}
              transition={{
                type: "spring",
                stiffness: 60
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "rgb(255, 99, 132)"
              }}
              whileTap={{
                scale: 0.9
              }}>
              <BiFemale color={colorfemale} />
              <text>Males</text>
              <h6>{counts.male_count}</h6></motion.div>

            <motion.div style={{ border: "1px solid lightgray", padding: "13px", textAlign: "center" }}
              animate={{
                x: 0,
                rotate: 360
              }}
              initial={{
                x: 200

              }}
              transition={{
                type: "spring",
                stiffness: 60
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "rgb(255, 99, 132)"
              }}
              whileTap={{
                scale: 0.9
              }}>
              <TbSum color={colortotal} />
              <text>Females</text>
              <h6>{counts.female_count}</h6></motion.div>

            <motion.div style={{ border: "1px solid lightgray", padding: "13px", textAlign: "center" }}
              animate={{
                x: 0,
                rotate: 360
              }}
              initial={{
                x: 200

              }}
              transition={{
                type: "spring",
                stiffness: 60
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "rgb(255, 99, 132)"
              }}
              whileTap={{
                scale: 0.9
              }}>
              <MdDoNotDisturbOnTotalSilence color={colorunidentify} />
              <text>Unidentifiable</text>
              <h6>{counts.unknown_count}</h6></motion.div>

            <motion.div style={{ border: "1px solid lightgray", padding: "13px", textAlign: "center" }}
              animate={{
                x: 0,
                rotate: 360,
                /*  backgroundColor: ['hsl(0, 100, 50)', 'white']*/
              }}
              initial={{
                x: 200,

              }}
              transition={{
                type: "spring",
                stiffness: 60
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "rgb(255, 99, 132)",
              }}
              whileTap={{
                scale: 0.9
              }}>
              <AiOutlinePercentage color={coloraccuracy} />
              <motiontext>Accuracy</motiontext>
              <h6>80%</h6></motion.div>



          </div>
        </div>
      </div>
    </div >
  );
};

export default LineChart;