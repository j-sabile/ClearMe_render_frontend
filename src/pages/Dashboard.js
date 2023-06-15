import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [openApplication, setOpenApplication] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/view-student-info`, { method: "POST", credentials: "include" })
      .then((response) => response.json())
      .then((body) => {
        setOpenApplication(body.open_application);
      });
  }, []);

  function showContent() {
    if (openApplication) {
      return (
        <div className="whole-container">
          <p10>You have a pending clearance application.</p10>
          <button type="button" className="glass-effect-10">
            <Link to="/student/view-application" className="nav-link">
              View Clearance Application
            </Link>
          </button>
          <br />
        </div>
      );
    } else {
      return (
        <div className="whole-container">
          <p9>You have no pending clearance application.</p9>
          <button type="button" className="glass-effect-10">
            <Link to="/student/create-application" className="nav-link">
              Create Clearance Application
            </Link>
          </button>
          <br />
        </div>
      );
    }
  }

  return <>{showContent()}</>;
}
