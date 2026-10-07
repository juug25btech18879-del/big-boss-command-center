import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialContestants = [
  { id: 1, name: "Aarav", team: "Alpha", points: 120, status: "Active", nominated: false, immune: false },
  { id: 2, name: "Priya", team: "Alpha", points: 110, status: "Active", nominated: false, immune: false },
  { id: 3, name: "Rahul", team: "Beta", points: 95, status: "Active", nominated: false, immune: false },
  { id: 4, name: "Simran", team: "Beta", points: 90, status: "Active", nominated: false, immune: false },
  { id: 5, name: "Vikram", team: "Gamma", points: 85, status: "Active", nominated: false, immune: false },
  { id: 6, name: "Ananya", team: "Gamma", points: 80, status: "Active", nominated: false, immune: false },
  { id: 7, name: "Kabir", team: "Alpha", points: 70, status: "Active", nominated: false, immune: false },
  { id: 8, name: "Riya", team: "Beta", points: 65, status: "Active", nominated: false, immune: false },
];

const initialTasks = [
  { id: 1, title: "Treasure Hunt", assigned: "Alpha", completed: false },
  { id: 2, title: "Team Strategy", assigned: "Beta", completed: true },
  { id: 3, title: "Memory Challenge", assigned: "Gamma", completed: false },
];

function App() {
  const [contestants, setContestants] = useState(initialContestants);
  const [tasks, setTasks] = useState(initialTasks);
  const [captain, setCaptain] = useState(null);
  const [announcement, setAnnouncement] = useState("Welcome to the Tech House. Big Boss is watching.");
  const [announcementInput, setAnnouncementInput] = useState("");
  const [newTask, setNewTask] = useState("");
  const [taskTeam, setTaskTeam] = useState("Alpha");
  const [time, setTime] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning || time <= 0) return;
    const interval = setInterval(() => setTime((previous) => previous - 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const activeContestants = contestants.filter((c) => c.status === "Active");
  const leaderboard = useMemo(() => [...activeContestants].sort((a, b) => b.points - a.points), [activeContestants]);
  const nominees = contestants.filter((c) => c.nominated && c.status === "Active");
  const highestScorer = leaderboard[0];

  const changePoints = (id, amount) => {
    setContestants((prev) => prev.map((c) => c.id === id ? { ...c, points: Math.max(0, c.points + amount) } : c));
  };

  const nominate = (id) => {
    setContestants((prev) => prev.map((c) => {
      if (c.id !== id || c.immune) return c;
      return { ...c, nominated: !c.nominated };
    }));
  };

  const toggleImmunity = (id) => {
    setContestants((prev) => prev.map((c) => c.id === id ? { ...c, immune: !c.immune, nominated: c.immune ? c.nominated : false } : c));
  };

  const evictContestant = (id) => {
    setContestants((prev) => prev.map((c) => c.id === id ? { ...c, status: "Evicted", nominated: false } : c));
    if (captain === id) setCaptain(null);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), title: newTask.trim(), assigned: taskTeam, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const makeAnnouncement = () => {
    if (!announcementInput.trim()) return;
    setAnnouncement(announcementInput.trim());
    setAnnouncementInput("");
  };

  const resetHouse = () => {
    setContestants(initialContestants);
    setTasks(initialTasks);
    setCaptain(null);
    setAnnouncement("Welcome to the Tech House. Big Boss is watching.");
    setTime(600);
    setTimerRunning(false);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="logo">BIG <span>BOSS</span></div>
          <div className="subtitle">DIGITAL COMMAND CENTER</div>
        </div>
        <div className="live-status"><span className="live-dot" />LIVE</div>
      </header>

      <section className="announcement-banner">
        <div className="speaker">📢</div>
        <div className="announcement-content">
          <small>BIG BOSS ANNOUNCEMENT</small>
          <strong>{announcement}</strong>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><span className="stat-icon">👥</span><div><small>ACTIVE CONTESTANTS</small><h2>{activeContestants.length}</h2></div></div>
        <div className="stat-card"><span className="stat-icon">🏆</span><div><small>HIGHEST SCORER</small><h2>{highestScorer?.name || "-"}</h2><span>{highestScorer?.points || 0} points</span></div></div>
        <div className="stat-card danger-stat"><span className="stat-icon">🚨</span><div><small>NOMINEES</small><h2>{nominees.length}</h2></div></div>
        <div className="stat-card"><span className="stat-icon">📋</span><div><small>COMPLETED TASKS</small><h2>{tasks.filter((t) => t.completed).length}<span className="total">/{tasks.length}</span></h2></div></div>
      </section>

      <main className="dashboard">
        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">HOUSE CONTROL</span><h2>👥 Contestants</h2></div><span className="count-badge">{activeContestants.length} ACTIVE</span></div>
          <div className="contestant-list">
            {contestants.map((c) => (
              <div className={`contestant ${c.status === "Evicted" ? "evicted" : ""}`} key={c.id}>
                <div className="avatar">{c.name[0]}</div>
                <div className="contestant-info">
                  <div className="name-line">
                    <strong>{c.name}</strong>
                    {captain === c.id && <span className="captain-tag">👑 CAPTAIN</span>}
                    {c.immune && <span className="immune-tag">🛡 IMMUNE</span>}
                    {c.nominated && <span className="nominee-tag">NOMINATED</span>}
                  </div>
                  <span>Team {c.team} · {c.points} points · {c.status}</span>
                </div>
                {c.status === "Active" && <div className="point-controls"><button className="minus" onClick={() => changePoints(c.id, -10)}>−10</button><button className="plus" onClick={() => changePoints(c.id, 10)}>+10</button></div>}
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">LIVE RANKINGS</span><h2>🏆 Leaderboard</h2></div></div>
          <div className="leaderboard">
            {leaderboard.map((c, i) => (
              <div className={`leader-row ${i === 0 ? "first" : ""}`} key={c.id}>
                <div className="rank">{i === 0 ? "👑" : `#${i + 1}`}</div>
                <div className="leader-avatar">{c.name[0]}</div>
                <div className="leader-name"><strong>{c.name}</strong><span>Team {c.team}</span></div>
                <div className="leader-points">{c.points}<small>PTS</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">POWER CONTROL</span><h2>👑 Captaincy & Immunity</h2></div></div>
          <div className="captain-box"><div className="current-captain"><span>HOUSE CAPTAIN</span><strong>{captain ? contestants.find((c) => c.id === captain)?.name : "Not Assigned"}</strong></div></div>
          <div className="control-list">
            {activeContestants.map((c) => (
              <div className="control-row" key={c.id}>
                <span>{c.name}</span>
                <div>
                  <button className="small-btn captain-btn" onClick={() => setCaptain(c.id)}>👑 Captain</button>
                  <button className={`small-btn ${c.immune ? "remove-immunity" : "immunity-btn"}`} onClick={() => toggleImmunity(c.id)}>{c.immune ? "Remove Immunity" : "🛡 Immunity"}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">MISSION CONTROL</span><h2>📋 Task Management</h2></div></div>
          <div className="task-create">
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter new task..." />
            <select value={taskTeam} onChange={(e) => setTaskTeam(e.target.value)}><option>Alpha</option><option>Beta</option><option>Gamma</option></select>
            <button onClick={addTask}>+ Add Task</button>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div className={`task ${task.completed ? "completed" : ""}`} key={task.id}>
                <div className="task-check">{task.completed ? "✓" : "○"}</div>
                <div className="task-info"><strong>{task.title}</strong><span>Team {task.assigned}</span></div>
                <button className="complete-btn" onClick={() => toggleTask(task.id)}>{task.completed ? "Completed" : "Mark Complete"}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel danger-panel">
          <div className="panel-header"><div><span className="eyebrow">EVICTION WATCH</span><h2>🚨 Danger Zone</h2></div><span className="danger-count">{nominees.length} NOMINATED</span></div>
          {nominees.length === 0 ? <div className="empty-state"><div>🛡️</div><strong>No contestants in danger</strong><span>Nominate contestants to move them here.</span></div> :
            <div className="danger-list">{nominees.map((c) => (
              <div className="danger-row" key={c.id}>
                <div className="danger-avatar">{c.name[0]}</div>
                <div><strong>{c.name}</strong><span>Team {c.team} · {c.points} points</span></div>
                <button className="evict-btn" onClick={() => evictContestant(c.id)}>🚪 EVICT</button>
              </div>
            ))}</div>}
        </section>

        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">VOTING CONTROL</span><h2>⚠️ Nominations</h2></div></div>
          <div className="nomination-list">
            {activeContestants.map((c) => (
              <div className="nomination-row" key={c.id}>
                <div><strong>{c.name}</strong><span>{c.immune ? "🛡 Immune" : c.nominated ? "🚨 Nominated" : "Eligible"}</span></div>
                <button disabled={c.immune} className={`nominate-btn ${c.nominated ? "nominated" : ""}`} onClick={() => nominate(c.id)}>{c.immune ? "IMMUNE" : c.nominated ? "REMOVE" : "NOMINATE"}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><div><span className="eyebrow">HOUSE BROADCAST</span><h2>📢 Big Boss Announcement</h2></div></div>
          <textarea value={announcementInput} onChange={(e) => setAnnouncementInput(e.target.value)} placeholder="Type your announcement..." />
          <button className="broadcast-btn" onClick={makeAnnouncement}>📢 BROADCAST TO HOUSE</button>
        </section>

        <section className="panel timer-panel">
          <div className="panel-header"><div><span className="eyebrow">MISSION CLOCK</span><h2>⏱ Task Timer</h2></div></div>
          <div className="timer"><div className="timer-display">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div><div className="timer-label">{timerRunning ? "TASK IN PROGRESS" : time === 0 ? "TIME UP" : "READY"}</div></div>
          <div className="timer-controls">
            <button onClick={() => setTimerRunning(true)}>▶ START</button>
            <button onClick={() => setTimerRunning(false)}>⏸ PAUSE</button>
            <button onClick={() => { setTimerRunning(false); setTime(600); }}>↻ RESET</button>
          </div>
        </section>
      </main>

      <footer>
        <div><strong>BIG BOSS COMMAND CENTER</strong><span>Tech House • Mission Control</span></div>
        <button className="reset-house" onClick={resetHouse}>↻ Reset House</button>
      </footer>
    </div>
  );
}

export default App;
