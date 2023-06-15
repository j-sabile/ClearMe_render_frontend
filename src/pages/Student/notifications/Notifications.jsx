import SingleNotif from "./SingleNotif";
import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [hasOpenApplication, setHasOpenApplication] = useState(null); // application id from student
  const [application, setApplication] = useState(null); // application info from applications collection
  const [clearedApplications, setClearedApplications] = useState([]); // list of cleared applications

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/view-student-info`, { method: "POST", credentials: "include" });

        const body = await response.json();
        const applicationId = body.open_application;
        setHasOpenApplication(applicationId);

        if (hasOpenApplication) {
          const applicationResponse = await fetch(`${process.env.REACT_APP_API}/view-open-application-info`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ applicationId: applicationId }),
          });

          const payload = await applicationResponse.json();
          if (payload && payload.data) {
            setApplication(payload.data);
            //alert("Successfully found application info!");
          } else {
            setApplication(null);
            alert("Failed to find application info.");
          }
        }

        // get cleared applications

        await fetch(`${process.env.REACT_APP_API}/get-cleared-applications`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((body) => {
            setClearedApplications(body.data);
          });
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }

    fetchData();
  }, [hasOpenApplication]);

  function showReturnedApplication() {
    if (hasOpenApplication && application && application.status === "returned") {
      return <SingleNotif id={application._id} status={application.status} step={application.current_step} />;
    } else {
      // you have no notifications alert using bootstrap
      return (
        <div className="alert alert-dark" role="alert">
          You have no returned application notification.
        </div>
      );
    }
  }

  function showClearedApplications() {
    if (clearedApplications.length > 0) {
      return clearedApplications.map((application) => {
        return <SingleNotif key={application._id} id={application._id} status={application.status} step={application.current_step} />;
      });
    } else {
      return (
        <div className="alert alert-dark" role="alert">
          You have no cleared application notifications.
        </div>
      );
    }
  }

  return (
    <div className="whole-container">
      <h11 id="notification">Notifications</h11>
      <div className="notif-container">
        <h6 className="text-muted">Returned Application Notification</h6>
        {showReturnedApplication()}
        <br></br>
        <h6 className="text-muted">Cleared Application Notifications</h6>
        {showClearedApplications()}
      </div>
    </div>
  );
}
