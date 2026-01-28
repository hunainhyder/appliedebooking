import QRCode from "react-qr-code";
import "./Ticket.css";

const Ticket = ({ name, ticketId, date = "09.02.2026", time = "11:00 AM - 4:00 PM" }) => {
  const verificationLink = `${window.location.origin}/verify/${ticketId}`;

  return (
    <div className="ticket-container">
      <div className="left-section">
        
        <div className="header-row">
          <div className="title-block">
            <h1 className="main-title">BATCH OF 22</h1>
            <h2 className="sub-title">ANNUAL CELEBRATION’ 26</h2>
          </div>

          <div className="icon-block">
            <img src="/airplane.png" alt="Plane Icon" className="plane-img" />
          </div>

          <div className="university-block">
            <p>DEPT OF</p>
            <p>APPLIED</p>
            <p>CHEMISTRY</p>
            <p className="university-text">UNIVERSITY</p>
            <p className="university-text">OF</p>
            <p className="university-text">KARACHI</p>
          </div>
        </div>

        <div className="footer-row">
          <div className="info-item">
            <span className="label">DATE:</span>
            <span className="value">{date}</span>
          </div>
          <div className="info-item venue-item">
            <span className="label">VENUE:</span>
            <span className="value">HAMALIA PALACE, NEAR MASKAN</span>
          </div>
          <div className="info-item">
            <span className="label">SEAT:</span>
            <span className="value">FIRST CLASS</span>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="stub-info">
          <div className="stub-group">
            <span className="stub-label">NAME:</span>
            <span className="stub-value highlight-name">{name || "GUEST"}</span>
          </div>
          
          <div className="stub-group">
            <span className="stub-label">FLIGHT:</span>
            <span className="stub-value">{ticketId}</span>
          </div>

          <div className="stub-group">
            <span className="stub-label">DATE:</span>
            <span className="stub-value">{date}</span>
          </div>

          <div className="stub-group">
            <span className="stub-label">TIME:</span>
            <span className="stub-value">{time}</span>
          </div>
        </div>

        <div className="qr-block">
          <QRCode 
             value={verificationLink} 
             size={60} 
             bgColor="#FFFFFF"
             fgColor="#000000"
             style={{ height: "auto", maxWidth: "80px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Ticket;