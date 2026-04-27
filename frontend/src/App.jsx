import { BrowserRouter } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>
  );
}
