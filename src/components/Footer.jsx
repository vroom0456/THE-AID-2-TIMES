export function Footer() {
  return (
    <footer>
      <div className="footer-logo">THE AID <span>2</span> TIMES</div>
      <div className="footer-links">
        {/* To avoid breaking anything if the Contribute modal isn't ready, this just alerts for now */}
        <a href="#" onClick={(e) => { e.preventDefault(); alert("Contribute feature coming soon!"); }}>Submit Resources</a>
        <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T" target="_blank" rel="noreferrer">Join Channel</a>
      </div>
      <div className="footer-disc">
        <strong>Disclaimer:</strong> All study materials and external resources linked remain the intellectual property of their respective creators. THE AID 2 TIMES acts solely as an aggregator for student convenience. CBIT Hyderabad.
      </div>
    </footer>
  );
}

export default Footer;

