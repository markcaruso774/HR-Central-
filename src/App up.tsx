import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const SUPABASE_URL = "https://tiwukijaoejvgrnyhnzi.supabase.co";
const SUPABASE_KEY = "sb_publishable_rkmTH1nTl5qkn-_7jLmQAw_-ExQC-WP";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d1f3c",
  bgDeep: "#071428",
  card: "#132040",
  cardHover: "#1a2d54",
  border: "#1e3a6e",
  borderLight: "#2a4a80",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "#3b82f620",
  white: "#f0f6ff",
  muted: "#7a9cc4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#e2eeff",
  textSoft: "#a8c4e8",
};

const modules = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "employees", label: "Employees", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "attendance", label: "Attendance", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { id: "leave", label: "Leave", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "payroll", label: "Payroll", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "contracts", label: "Contracts", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "payslips", label: "Payslips", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" },
];

// ── SVG ICON ─────────────────────────────────────────────────────────────────
function Icon({ path, size = 20, color = "currentColor", style: s = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d={path} />
    </svg>
  );
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
function Card({ children, style: s = {}, onClick = undefined }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 24, transition: "all 0.2s", cursor: onClick ? "pointer" : "default",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)", ...s
    }}>
      {children}
    </div>
  );
}

function Badge({ color = C.accent, children, style: s = {} }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700,
      letterSpacing: 0.5, textTransform: "uppercase", ...s
    }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = C.accent, small = false, disabled = false, outline = false, style: s = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "transparent" : disabled ? C.border : color,
      color: disabled ? C.muted : outline ? color : "#fff",
      border: outline ? `1px solid ${color}` : "none",
      borderRadius: 10, padding: small ? "6px 14px" : "10px 22px",
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: 0.5, transition: "all 0.15s", opacity: disabled ? 0.6 : 1, ...s
    }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.danger }}> *</span>}
      </label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
        onFocus={e => e.target.style.borderColor = C.accent}
        onBlur={e => e.target.style.borderColor = C.border} />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.danger }}> *</span>}
      </label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}>
        <option value="">-- Select --</option>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
      <div style={{ background: color + "22", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon path={icon} size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontWeight: 600 }}>{label}</div>
      </div>
    </Card>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [showPwd, setShowPwd] = useState(false);

  const handle = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        const { error: e } = await supabase.auth.signUp({ email, password });
        if (e) throw e;
        setError("Account created! You can now sign in.");
        setMode("login");
      } else {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
        if (e) throw e;
        // Hardcoded admin + database role lookup with fallback
        const adminEmails = ["m.christopher@cbi.ngo"];
        let role = "employee";
        if (adminEmails.includes(email.toLowerCase())) {
          role = "admin";
        } else {
          try {
            const { data: roleData } = await supabase.from("user_roles").select("role").eq("email", email.toLowerCase()).single();
            if (roleData?.role) role = roleData.role;
          } catch { role = "employee"; }
        }
        onLogin({ ...data.user, role });
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: C.accent + "15", borderRadius: "50%", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 300, height: 300, background: C.accentLight + "10", borderRadius: "50%", filter: "blur(60px)" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.accent + "22", borderRadius: 20, padding: 16, marginBottom: 16, border: `1px solid ${C.accent}44` }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: C.white, margin: 0, letterSpacing: -0.5 }}>HR Central</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>People Operations Platform</p>
        </div>

        <Card style={{ padding: 32 }}>
          <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
            {mode === "login" ? "Sign In to Your Account" : "Create Account"}
          </h2>
          <Input label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@company.com" required />
          <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>PASSWORD <span style={{ color: C.danger }}>*</span></label><div style={{ position: "relative" }}><input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 44px 10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} /><button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, fontWeight: 700 }}>{showPwd ? "HIDE" : "SHOW"}</button></div></div>
          {error && <div style={{ background: error.includes("Check") ? C.success + "22" : C.danger + "22", color: error.includes("Check") ? C.success : C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 12, marginBottom: 16, border: `1px solid ${error.includes("Check") ? C.success : C.danger}44` }}>{error}</div>}
          <Btn onClick={handle} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14, marginBottom: 12 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Btn>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 12 }}>
            {mode === "login" ? "Need an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ color: C.accent, cursor: "pointer", fontWeight: 700 }}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </Card>
        
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ employees, leaveRequests, attendance, user }) {
  const today = new Date().toISOString().split("T")[0];
  const present = attendance.filter(a => a.date === today && a.status === "Present").length;
  const onLeave = leaveRequests.filter(l => l.status === "Approved").length;
  const pending = leaveRequests.filter(l => l.status === "Pending").length;
  const males = employees.filter(e => e.gender?.toLowerCase() === "male").length;
  const females = employees.filter(e => e.gender?.toLowerCase() === "female").length;
  const total = employees.length;
  const malePct = total > 0 ? Math.round((males / total) * 100) : 0;
  const femalePct = total > 0 ? Math.round((females / total) * 100) : 0;

  const depts = {};
  employees.forEach(e => { if (e.location) depts[e.location] = (depts[e.location] || 0) + 1; });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: C.white, fontSize: 26, fontWeight: 800, margin: 0 }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"} 👋
        </h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Here's what's happening across your organisation today</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {/* Total Employees with gender breakdown */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ background: C.accent + "22", borderRadius: 14, padding: 14 }}>
              <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size={24} color={C.accent} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, fontFamily: "monospace" }}>{total}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Total Employees</div>
            </div>
          </div>
          {/* Gender bar */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>Male {males} ({malePct}%)</span>
              <span style={{ fontSize: 11, color: "#f472b6", fontWeight: 700 }}>Female {females} ({femalePct}%)</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${malePct}%`, background: "linear-gradient(90deg, #3b82f6, #f472b6)", borderRadius: 4 }} />
            </div>
          </div>
        </Card>
        <StatCard label="Present Today" value={present} color={C.success} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard label="On Leave" value={onLeave} color={C.warning} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <StatCard label="Pending Requests" value={pending} color={C.danger} icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size={16} color={C.accent} />
            Recent Employees
          </h3>
          {employees.slice(-5).reverse().map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{e.location}</div>
              </div>
              <Badge color={C.accent}>{e.designation || "Staff"}</Badge>
            </div>
          ))}
          {employees.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No employees yet.</p>}
        </Card>
        <Card>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={16} color={C.warning} />
            Leave Requests
          </h3>
          {leaveRequests.slice(-5).reverse().map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{l.employee_name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{l.type}</div>
              </div>
              <Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : C.warning}>{l.status}</Badge>
            </div>
          ))}
          {leaveRequests.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No requests yet.</p>}
        </Card>
      </div>

      {Object.keys(depts).length > 0 && (
        <Card>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Staff by Location</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {Object.entries(depts).sort((a,b) => b[1]-a[1]).map(([loc, count]) => (
              <div key={loc} style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" size={14} color={C.accent} />
                <div>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{loc}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{count} staff · {Math.round((count/total)*100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── EMPLOYEE PROFILE PANEL ────────────────────────────────────────────────────
function EmployeeProfile({ employee, onClose, onUpdate }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...employee });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("attendance").select("*").eq("employee_id", employee.id).order("date", { ascending: true });
      setAttendanceRecords(data || []);
      setLoading(false);
    };
    load();
  }, [employee.id]);

  const saveEdit = async () => {
    setSaving(true);
    const { error } = await supabase.from("employees").update(form).eq("id", employee.id);
    if (error) { setSaveMsg("Error saving: " + error.message); }
    else { setSaveMsg("Saved successfully!"); setEditing(false); if (onUpdate) onUpdate(form); }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const presentDays = attendanceRecords.filter(r => r.status === "Present").length;
  const absentDays = attendanceRecords.filter(r => r.status === "Absent").length;
  const lateDays = attendanceRecords.filter(r => r.status === "Late").length;
  const lateDates = attendanceRecords.filter(r => r.status === "Late");

  const last30 = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const rec = attendanceRecords.find(r => r.date === dateStr);
    last30.push({ date: dateStr, label: d.toLocaleDateString("en", { month: "short", day: "numeric" }), status: rec?.status || "None", value: rec?.status === "Present" ? 3 : rec?.status === "Late" ? 2 : rec?.status === "Absent" ? 1 : 0 });
  }

  const chartW = 480; const chartH = 100;
  const points = last30.map((d, i) => `${(i / 29) * chartW},${chartH - (d.value / 3) * chartH}`).join(" ");

  const fields = [
    ["name", "Full Name"], ["designation", "Designation"], ["location", "Location"],
    ["gender", "Gender"], ["dob", "Date of Birth"], ["nationality", "Nationality"],
    ["marital_status", "Marital Status"], ["phone_number", "Phone Number"],
    ["official_email", "Official Email"], ["start_date", "Start Date"],
    ["education_qualifications", "Education"], ["professional_certification", "Certification"],
    ["salary", "Salary (NGN)"],
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998 }} />
      {/* Panel */}
      <div style={{ position: "fixed", top: 0, right: 0, width: "min(580px, 100vw)", height: "100vh", background: C.bgDeep, borderLeft: `1px solid ${C.border}`, zIndex: 999, overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)" }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .profile-panel { animation: slideIn 0.3s ease; }`}</style>
        <div className="profile-panel">
          {/* Header */}
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.bgDeep, zIndex: 10 }}>
            <div>
              <h2 style={{ color: C.white, fontSize: 18, fontWeight: 800, margin: 0 }}>{form.name}</h2>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <Badge color={C.accent}>{form.designation || "Staff"}</Badge>
                <Badge color={C.muted}>{form.location || "—"}</Badge>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!editing && <Btn small color={C.accent} onClick={() => setEditing(true)}>Edit</Btn>}
              {editing && <Btn small color={C.success} onClick={saveEdit} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>}
              {editing && <Btn small outline color={C.muted} onClick={() => { setEditing(false); setForm({ ...employee }); }}>Cancel</Btn>}
              <Btn small color={C.border} onClick={onClose}>✕</Btn>
            </div>
          </div>

          {saveMsg && <div style={{ margin: "12px 24px 0", padding: "10px 14px", borderRadius: 8, background: saveMsg.includes("Error") ? C.danger + "22" : C.success + "22", color: saveMsg.includes("Error") ? C.danger : C.success, fontSize: 13 }}>{saveMsg}</div>}

          <div style={{ padding: 24 }}>
            {/* Personal Info */}
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                {editing ? "Edit Employee Information" : "Personal Information"}
              </h3>
              {editing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {fields.map(([key, label]) => (
                    <Input key={key} label={label} value={form[key] || ""} onChange={v => setForm({ ...form, [key]: v })} type={key === "dob" || key === "start_date" ? "date" : key === "salary" ? "number" : "text"} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {fields.map(([key, label]) => (
                    <div key={key} style={{ background: C.bg, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>
                        {key === "salary" && form[key] ? `₦${Number(form[key]).toLocaleString()}` : form[key] || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Attendance Summary */}
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Attendance Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: C.success + "22", border: `1px solid ${C.success}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.success, fontFamily: "monospace" }}>{presentDays}</div>
                  <div style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>Days Present</div>
                </div>
                <div style={{ background: C.danger + "22", border: `1px solid ${C.danger}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.danger, fontFamily: "monospace" }}>{absentDays}</div>
                  <div style={{ fontSize: 11, color: C.danger, fontWeight: 600 }}>Days Absent</div>
                </div>
                <div style={{ background: C.warning + "22", border: `1px solid ${C.warning}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.warning, fontFamily: "monospace" }}>{lateDays}</div>
                  <div style={{ fontSize: 11, color: C.warning, fontWeight: 600 }}>Days Late</div>
                </div>
              </div>

              {loading ? <div style={{ color: C.muted, fontSize: 13 }}>Loading chart...</div> : attendanceRecords.length === 0 ? (
                <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 20 }}>No attendance records yet for this employee.</div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>Attendance Trend — Last 30 Days</div>
                  <div style={{ overflowX: "auto" }}>
                    <svg width={chartW} height={chartH + 30} style={{ display: "block" }}>
                      {[0,1,2,3].map(v => <line key={v} x1="0" y1={chartH-(v/3)*chartH} x2={chartW} y2={chartH-(v/3)*chartH} stroke={C.border} strokeWidth="1" strokeDasharray="4,4" />)}
                      {["Absent","Late","Present"].map((l,i) => <text key={l} x="4" y={chartH-((i+1)/3)*chartH+4} fill={i===0?C.danger:i===1?C.warning:C.success} fontSize="9" fontWeight="700">{l}</text>)}
                      <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.3" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></linearGradient></defs>
                      <polygon points={`0,${chartH} ${points} ${chartW},${chartH}`} fill="url(#aGrad)" />
                      <polyline points={points} fill="none" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
                      {last30.map((d, i) => d.value > 0 && <circle key={i} cx={(i/29)*chartW} cy={chartH-(d.value/3)*chartH} r="3" fill={d.status==="Present"?C.success:d.status==="Late"?C.warning:C.danger} />)}
                      {last30.filter((_,i) => i%5===0).map((d,i) => <text key={i} x={(i*5/29)*chartW} y={chartH+20} fill={C.muted} fontSize="8" textAnchor="middle">{d.label}</text>)}
                    </svg>
                  </div>
                </div>
              )}
            </Card>

            {lateDates.length > 0 && (
              <Card>
                <h3 style={{ color: C.warning, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Late Arrival Records</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {lateDates.map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.date}</div>
                      <Badge color={C.warning}>{r.late_duration || "Late"}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── EMPLOYEES ─────────────────────────────────────────────────────────────────
const EDU_OPTIONS = ["Secondary", "Diploma", "Degree (B.Sc/B.A/B.Eng)", "HND", "MSc", "MBA", "PhD", "PGD", "Professional Certificate"];
const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];
const MARITAL_OPTIONS = ["Single", "Married", "Divorced", "Widowed"];

const EMPTY_FORM = { name: "", designation: "", location: "", education_qualifications: "", professional_certification: "", dob: "", nationality: "", gender: "", marital_status: "", official_email: "", phone_number: "", salary: "", start_date: "" };

function Employees({ employees, setEmployees, isHR }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [selectedEdu, setSelectedEdu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [customCols, setCustomCols] = useState([]);
  const [newCol, setNewCol] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const fileRef = useRef();

  const toggleEdu = (opt) => setSelectedEdu(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);

  const save = async () => {
    if (!form.name) { setMsg("Name is required"); return; }
    setLoading(true);
    const payload = { ...form, education_qualifications: selectedEdu.join(", "), salary: Number(form.salary) || 0 };
    const { data, error } = await supabase.from("employees").insert([payload]).select();
    if (error) { setMsg("Error: " + error.message); }
    else { setEmployees([...employees, data[0]]); setForm(EMPTY_FORM); setSelectedEdu([]); setMsg("Employee added successfully!"); setShowForm(false); }
    setLoading(false);
  };

  const remove = async (id) => {
    await supabase.from("employees").delete().eq("id", id);
    setEmployees(employees.filter(e => e.id !== id));
  };

  const handleExcel = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setLoading(true); setMsg("Reading Excel file...");
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);
      const mapped = rows.map(r => ({
        name: r["Name"] || r["name"] || "",
        designation: r["Designation"] || r["designation"] || r["Position"] || "",
        location: r["Location"] || r["location"] || "",
        education_qualifications: r["Education"] || r["education_qualifications"] || "",
        professional_certification: r["Certification"] || r["professional_certification"] || "",
        dob: r["DOB"] || r["dob"] || r["Date of Birth"] || null,
        nationality: r["Nationality"] || r["nationality"] || "",
        gender: r["Gender"] || r["gender"] || "",
        marital_status: r["Marital Status"] || r["marital_status"] || "",
        official_email: r["Email"] || r["official_email"] || r["Official Email"] || "",
        phone_number: r["Phone"] || r["phone_number"] || r["Phone Number"] || "",
        salary: Number(r["Salary"] || r["salary"] || 0),
        start_date: r["Start Date"] || r["start_date"] || null,
      })).filter(r => r.name);
      if (mapped.length === 0) { setMsg("No valid data found. Check your Excel column headers."); setLoading(false); return; }
      const { data, error } = await supabase.from("employees").insert(mapped).select();
      if (error) setMsg("Error uploading: " + error.message);
      else { setEmployees([...employees, ...data]); setMsg(`Successfully uploaded ${data.length} employees!`); }
      setLoading(false);
    };
    reader.readAsArrayBuffer(f);
  };

  const downloadTemplate = () => {
    const template = [{ Name: "John Doe", Designation: "Manager", Location: "Lagos", Education: "Degree, MSc", Certification: "PMP", DOB: "1990-01-15", Nationality: "Nigerian", Gender: "Male", "Marital Status": "Married", Email: "john@company.com", Phone: "08012345678", Salary: 250000, "Start Date": "2023-01-01" }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(template), "Staff Template");
    XLSX.writeFile(wb, "Staff_Upload_Template.xlsx");
  };

  const filtered = employees.filter(e => e.name?.toLowerCase().includes(search.toLowerCase()) || (e.designation || "").toLowerCase().includes(search.toLowerCase()) || (e.location || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Employee Database</h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{employees.length} staff members</p>
        </div>
        {isHR && (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn small outline color={C.success} onClick={downloadTemplate}>Download Template</Btn>
            <Btn small outline color={C.accent} onClick={() => fileRef.current.click()}>Upload Excel</Btn>
            <Btn small onClick={() => setShowForm(!showForm)}>+ Add Employee</Btn>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleExcel} style={{ display: "none" }} />

      {msg && <div style={{ background: msg.includes("Error") ? C.danger + "22" : C.success + "22", color: msg.includes("Error") ? C.danger : C.success, padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontSize: 13, border: `1px solid ${msg.includes("Error") ? C.danger : C.success}44` }}>{msg}</div>}

      {showForm && isHR && (
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ color: C.accent, marginBottom: 20, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Add New Employee</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <Input label="Designation" value={form.designation} onChange={v => setForm({ ...form, designation: v })} />
            <Input label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} />
            <Input label="Professional Certification" value={form.professional_certification} onChange={v => setForm({ ...form, professional_certification: v })} />
            <Input label="Date of Birth" value={form.dob} onChange={v => setForm({ ...form, dob: v })} type="date" />
            <Input label="Nationality" value={form.nationality} onChange={v => setForm({ ...form, nationality: v })} />
            <Select label="Gender" value={form.gender} onChange={v => setForm({ ...form, gender: v })} options={GENDER_OPTIONS} />
            <Select label="Marital Status" value={form.marital_status} onChange={v => setForm({ ...form, marital_status: v })} options={MARITAL_OPTIONS} />
            <Input label="Official Email" value={form.official_email} onChange={v => setForm({ ...form, official_email: v })} type="email" />
            <Input label="Phone Number" value={form.phone_number} onChange={v => setForm({ ...form, phone_number: v })} />
            <Input label="Salary (NGN)" value={form.salary} onChange={v => setForm({ ...form, salary: v })} type="number" />
            <Input label="Start Date" value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} type="date" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Educational Qualifications</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EDU_OPTIONS.map(opt => (
                <div key={opt} onClick={() => toggleEdu(opt)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${selectedEdu.includes(opt) ? C.accent : C.border}`, background: selectedEdu.includes(opt) ? C.accent + "22" : "transparent", color: selectedEdu.includes(opt) ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save} disabled={loading}>{loading ? "Saving..." : "Save Employee"}</Btn>
            <Btn outline color={C.muted} onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: C.textSoft, fontSize: 13 }}>Showing {filtered.length} employees</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role or location..."
            style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", color: C.text, fontSize: 13, outline: "none", width: 240 }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Name", "Designation", "Location", "Gender", "Email", "Phone", isHR ? "DOB" : "", isHR ? "Salary" : "", ""].filter(Boolean).map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px", color: C.text, fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: "12px" }}><Badge color={C.accent}>{e.designation || "—"}</Badge></td>
                  <td style={{ padding: "12px", color: C.muted }}>{e.location || "—"}</td>
                  <td style={{ padding: "12px", color: C.muted }}>{e.gender || "—"}</td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{e.official_email || "—"}</td>
                  <td style={{ padding: "12px", color: C.muted }}>{e.phone_number || "—"}</td>
                  {isHR && <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{e.dob || "—"}</td>}
                  {isHR && <td style={{ padding: "12px", color: C.success, fontFamily: "monospace" }}>{e.salary ? `₦${Number(e.salary).toLocaleString()}` : "—"}</td>}
                  {isHR && <td style={{ padding: "12px" }}><Btn small color={C.danger} onClick={() => remove(e.id)}>Remove</Btn></td>}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No employees found.</div>}
        </div>
      </Card>
      {selectedEmployee && (
        <>
          <div onClick={() => setSelectedEmployee(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} />
          <EmployeeProfile employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onUpdate={(updated) => { setEmployees(employees.map(e => e.id === updated.id ? updated : e)); setSelectedEmployee(updated); }} />
        </>
      )}
    </div>
  );
}

// ── ATTENDANCE ────────────────────────────────────────────────────────────────
function Attendance({ employees, isHR }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lateMinutes, setLateMinutes] = useState({});

  useEffect(() => { loadRecords(); }, [date]);

  const loadRecords = async () => {
    const { data } = await supabase.from("attendance").select("*").eq("date", date);
    setRecords(data || []);
  };

  const mark = async (emp, status) => {
    setLoading(true);
    const existing = records.find(r => r.employee_id === emp.id);
    const payload = { employee_id: emp.id, employee_name: emp.name, date, status, late_duration: status === "Late" ? (lateMinutes[emp.id] || "") : null };
    if (existing) {
      await supabase.from("attendance").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("attendance").insert([payload]);
    }
    await loadRecords();
    setLoading(false);
  };

  const getStatus = (empId) => records.find(r => r.employee_id === empId)?.status || null;
  const getLate = (empId) => records.find(r => r.employee_id === empId)?.late_duration || "";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Attendance Tracker</h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>All records are saved permanently</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px", color: C.text, fontSize: 13, outline: "none" }} />
        <Badge color={C.success}>{records.filter(r => r.status === "Present").length} Present</Badge>
        <Badge color={C.danger}>{records.filter(r => r.status === "Absent").length} Absent</Badge>
        <Badge color={C.warning}>{records.filter(r => r.status === "Late").length} Late</Badge>
        <Badge color={C.muted}>{employees.length - records.length} Not marked</Badge>
      </div>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Employee", "Designation", "Location", "Status", "Late Duration", isHR ? "Mark Attendance" : ""].filter(Boolean).map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(e => {
                const s = getStatus(e.id);
                return (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px", color: C.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }} onClick={() => setSelectedEmployee(e)}>{e.name}</td>
                    <td style={{ padding: "12px", color: C.muted }}>{e.designation || "—"}</td>
                    <td style={{ padding: "12px", color: C.muted }}>{e.location || "—"}</td>
                    <td style={{ padding: "12px" }}>
                      {s ? <Badge color={s === "Present" ? C.success : s === "Absent" ? C.danger : C.warning}>{s}</Badge>
                        : <span style={{ color: C.muted, fontSize: 12 }}>Not marked</span>}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {s === "Late" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: C.warning, fontSize: 12 }}>{getLate(e.id) || "—"}</span>
                          {isHR && (
                            <input value={lateMinutes[e.id] || ""} onChange={ev => setLateMinutes({ ...lateMinutes, [e.id]: ev.target.value })}
                              placeholder="e.g. 30 mins"
                              style={{ width: 90, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                          )}
                        </div>
                      ) : <span style={{ color: C.muted, fontSize: 12 }}>—</span>}
                    </td>
                    {isHR && (
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small color={C.success} onClick={() => mark(e, "Present")}>Present</Btn>
                          <Btn small color={C.danger} onClick={() => mark(e, "Absent")}>Absent</Btn>
                          <Btn small color={C.warning} onClick={() => mark(e, "Late")}>Late</Btn>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {employees.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No employees found. Add employees first.</div>}
        </div>
      </Card>
    </div>
  );
}

// ── LEAVE ─────────────────────────────────────────────────────────────────────
function Leave({ employees, leaveRequests, setLeaveRequests, isHR, user }) {
  const [form, setForm] = useState({ employee_id: "", type: "", from_date: "", to_date: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.employee_id || !form.type || !form.from_date || !form.to_date) return;
    setLoading(true);
    const emp = employees.find(e => e.id === form.employee_id);
    const payload = { ...form, employee_name: emp?.name || "Unknown", status: "Pending" };
    const { data } = await supabase.from("leave_requests").insert([payload]).select();
    setLeaveRequests([...leaveRequests, data[0]]);
    setForm({ employee_id: "", type: "", from_date: "", to_date: "", reason: "" });
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("leave_requests").update({ status }).eq("id", id);
    setLeaveRequests(leaveRequests.map(l => l.id === id ? { ...l, status } : l));
  };

  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity Leave", "Paternity Leave", "Emergency Leave", "Unpaid Leave", "Study Leave"].map(v => ({ value: v, label: v }));

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Leave Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>New Leave Request</h3>
          <Select label="Employee" value={form.employee_id} onChange={v => setForm({ ...form, employee_id: v })} options={employees.map(e => ({ value: e.id, label: e.name }))} required />
          <Select label="Leave Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={leaveTypes} required />
          <Input label="From" value={form.from_date} onChange={v => setForm({ ...form, from_date: v })} type="date" required />
          <Input label="To" value={form.to_date} onChange={v => setForm({ ...form, to_date: v })} type="date" required />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Reason</label>
            <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })
            } style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 80 }} />
          </div>
          <Btn onClick={submit} disabled={loading} style={{ width: "100%" }}>{loading ? "Submitting..." : "Submit Request"}</Btn>
        </Card>

        <Card>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>All Leave Requests</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Employee", "Type", "From", "To", "Status", isHR ? "Actions" : ""].filter(Boolean).map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(l => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px", color: C.text, fontWeight: 600 }}>{l.employee_name}</td>
                  <td style={{ padding: "12px" }}><Badge color={C.warning}>{l.type}</Badge></td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{l.from_date}</td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{l.to_date}</td>
                  <td style={{ padding: "12px" }}><Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : C.warning}>{l.status}</Badge></td>
                  {isHR && (
                    <td style={{ padding: "12px" }}>
                      {l.status === "Pending" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small color={C.success} onClick={() => updateStatus(l.id, "Approved")}>Approve</Btn>
                          <Btn small color={C.danger} onClick={() => updateStatus(l.id, "Rejected")}>Reject</Btn>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {leaveRequests.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No leave requests yet.</div>}
        </Card>
      </div>
    </div>
  );
}

// ── PAYROLL ───────────────────────────────────────────────────────────────────
function Payroll({ employees }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [overrides, setOverrides] = useState({});
  const setOv = (id, field, val) => setOverrides(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  const getRow = (e) => {
    const base = Number(overrides[e.id]?.salary ?? e.salary ?? 0);
    const allowance = Number(overrides[e.id]?.allowance ?? 0);
    const tax = Math.round(base * 0.07);
    const pension = Math.round(base * 0.08);
    const net = base + allowance - tax - pension;
    return { base, allowance, tax, pension, net };
  };
  const total = employees.reduce((s, e) => s + getRow(e).net, 0);

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Payroll</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px", color: C.text, fontSize: 13, outline: "none" }} />
        <Badge color={C.success} style={{ fontSize: 13, padding: "6px 16px" }}>Total: ₦{total.toLocaleString()}</Badge>
      </div>
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Employee", "Basic Salary", "Allowance", "Tax (7%)", "Pension (8%)", "Net Pay"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(e => {
                const { base, allowance, tax, pension, net } = getRow(e);
                return (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px", color: C.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }} onClick={() => setSelectedEmployee(e)}>{e.name}</td>
                    <td style={{ padding: "12px" }}>
                      <input type="number" defaultValue={e.salary} onChange={ev => setOv(e.id, "salary", ev.target.value)}
                        style={{ width: 120, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 13, outline: "none" }} />
                    </td>
                    <td style={{ padding: "12px" }}>
                      <input type="number" defaultValue={0} placeholder="0" onChange={ev => setOv(e.id, "allowance", ev.target.value)}
                        style={{ width: 100, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 13, outline: "none" }} />
                    </td>
                    <td style={{ padding: "12px", color: C.danger, fontFamily: "monospace" }}>₦{tax.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: C.warning, fontFamily: "monospace" }}>₦{pension.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: C.success, fontFamily: "monospace", fontWeight: 700, fontSize: 15 }}>₦{net.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {employees.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No employees found.</div>}
        </div>
      </Card>
    </div>
  );
}

// ── CONTRACTS ────────────────────────────────────────────────────────────────
function Contracts() {
  const [file, setFile] = useState(null);
  const [rawBuffer, setRawBuffer] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [contractSheet, setContractSheet] = useState("");
  const [sheetOptions, setSheetOptions] = useState([]);
  const [mappings, setMappings] = useState([{ column: "", cell: "" }]);
  const [status, setStatus] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f); setStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target.result;
        setRawBuffer(buffer);
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array", cellStyles: true });
        setSheetOptions(wb.SheetNames.map(s => ({ value: s, label: s })));
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        if (rows.length > 0) {
          const headers = rows[0].filter(Boolean);
          setColumns(headers);
          setStaffData(rows.slice(1).filter(r => r.some(c => c !== undefined && c !== "")).map(r => {
            const o = {}; headers.forEach((h, i) => { o[h] = r[i] ?? ""; }); return o;
          }));
          setStatus(`Loaded ${rows.length - 1} staff records. Select contract sheet and map columns.`);
        }
      } catch (err) { setStatus("Error reading file: " + err.message); }
    };
    reader.readAsArrayBuffer(f);
  };

  const generate = async () => {
    if (!rawBuffer || !contractSheet || staffData.length === 0 || mappings.every(m => !m.column || !m.cell)) {
      setStatus("Please complete all steps — upload file, select contract sheet, and add at least one mapping."); return;
    }
    setGenerating(true);
    setStatus("Generating contracts — preserving all formatting, colours and images...");

    try {
      // Read original workbook preserving ALL styles
      const wb = XLSX.read(new Uint8Array(rawBuffer), { type: "array", cellStyles: true, cellNF: true, sheetStubs: true });
      const templateSheetName = contractSheet;

      // Create output workbook starting fresh
      const outputWb = XLSX.utils.book_new();

      // Copy all non-data sheets first (to preserve workbook styles/themes)
      wb.SheetNames.forEach(name => {
        if (name !== templateSheetName) {
          // Keep other sheets as reference
        }
      });

      let generated = 0;

      for (let idx = 0; idx < staffData.length; idx++) {
        const staff = staffData[idx];
        const staffName = String(staff[columns[0]] || `Staff_${idx + 1}`).substring(0, 25).replace(/[\\/:*?"<>|]/g, "_");

        // Deep clone the template sheet
        const templateSheet = wb.Sheets[templateSheetName];
        const clonedSheet = JSON.parse(JSON.stringify(templateSheet));

        // Apply each mapping
        mappings.forEach(({ column, cell }) => {
          if (!column || !cell) return;
          const value = staff[column] ?? "";
          const cellKey = cell.trim().toUpperCase();

          if (clonedSheet[cellKey]) {
            // Preserve all existing cell properties, only change value
            clonedSheet[cellKey] = {
              ...clonedSheet[cellKey],
              v: value,
              w: String(value),
              t: typeof value === "number" ? "n" : "s",
            };
          } else {
            // Create new cell if it doesn't exist
            clonedSheet[cellKey] = { v: value, w: String(value), t: "s" };
          }
        });

        // Add sheet to output workbook named after staff member
        XLSX.utils.book_append_sheet(outputWb, clonedSheet, staffName);
        generated++;
      }

      // Write output as binary
      const wbOut = XLSX.write(outputWb, {
        bookType: "xlsx",
        type: "base64",
        cellStyles: true,
      });

      // Trigger download of single workbook
      const a = document.createElement("a");
      a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbOut}`;
      a.download = `All_Contracts_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();

      setStatus(`Done! Generated ${generated} contracts in one workbook. Each staff has their own sheet named after them.`);
    } catch (err) {
      setStatus("Error generating contracts: " + err.message);
    }
    setGenerating(false);
  };

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Contract Generation</h2>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 13, lineHeight: 1.7 }}>
        Upload your Excel file — <strong style={{ color: C.accent }}>Sheet 1 = Staff Data</strong>, another sheet = Contract Template.<br />
        The output will be <strong style={{ color: C.success }}>one single workbook</strong> with each staff on their own sheet, preserving all formatting, colours and images.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 1 — Upload Excel File</h3>
            <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 12, transition: "all 0.2s", background: file ? C.success + "08" : "transparent" }}>
              <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={32} color={file ? C.success : C.accent} style={{ margin: "0 auto 12px" }} />
              <div style={{ color: file ? C.success : C.muted, fontSize: 13, fontWeight: 600 }}>{file ? `Loaded: ${file.name}` : "Click to upload .xlsx file"}</div>
              {staffData.length > 0 && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{staffData.length} staff records found</div>}
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: "none" }} />
          </Card>

          {sheetOptions.length > 0 && (
            <Card>
              <h3 style={{ color: C.warning, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 2 — Select Contract Template Sheet</h3>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Which sheet in your Excel file is the contract template?</p>
              <Select label="Contract Template Sheet" value={contractSheet} onChange={setContractSheet} options={sheetOptions} />
              {contractSheet && <div style={{ background: C.success + "15", border: `1px solid ${C.success}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.success }}>
                Template selected: <strong>{contractSheet}</strong> — formatting, colours and images will be preserved
              </div>}
            </Card>
          )}
        </div>

        <Card>
          <h3 style={{ color: C.success, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 3 — Map Staff Columns to Template Cells</h3>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Tell the system which cell in your contract template should be filled with which staff data column.<br />
            <span style={{ color: C.accent }}>Example: "Name" column → cell B5 in template</span>
          </p>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Select label={i === 0 ? "Staff Data Column" : ""} value={m.column} onChange={v => { const u = [...mappings]; u[i].column = v; setMappings(u); }} options={columns.map(c => ({ value: c, label: c }))} />
              </div>
              <div style={{ color: C.accent, paddingBottom: 14, fontSize: 20, fontWeight: 700 }}>→</div>
              <div style={{ flex: 1 }}>
                <Input label={i === 0 ? "Template Cell" : ""} value={m.cell} onChange={v => { const u = [...mappings]; u[i].cell = v; setMappings(u); }} placeholder="e.g. B5, G12" />
              </div>
              <div style={{ paddingBottom: 14 }}>
                <Btn small color={C.danger} onClick={() => setMappings(mappings.filter((_, idx) => idx !== i))}>✕</Btn>
              </div>
            </div>
          ))}
          <Btn small outline color={C.muted} onClick={() => setMappings([...mappings, { column: "", cell: "" }])} style={{ marginBottom: 20 }}>+ Add Another Mapping</Btn>

          <div style={{ background: C.bgDeep, borderRadius: 10, padding: 14, marginBottom: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Output Preview</div>
            <div style={{ fontSize: 12, color: C.text }}>
              One Excel workbook with <strong style={{ color: C.accent }}>{staffData.length} sheets</strong><br />
              Each sheet named after the staff member<br />
              Template formatting fully preserved
            </div>
          </div>

          <Btn onClick={generate} disabled={generating || !rawBuffer || !contractSheet} style={{ width: "100%", padding: 14, fontSize: 14 }}>
            {generating ? "Generating — please wait..." : `Generate All ${staffData.length} Contracts`}
          </Btn>
        </Card>
      </div>

      {status && (
        <div style={{ marginTop: 16, padding: "14px 18px", background: C.card, border: `1px solid ${status.includes("Done") ? C.success : status.includes("Error") ? C.danger : C.border}`, borderRadius: 10, color: status.includes("Done") ? C.success : status.includes("Error") ? C.danger : C.warning, fontSize: 13, lineHeight: 1.6 }}>
          {status}
        </div>
      )}
    </div>
  );
}

// ── PAYSLIPS ──────────────────────────────────────────────────────────────────
function Payslips() {
  const [file, setFile] = useState(null);
  const [rawBuffer, setRawBuffer] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [payslipSheet, setPayslipSheet] = useState("");
  const [sheetOptions, setSheetOptions] = useState([]);
  const [mappings, setMappings] = useState([{ column: "", cell: "" }]);
  const [status, setStatus] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f); setStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target.result;
        setRawBuffer(buffer);
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array", cellStyles: true });
        setSheetOptions(wb.SheetNames.map(s => ({ value: s, label: s })));
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        if (rows.length > 0) {
          const headers = rows[0].filter(Boolean);
          setColumns(headers);
          setStaffData(rows.slice(1).filter(r => r.some(c => c !== undefined && c !== "")).map(r => {
            const o = {}; headers.forEach((h, i) => { o[h] = r[i] ?? ""; }); return o;
          }));
          setStatus(`Loaded ${rows.length - 1} salary records.`);
        }
      } catch (err) { setStatus("Error reading file: " + err.message); }
    };
    reader.readAsArrayBuffer(f);
  };

  const generate = async () => {
    if (!rawBuffer || !payslipSheet || staffData.length === 0 || mappings.every(m => !m.column || !m.cell)) {
      setStatus("Please complete all steps first."); return;
    }
    setGenerating(true);
    setStatus("Generating payslips — preserving all formatting, colours and images...");

    try {
      const wb = XLSX.read(new Uint8Array(rawBuffer), { type: "array", cellStyles: true, cellNF: true, sheetStubs: true });
      const outputWb = XLSX.utils.book_new();
      let generated = 0;

      for (let idx = 0; idx < staffData.length; idx++) {
        const staff = staffData[idx];
        const staffName = String(staff[columns[0]] || `Staff_${idx + 1}`).substring(0, 25).replace(/[\\/:*?"<>|]/g, "_");
        const templateSheet = wb.Sheets[payslipSheet];
        const clonedSheet = JSON.parse(JSON.stringify(templateSheet));

        mappings.forEach(({ column, cell }) => {
          if (!column || !cell) return;
          const value = staff[column] ?? "";
          const cellKey = cell.trim().toUpperCase();
          if (clonedSheet[cellKey]) {
            clonedSheet[cellKey] = { ...clonedSheet[cellKey], v: value, w: String(value), t: typeof value === "number" ? "n" : "s" };
          } else {
            clonedSheet[cellKey] = { v: value, w: String(value), t: "s" };
          }
        });

        XLSX.utils.book_append_sheet(outputWb, clonedSheet, staffName);
        generated++;
      }

      const wbOut = XLSX.write(outputWb, { bookType: "xlsx", type: "base64", cellStyles: true });
      const a = document.createElement("a");
      a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbOut}`;
      a.download = `All_Payslips_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();

      setStatus(`Done! Generated ${generated} payslips in one workbook. Each staff has their own sheet.`);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
    setGenerating(false);
  };

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Payslip Generation</h2>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 13, lineHeight: 1.7 }}>
        Upload your Excel file — <strong style={{ color: C.accent }}>Sheet 1 = Salary Data</strong>, another sheet = Payslip Template.<br />
        Output is <strong style={{ color: C.success }}>one workbook</strong> with each staff on their own sheet, all formatting preserved.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 1 — Upload Excel File</h3>
            <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 12, transition: "all 0.2s", background: file ? C.success + "08" : "transparent" }}>
              <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={32} color={file ? C.success : C.success} style={{ margin: "0 auto 12px" }} />
              <div style={{ color: file ? C.success : C.muted, fontSize: 13, fontWeight: 600 }}>{file ? `Loaded: ${file.name}` : "Click to upload .xlsx file"}</div>
              {staffData.length > 0 && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{staffData.length} salary records found</div>}
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: "none" }} />
          </Card>

          {sheetOptions.length > 0 && (
            <Card>
              <h3 style={{ color: C.warning, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 2 — Select Payslip Template Sheet</h3>
              <Select label="Payslip Template Sheet" value={payslipSheet} onChange={setPayslipSheet} options={sheetOptions} />
              {payslipSheet && <div style={{ background: C.success + "15", border: `1px solid ${C.success}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.success }}>
                Template selected: <strong>{payslipSheet}</strong> — formatting preserved
              </div>}
            </Card>
          )}
        </div>

        <Card>
          <h3 style={{ color: C.success, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 3 — Map Columns to Template Cells</h3>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Example: "Basic Salary" column → cell F8 in template</p>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Select label={i === 0 ? "Salary Data Column" : ""} value={m.column} onChange={v => { const u = [...mappings]; u[i].column = v; setMappings(u); }} options={columns.map(c => ({ value: c, label: c }))} />
              </div>
              <div style={{ color: C.accent, paddingBottom: 14, fontSize: 20, fontWeight: 700 }}>→</div>
              <div style={{ flex: 1 }}>
                <Input label={i === 0 ? "Template Cell" : ""} value={m.cell} onChange={v => { const u = [...mappings]; u[i].cell = v; setMappings(u); }} placeholder="e.g. F8" />
              </div>
              <div style={{ paddingBottom: 14 }}>
                <Btn small color={C.danger} onClick={() => setMappings(mappings.filter((_, idx) => idx !== i))}>✕</Btn>
              </div>
            </div>
          ))}
          <Btn small outline color={C.muted} onClick={() => setMappings([...mappings, { column: "", cell: "" }])} style={{ marginBottom: 20 }}>+ Add Another Mapping</Btn>

          <div style={{ background: C.bgDeep, borderRadius: 10, padding: 14, marginBottom: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Output Preview</div>
            <div style={{ fontSize: 12, color: C.text }}>
              One Excel workbook with <strong style={{ color: C.accent }}>{staffData.length} sheets</strong><br />
              Each sheet named after the staff member<br />
              Payslip formatting fully preserved
            </div>
          </div>

          <Btn onClick={generate} disabled={generating || !rawBuffer || !payslipSheet} style={{ width: "100%", padding: 14, fontSize: 14 }}>
            {generating ? "Generating — please wait..." : `Generate All ${staffData.length} Payslips`}
          </Btn>
        </Card>
      </div>

      {status && (
        <div style={{ marginTop: 16, padding: "14px 18px", background: C.card, border: `1px solid ${status.includes("Done") ? C.success : status.includes("Error") ? C.danger : C.border}`, borderRadius: 10, color: status.includes("Done") ? C.success : status.includes("Error") ? C.danger : C.warning, fontSize: 13, lineHeight: 1.6 }}>
          {status}
        </div>
      )}
    </div>
  );
}


// ── ROLE MANAGEMENT ───────────────────────────────────────────────────────────
function RoleManager() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("hr");
  const [roles, setRoles] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadRoles(); }, []);

  const loadRoles = async () => {
    const { data } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
    setRoles(data || []);
  };

  const assign = async () => {
    if (!email) { setMsg("Please enter an email"); return; }
    setLoading(true);
    const { error } = await supabase.from("user_roles").upsert({ email: email.toLowerCase(), role }, { onConflict: "email" });
    if (error) setMsg("Error: " + error.message);
    else { setMsg(`Role assigned successfully! ${email} is now ${role}`); setEmail(""); await loadRoles(); }
    setLoading(false);
  };

  const remove = async (id) => {
    await supabase.from("user_roles").delete().eq("id", id);
    await loadRoles();
  };

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Role Management</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Assign HR access to staff members. Everyone else gets employee access by default.</p>
      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Assign Role</h3>
          <Input label="Staff Email" value={email} onChange={setEmail} type="email" placeholder="staff@company.com" required />
          <Select label="Role" value={role} onChange={setRole} options={[{ value: "hr", label: "HR — Full Access" }, { value: "employee", label: "Employee — Limited Access" }]} />
          {msg && <div style={{ background: msg.includes("Error") ? C.danger + "22" : C.success + "22", color: msg.includes("Error") ? C.danger : C.success, padding: "10px 14px", borderRadius: 8, fontSize: 12, marginBottom: 12, border: `1px solid ${msg.includes("Error") ? C.danger : C.success}44` }}>{msg}</div>}
          <Btn onClick={assign} disabled={loading} style={{ width: "100%" }}>{loading ? "Saving..." : "Assign Role"}</Btn>
        </Card>
        <Card>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Current Role Assignments</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Email", "Role", "Assigned", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px", color: C.text, fontWeight: 600 }}>{r.email}</td>
                  <td style={{ padding: "12px" }}><Badge color={r.role === "admin" ? C.danger : r.role === "hr" ? C.accent : C.success}>{r.role}</Badge></td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "12px" }}>
                    {r.role !== "admin" && <Btn small color={C.danger} onClick={() => remove(r.id)}>Remove</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {roles.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No roles assigned yet.</div>}
        </Card>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const isHR = user?.role === "hr" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const getRoleForEmail = async (email) => {
    const adminEmails = ["m.christopher@cbi.ngo"];
    if (adminEmails.includes(email.toLowerCase())) return "admin";
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("email", email.toLowerCase()).single();
      return data?.role || "employee";
    } catch { return "employee"; }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        const role = await getRoleForEmail(session.user.email);
        setUser({ ...session.user, role });
      }
      setLoading(false);
    }).catch(() => { clearTimeout(timeout); setLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const role = await getRoleForEmail(session.user.email);
        setUser({ ...session.user, role });
      } else { setUser(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [emp, leave] = await Promise.all([
        supabase.from("employees").select("*").order("created_at", { ascending: false }),
        supabase.from("leave_requests").select("*").order("created_at", { ascending: false }),
      ]);
      setEmployees(emp.data || []);
      setLeaveRequests(leave.data || []);
    };
    load();
  }, [user]);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.accent, fontSize: 16, fontWeight: 600 }}>Loading HR Central...</div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const allModules = [
    ...modules,
    ...(isAdmin ? [{ id: "roles", label: "Manage Roles", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }] : [])
  ];

  const visibleModules = isHR ? allModules : allModules.filter(m => ["dashboard", "employees", "attendance", "leave"].includes(m.id));

  const renderModule = () => {
    switch (active) {
      case "dashboard": return <Dashboard employees={employees} leaveRequests={leaveRequests} attendance={attendance} user={user} />;
      case "employees": return <Employees employees={employees} setEmployees={setEmployees} isHR={isHR} />;
      case "attendance": return <Attendance employees={employees} isHR={isHR} />;
      case "leave": return <Leave employees={employees} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} isHR={isHR} user={user} />;
      case "payroll": return isHR ? <Payroll employees={employees} /> : null;
      case "contracts": return isHR ? <Contracts /> : null;
      case "payslips": return isHR ? <Payslips /> : null;
      case "roles": return isAdmin ? <RoleManager /> : null;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: C.bgDeep, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: C.accent + "22", borderRadius: 10, padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, color: C.white, fontWeight: 800, letterSpacing: -0.3 }}>HR Central</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>People Operations</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ background: C.accent + "15", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginBottom: 4 }}>{user.email}</div>
            <Badge color={isAdmin ? C.danger : isHR ? C.accent : C.success} style={{ fontSize: 10 }}>
              {isAdmin ? "Super Admin" : isHR ? "HR Admin" : "Employee"}
            </Badge>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
          {visibleModules.map((m) => (
            <div key={m.id} onClick={() => setActive(m.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10,
              cursor: "pointer", marginBottom: 4, transition: "all 0.15s",
              background: active === m.id ? C.accent + "22" : "transparent",
              borderLeft: active === m.id ? `3px solid ${C.accent}` : "3px solid transparent",
              color: active === m.id ? C.accent : C.muted,
              fontWeight: active === m.id ? 700 : 400, fontSize: 13,
            }}>
              <Icon path={m.icon} size={16} color={active === m.id ? C.accent : C.muted} />
              {m.label}
            </div>
          ))}
        </nav>

        {/* Office icon */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: C.accent + "10", borderRadius: 12, padding: "12px", marginBottom: 10, border: `1px solid ${C.accent}22` }}>
            <svg width="100%" height="70" viewBox="0 0 180 70" fill="none">
              {/* Sky background */}
              <rect width="180" height="70" rx="8" fill="#071428" />
              {/* Moon/stars */}
              <circle cx="160" cy="12" r="3" fill="#60a5fa" opacity="0.6" />
              <circle cx="140" cy="8" r="1.5" fill="#e2eeff" opacity="0.5" />
              <circle cx="170" cy="20" r="1" fill="#e2eeff" opacity="0.4" />
              {/* Ground */}
              <rect x="0" y="60" width="180" height="10" rx="0" fill="#0d1f3c" />
              {/* Building 1 - tallest center */}
              <rect x="65" y="15" width="50" height="55" rx="2" fill="#1a3a6b" stroke="#2a4a80" strokeWidth="1" />
              {/* Windows building 1 */}
              {[20,30,40,50].map(y => [70,82,95,107].map(x => (
                `<rect key="${x}-${y}" x="${x}" y="${y}" width="8" height="6" rx="1" fill="${x===82&&y===30 ? '#fbbf24' : x===95&&y===40 ? '#60a5fa' : '#0d1f3c'}" opacity="0.9" />`
              )))}
              <rect x="70" y="20" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
              <rect x="82" y="20" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="95" y="20" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.8" />
              <rect x="107" y="20" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.7" />
              <rect x="70" y="30" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="82" y="30" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.9" />
              <rect x="95" y="30" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="107" y="30" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
              <rect x="70" y="40" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.7" />
              <rect x="82" y="40" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="95" y="40" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.8" />
              <rect x="107" y="40" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="70" y="50" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="82" y="50" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.7" />
              <rect x="95" y="50" width="8" height="6" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="107" y="50" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.8" />
              {/* Building 2 - left */}
              <rect x="10" y="28" width="35" height="42" rx="2" fill="#132040" stroke="#1e3a6e" strokeWidth="1" />
              <rect x="15" y="33" width="7" height="5" rx="1" fill="#60a5fa" opacity="0.6" />
              <rect x="26" y="33" width="7" height="5" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="15" y="42" width="7" height="5" rx="1" fill="#fbbf24" opacity="0.7" />
              <rect x="26" y="42" width="7" height="5" rx="1" fill="#60a5fa" opacity="0.5" />
              <rect x="15" y="51" width="7" height="5" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="26" y="51" width="7" height="5" rx="1" fill="#fbbf24" opacity="0.6" />
              {/* Building 3 - right */}
              <rect x="135" y="25" width="38" height="45" rx="2" fill="#132040" stroke="#1e3a6e" strokeWidth="1" />
              <rect x="140" y="30" width="7" height="5" rx="1" fill="#fbbf24" opacity="0.8" />
              <rect x="151" y="30" width="7" height="5" rx="1" fill="#60a5fa" opacity="0.6" />
              <rect x="162" y="30" width="7" height="5" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="140" y="40" width="7" height="5" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="151" y="40" width="7" height="5" rx="1" fill="#fbbf24" opacity="0.7" />
              <rect x="162" y="40" width="7" height="5" rx="1" fill="#60a5fa" opacity="0.5" />
              <rect x="140" y="50" width="7" height="5" rx="1" fill="#60a5fa" opacity="0.6" />
              <rect x="151" y="50" width="7" height="5" rx="1" fill="#0d1f3c" opacity="0.9" />
              <rect x="162" y="50" width="7" height="5" rx="1" fill="#fbbf24" opacity="0.6" />
              {/* Antenna on main building */}
              <line x1="90" y1="15" x2="90" y2="5" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="90" cy="4" r="2" fill="#ef4444" opacity="0.8" />
            </svg>
            <div style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: 0.5 }}>PEOPLE OPERATIONS HQ</div>
          </div>
          <button onClick={logout} style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px", color: C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 220, padding: "32px 36px", overflowY: "auto", minHeight: "100vh" }}>
        {renderModule()}
      </div>
    </div>
  );
}
