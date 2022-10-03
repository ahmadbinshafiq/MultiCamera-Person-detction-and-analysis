import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import FrameType from "./pages/FrameType";
import Analytics from "./pages/Analytics";
import Cameras from "./pages/Cameras";
import CameraType from "./pages/CameraType";

function App() {
  return (

    <Router>
      <SideBar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/cameras/gridview" element={<Cameras />} />
          <Route path="/cameras/frameview" element={<FrameType />} />
          <Route path="/messages" element={<FrameType />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/saved" element={<CameraType />} />


          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
    </Router>

  );
}

export default App;