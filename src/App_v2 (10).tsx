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
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [activeLeaves, setActiveLeaves] = useState([]);
  const [missingGender, setMissingGender] = useState([]);

  useEffect(() => {
    const load = async () => {
      // Fetch today attendance
      const { data: att } = await supabase.from("attendance").select("*").eq("date", today);
      setTodayAttendance(att || []);
      // Fetch active leaves (approved and today falls between from_date and to_date)
      const { data: leaves } = await supabase.from("leave_requests")
        .select("*").eq("status", "Approved")
        .lte("from_date", today).gte("to_date", today);
      setActiveLeaves(leaves || []);
    };
    load();
  }, []);

  // Gender helper — trim spaces and lowercase
  const getGender = (e) => e.gender?.trim().toLowerCase() || "";

  const total = employees.length;
  const males = employees.filter(e => getGender(e) === "male").length;
  const females = employees.filter(e => getGender(e) === "female").length;
  const noGender = employees.filter(e => !getGender(e)).length;
  const malePct = total > 0 ? Math.round((males / total) * 100) : 0;
  const femalePct = total > 0 ? Math.round((females / total) * 100) : 0;

  // Present today
  const presentIds = todayAttendance.filter(a => a.status === "Present" || a.status === "Late").map(a => a.employee_id);
  const presentEmps = employees.filter(e => presentIds.includes(e.id));
  const present = presentEmps.length;
  const malePresent = presentEmps.filter(e => getGender(e) === "male").length;
  const femalePresent = presentEmps.filter(e => getGender(e) === "female").length;
  const malePresentPct = present > 0 ? Math.round((malePresent / present) * 100) : 0;
  const femalePresentPct = present > 0 ? Math.round((femalePresent / present) * 100) : 0;

  // Active on leave today
  const onLeaveCount = activeLeaves.length;
  const leaveEmpIds = activeLeaves.map(l => l.employee_id);
  const leaveEmps = employees.filter(e => leaveEmpIds.includes(e.id));
  const maleOnLeave = leaveEmps.filter(e => getGender(e) === "male").length;
  const femaleOnLeave = leaveEmps.filter(e => getGender(e) === "female").length;
  const maleOnLeavePct = onLeaveCount > 0 ? Math.round((maleOnLeave / onLeaveCount) * 100) : 0;
  const femaleOnLeavePct = onLeaveCount > 0 ? Math.round((femaleOnLeave / onLeaveCount) * 100) : 0;

  // Next return date
  const nextReturn = activeLeaves.length > 0
    ? activeLeaves.sort((a, b) => new Date(a.to_date) - new Date(b.to_date))[0]
    : null;
  const nextReturnEmp = nextReturn ? employees.find(e => e.id === nextReturn.employee_id) : null;

  const pending = leaveRequests.filter(l => l.status === "Pending").length;
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

      {/* Missing gender warning */}
      {noGender > 0 && (
        <div style={{ background: C.warning + "15", border: `1px solid ${C.warning}44`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={16} color={C.warning} />
          <span style={{ color: C.warning, fontSize: 12, fontWeight: 600 }}>{noGender} employee{noGender > 1 ? "s have" : " has"} no gender recorded — go to Employees module to update</span>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>

        {/* Total Employees */}
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
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>Male {males} ({malePct}%)</span>
              <span style={{ fontSize: 11, color: "#f472b6", fontWeight: 700 }}>Female {females} ({femalePct}%)</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden", display: "flex" }}>
              <div style={{ height: "100%", width: `${malePct}%`, background: "#3b82f6" }} />
              <div style={{ height: "100%", width: `${femalePct}%`, background: "#f472b6" }} />
            </div>
            {noGender > 0 && <div style={{ fontSize: 10, color: C.warning, marginTop: 4 }}>{noGender} unrecorded</div>}
          </div>
        </Card>

        {/* Present Today */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ background: C.success + "22", borderRadius: 14, padding: 14 }}>
              <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={24} color={C.success} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.success, fontFamily: "monospace" }}>{present}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Present Today</div>
            </div>
          </div>
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>Male {malePresent} ({malePresentPct}%)</span>
              <span style={{ fontSize: 11, color: "#f472b6", fontWeight: 700 }}>Female {femalePresent} ({femalePresentPct}%)</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden", display: "flex" }}>
              <div style={{ height: "100%", width: `${malePresentPct}%`, background: "#3b82f6" }} />
              <div style={{ height: "100%", width: `${femalePresentPct}%`, background: "#f472b6" }} />
            </div>
          </div>
        </Card>

        {/* On Leave */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ background: C.warning + "22", borderRadius: 14, padding: 14 }}>
              <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={24} color={C.warning} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.warning, fontFamily: "monospace" }}>{onLeaveCount}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>On Leave Today</div>
            </div>
          </div>
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>Male {maleOnLeave} ({maleOnLeavePct}%)</span>
              <span style={{ fontSize: 11, color: "#f472b6", fontWeight: 700 }}>Female {femaleOnLeave} ({femaleOnLeavePct}%)</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden", display: "flex" }}>
              <div style={{ height: "100%", width: `${maleOnLeavePct}%`, background: "#3b82f6" }} />
              <div style={{ height: "100%", width: `${femaleOnLeavePct}%`, background: "#f472b6" }} />
            </div>
            {nextReturnEmp && (
              <div style={{ fontSize: 10, color: C.warning, marginTop: 4 }}>
                Next return: {nextReturnEmp.name?.split(" ")[0]} · {new Date(nextReturn.to_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </div>
            )}
          </div>
        </Card>

        {/* Pending Requests */}
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
                <div style={{ color: C.muted, fontSize: 11 }}>{l.type} · {l.from_date} to {l.to_date}</div>
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

function Employees({ employees, setEmployees, isHR, setSelectedEmployee }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [selectedEdu, setSelectedEdu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [customCols, setCustomCols] = useState([]);
  const [newCol, setNewCol] = useState("");
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
                  <td style={{ padding: "12px", color: C.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }} onClick={() => setSelectedEmployee(e)}>{e.name}</td>
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
    </div>
  );
}

// ── ATTENDANCE ────────────────────────────────────────────────────────────────
function Attendance({ employees, isHR, setSelectedEmployee }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [lateMinutes, setLateMinutes] = useState({});
  const [absentReasons, setAbsentReasons] = useState({});

  useEffect(() => { loadRecords(); }, [date]);

  const loadRecords = async () => {
    setLoading(true);
    const { data } = await supabase.from("attendance").select("*").eq("date", date);
    setRecords(data || []);
    // Restore absent reasons and late minutes from saved records
    const reasons = {}; const mins = {};
    (data || []).forEach(r => {
      if (r.status === "Absent" && r.late_duration) reasons[r.employee_id] = r.late_duration;
      if (r.status === "Late" && r.late_duration) mins[r.employee_id] = r.late_duration;
    });
    setAbsentReasons(reasons);
    setLateMinutes(mins);
    setLoading(false);
  };

  // Fetch active leaves for SELECTED date to show On Leave badge
  const [activeLeaveIds, setActiveLeaveIds] = useState([]);
  useEffect(() => {
    const loadLeaves = async () => {
      const { data } = await supabase.from("leave_requests")
        .select("employee_id").eq("status", "Approved")
        .lte("from_date", date).gte("to_date", date);
      setActiveLeaveIds((data || []).map(l => l.employee_id));
    };
    loadLeaves();
  }, [date]); // Re-runs every time date changes

  const mark = async (emp, status) => {
    const existing = records.find(r => r.employee_id === emp.id);
    // If clicking same status again — UNMARK it
    if (existing && existing.status === status) {
      await supabase.from("attendance").delete().eq("id", existing.id);
      setRecords(records.filter(r => r.employee_id !== emp.id));
      return;
    }
    const payload = { employee_id: emp.id, employee_name: emp.name, date, status, late_duration: status === "Late" ? (lateMinutes[emp.id] || "") : status === "Absent" ? (absentReasons[emp.id] || "") : null };
    if (existing) {
      await supabase.from("attendance").update(payload).eq("id", existing.id);
      setRecords(records.map(r => r.employee_id === emp.id ? { ...r, ...payload } : r));
    } else {
      const { data } = await supabase.from("attendance").insert([payload]).select();
      setRecords([...records, data[0]]);
    }
  };

  const getStatus = (empId) => records.find(r => r.employee_id === empId)?.status || null;
  const getLate = (empId) => records.find(r => r.employee_id === empId)?.late_duration || "";

  // Get unique locations
  const locations = [...new Set(employees.map(e => e.location).filter(Boolean))].sort();

  // Filter employees by selected location
  const filteredEmployees = selectedLocation ? employees.filter(e => e.location === selectedLocation) : employees;

  // Breakdown stats
  const present = records.filter(r => r.status === "Present").length;
  const absent = records.filter(r => r.status === "Absent").length;
  const late = records.filter(r => r.status === "Late").length;
  const notMarked = filteredEmployees.length - records.filter(r => filteredEmployees.some(e => e.id === r.employee_id)).length;
  const total = filteredEmployees.length;

  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Attendance Tracker</h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>All records saved permanently — click a status again to unmark</p>
      </div>

      {/* Date selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px", color: C.text, fontSize: 13, outline: "none" }} />
        <span style={{ color: C.muted, fontSize: 12 }}>
          {date === today ? "Today" : new Date(date).toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Breakdown summary */}
      <Card style={{ marginBottom: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>
            Attendance Breakdown — {selectedLocation || "All Locations"} ({total} staff)
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Present", value: present, color: C.success },
            { label: "Absent", value: absent, color: C.danger },
            { label: "Late", value: late, color: C.warning },
            { label: "Not Marked", value: notMarked, color: C.muted },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: color + "15", border: `1px solid ${color}33`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
              <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{pct(value)}%</div>
            </div>
          ))}
        </div>
        {/* Visual bar */}
        <div style={{ height: 10, borderRadius: 6, background: C.border, overflow: "hidden", display: "flex" }}>
          {present > 0 && <div style={{ width: `${pct(present)}%`, background: C.success, transition: "width 0.5s" }} />}
          {late > 0 && <div style={{ width: `${pct(late)}%`, background: C.warning, transition: "width 0.5s" }} />}
          {absent > 0 && <div style={{ width: `${pct(absent)}%`, background: C.danger, transition: "width 0.5s" }} />}
          {notMarked > 0 && <div style={{ width: `${pct(notMarked)}%`, background: C.muted + "50", transition: "width 0.5s" }} />}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {[{ label: "Present", color: C.success }, { label: "Late", color: C.warning }, { label: "Absent", color: C.danger }, { label: "Not Marked", color: C.muted }].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Location filter chips */}
      {locations.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <div onClick={() => setSelectedLocation("")}
            style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${!selectedLocation ? C.accent : C.border}`, background: !selectedLocation ? C.accent + "22" : "transparent", color: !selectedLocation ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}>
            All Locations
          </div>
          {locations.map(loc => (
            <div key={loc} onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}
              style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${selectedLocation === loc ? C.accent : C.border}`, background: selectedLocation === loc ? C.accent + "22" : "transparent", color: selectedLocation === loc ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}>
              {loc} ({employees.filter(e => e.location === loc).length})
            </div>
          ))}
        </div>
      )}

      {/* Attendance table */}
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
              {filteredEmployees.map(e => {
                const s = getStatus(e.id);
                return (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px", color: C.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }} onClick={() => setSelectedEmployee(e)}>{e.name}</td>
                    <td style={{ padding: "12px", color: C.muted }}>{e.designation || "—"}</td>
                    <td style={{ padding: "12px", color: C.muted }}>{e.location || "—"}</td>
                    <td style={{ padding: "12px" }}>
                      {s ? <Badge color={s === "Present" ? C.success : s === "Absent" ? C.danger : C.warning}>{s}</Badge>
                        : activeLeaveIds.includes(e.id)
                          ? <Badge color={C.warning}>On Leave</Badge>
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
                      ) : s === "Absent" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: C.danger, fontSize: 12 }}>{getLate(e.id) || "—"}</span>
                          {isHR && (
                            <input value={absentReasons[e.id] || ""} onChange={ev => setAbsentReasons({ ...absentReasons, [e.id]: ev.target.value })}
                              placeholder="Reason (optional)"
                              style={{ width: 120, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                          )}
                        </div>
                      ) : <span style={{ color: C.muted, fontSize: 12 }}>—</span>}
                    </td>
                    {isHR && (
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small color={s === "Present" ? C.success : C.bgDeep} style={{ border: `1px solid ${C.success}`, color: s === "Present" ? "#fff" : C.success }} onClick={() => mark(e, "Present")}>
                            {s === "Present" ? "✓ Present" : "Present"}
                          </Btn>
                          <Btn small color={s === "Absent" ? C.danger : C.bgDeep} style={{ border: `1px solid ${C.danger}`, color: s === "Absent" ? "#fff" : C.danger }} onClick={() => mark(e, "Absent")}>
                            {s === "Absent" ? "✓ Absent" : "Absent"}
                          </Btn>
                          <Btn small color={s === "Late" ? C.warning : C.bgDeep} style={{ border: `1px solid ${C.warning}`, color: s === "Late" ? "#fff" : C.warning }} onClick={() => mark(e, "Late")}>
                            {s === "Late" ? "✓ Late" : "Late"}
                          </Btn>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No employees found{selectedLocation ? ` in ${selectedLocation}` : ""}.</div>}
        </div>
      </Card>
    </div>
  );
}

// ── LEAVE ─────────────────────────────────────────────────────────────────────
function Leave({ employees, leaveRequests, setLeaveRequests, isHR, user }) {
  const [form, setForm] = useState({ employee_id: "", type: "", from_date: "", to_date: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

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

  const deleteRequest = async (id) => {
    await supabase.from("leave_requests").delete().eq("id", id);
    setLeaveRequests(leaveRequests.filter(l => l.id !== id));
  };

  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity Leave", "Paternity Leave", "Emergency Leave", "Unpaid Leave", "Study Leave"].map(v => ({ value: v, label: v }));

  const filteredLeaves = filter === "All" ? leaveRequests : leaveRequests.filter(l => l.status === filter);

  // Duration calculation
  const getDays = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

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
          {form.from_date && form.to_date && (
            <div style={{ background: C.accent + "15", border: `1px solid ${C.accent}33`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.accent, marginBottom: 12 }}>
              Duration: {getDays(form.from_date, form.to_date)} day{getDays(form.from_date, form.to_date) > 1 ? "s" : ""}
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Reason</label>
            <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
              style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 80 }} />
          </div>
          <Btn onClick={submit} disabled={loading} style={{ width: "100%" }}>{loading ? "Submitting..." : "Submit Request"}</Btn>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>All Leave Requests</h3>
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Pending", "Approved", "Rejected"].map(f => (
                <div key={f} onClick={() => setFilter(f)} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${filter === f ? C.accent : C.border}`, background: filter === f ? C.accent + "22" : "transparent", color: filter === f ? C.accent : C.muted, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{f}</div>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Employee", "Type", "From", "To", "Days", "Reason", "Status", isHR ? "Actions" : ""].filter(Boolean).map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(l => (
                  <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px", color: C.text, fontWeight: 600 }}>{l.employee_name}</td>
                    <td style={{ padding: "12px" }}><Badge color={C.warning}>{l.type}</Badge></td>
                    <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{l.from_date}</td>
                    <td style={{ padding: "12px", color: C.muted, fontSize: 12 }}>{l.to_date}</td>
                    <td style={{ padding: "12px", color: C.accent, fontSize: 12, fontWeight: 700 }}>{getDays(l.from_date, l.to_date)}d</td>
                    <td style={{ padding: "12px", color: C.muted, fontSize: 12, maxWidth: 150 }}>{l.reason || "—"}</td>
                    <td style={{ padding: "12px" }}><Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : C.warning}>{l.status}</Badge></td>
                    {isHR && (
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {l.status !== "Approved" && (
                            <Btn small color={C.success} onClick={() => updateStatus(l.id, "Approved")}>Approve</Btn>
                          )}
                          {l.status !== "Rejected" && (
                            <Btn small color={C.danger} onClick={() => updateStatus(l.id, "Rejected")}>Reject</Btn>
                          )}
                          {l.status !== "Pending" && (
                            <Btn small outline color={C.muted} onClick={() => updateStatus(l.id, "Pending")}>Reset</Btn>
                          )}
                          <Btn small color={C.danger} onClick={() => deleteRequest(l.id)}>🗑</Btn>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeaves.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No {filter !== "All" ? filter.toLowerCase() : ""} leave requests yet.</div>}
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
  const [dataSheet, setDataSheet] = useState("");
  const [templateSheet, setTemplateSheet] = useState("");
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
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
        const names = wb.SheetNames;
        setSheetOptions(names.map(s => ({ value: s, label: s })));
        // Auto-detect Salary_breakdown and Contract_Template
        const dataSheetName = names.find(n => n.toLowerCase().includes("salary") || n.toLowerCase().includes("data") || n.toLowerCase().includes("payroll")) || names[0];
        const templateSheetName = names.find(n => n.toLowerCase().includes("contract") || n.toLowerCase().includes("template")) || names[1] || names[0];
        setDataSheet(dataSheetName);
        setTemplateSheet(templateSheetName);
        // Load staff data from data sheet
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[dataSheetName], { header: 1 });
        if (rows.length > 0) {
          const headers = rows[0].map((h, i) => h || `Column_${String.fromCharCode(65+i)}`);
          setColumns(headers);
          setStaffData(rows.slice(1).filter(r => r.some(c => c !== undefined && c !== "")).map(r => {
            const o = {}; headers.forEach((h, i) => { o[h] = r[i] ?? ""; }); return o;
          }));
          setStatus(`Loaded ${rows.length - 1} staff records from "${dataSheetName}". Template: "${templateSheetName}"`);
        }
      } catch (err) { setStatus("Error reading file: " + err.message); }
    };
    reader.readAsArrayBuffer(f);
  };

  const generate = async () => {
    if (!rawBuffer || !templateSheet || !dataSheet || staffData.length === 0) {
      setStatus("Please upload your Excel file first."); return;
    }
    if (mappings.every(m => !m.column || !m.cell)) {
      setStatus("Please add at least one column-to-cell mapping."); return;
    }
    setGenerating(true);
    setStatus("Generating contracts — duplicating template sheet with full formatting...");

    try {
      // Load JSZip from CDN
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      
      // Read the xlsx as a ZIP archive
      const zip = await window.JSZip.loadAsync(rawBuffer);
      
      // Find the template sheet's XML file
      const workbookXml = await zip.file("xl/workbook.xml").async("string");
      const workbookRels = await zip.file("xl/_rels/workbook.xml.rels").async("string");
      
      // Parse sheet names and their rId mappings
      const sheetRegex = /<sheet[^>]+name="([^"]+)"[^>]+sheetId="(\d+)"[^>]+r:id="([^"]+)"/g;
      const sheets = [];
      let m;
      while ((m = sheetRegex.exec(workbookXml)) !== null) {
        sheets.push({ name: m[1], sheetId: parseInt(m[2]), rId: m[3] });
      }
      
      // Find template sheet info
      const templateInfo = sheets.find(s => s.name === templateSheet);
      if (!templateInfo) throw new Error(`Template sheet "${templateSheet}" not found`);
      
      // Get template sheet file path from relationships
      const relRegex = new RegExp(`Id="${templateInfo.rId}"[^>]+Target="([^"]+)"`);
      const relMatch = workbookRels.match(relRegex);
      if (!relMatch) throw new Error("Could not find template sheet relationship");
      
      const templatePath = "xl/" + relMatch[1].replace(/^\.\//, "");
      const templateXml = await zip.file(templatePath).async("string");
      
      // Get max existing sheetId and find next available sheet number
      const maxSheetId = Math.max(...sheets.map(s => s.sheetId));
      const sheetFiles = Object.keys(zip.files).filter(f => f.match(/xl\/worksheets\/sheet\d+\.xml$/));
      const maxSheetNum = Math.max(...sheetFiles.map(f => parseInt(f.match(/sheet(\d+)\.xml$/)[1])));
      
      let newWorkbookXml = workbookXml;
      let newWorkbookRels = workbookRels;
      
      // Process each staff member
      for (let idx = 0; idx < staffData.length; idx++) {
        const staff = staffData[idx];
        const staffName = String(staff[columns[0]] || `Staff_${idx + 1}`).substring(0, 31).replace(/[\\/:*?"<>|]/g, "_");
        
        // Clone template XML
        let sheetXml = templateSheet === dataSheet ? templateXml : templateXml;
        
        // Replace cell values using XML manipulation
        mappings.forEach(({ column, cell }) => {
          if (!column || !cell) return;
          const value = String(staff[column] ?? "");
          const cellRef = cell.trim().toUpperCase();
          
          // Find and replace the cell value in XML
          // Handle shared strings (type="s") and inline strings (type="inlineStr") and plain values
          const cellPattern = new RegExp(
            `(<c r="${cellRef}"[^>]*>)(.*?)(<\\/c>)`,
            "s"
          );
          
          if (cellPattern.test(sheetXml)) {
            sheetXml = sheetXml.replace(cellPattern, (match, open, inner, close) => {
              // Remove type="s" if present to avoid shared string lookup
              const newOpen = open.replace(/\s+t="[^"]*"/, "").replace(/\s+s="([^"]*)"/, ' s="$1"');
              return `${newOpen}<v>${value}</v>${close}`;
            });
          } else {
            // Cell doesn't exist in template — insert it
            // Find the row and insert
            const rowNum = cellRef.match(/\d+/)[0];
            const rowPattern = new RegExp(`(<row[^>]+r="${rowNum}"[^>]*>)(.*?)(<\\/row>)`, "s");
            if (rowPattern.test(sheetXml)) {
              sheetXml = sheetXml.replace(rowPattern, (match, open, inner, close) => {
                return `${open}${inner}<c r="${cellRef}" t="inlineStr"><is><t>${value}</t></is></c>${close}`;
              });
            }
          }
        });
        
        // Add new sheet to zip
        const newSheetNum = maxSheetNum + idx + 1;
        const newSheetPath = `xl/worksheets/sheet${newSheetNum}.xml`;
        zip.file(newSheetPath, sheetXml);
        
        // Add new sheet to workbook relationships
        const newRId = `rId${1000 + idx}`;
        const newSheetId = maxSheetId + idx + 1;
        
        newWorkbookRels = newWorkbookRels.replace(
          "</Relationships>",
          `<Relationship Id="${newRId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${newSheetNum}.xml"/>\n</Relationships>`
        );
        
        // Add new sheet to workbook.xml
        const escapedName = staffName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        newWorkbookXml = newWorkbookXml.replace(
          "</sheets>",
          `<sheet name="${escapedName}" sheetId="${newSheetId}" r:id="${newRId}"/>\n</sheets>`
        );
      }
      
      // Update workbook files
      zip.file("xl/workbook.xml", newWorkbookXml);
      zip.file("xl/_rels/workbook.xml.rels", newWorkbookRels);
      
      // Generate output file
      const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `All_Contracts_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      
      setStatus(`Done! Generated ${staffData.length} contracts. Each staff has their own sheet with full formatting preserved — logos, colours, fonts all intact!`);
    } catch (err) {
      setStatus("Error: " + err.message);
      console.error(err);
    }
    setGenerating(false);
  };

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Contract Generation</h2>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 13, lineHeight: 1.7 }}>
        Upload your Excel file containing both <strong style={{ color: C.accent }}>Salary_breakdown</strong> and <strong style={{ color: C.accent }}>Contract_Template</strong> sheets.<br />
        The app duplicates the template sheet for each staff member — <strong style={{ color: C.success }}>logos, colours, borders and formatting all preserved</strong>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 1 — Upload Excel File</h3>
            <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: file ? C.success + "08" : "transparent" }}>
              <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={32} color={file ? C.success : C.accent} style={{ margin: "0 auto 12px" }} />
              <div style={{ color: file ? C.success : C.muted, fontSize: 13, fontWeight: 600 }}>{file ? `✓ ${file.name}` : "Click to upload .xlsx file"}</div>
              {staffData.length > 0 && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{staffData.length} staff records found</div>}
            </div>
            <input ref={fileRef} type="file" accept=".xlsx" onChange={handleFile} style={{ display: "none" }} />
          </Card>

          {sheetOptions.length > 0 && (
            <Card>
              <h3 style={{ color: C.warning, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 2 — Confirm Sheets</h3>
              <Select label="Data Sheet (staff list)" value={dataSheet} onChange={v => {
                setDataSheet(v);
                const wb = XLSX.read(new Uint8Array(rawBuffer), { type: "array" });
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[v], { header: 1 });
                if (rows.length > 0) {
                  const headers = rows[0].map((h, i) => h || `Column_${String.fromCharCode(65+i)}`);
                  setColumns(headers);
                  setStaffData(rows.slice(1).filter(r => r.some(c => c !== undefined && c !== "")).map(r => {
                    const o = {}; headers.forEach((h, i) => { o[h] = r[i] ?? ""; }); return o;
                  }));
                }
              }} options={sheetOptions} />
              <Select label="Contract Template Sheet" value={templateSheet} onChange={setTemplateSheet} options={sheetOptions} />
              {templateSheet && dataSheet && templateSheet !== dataSheet && (
                <div style={{ background: C.success + "15", border: `1px solid ${C.success}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.success }}>
                  ✓ Template sheet will be duplicated for each of the {staffData.length} staff members
                </div>
              )}
            </Card>
          )}
        </div>

        <Card>
          <h3 style={{ color: C.success, marginBottom: 12, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Step 3 — Map Columns to Template Cells</h3>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Based on your VBA macro, suggested mappings:<br />
            <span style={{ color: C.accent }}>Name (Col B) → B14 · Designation (Col A) → D22 · Gross Salary (Col J) → C45</span>
          </p>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Select label={i === 0 ? "Staff Data Column" : ""} value={m.column} onChange={v => { const u = [...mappings]; u[i].column = v; setMappings(u); }} options={columns.map(c => ({ value: c, label: c }))} />
              </div>
              <div style={{ color: C.accent, paddingBottom: 14, fontSize: 20, fontWeight: 700 }}>→</div>
              <div style={{ flex: 1 }}>
                <Input label={i === 0 ? "Template Cell" : ""} value={m.cell} onChange={v => { const u = [...mappings]; u[i].cell = v; setMappings(u); }} placeholder="e.g. B14" />
              </div>
              <div style={{ paddingBottom: 14 }}>
                <Btn small color={C.danger} onClick={() => setMappings(mappings.filter((_, idx) => idx !== i))}>✕</Btn>
              </div>
            </div>
          ))}
          <Btn small outline color={C.muted} onClick={() => setMappings([...mappings, { column: "", cell: "" }])} style={{ marginBottom: 20 }}>+ Add Another Mapping</Btn>

          <div style={{ background: C.bgDeep, borderRadius: 10, padding: 14, marginBottom: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Output</div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }}>
              ✓ One workbook with <strong style={{ color: C.accent }}>{staffData.length} contract sheets</strong><br />
              ✓ Each sheet named after the staff member<br />
              ✓ Logos, colours, borders fully preserved<br />
              ✓ Only mapped cells are changed
            </div>
          </div>

          <Btn onClick={generate} disabled={generating || !rawBuffer || !templateSheet || !dataSheet} style={{ width: "100%", padding: 14, fontSize: 14 }}>
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
      case "employees": return <Employees employees={employees} setEmployees={setEmployees} isHR={isHR} setSelectedEmployee={setSelectedEmployee} />;
      case "attendance": return <Attendance employees={employees} isHR={isHR} setSelectedEmployee={setSelectedEmployee} />;
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
          <div style={{ background: C.accent + "10", borderRadius: 12, padding: "8px", marginBottom: 10, border: `1px solid ${C.accent}22`, textAlign: "center" }}>
            <img src="data:image/png;base64,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" alt="HR Illustration" style={{ width: "100%", borderRadius: 8, opacity: 0.9 }} />
            <div style={{ fontSize: 9, color: C.muted, marginTop: 4, letterSpacing: 0.5 }}>PEOPLE OPERATIONS HQ</div>
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
      {selectedEmployee && (
        <>
          <div onClick={() => setSelectedEmployee(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998 }} />
          <EmployeeProfile
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onUpdate={(updated) => {
              setEmployees(employees.map(e => e.id === updated.id ? updated : e));
              setSelectedEmployee(updated);
            }}
          />
        </>
      )}
    </div>
  );
}
