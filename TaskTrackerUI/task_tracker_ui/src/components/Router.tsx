import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Routers;
