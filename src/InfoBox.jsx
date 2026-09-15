import React from "react";
import "./InfoBox.css";

function InfoBox({ title, value, subtitle, positive }) {
  return (
    <div className="InfoBox">
      <p className="InfoBox_title">{title}</p>

      <h2 className="InfoBox_value">{value}</h2>

      <p className={`InfoBox_subtitle ${positive === true ? "positive" : ""} ${positive === false ? "negative" : ""}`}>
        {subtitle}
      </p>
    </div>
  );
}

export default InfoBox;