import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import FrameType from "./pages/FrameType";
import Analytics from "./pages/Analytics";
import Cameras from "./pages/Cameras";
import CameraType from "./pages/CameraType";
import Donutchartforframe from "./pages/Donutchartforframe";
import Heatmapfeed from "./components/heatmapfeed";
import NoHeatmapfeed from "./components/NoHeatmapfeed";

function App() {
  return (
    <div style={{ backgroundColor: "#F7F8FC" }}>
      <Router>
        <SideBar>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cameras" element={<Cameras />} />
            <Route path="/cameras/gridview" element={<Cameras />} />
            <Route path="/cameras/frameview" element={<FrameType />} />
            <Route path="/messages" element={<Donutchartforframe />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<> not found</>} />

            <Route path="/heatmap" element={<Heatmapfeed />} />
            <Route path="/Noheatmap" element={<NoHeatmapfeed />} />

            {/* <Route path="/Noheatmap" element={<Donutchartforframe />} /> */}
          </Routes>
        </SideBar>
        {/* <Routes>
          <Route path="/heatmap" element={<Heatmapfeed />} />
          <Route path="/Noheatmap" element={<NoHeatmapfeed />} />
        </Routes> */}
      </Router>
    </div>
  );
}

export default App;