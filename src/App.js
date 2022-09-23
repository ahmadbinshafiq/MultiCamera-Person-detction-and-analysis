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
    <div         class="background_image"
    style={{
      backgroundImage: 'url("https://th.bing.com/th?id=OIF.Y2Li%2fQcXMk1Zv7B%2fjk7UHA&pid=ImgDet&rs=1")',
      backgroundSize: "cover",
      height: "100%",
      color: "#f5f5f5"
    }}>
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
    </div>
  );
}

export default App;