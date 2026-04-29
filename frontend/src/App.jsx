import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Landing from "./pages/Landing";
import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
