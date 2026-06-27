import { TEAM_MEMBERS } from "../data/teamMembers";

export function Team() {
  return (
    <section id="team">
      <div className="sec-label">02 · The Team</div>
      <h2 className="sec-title">Built for the students.</h2>
      <div className="team-grid" id="teamGrid">
        {TEAM_MEMBERS.map((m, i) => {
          if (m.isFounder) {
            return (
              <div key={i} className="founder-card">
                <div className="team-role">{m.role}</div>
                <div className="team-name" style={{ fontSize: "1.2rem" }}>{m.name}</div>
                <div className="team-desc" style={{ marginTop: "3px", color: "var(--g5)" }}>{m.dept}</div>
                <div className="founder-quote">{m.quote}</div>
              </div>
            );
          }
          return (
            <div key={i} className="team-card">
              <div className="team-role">{m.role}</div>
              <div className="team-name">{m.name}</div>
              <div className="team-desc">{m.dept}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Team;
