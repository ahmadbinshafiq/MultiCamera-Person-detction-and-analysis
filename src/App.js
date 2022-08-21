import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Analytics from "./pages/Analytics";
import Cameras from "./pages/Cameras";

function App() {
  return (
    <Router>
      <SideBar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/cameras" element={<Cameras />} />

          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
    </Router>
  );
}

export default App;