import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import FrameType from "./pages/FrameType";
import Analytics from "./pages/Analytics";
import Cameras from "./pages/Cameras";
import CameraType from "./pages/CameraType";
import Messages from "./pages/Messages";

function App() {
  return (
<div style={{backgroundColor:"#F7F8FC"}}>
    <Router>
      <SideBar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/cameras/gridview" element={<Cameras />} />
          <Route path="/cameras/frameview" element={<FrameType />} />
          <Route path="/messages" element={<FrameType />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/saved" element={<Messages />} />


          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
    </Router>
</div>
  );
}

export default App;