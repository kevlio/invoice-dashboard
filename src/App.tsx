import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { DashboardProvider } from "./context/DashboardContext";
import { MantineProvider} from "@mantine/core";

function App() {
  return (
    <div className="App">
      <MantineProvider>
        <DashboardProvider>
          <Navbar />
          <Outlet />
        </DashboardProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
