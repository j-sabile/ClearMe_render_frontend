import React from "react";
import Remark from "./Remark.jsx";
import { useState, useEffect } from "react";

function ViewRemarks({ handleCloseModal }) {
  const [adviser, setAdviser] = useState([]); // adviser info
  const [application, setApplication] = useState([]); // open application info
  const [remarks, setRemarks] = useState([]); // remarks info

  useEffect(() => {
    const e = async () => {
      await fetch(`${process.env.REACT_APP_API}/get-open-application`, { method: "GET", credentials: "include" })
        .then((response) => response.json())
        .then((body) => {
          setApplication(body.data);
          setRemarks(body.data.remarks);
        });

      // fetch adviser info
      await fetch(`${process.env.REACT_APP_API}/get-adviser-details`, { method: "GET", credentials: "include" })
        .then((response) => response.json())
        .then((body) => {
          setAdviser(body.adviser);
        });
    };
    e();
  }, []);

  const sortedRemarks = remarks.sort((a, b) => {
    if (a._id > b._id) {
      return -1; // Sort in descending order
    } else if (a._id < b._id) {
      return 1;
    }
    return 0;
  });

  function showRemarks() {
    let commenterIs = ""; // initialize commenterIs, containing the name of clearance officer/adviser
    return sortedRemarks.map((remark, index) => {
      if (remark.commenter === "admin") {
        commenterIs = "Clearance Officer Admin"; // hard code name of admin/clearance officer since admin is only 1 person
      } else {
        commenterIs = "Adviser " + adviser.first_name + " " + adviser.last_name; // name of adviser
      }
      return <Remark key={index} remark={remark.remarks} step={remark.step} date={remark.date.slice(0, 10)} commenter={commenterIs} />;
    });
  }

  return (
    <div className="whole-container">
      <button type="button" className="btn-close btn-right" aria-label="Close" onClick={handleCloseModal}></button>

      <h5>Returned Remarks</h5>

      <div className="remark-container">
        {/* show remarks.map() */}
        {application && adviser && showRemarks()}
      </div>
    </div>
  );
}

export default ViewRemarks;
