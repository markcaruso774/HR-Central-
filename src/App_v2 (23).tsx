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
  { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
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


// ── STAFF DASHBOARD ──────────────────────────────────────────────────────────
function StaffDashboard({ user, employees, leaveRequests, isManager, setLeaveRequests }) {
  const [staffRecord, setStaffRecord] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "", from_date: "", to_date: "", reason: "", recipient_email: "", recipient_name: "", address_while_away: "", cc_emails: [] });
  const [ccSearch, setCcSearch] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [managerRequests, setManagerRequests] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        // Find staff record by email — run in parallel with other queries
        const [empsResult, mgrResult] = await Promise.all([
          supabase.from("employees").select("*"),
          isManager ? supabase.from("leave_requests").select("*").eq("recipient_email", user.email).eq("status", "Pending - Line Manager") : Promise.resolve({ data: [] })
        ]);

        const emps = empsResult.data || [];
        const me = emps.find(e => e.official_email?.toLowerCase() === user.email?.toLowerCase());
        setStaffRecord(me || null);
        setManagerRequests(mgrResult.data || []);

        if (me) {
          // Load attendance and leave balance in parallel
          const [attResult, balResult] = await Promise.all([
            supabase.from("attendance").select("*").eq("employee_id", me.id).order("date", { ascending: false }),
            supabase.from("leave_balances").select("*").eq("employee_id", me.id).maybeSingle()
          ]);
          setAttendanceRecords(attResult.data || []);
          setLeaveBalance(balResult.data || null);

             // Load profile picture using signed URL for reliable access
          try {
            const { data: signedData } = await supabase.storage.from("profile-pictures").createSignedUrl(`${me.id}.png`, 60 * 60 * 24 * 365);
            if (signedData?.signedUrl) setProfilePic(signedData.signedUrl);
          } catch {}
        }
      } catch (err) {
        console.error("StaffDashboard load error:", err);
      }
    };
    load();
  }, [user.email]);

  const uploadPicture = async (file) => {
    if (!staffRecord || !file) return;
    setUploading(true);
    try {
      const filePath = `${staffRecord.id}.png`;
      const { error } = await supabase.storage.from("profile-pictures").upload(filePath, file, { upsert: true, contentType: file.type });
      if (error) { console.error("Upload error:", error); setUploading(false); return; }
      // Use signed URL for reliable access regardless of bucket policy
      const { data: signedData } = await supabase.storage.from("profile-pictures").createSignedUrl(filePath, 60 * 60 * 24 * 365);
      if (signedData?.signedUrl) setProfilePic(signedData.signedUrl);
      else {
        // Fallback to public URL
        const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
        setProfilePic(data.publicUrl + "?t=" + Date.now());
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const submitLeave = async () => {
    if (!staffRecord) return;
    setSubmitting(true);
    const payload = {
      employee_id: staffRecord.id,
      employee_name: staffRecord.name,
      type: leaveForm.type,
      from_date: leaveForm.from_date,
      to_date: leaveForm.to_date,
      reason: leaveForm.reason,
      recipient_email: leaveForm.recipient_email,
      recipient_name: leaveForm.recipient_name,
      address_while_away: leaveForm.address_while_away,
      cc_emails: (leaveForm.cc_emails || []).join(","),
      status: "Pending - Line Manager"
    };
    const { data } = await supabase.from("leave_requests").insert([payload]).select();
    if (data?.[0]) {
      setLeaveRequests(prev => [...prev, data[0]]);
      // Notify line manager
      await supabase.from("notifications").insert([{
        user_email: leaveForm.recipient_email.toLowerCase(),
        type: "leave_request",
        title: "New Leave Request — Action Required",
        message: `${staffRecord?.name} has sent you a ${leaveForm.type} request (${leaveForm.from_date} to ${leaveForm.to_date}) for your approval.`,
        document_id: data[0].id,
        is_read: false,
      }]);
      // Notify CC'd staff
      for (const ccEmail of (leaveForm.cc_emails || [])) {
        await supabase.from("notifications").insert([{
          user_email: ccEmail.toLowerCase(),
          type: "leave_cc",
          title: "You Have Been Copied on a Leave Request",
          message: `${staffRecord?.name} has submitted a ${leaveForm.type} request (${leaveForm.from_date} to ${leaveForm.to_date}) to their Line Manager. You have been copied.`,
          document_id: data[0].id,
          is_read: false,
        }]);
      }
    }
    setShowConfirm(false);
    setShowLeaveForm(false);
    setLeaveForm({ type: "", from_date: "", to_date: "", reason: "", recipient_email: "", recipient_name: "", address_while_away: "", cc_emails: [] });
    setCcSearch("");
    setRecipientSearch("");
    setSubmitting(false);
  };

  const approveAsManager = async (req) => {
    await supabase.from("leave_requests").update({ status: "Pending - HR" }).eq("id", req.id);
    setManagerRequests(prev => prev.filter(r => r.id !== req.id));
    setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Pending - HR" } : r));
    // Notify HR
    const { data: hrRoles } = await supabase.from("user_roles").select("email").eq("role", "hr");
    for (const hr of (hrRoles || [])) {
      await supabase.from("notifications").insert([{
        user_email: hr.email.toLowerCase(),
        type: "leave_request",
        title: "Leave Request — Awaiting Final Approval",
        message: `${req.employee_name}'s ${req.type} request has been approved by Line Manager and requires your final approval.`,
        document_id: req.id,
        is_read: false,
      }]);
    }
    // Notify staff it was forwarded
    await supabase.from("notifications").insert([{
      user_email: req.recipient_email || req.employee_name,
      type: "leave_forwarded",
      title: "Leave Request Forwarded to HR",
      message: `Your Line Manager has approved your ${req.type} request. It has been forwarded to HR for final approval.`,
      document_id: req.id,
      is_read: false,
    }]);
    setConfirmAction(null);
  };

  const rejectAsManager = async (req) => {
    await supabase.from("leave_requests").update({ status: "Rejected" }).eq("id", req.id);
    setManagerRequests(prev => prev.filter(r => r.id !== req.id));
    setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Rejected" } : r));
    setConfirmAction(null);
  };

  // Leave calculations
  const myLeaves = leaveRequests.filter(l => l.employee_id === staffRecord?.id);
  const getDays = (from, to) => Math.ceil((new Date(to) - new Date(from)) / (1000*60*60*24)) + 1;
  const annualTaken = myLeaves.filter(l => l.status === "Approved" && l.type !== "Sick Leave").reduce((a, l) => a + getDays(l.from_date, l.to_date), 0);
  const sickTaken = myLeaves.filter(l => l.status === "Approved" && l.type === "Sick Leave").reduce((a, l) => a + getDays(l.from_date, l.to_date), 0);
  const annualEntitled = leaveBalance?.annual_entitled ?? 24;
  const sickEntitled = leaveBalance?.sick_entitled ?? 18;
  const annualLeft = Math.max(0, annualEntitled - annualTaken - (leaveBalance?.annual_prior || 0));
  const sickLeft = Math.max(0, sickEntitled - sickTaken - (leaveBalance?.sick_prior || 0));

  // Attendance stats
  const presentDays = attendanceRecords.filter(r => r.status === "Present").length;
  const absentDays = attendanceRecords.filter(r => r.status === "Absent").length;
  const lateDays = attendanceRecords.filter(r => r.status === "Late").length;

  // Recipient search
  const allEmails = employees.map(e => ({ email: e.official_email, name: e.name })).filter(e => e.email);
  const filteredRecipients = recipientSearch.length > 1
    ? allEmails.filter(e => e.name?.toLowerCase().includes(recipientSearch.toLowerCase()) || e.email?.toLowerCase().includes(recipientSearch.toLowerCase())).slice(0, 6)
    : [];

  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity Leave", "Paternity Leave", "Emergency Leave", "Unpaid Leave", "Study Leave"];

  // Daily quote — changes every day, same for everyone
  const quotes = [
    "The secret of getting ahead is getting started. — Mark Twain",
    "Coming together is a beginning, staying together is progress. — Henry Ford",
    "Your work is going to fill a large part of your life. Do great work. — Steve Jobs",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "Hard work beats talent when talent doesn't work hard. — Tim Notke",
    "The future depends on what you do today. — Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "Quality is not an act, it is a habit. — Aristotle",
    "It always seems impossible until it's done. — Nelson Mandela",
    "Strive not to be a success, but rather to be of value. — Albert Einstein",
    "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
    "The best preparation for tomorrow is doing your best today. — H. Jackson Brown Jr.",
    "A dream doesn't become reality through magic; it takes sweat, determination and hard work. — Colin Powell",
    "Nothing will work unless you do. — Maya Angelou",
    "The harder I work, the luckier I get. — Samuel Goldwyn",
    "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
    "Opportunities don't happen. You create them. — Chris Grosser",
    "Don't be afraid to give up the good to go for the great. — John D. Rockefeller",
    "I find that the harder I work, the more luck I seem to have. — Thomas Jefferson",
    "Teamwork makes the dream work. — John C. Maxwell",
    "Alone we can do so little; together we can do so much. — Helen Keller",
    "Great things in business are never done by one person. — Steve Jobs",
    "The way to get started is to quit talking and begin doing. — Walt Disney",
    "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
    "Excellence is not a skill, it is an attitude. — Ralph Marston",
    "Do what you can, with what you have, where you are. — Theodore Roosevelt",
    "Your attitude determines your direction. — Anonymous",
    "Small steps every day lead to big achievements. — Anonymous",
  ];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayQuote = quotes[dayOfYear % quotes.length];
  const firstName = staffRecord?.name?.split(" ")[0] || user.email?.split("@")[0] || "there";
  const greeting = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>
          Good {greeting}, {firstName}! 👋
        </h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 10 }}>
          {new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0d2240 60%, #162d4a 100%)", borderRadius: 16, padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.08)", border: "1px solid rgba(59,130,246,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(59,130,246,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -30, left: 10, width: 80, height: 80, background: "rgba(59,130,246,0.04)", borderRadius: "50%" }} />
          <div style={{ fontSize: 36, color: "rgba(59,130,246,0.3)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8, position: "relative" }}>"</div>
          <p style={{ color: "#e2eeff", fontSize: 13, margin: "0 0 12px 0", fontStyle: "italic", lineHeight: 1.8, fontFamily: "Georgia, serif", position: "relative" }}>
            {todayQuote.split(" — ")[0]}
          </p>
          {todayQuote.includes(" — ") && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <div style={{ height: 1, width: 24, background: "rgba(59,130,246,0.5)" }} />
              <span style={{ color: "#60a5fa", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>— {todayQuote.split(" — ")[1]}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {/* Left — Profile Card */}
        <div>
          <Card style={{ textAlign: "center", padding: 24, marginBottom: 16 }}>
            {/* Profile Picture */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
              <div onClick={() => fileRef.current.click()} style={{ width: 90, height: 90, borderRadius: "50%", background: C.accent + "33", border: `3px solid ${C.accent}`, overflow: "hidden", cursor: "pointer", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {profilePic
                  ? <img src={profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setProfilePic(null)} />
                  : <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size={40} color={C.accent} />
                }
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, background: C.accent, borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => fileRef.current.click()}>
                <Icon path="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" size={12} color="#fff" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) uploadPicture(e.target.files[0]); }} />
            {uploading && <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>Uploading...</div>}
            <div style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>{staffRecord?.name || user.email}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{staffRecord?.designation || "—"}</div>
            <div style={{ marginTop: 6 }}>
              <Badge color={isManager ? C.warning : C.accent}>{isManager ? "Line Manager" : "Employee"}</Badge>
            </div>
            {staffRecord && (
              <div style={{ marginTop: 16, textAlign: "left" }}>
                {[["Location", staffRecord.location], ["Nationality", staffRecord.nationality], ["Phone", staffRecord.phone_number], ["Email", staffRecord.official_email]].map(([label, val]) => val ? (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.muted, fontSize: 11 }}>{label}</span>
                    <span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>{val}</span>
                  </div>
                ) : null)}
              </div>
            )}
            {!staffRecord && <p style={{ color: C.warning, fontSize: 12, marginTop: 12 }}>Your email is not linked to an employee record. Please contact HR.</p>}
          </Card>

          {/* Leave Balance Card */}
          <Card>
            <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Leave Balance {new Date().getFullYear()}</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Annual Leave</span>
                <span style={{ color: annualLeft > 5 ? C.success : annualLeft > 0 ? C.warning : C.danger, fontWeight: 800, fontSize: 14 }}>{annualLeft} days left</span>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((annualLeft / annualEntitled) * 100)}%`, background: annualLeft > 5 ? C.success : annualLeft > 0 ? C.warning : C.danger, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Taken: {annualTaken} · Entitled: {annualEntitled}</div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Sick Leave</span>
                <span style={{ color: sickLeft > 3 ? C.success : sickLeft > 0 ? C.warning : C.danger, fontWeight: 800, fontSize: 14 }}>{sickLeft} days left</span>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((sickLeft / sickEntitled) * 100)}%`, background: sickLeft > 3 ? C.success : sickLeft > 0 ? C.warning : C.danger, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Taken: {sickTaken} · Entitled: {sickEntitled}</div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Attendance Summary */}
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>My Attendance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 12 }}>
              {[{ label: "Present", value: presentDays, color: C.success }, { label: "Absent", value: absentDays, color: C.danger }, { label: "Late", value: lateDays, color: C.warning }].map(({ label, value, color }) => (
                <div key={label} style={{ background: color + "15", border: `1px solid ${color}33`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
                  <div style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Manager — Requests Pending Approval */}
          {isManager && (
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ color: C.warning, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
                Leave Requests Awaiting My Approval {managerRequests.length > 0 && <Badge color={C.danger}>{managerRequests.length}</Badge>}
              </h3>
              {managerRequests.length === 0
                ? <p style={{ color: C.muted, fontSize: 13 }}>No pending requests.</p>
                : managerRequests.map(req => (
                  <div key={req.id} style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{req.employee_name}</div>
                        <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{req.type} · {req.from_date} → {req.to_date} ({getDays(req.from_date, req.to_date)} days)</div>
                        {req.reason && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Reason: {req.reason}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small color={C.success} onClick={() => setConfirmAction({ type: "approve", req })}>Approve</Btn>
                        <Btn small color={C.danger} onClick={() => setConfirmAction({ type: "reject", req })}>Reject</Btn>
                      </div>
                    </div>
                  </div>
                ))
              }
            </Card>
          )}

          {/* My Leave Requests */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>My Leave Requests</h3>
              <Btn small color={C.accent} onClick={() => setShowLeaveForm(!showLeaveForm)}>+ New Request</Btn>
            </div>

            {/* Leave Form */}
            {showLeaveForm && (
              <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
                <Select label="Leave Type" value={leaveForm.type} onChange={v => setLeaveForm({ ...leaveForm, type: v })} options={leaveTypes.map(t => ({ value: t, label: t }))} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                  <Input label="From Date" value={leaveForm.from_date} onChange={v => setLeaveForm({ ...leaveForm, from_date: v })} type="date" />
                  <Input label="To Date" value={leaveForm.to_date} onChange={v => setLeaveForm({ ...leaveForm, to_date: v })} type="date" />
                </div>
                {leaveForm.from_date && leaveForm.to_date && (
                  <div style={{ background: C.accent + "15", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.accent, marginBottom: 10 }}>
                    Duration: {getDays(leaveForm.from_date, leaveForm.to_date)} day(s) · Annual Leave remaining: {annualLeft} days
                  </div>
                )}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Reason</label>
                  <textarea value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 60 }} />
                </div>
                {/* Address While Away */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Address While Away</label>
                  <input value={leaveForm.address_while_away} onChange={e => setLeaveForm({ ...leaveForm, address_while_away: e.target.value })}
                    placeholder="Enter your address during leave..."
                    style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>

                {/* Line Manager Search */}
                <div style={{ marginBottom: 12, position: "relative" }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Send To (Line Manager)</label>
                  <input value={recipientSearch} onChange={e => { setRecipientSearch(e.target.value); setLeaveForm({ ...leaveForm, recipient_email: "", recipient_name: "" }); }}
                    placeholder="Type name or email to search..."
                    style={{ width: "100%", background: C.bgDeep, border: `1px solid ${leaveForm.recipient_email ? C.success : C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  {leaveForm.recipient_email && <div style={{ fontSize: 11, color: C.success, marginTop: 4 }}>✓ Sending to: {leaveForm.recipient_name} ({leaveForm.recipient_email})</div>}
                  {filteredRecipients.length > 0 && !leaveForm.recipient_email && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                      {filteredRecipients.map(r => (
                        <div key={r.email} onClick={() => { setLeaveForm({ ...leaveForm, recipient_email: r.email, recipient_name: r.name }); setRecipientSearch(r.name); }}
                          style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                          onMouseEnter={e => e.currentTarget.style.background = C.accent + "22"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                          <div style={{ color: C.muted, fontSize: 11 }}>{r.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* CC Field */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Copy To (Optional — colleagues to notify)</label>
                  <div style={{ position: "relative" }}>
                    <input value={ccSearch} onChange={e => setCcSearch(e.target.value)}
                      placeholder="Search name or email to add..."
                      style={{ width: "100%", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    {ccSearch.length > 1 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                        {allEmails.filter(e => !leaveForm.cc_emails.includes(e.email) && (e.name?.toLowerCase().includes(ccSearch.toLowerCase()) || e.email?.toLowerCase().includes(ccSearch.toLowerCase()))).slice(0, 5).map(r => (
                          <div key={r.email} onClick={() => { setLeaveForm({ ...leaveForm, cc_emails: [...leaveForm.cc_emails, r.email] }); setCcSearch(""); }}
                            style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                            onMouseEnter={e => e.currentTarget.style.background = C.accent+"22"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                            <div style={{ color: C.muted, fontSize: 11 }}>{r.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {leaveForm.cc_emails.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {leaveForm.cc_emails.map(email => (
                        <div key={email} style={{ display: "flex", alignItems: "center", gap: 6, background: C.accent+"15", border: `1px solid ${C.accent}33`, borderRadius: 20, padding: "4px 10px", fontSize: 11 }}>
                          <span style={{ color: C.accent }}>{email}</span>
                          <span onClick={() => setLeaveForm({ ...leaveForm, cc_emails: leaveForm.cc_emails.filter(e => e !== email) })} style={{ color: C.muted, cursor: "pointer", fontWeight: 700 }}>✕</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => { if (leaveForm.type && leaveForm.from_date && leaveForm.to_date && leaveForm.recipient_email) setShowConfirm(true); }} style={{ flex: 1 }} disabled={!leaveForm.type || !leaveForm.from_date || !leaveForm.to_date || !leaveForm.recipient_email}>Preview & Send</Btn>
                  <Btn outline color={C.muted} onClick={() => setShowLeaveForm(false)}>Cancel</Btn>
                </div>
              </div>
            )}

            {/* My leave requests table */}
            {myLeaves.length === 0
              ? <p style={{ color: C.muted, fontSize: 13 }}>No leave requests yet.</p>
              : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["Type", "From", "To", "Days", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.map(l => (
                      <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "10px" }}><Badge color={C.warning}>{l.type}</Badge></td>
                        <td style={{ padding: "10px", color: C.muted, fontSize: 12 }}>{l.from_date}</td>
                        <td style={{ padding: "10px", color: C.muted, fontSize: 12 }}>{l.to_date}</td>
                        <td style={{ padding: "10px", color: C.accent, fontWeight: 700 }}>{getDays(l.from_date, l.to_date)}d</td>
                        <td style={{ padding: "10px" }}>
                          <Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : l.status === "Pending - HR" ? C.accent : C.warning}>{l.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </Card>
        </div>
      </div>

      {/* Confirmation Popup — Submit Leave */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.card, borderRadius: 16, padding: 28, width: 420, border: `1px solid ${C.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Confirm Leave Request</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Please review your request before sending</p>
            <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              {[
                ["Employee", staffRecord?.name],
                ["Leave Type", leaveForm.type],
                ["From", leaveForm.from_date],
                ["To", leaveForm.to_date],
                ["Duration", `${getDays(leaveForm.from_date, leaveForm.to_date)} day(s)`],
                ["Reason", leaveForm.reason || "Not specified"],
                ["Sending To", `${leaveForm.recipient_name}`],
                ...(leaveForm.cc_emails.length > 0 ? [["Copied To", leaveForm.cc_emails.join(", ")]] : []),
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                  <span style={{ color: label === "Sending To" ? C.warning : C.text, fontSize: 12, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.warning + "15", border: `1px solid ${C.warning}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.warning, marginBottom: 16 }}>
              ⚠️ You are sending this to <strong>{leaveForm.recipient_name}</strong> as your Line Manager. Please confirm this is correct before sending.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={submitLeave} disabled={submitting} style={{ flex: 1 }}>{submitting ? "Sending..." : "Confirm & Send"}</Btn>
              <Btn outline color={C.muted} onClick={() => setShowConfirm(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup — Manager Approve/Reject */}
      {confirmAction && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.card, borderRadius: 16, padding: 28, width: 400, border: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
              {confirmAction.type === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
            </h3>
            <div style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ color: C.white, fontWeight: 700 }}>{confirmAction.req.employee_name}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{confirmAction.req.type} · {confirmAction.req.from_date} → {confirmAction.req.to_date}</div>
            </div>
            {confirmAction.type === "approve" && (
              <div style={{ background: C.success + "15", border: `1px solid ${C.success}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.success, marginBottom: 16 }}>
                ✓ You are approving as Line Manager. This request will be forwarded to HR for final approval.
              </div>
            )}
            {confirmAction.type === "reject" && (
              <div style={{ background: C.danger + "15", border: `1px solid ${C.danger}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.danger, marginBottom: 16 }}>
                ✗ You are rejecting this request as Line Manager.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <Btn color={confirmAction.type === "approve" ? C.success : C.danger} onClick={() => confirmAction.type === "approve" ? approveAsManager(confirmAction.req) : rejectAsManager(confirmAction.req)} style={{ flex: 1 }}>
                {confirmAction.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </Btn>
              <Btn outline color={C.muted} onClick={() => setConfirmAction(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
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

  // Daily quote
  const hrQuotes = [
    "The secret of getting ahead is getting started. — Mark Twain",
    "Coming together is a beginning, staying together is progress. — Henry Ford",
    "Your work is going to fill a large part of your life. Do great work. — Steve Jobs",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "Hard work beats talent when talent doesn't work hard. — Tim Notke",
    "The future depends on what you do today. — Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "Quality is not an act, it is a habit. — Aristotle",
    "It always seems impossible until it's done. — Nelson Mandela",
    "Strive not to be a success, but rather to be of value. — Albert Einstein",
    "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
    "The best preparation for tomorrow is doing your best today. — H. Jackson Brown Jr.",
    "A dream doesn't become reality through magic; it takes sweat, determination and hard work. — Colin Powell",
    "Nothing will work unless you do. — Maya Angelou",
    "The harder I work, the luckier I get. — Samuel Goldwyn",
    "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
    "Opportunities don't happen. You create them. — Chris Grosser",
    "Don't be afraid to give up the good to go for the great. — John D. Rockefeller",
    "I find that the harder I work, the more luck I seem to have. — Thomas Jefferson",
    "Teamwork makes the dream work. — John C. Maxwell",
    "Alone we can do so little; together we can do so much. — Helen Keller",
    "Great things in business are never done by one person. — Steve Jobs",
    "The way to get started is to quit talking and begin doing. — Walt Disney",
    "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
    "Excellence is not a skill, it is an attitude. — Ralph Marston",
    "Do what you can, with what you have, where you are. — Theodore Roosevelt",
    "Your attitude determines your direction. — Anonymous",
    "Small steps every day lead to big achievements. — Anonymous",
  ];
  const hrDayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const hrQuote = hrQuotes[hrDayOfYear % hrQuotes.length];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: C.white, fontSize: 26, fontWeight: 800, margin: 0 }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"} 👋
        </h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 10 }}>Here's what's happening across your organisation today</p>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0d2240 60%, #162d4a 100%)", borderRadius: 16, padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.08)", border: "1px solid rgba(59,130,246,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(59,130,246,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -30, left: 10, width: 80, height: 80, background: "rgba(59,130,246,0.04)", borderRadius: "50%" }} />
          <div style={{ fontSize: 36, color: "rgba(59,130,246,0.3)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8, position: "relative" }}>"</div>
          <p style={{ color: "#e2eeff", fontSize: 13, margin: "0 0 12px 0", fontStyle: "italic", lineHeight: 1.8, fontFamily: "Georgia, serif", position: "relative" }}>
            {hrQuote.split(" — ")[0]}
          </p>
          {hrQuote.includes(" — ") && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <div style={{ height: 1, width: 24, background: "rgba(59,130,246,0.5)" }} />
              <span style={{ color: "#60a5fa", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>— {hrQuote.split(" — ")[1]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Missing gender warning */}
      {noGender > 0 && (
        <div style={{ background: C.warning + "15", border: `1px solid ${C.warning}44`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={16} color={C.warning} />
          <span style={{ color: C.warning, fontSize: 12, fontWeight: 600 }}>{noGender} employee{noGender > 1 ? "s have" : " has"} no gender recorded — go to Employees module to update</span>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>

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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
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
              <Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : l.status === "Pending - HR" ? C.accent : C.warning}>{l.status}</Badge>
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
  const absentDates = attendanceRecords.filter(r => r.status === "Absent");

  // Total late duration calculation
  const totalLateMinutes = lateDates.reduce((acc, r) => {
    if (!r.late_duration) return acc;
    const str = String(r.late_duration).toLowerCase();
    const hrMatch = str.match(/(\d+\.?\d*)\s*h/);
    const minMatch = str.match(/(\d+\.?\d*)\s*m/);
    const numOnly = str.match(/^(\d+\.?\d*)$/);
    let mins = 0;
    if (hrMatch) mins += parseFloat(hrMatch[1]) * 60;
    if (minMatch) mins += parseFloat(minMatch[1]);
    if (numOnly && !hrMatch && !minMatch) mins += parseFloat(numOnly[1]);
    return acc + mins;
  }, 0);
  const totalLateHrs = Math.floor(totalLateMinutes / 60);
  const totalLateMins = Math.round(totalLateMinutes % 60);
  const totalLateStr = totalLateHrs > 0 ? `${totalLateHrs}h ${totalLateMins}m` : `${totalLateMins}m`;

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
    ["name", "Full Name"], ["staff_number", "Staff Number / ID"], ["department", "Department"],
    ["designation", "Designation"], ["location", "Location"],
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                  {fields.map(([key, label]) => (
                    <Input key={key} label={label} value={form[key] || ""} onChange={v => setForm({ ...form, [key]: v })} type={key === "dob" || key === "start_date" ? "date" : key === "salary" ? "number" : "text"} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
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
                  {lateDays > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Total: {totalLateStr}</div>}
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
              <Card style={{ marginBottom: 16 }}>
                <h3 style={{ color: C.warning, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Late Arrival Records · Total: {totalLateStr}</h3>
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

            {absentDates.length > 0 && (
              <Card style={{ marginBottom: 16 }}>
                <h3 style={{ color: C.danger, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Absent Records · {absentDays} day{absentDays > 1 ? "s" : ""}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {absentDates.map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg, borderRadius: 8, padding: "10px 14px" }}>
                      <div>
                        <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.date}</div>
                        {r.late_duration && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Reason: {r.late_duration}</div>}
                      </div>
                      <Badge color={C.danger}>Absent</Badge>
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
                            <input value={lateMinutes[e.id] || ""} 
                              onChange={ev => setLateMinutes({ ...lateMinutes, [e.id]: ev.target.value })}
                              onBlur={async (ev) => {
                                const duration = ev.target.value;
                                const existing = records.find(r => r.employee_id === e.id);
                                if (existing && existing.status === "Late") {
                                  await supabase.from("attendance").update({ late_duration: duration }).eq("id", existing.id);
                                  setRecords(records.map(r => r.employee_id === e.id ? { ...r, late_duration: duration } : r));
                                }
                              }}
                              placeholder="e.g. 30 mins"
                              style={{ width: 90, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                          )}
                        </div>
                      ) : s === "Absent" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: C.danger, fontSize: 12 }}>{getLate(e.id) || "—"}</span>
                          {isHR && (
                            <input value={absentReasons[e.id] || ""} 
                              onChange={ev => setAbsentReasons({ ...absentReasons, [e.id]: ev.target.value })}
                              onBlur={async (ev) => {
                                const reason = ev.target.value;
                                const existing = records.find(r => r.employee_id === e.id);
                                if (existing && existing.status === "Absent") {
                                  await supabase.from("attendance").update({ late_duration: reason }).eq("id", existing.id);
                                  setRecords(records.map(r => r.employee_id === e.id ? { ...r, late_duration: reason } : r));
                                }
                              }}
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

// ── LEAVE PDF GENERATOR ──────────────────────────────────────────────────────
const LEAVE_LOGO_B64 = "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";

async function generateLeaveFormPDF(leave, employees) {
  // Load jsPDF dynamically
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const H = 297;
  const margin = 20; const cw = W - 2 * margin;

  // Find employee record
  const emp = employees.find(e => e.id === leave.employee_id) || {};

  // Calculate days
  const getDays = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };
  const days = leave.from_date && leave.to_date ? getDays(leave.from_date, leave.to_date) : "";

  // Format date nicely
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  // Colors
  const darkBlue = [13, 31, 60];
  const accent = [26, 58, 107];
  const gold = [200, 169, 110];
  const lightBlue = [144, 202, 249];
  const border = [176, 190, 197];
  const textDark = [26, 26, 46];
  const muted = [84, 110, 122];
  const white = [255, 255, 255];
  const green = [27, 94, 32];
  const red = [183, 28, 28];
  const lightBg = [248, 250, 252];

  // Background
  doc.setFillColor(...lightBg);
  doc.rect(0, 0, W, H, "F");

  // Header bar
  doc.setFillColor(...darkBlue);
  doc.rect(0, 0, W, 38, "F");
  doc.setFillColor(...gold);
  doc.rect(0, 38, W, 1.5, "F");

  // Logo
  try {
    doc.addImage("data:image/jpeg;base64," + LEAVE_LOGO_B64, "JPEG", margin, 5, 22, 22);
  } catch(e) {}

  // Title
  doc.setTextColor(...white);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("LEAVE APPLICATION FORM", W / 2, 16, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightBlue);
  doc.text("CARE BEST INITIATIVE (CBI) — People Operations", W / 2, 23, { align: "center" });

  // Helper: section header
  const sectionHeader = (y, title, color = accent) => {
    doc.setFillColor(...color);
    doc.rect(margin, y, cw, 7, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin + 3, y + 4.8);
    return y + 7;
  };

  // Helper: field box
  const fieldBox = (x, y, w, h, label, value) => {
    doc.setFillColor(...white);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h, "FD");
    doc.setTextColor(...muted);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 2, y + 3.5);
    doc.setTextColor(...textDark);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(String(value || ""), x + 2, y + h - 2.5);
  };

  // Helper: checkbox row
  const checkboxRow = (y, options, selected) => {
    const bw = cw / options.length;
    options.forEach((opt, i) => {
      const x = margin + i * bw;
      const isSel = opt.toLowerCase() === (selected || "").toLowerCase();
      doc.setFillColor(...(isSel ? [227, 242, 253] : white));
      doc.setDrawColor(...(isSel ? accent : border));
      doc.setLineWidth(isSel ? 0.8 : 0.3);
      doc.rect(x + 1, y, bw - 2, 10, "FD");
      doc.setFillColor(...(isSel ? accent : white));
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.6);
      doc.rect(x + 3, y + 3, 4, 4, isSel ? "FD" : "D");
      if (isSel) {
        doc.setTextColor(...white);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("✓", x + 4, y + 6.5);
      }
      doc.setTextColor(...(isSel ? textDark : muted));
      doc.setFontSize(7.5);
      doc.setFont("helvetica", isSel ? "bold" : "normal");
      doc.text(opt, x + 9, y + 6.5);
    });
  };

  let y = 42;

  // SECTION 1: Staff Info
  y = sectionHeader(y, "1. Staff Information") + 1;
  fieldBox(margin, y, cw/2 - 1, 13, "Full Name", leave.employee_name || emp.name || "");
  fieldBox(margin + cw/2 + 1, y, cw/2 - 1, 13, "Staff Number / ID", emp.staff_number || "");
  y += 14;
  fieldBox(margin, y, cw/2 - 1, 13, "Department", emp.department || "");
  fieldBox(margin + cw/2 + 1, y, cw/2 - 1, 13, "Designation", emp.designation || "");
  y += 17;

  // SECTION 2: Leave Details
  y = sectionHeader(y, "2. Leave Details") + 1;
  fieldBox(margin, y, cw/3 - 1, 13, "Number of Days", String(days));
  fieldBox(margin + cw/3 + 1, y, cw/3 - 1, 13, "From Date", fmtDate(leave.from_date));
  fieldBox(margin + 2*cw/3 + 1, y, cw/3 - 1, 13, "To Date", fmtDate(leave.to_date));
  y += 17;

  // SECTION 3: Type of Leave
  y = sectionHeader(y, "3. Type of Leave") + 1;
  checkboxRow(y, ["Annual Leave", "Sick Leave", "Maternity Leave"], leave.type || "");
  y += 11;
  checkboxRow(y, ["Paternity Leave", "Emergency Leave", "Unpaid Leave"], leave.type || "");
  y += 14;

  // SECTION 4: Contact
  y = sectionHeader(y, "4. Contact While on Leave") + 1;
  fieldBox(margin, y, cw/2 - 1, 13, "Address While Away", leave.address_while_away || "");
  fieldBox(margin + cw/2 + 1, y, cw/2 - 1, 13, "Phone Number", emp.phone_number || "");
  y += 14;
  // Reason box
  doc.setFillColor(...white);
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, cw, 15, "FD");
  doc.setTextColor(...muted);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("Reason for Leave", margin + 2, y + 3.5);
  doc.setTextColor(...textDark);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(leave.reason || "", margin + 2, y + 10);
  y += 19;

  // SECTION 5: Applicant Declaration
  y = sectionHeader(y, "5. Applicant Declaration") + 1;
  fieldBox(margin, y, cw/2 - 1, 13, "Applicant Signature", "");
  fieldBox(margin + cw/2 + 1, y, cw/2 - 1, 13, "Date of Application", fmtDate(leave.created_at));
  y += 17;

  // SECTION 6: Line Manager
  y = sectionHeader(y, "6. Line Manager Recommendation", green) + 1;
  doc.setFillColor(...white);
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, cw, 9, "FD");
  doc.setTextColor(...muted);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  // Auto tick Deserves since line manager already approved
  doc.text("He/She", margin + 3, y + 5.8);
  doc.setFillColor(27, 94, 32); doc.setDrawColor(27, 94, 32);
  doc.rect(margin + 18, y + 2, 4, 4, "FD");
  doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont("helvetica", "bold");
  doc.text("v", margin + 19.2, y + 5.5);
  doc.setTextColor(...textDark); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
  doc.text("Deserves", margin + 24, y + 5.8);
  doc.setFillColor(...white); doc.setDrawColor(...border);
  doc.rect(margin + 52, y + 2, 4, 4, "D");
  doc.setTextColor(...muted); doc.setFont("helvetica", "normal");
  doc.text("Does not deserve  to proceed on leave", margin + 58, y + 5.8);
  y += 10;
  fieldBox(margin, y, cw/3 - 1, 13, "From", fmtDate(leave.from_date));
  fieldBox(margin + cw/3 + 1, y, cw/3 - 1, 13, "To", fmtDate(leave.to_date));
  fieldBox(margin + 2*cw/3 + 1, y, cw/3 - 1, 13, "Line Manager", "Approved — " + fmtDate(new Date().toISOString()));
  y += 17;

  // SECTION 7: HR Department
  y = sectionHeader(y, "7. HR Department", red) + 1;
  doc.setFillColor(...white);
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, cw, 9, "FD");
  doc.setTextColor(...muted);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("HR Comments:", margin + 3, y + 5.8);
  y += 10;
  fieldBox(margin, y, cw/3 - 1, 13, "Approved / Not Approved", leave.status === "Approved" ? "APPROVED" : "");
  fieldBox(margin + cw/3 + 1, y, cw/3 - 1, 13, "HR Officer Signature", "");
  fieldBox(margin + 2*cw/3 + 1, y, cw/3 - 1, 13, "Date", leave.status === "Approved" ? fmtDate(new Date().toISOString()) : "");

  // Footer
  doc.setFillColor(...darkBlue);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setFillColor(...gold);
  doc.rect(0, H - 12, W, 0.8, "F");
  doc.setTextColor(...lightBlue);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("CARE BEST INITIATIVE (CBI) — Confidential — Leave Application Form", W / 2, H - 4, { align: "center" });

  // Download
  const filename = `Leave_Form_${(leave.employee_name || "Staff").replace(/\s+/g, "_")}_${leave.from_date || ""}.pdf`;
  doc.save(filename);
}

// ── LEAVE ─────────────────────────────────────────────────────────────────────
function Leave({ employees, leaveRequests, setLeaveRequests, isHR, user }) {
  const [form, setForm] = useState({ employee_id: "", type: "", from_date: "", to_date: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("requests"); // "requests" or "balances"
  const [balances, setBalances] = useState({});
  const [savingBalance, setSavingBalance] = useState({});

  // Load leave balances from DB
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("leave_balances").select("*");
      if (data) {
        const map = {};
        data.forEach(b => { map[b.employee_id] = b; });
        setBalances(map);
      }
    };
    load().catch(() => {}); // silently fail if table doesn't exist yet
  }, []);

  const saveBalance = async (empId, field, value) => {
    setSavingBalance(s => ({ ...s, [empId]: true }));
    const existing = balances[empId];
    const payload = { employee_id: empId, [field]: parseFloat(value) || 0 };
    if (existing?.id) {
      await supabase.from("leave_balances").update(payload).eq("id", existing.id);
      setBalances(b => ({ ...b, [empId]: { ...b[empId], [field]: parseFloat(value) || 0 } }));
    } else {
      const { data } = await supabase.from("leave_balances").insert([payload]).select();
      if (data?.[0]) setBalances(b => ({ ...b, [empId]: data[0] }));
    }
    setSavingBalance(s => ({ ...s, [empId]: false }));
  };

  // Calculate leave balance for a staff member
  const calcBalance = (emp) => {
    const bal = balances[emp.id] || {};
    const annualEntitled = bal.annual_entitled ?? 24;
    const sickEntitled = bal.sick_entitled ?? 18;

    // Days taken from approved leave requests
    const empLeaves = leaveRequests.filter(l => l.employee_id === emp.id && l.status === "Approved");
    const getDays = (from, to) => Math.ceil((new Date(to) - new Date(from)) / (1000*60*60*24)) + 1;
    
    const annualTaken = empLeaves
      .filter(l => l.type !== "Sick Leave")
      .reduce((acc, l) => acc + getDays(l.from_date, l.to_date), 0);
    const sickTaken = empLeaves
      .filter(l => l.type === "Sick Leave")
      .reduce((acc, l) => acc + getDays(l.from_date, l.to_date), 0);

    const annualPrior = bal.annual_prior || 0;
    const sickPrior = bal.sick_prior || 0;

    const annualUsed = annualTaken + annualPrior;
    const sickUsed = sickTaken + sickPrior;

    return {
      annualEntitled, sickEntitled,
      annualTaken, sickTaken,
      annualPrior, sickPrior,
      annualUsed, sickUsed,
      annualLeft: Math.max(0, annualEntitled - annualUsed),
      sickLeft: Math.max(0, sickEntitled - sickUsed),
    };
  };

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
    const leave = leaveRequests.find(l => l.id === id);
    if (!leave) return;
    // Find staff email
    const { data: empData } = await supabase.from("employees").select("official_email").eq("id", leave.employee_id).single();
    const staffEmail = empData?.official_email;
    if (!staffEmail) return;
    if (status === "Approved") {
      await supabase.from("notifications").insert([{
        user_email: staffEmail.toLowerCase(),
        type: "leave_approved",
        title: "Your Leave Request Has Been Approved! ✅",
        message: `Your ${leave.type} request (${leave.from_date} to ${leave.to_date}) has been approved by HR. Enjoy your leave!`,
        document_id: id,
        is_read: false,
      }]);
    } else if (status === "Rejected") {
      await supabase.from("notifications").insert([{
        user_email: staffEmail.toLowerCase(),
        type: "leave_rejected",
        title: "Leave Request Rejected",
        message: `Your ${leave.type} request (${leave.from_date} to ${leave.to_date}) has been rejected by HR. Please contact HR for more information.`,
        document_id: id,
        is_read: false,
      }]);
    }
  };

  const deleteRequest = async (id) => {
    await supabase.from("leave_requests").delete().eq("id", id);
    setLeaveRequests(leaveRequests.filter(l => l.id !== id));
  };

  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity Leave", "Paternity Leave", "Emergency Leave", "Unpaid Leave", "Study Leave"].map(v => ({ value: v, label: v }));

  const filteredLeaves = filter === "All" ? leaveRequests : leaveRequests.filter(l => l.status === filter);
  const pendingHRCount = leaveRequests.filter(l => l.status === "Pending - HR").length;

  // Duration calculation
  const getDays = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const visibleEmployees = isHR ? employees : employees.filter(e => e.official_email === user?.email);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Leave Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["requests", "balances"].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "8px 20px", borderRadius: 20, border: `1px solid ${activeTab === tab ? C.accent : C.border}`, background: activeTab === tab ? C.accent + "22" : "transparent", color: activeTab === tab ? C.accent : C.muted, fontSize: 13, cursor: "pointer", fontWeight: 700, textTransform: "capitalize" }}>
              {tab === "requests" ? "Leave Requests" : "Leave Balances"}
            </div>
          ))}
        </div>
      </div>

      {activeTab === "requests" && (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
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
              {["All", "Pending - Line Manager", "Pending - HR", "Approved", "Rejected"].map(f => (
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
                    <td style={{ padding: "12px" }}><Badge color={l.status === "Approved" ? C.success : l.status === "Rejected" ? C.danger : l.status === "Pending - HR" ? C.accent : C.warning}>{l.status}</Badge></td>
                    {isHR && (
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {l.status !== "Approved" && (
                            <Btn small color={C.success} onClick={() => updateStatus(l.id, "Approved")}>Approve</Btn>
                          )}
                          {l.status !== "Rejected" && (
                            <Btn small color={C.danger} onClick={() => updateStatus(l.id, "Rejected")}>Reject</Btn>
                          )}
                          {l.status !== "Pending" && l.status !== "Pending - Line Manager" && (
                            <Btn small outline color={C.muted} onClick={() => updateStatus(l.id, "Pending - Line Manager")}>Reset</Btn>
                          )}
                          {(l.status === "Pending - HR" || l.status === "Approved") && (
                            <Btn small color={C.accent} onClick={() => generateLeaveFormPDF(l, employees)}>📄 Form</Btn>
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
      )}

      {activeTab === "balances" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>Leave Balances — {new Date().getFullYear()}</h3>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Annual Leave: 24 days · Sick Leave: 18 days · HR can modify entitlement and prior days taken</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Employee", "Annual Entitled", "Annual Prior", "Annual Taken", "Annual Left", "Sick Entitled", "Sick Prior", "Sick Taken", "Sick Left"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 10px", color: C.muted, fontSize: 10, textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleEmployees.map(emp => {
                  const b = calcBalance(emp);
                  const bal = balances[emp.id] || {};
                  return (
                    <tr key={emp.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px", color: C.text, fontWeight: 600, whiteSpace: "nowrap" }}>{emp.name}</td>
                      {/* Annual Entitled - editable by HR */}
                      <td style={{ padding: "10px" }}>
                        {isHR ? (
                          <input type="number" defaultValue={b.annualEntitled}
                            onBlur={e => saveBalance(emp.id, "annual_entitled", e.target.value)}
                            style={{ width: 50, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", color: C.accent, fontSize: 12, outline: "none", fontWeight: 700 }} />
                        ) : <span style={{ color: C.accent, fontWeight: 700 }}>{b.annualEntitled}</span>}
                      </td>
                      {/* Annual Prior - editable by HR */}
                      <td style={{ padding: "10px" }}>
                        {isHR ? (
                          <input type="number" defaultValue={b.annualPrior}
                            onBlur={e => saveBalance(emp.id, "annual_prior", e.target.value)}
                            style={{ width: 50, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", color: C.warning, fontSize: 12, outline: "none" }} />
                        ) : <span style={{ color: C.warning }}>{b.annualPrior}</span>}
                      </td>
                      <td style={{ padding: "10px", color: C.muted }}>{b.annualTaken}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ color: b.annualLeft > 5 ? C.success : b.annualLeft > 0 ? C.warning : C.danger, fontWeight: 800, fontSize: 13 }}>{b.annualLeft}</span>
                      </td>
                      {/* Sick Entitled - editable by HR */}
                      <td style={{ padding: "10px" }}>
                        {isHR ? (
                          <input type="number" defaultValue={b.sickEntitled}
                            onBlur={e => saveBalance(emp.id, "sick_entitled", e.target.value)}
                            style={{ width: 50, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", color: C.accent, fontSize: 12, outline: "none", fontWeight: 700 }} />
                        ) : <span style={{ color: C.accent, fontWeight: 700 }}>{b.sickEntitled}</span>}
                      </td>
                      {/* Sick Prior */}
                      <td style={{ padding: "10px" }}>
                        {isHR ? (
                          <input type="number" defaultValue={b.sickPrior}
                            onBlur={e => saveBalance(emp.id, "sick_prior", e.target.value)}
                            style={{ width: 50, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", color: C.warning, fontSize: 12, outline: "none" }} />
                        ) : <span style={{ color: C.warning }}>{b.sickPrior}</span>}
                      </td>
                      <td style={{ padding: "10px", color: C.muted }}>{b.sickTaken}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ color: b.sickLeft > 3 ? C.success : b.sickLeft > 0 ? C.warning : C.danger, fontWeight: 800, fontSize: 13 }}>{b.sickLeft}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {isHR && <p style={{ color: C.muted, fontSize: 11, marginTop: 12 }}>💡 Click any number in Annual/Sick Entitled or Prior columns to edit. Changes save automatically when you click away.</p>}
        </Card>
      )}
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
  const [workbook, setWorkbook] = useState(null);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [dataSheet, setDataSheet] = useState("");
  const [templateSheet, setTemplateSheet] = useState("");
  const [columns, setColumns] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [savedMappings, setSavedMappings] = useState([]);
  const [mappingName, setMappingName] = useState("");
  const [wordsSourceCol, setWordsSourceCol] = useState(0);
  const [wordsTargetCell, setWordsTargetCell] = useState("D45");
  const [wordsEnabled, setWordsEnabled] = useState(true);
  const [sheetNameCol, setSheetNameCol] = useState(0);
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [showSendModal, setShowSendModal] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hr_contract_mappings") || "[]");
      setSavedMappings(saved);
    } catch {}
  }, []);

  const numToWords = (n) => {
    if (!n && n !== 0) return "";
    try { n = parseFloat(n); } catch { return ""; }
    const naira = Math.floor(n);
    const kobo = Math.round((n - naira) * 100);
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const say = (n) => {
      if (n === 0) return "";
      else if (n < 20) return ones[n];
      else if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
      else if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100 ? " and "+say(n%100) : "");
      else if (n < 1000000) return say(Math.floor(n/1000))+" Thousand"+(n%1000 ? ", "+say(n%1000) : "");
      else if (n < 1000000000) return say(Math.floor(n/1000000))+" Million"+(n%1000000 ? ", "+say(n%1000000) : "");
      else return say(Math.floor(n/1000000000))+" Billion"+(n%1000000000 ? ", "+say(n%1000000000) : "");
    };
    let result = (say(naira) || "Zero") + " Naira";
    if (kobo > 0) result += ", " + say(kobo) + " Kobo";
    return result + " Only";
  };

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target.result; setRawBuffer(buffer);
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
        setWorkbook(wb);
        const names = wb.SheetNames;
        setSheetOptions(names.map(s => ({ value: s, label: s })));
        const dataSheetName = names.find(n => /salary|data|payroll|staff/i.test(n)) || names[0];
        const tmplName = names.find(n => /contract|template/i.test(n)) || names[1] || names[0];
        setDataSheet(dataSheetName); setTemplateSheet(tmplName);
        loadColumnsFromSheet(wb, dataSheetName);
        setStep(2);
      } catch(err) { setStatus({ msg: "Error reading file: " + err.message, type: "error" }); }
    };
    reader.readAsArrayBuffer(f);
  };

  const loadColumnsFromSheet = (wb, sheetName) => {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    if (!rows.length) return;
    const headers = rows[0].map((h, i) => ({ label: h ? String(h).trim() : `Col ${i+1}`, index: i }));
    setColumns(headers);
    setStaffData(rows.slice(1).filter(r => r.some(c => c !== undefined && c !== "")));
    // Set default mappings
    const guessCol = (kws) => { for (const kw of kws) { const idx = headers.findIndex(c => c.label.toLowerCase().includes(kw.toLowerCase())); if (idx !== -1) return headers[idx].index; } return 0; };
    setMappings([
      { col: guessCol(["name","NAME","B"]), cell: "B14", type: "text" },
      { col: guessCol(["designation","DESIGNATION","A"]), cell: "D22", type: "text" },
      { col: guessCol(["gross","GROSS","J"]), cell: "C45", type: "number" },
      { col: guessCol(["paye","PAYE","N"]), cell: "E112", type: "number" },
      { col: guessCol(["pension","PENSION","L"]), cell: "E113", type: "number" },
      { col: guessCol(["nhis","NHIS","M"]), cell: "E114", type: "number" },
    ]);
    setWordsSourceCol(guessCol(["gross","GROSS","J"]));
    setSheetNameCol(guessCol(["name","NAME","B"]));
  };

  const saveMapping = () => {
    if (!mappingName.trim()) { setStatus({ msg: "Please enter a name for this mapping", type: "error" }); return; }
    const entry = { name: mappingName, mappings, wordsSourceCol, wordsTargetCell, sheetNameCol, wordsEnabled, savedAt: new Date().toLocaleDateString() };
    const existing = savedMappings.findIndex(m => m.name === mappingName);
    const updated = existing >= 0 ? savedMappings.map((m,i) => i===existing ? entry : m) : [...savedMappings, entry];
    setSavedMappings(updated);
    localStorage.setItem("hr_contract_mappings", JSON.stringify(updated));
    setStatus({ msg: `✓ Mapping "${mappingName}" saved!`, type: "success" });
  };

  const loadMapping = (m) => {
    setMappings(m.mappings);
    setWordsSourceCol(m.wordsSourceCol);
    setWordsTargetCell(m.wordsTargetCell);
    setSheetNameCol(m.sheetNameCol);
    setWordsEnabled(m.wordsEnabled);
    setMappingName(m.name);
  };

  const deleteMapping = (i) => {
    const updated = savedMappings.filter((_, idx) => idx !== i);
    setSavedMappings(updated);
    localStorage.setItem("hr_contract_mappings", JSON.stringify(updated));
  };

  const updateNumericCell = (xml, cellRef, value) => {
    const pattern = new RegExp(`(<c r="${cellRef}"[^>]*>)(.*?)(</c>)`, "s");
    return xml.replace(pattern, (m, open, inner, close) => `${open.replace(/\s+t="[^"]*"/, "")}<v>${value}</v>${close}`);
  };

  const updateStringCell = (xml, cellRef, value) => {
    const safe = String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const pattern = new RegExp(`(<c r="${cellRef}"[^>]*>)(.*?)(</c>)`, "s");
    return xml.replace(pattern, (m, open) => {
      const sMatch = open.match(/s="(\d+)"/);
      return `<c r="${cellRef}"${sMatch ? ` s="${sMatch[1]}"` : ""} t="inlineStr"><is><t>${safe}</t></is></c>`;
    });
  };

  const generate = async () => {
    if (!rawBuffer) { setStatus({ msg: "Please upload a file first", type: "error" }); return; }
    setGenerating(true); setProgress(0);
    setStatus({ msg: "Loading file and preparing template...", type: "info" });
    try {
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const zip = await window.JSZip.loadAsync(rawBuffer);
      const binaryExts = [".jpeg",".jpg",".png",".gif",".emf",".wmf",".bin",".wdp"];
      const files = {};
      for (const name of Object.keys(zip.files)) {
        if (!zip.files[name].dir) {
          const isBinary = binaryExts.some(ext => name.toLowerCase().endsWith(ext));
          files[name] = await zip.files[name].async(isBinary ? "uint8array" : "string");
        }
      }
      const wbXml = files["xl/workbook.xml"];
      const wbRels = files["xl/_rels/workbook.xml.rels"];
      const sheetMatches = [...wbXml.matchAll(/<sheet[^>]+name="([^"]+)"[^>]+r:id="([^"]+)"/g)];
      const tmplInfo = sheetMatches.find(m => m[1] === templateSheet);
      if (!tmplInfo) throw new Error(`Template sheet "${templateSheet}" not found`);
      const relMatch = wbRels.match(new RegExp(`Id="${tmplInfo[2]}"[^>]+Target="([^"]+)"`));
      if (!relMatch) throw new Error("Could not find template sheet file");
      const templatePath = "xl/" + relMatch[1].replace(/^\.\//, "");
      const templateXml = files[templatePath];
      const templateRelsPath = templatePath.replace("worksheets/sheet", "worksheets/_rels/sheet").replace(".xml", ".xml.rels");
      const existingSheets = Object.keys(files).filter(f => f.match(/xl\/worksheets\/sheet\d+\.xml$/));
      const maxSheetNum = Math.max(...existingSheets.map(f => parseInt(f.match(/sheet(\d+)\.xml$/)[1])));
      const maxSheetId = Math.max(...[...wbXml.matchAll(/sheetId="(\d+)"/g)].map(m => parseInt(m[1])));
      let newWbXml = wbXml, newWbRels = wbRels, newCT = files["[Content_Types].xml"];

      for (let i = 0; i < staffData.length; i++) {
        const row = staffData[i];
        const sheetNum = maxSheetNum + i + 1;
        const sheetId = maxSheetId + i + 1;
        const rId = `rId_gen${sheetNum}`;
        let sheetXml = templateXml;
        for (const m of mappings) {
          const val = row[m.col] ?? "";
          if (m.type === "number") sheetXml = updateNumericCell(sheetXml, m.cell.toUpperCase(), val);
          else sheetXml = updateStringCell(sheetXml, m.cell.toUpperCase(), String(val));
        }
        if (wordsEnabled && wordsTargetCell) {
          sheetXml = updateStringCell(sheetXml, wordsTargetCell.toUpperCase(), numToWords(row[wordsSourceCol]));
        }
        files[`xl/worksheets/sheet${sheetNum}.xml`] = sheetXml;
        if (files[templateRelsPath]) files[`xl/worksheets/_rels/sheet${sheetNum}.xml.rels`] = files[templateRelsPath];
        let sheetName = String(row[sheetNameCol] || `Staff_${i+1}`).substring(0,31).replace(/[\\/:*?"<>|]/g,"").trim();
        newWbXml = newWbXml.replace("</sheets>", `<sheet name="${sheetName}" sheetId="${sheetId}" r:id="${rId}"/>\n</sheets>`);
        newWbRels = newWbRels.replace("</Relationships>", `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${sheetNum}.xml"/>\n</Relationships>`);
        newCT = newCT.replace("</Types>", `<Override PartName="/xl/worksheets/sheet${sheetNum}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n</Types>`);
        setProgress(Math.round(((i+1)/staffData.length)*100));
      }
      files["xl/workbook.xml"] = newWbXml;
      files["xl/_rels/workbook.xml.rels"] = newWbRels;
      files["[Content_Types].xml"] = newCT;
      const newZip = new window.JSZip();
      for (const [name, data] of Object.entries(files)) {
        if (data instanceof Uint8Array) newZip.file(name, data, { binary: true });
        else if (data) newZip.file(name, data);
      }
      const blob = await newZip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", compression: "DEFLATE" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `All_Contracts_${new Date().toISOString().split("T")[0]}.xlsx`; a.click();
      URL.revokeObjectURL(url);
      setStatus({ msg: `✅ Done! Generated ${staffData.length} contracts. Each staff has their own sheet with logos and formatting fully preserved.`, type: "success" });
    } catch(err) {
      setStatus({ msg: "❌ Error: " + err.message, type: "error" });
      console.error(err);
    }
    setGenerating(false);
  };

  const StepIndicator = ({ n, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: step === n ? C.accent+"22" : step > n ? C.success+"15" : "transparent", border: `1px solid ${step === n ? C.accent : step > n ? C.success : C.border}`, color: step === n ? C.accent : step > n ? C.success : C.muted, fontSize: 12, fontWeight: 700 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: step === n ? C.accent : step > n ? C.success : C.border, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{step > n ? "✓" : n}</div>
      {label}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Contract Generator</h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Generate contracts for all staff — logos, formatting and merged cells fully preserved</p>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[["1","Upload File"],["2","Select Sheets"],["3","Map Columns"],["4","Generate"]].map(([n,l]) => <StepIndicator key={n} n={parseInt(n)} label={l} />)}
      </div>

      {/* STEP 1 */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Step 1 — Upload Excel File</h3>
        <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 12, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: file ? C.success+"08" : "transparent" }}>
          <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={32} color={file ? C.success : C.accent} style={{ margin: "0 auto 12px" }} />
          <div style={{ color: file ? C.success : C.muted, fontSize: 13, fontWeight: 600 }}>{file ? `✓ ${file.name} — ${staffData.length} staff found` : "Click to upload .xlsx file"}</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Must contain a data sheet and a contract template sheet</div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xlsm" onChange={handleFile} style={{ display: "none" }} />
      </Card>

      {step >= 2 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ color: C.warning, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Step 2 — Select Sheets</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            <Select label="Data Sheet (Staff List)" value={dataSheet} onChange={v => { setDataSheet(v); loadColumnsFromSheet(workbook, v); }} options={sheetOptions} />
            <Select label="Contract Template Sheet" value={templateSheet} onChange={setTemplateSheet} options={sheetOptions} />
          </div>
          {staffData.length > 0 && (
            <div style={{ marginTop: 10, padding: "8px 14px", background: C.success+"15", border: `1px solid ${C.success}33`, borderRadius: 8, fontSize: 12, color: C.success }}>
              ✓ {staffData.length} staff records found · Template: "{templateSheet}"
            </div>
          )}
          <div style={{ marginTop: 14, textAlign: "right" }}>
            <Btn onClick={() => setStep(3)}>Next: Map Columns →</Btn>
          </div>
        </Card>
      )}

      {step >= 3 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ color: C.success, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Step 3 — Map Columns to Template Cells</h3>

          {/* Saved mappings */}
          {savedMappings.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Saved Mappings — Click to Load</div>
              {savedMappings.map((m, i) => (
                <div key={i} onClick={() => loadMapping(m)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 6, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div>
                    <div style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>📋 {m.name}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{m.mappings.length} mappings · Saved {m.savedAt}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge color={C.success}>Load</Badge>
                    <Btn small color={C.danger} onClick={e => { e.stopPropagation(); deleteMapping(i); }}>🗑</Btn>
                  </div>
                </div>
              ))}
              <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
            </div>
          )}

          {/* Mapping rows */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 120px 100px auto", gap: 8, marginBottom: 8, padding: "0 12px" }}>
            {["Data Column","","Template Cell","Type",""].map((h,i) => <div key={i} style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>)}
          </div>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 24px 120px 100px auto", gap: 8, alignItems: "end", marginBottom: 8, padding: 10, background: C.bgDeep, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <Select value={String(m.col)} onChange={v => setMappings(mappings.map((mp,idx) => idx===i ? {...mp, col: parseInt(v)} : mp))} options={columns.map(c => ({ value: String(c.index), label: c.label }))} />
              <div style={{ color: C.accent, textAlign: "center", fontWeight: 700, paddingBottom: 4 }}>→</div>
              <Input value={m.cell} onChange={v => setMappings(mappings.map((mp,idx) => idx===i ? {...mp, cell: v.toUpperCase()} : mp))} placeholder="e.g. B14" />
              <Select value={m.type} onChange={v => setMappings(mappings.map((mp,idx) => idx===i ? {...mp, type: v} : mp))} options={[{value:"text",label:"Text"},{value:"number",label:"Number"}]} />
              <Btn small color={C.danger} onClick={() => setMappings(mappings.filter((_,idx) => idx!==i))}>✕</Btn>
            </div>
          ))}
          <Btn small outline color={C.muted} onClick={() => setMappings([...mappings, { col: 0, cell: "", type: "text" }])} style={{ marginBottom: 16 }}>+ Add Row</Btn>

          {/* Salary in words */}
          <div style={{ padding: 14, background: C.bgDeep, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginBottom: 10 }}>Salary in Words</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 8 }}>
              <Select label="Source Column (Salary Number)" value={String(wordsSourceCol)} onChange={v => setWordsSourceCol(parseInt(v))} options={columns.map(c => ({ value: String(c.index), label: c.label }))} />
              <Input label="Target Cell" value={wordsTargetCell} onChange={setWordsTargetCell} placeholder="e.g. D45" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => setWordsEnabled(!wordsEnabled)} style={{ width: 36, height: 20, borderRadius: 10, background: wordsEnabled ? C.accent : C.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, left: wordsEnabled ? 19 : 3, width: 14, height: 14, background: "white", borderRadius: "50%", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>Auto-generate salary in words (Naira + Kobo)</span>
            </div>
          </div>

          {/* Sheet naming */}
          <Select label="Name Each Sheet After (Column)" value={String(sheetNameCol)} onChange={v => setSheetNameCol(parseInt(v))} options={columns.map(c => ({ value: String(c.index), label: c.label }))} />

          {/* Save mapping */}
          <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input label="Save This Mapping As" value={mappingName} onChange={setMappingName} placeholder="e.g. CBI Standard Contract, Consultancy 2026..." />
            </div>
            <Btn outline color={C.muted} onClick={saveMapping}>💾 Save</Btn>
          </div>

          <div style={{ marginTop: 14, textAlign: "right" }}>
            <Btn onClick={() => setStep(4)}>Next: Generate →</Btn>
          </div>
        </Card>
      )}

      {step >= 4 && (
        <Card>
          <h3 style={{ color: C.accent, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Step 4 — Generate Contracts</h3>
          <div style={{ background: C.bgDeep, borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 2 }}>
            📊 <strong style={{ color: C.text }}>Data Sheet:</strong> <span style={{ color: C.muted }}>{dataSheet} · {staffData.length} staff</span><br />
            📄 <strong style={{ color: C.text }}>Template Sheet:</strong> <span style={{ color: C.muted }}>{templateSheet}</span><br />
            🔗 <strong style={{ color: C.text }}>Mappings:</strong> <span style={{ color: C.muted }}>{mappings.length} column → cell mappings</span><br />
            💬 <strong style={{ color: C.text }}>Salary in Words:</strong> <span style={{ color: C.muted }}>{wordsEnabled ? `Yes — cell ${wordsTargetCell}` : "Disabled"}</span>
          </div>
          {generating && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                <span>Generating contracts...</span><span>{progress}%</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, transition: "width 0.3s" }} />
              </div>
            </div>
          )}
          <Btn onClick={generate} disabled={generating || !rawBuffer} style={{ width: "100%", padding: 14, fontSize: 14, justifyContent: "center" }}>
            {generating ? `Generating... ${progress}%` : `⚡ Generate All ${staffData.length} Contracts`}
          </Btn>
          {status.msg && status.type === "success" && (
            <Btn color={C.success} onClick={() => setShowSendModal(true)} style={{ width: "100%", padding: 12, fontSize: 13, justifyContent: "center", marginTop: 8 }}>
              📤 Convert & Send Contracts to Staff
            </Btn>
          )}
          {status.msg && (
            <div style={{ marginTop: 12, padding: "12px 16px", background: status.type==="success" ? C.success+"15" : status.type==="error" ? C.danger+"15" : C.accent+"15", border: `1px solid ${status.type==="success" ? C.success : status.type==="error" ? C.danger : C.accent}44`, borderRadius: 10, color: status.type==="success" ? C.success : status.type==="error" ? C.danger : C.accent, fontSize: 13 }}>
              {status.msg}
            </div>
          )}
        </Card>
      )}
      {showSendModal && <PDFSendToStaff user={window.__hrUser} employees={window.__hrEmployees || []} docType="contract" onClose={() => setShowSendModal(false)} />}
    </div>
  );
}


// ── PAYSLIPS ──────────────────────────────────────────────────────────────────
function Payslips() {
  const [file, setFile] = useState(null);
  const [rawBuffer, setRawBuffer] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [dataSheet, setDataSheet] = useState("");
  const [templateSheet, setTemplateSheet] = useState("");
  const [columns, setColumns] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [savedMappings, setSavedMappings] = useState([]);
  const [mappingName, setMappingName] = useState("");
  const [sheetNameCol, setSheetNameCol] = useState(0);
  const [headerCell, setHeaderCell] = useState("D2");
  const [headerFormat, setHeaderFormat] = useState("{MONTH} SALARY PAYSLIP");
  const [paymentDateCell, setPaymentDateCell] = useState("I5");
  const [monthYear, setMonthYear] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [location, setLocation] = useState("MAIDUGURI");
  const [staffAttendance, setStaffAttendance] = useState([]);
  const [applyWorked, setApplyWorked] = useState("20");
  const [applyAbsent, setApplyAbsent] = useState("0");
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [showSendModal, setShowSendModal] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    try { setSavedMappings(JSON.parse(localStorage.getItem("hr_payslip_mappings") || "[]")); } catch {}
    // Set default month and payment date
    const now = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    setMonthYear(`${months[now.getMonth()].toUpperCase()} ${now.getFullYear()}`);
    const dd = String(25).padStart(2,"0");
    const mm = String(now.getMonth()+1).padStart(2,"0");
    setPaymentDate(`${now.getFullYear()}-${mm}-${dd}`);
  }, []);

  const numToWords = (n) => {
    if (!n && n !== 0) return "";
    try { n = parseFloat(n); } catch { return ""; }
    const naira = Math.floor(n); const kobo = Math.round((n - naira) * 100);
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const say = (n) => { if (n===0) return ""; else if (n<20) return ones[n]; else if (n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); else if (n<1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100?" and "+say(n%100):""); else if (n<1000000) return say(Math.floor(n/1000))+" Thousand"+(n%1000?", "+say(n%1000):""); else if (n<1000000000) return say(Math.floor(n/1000000))+" Million"+(n%1000000?", "+say(n%1000000):""); else return say(Math.floor(n/1000000000))+" Billion"+(n%1000000000?", "+say(n%1000000000):""); };
    let r = (say(naira)||"Zero")+" Naira"; if (kobo>0) r += ", "+say(kobo)+" Kobo"; return r+" Only";
  };

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target.result; setRawBuffer(buffer);
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
        setWorkbook(wb);
        const names = wb.SheetNames;
        setSheetOptions(names.map(s => ({ value: s, label: s })));
        const dataName = names.find(n => /payroll|master|data|staff/i.test(n)) || names[names.length-1];
        const tmplName = names.find(n => /template|payslip|slip/i.test(n)) || names[0];
        setDataSheet(dataName); setTemplateSheet(tmplName);
        loadCols(wb, dataName);
        setStep(2);
      } catch(err) { setStatus({ msg: "Error: " + err.message, type: "error" }); }
    };
    reader.readAsArrayBuffer(f);
  };

  const loadCols = (wb, sheetName) => {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    if (!rows.length) return;
    let headerRow = 0; let maxCols = 0;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const count = rows[i].filter(c => c !== undefined && c !== null && c !== "").length;
      if (count > maxCols) { maxCols = count; headerRow = i; }
    }
    const headers = rows[headerRow].map((h, i) => ({ label: h ? String(h).trim() : `Col ${i+1}`, index: i }));
    setColumns(headers);
    const data = rows.slice(headerRow + 1).filter(r => r.some(c => c !== undefined && c !== null && c !== ""));
    setStaffData(data);
    const guessCol = (kws) => { for (const kw of kws) { const idx = headers.findIndex(c => c.label.toLowerCase().includes(kw.toLowerCase())); if (idx !== -1) return headers[idx].index; } return 0; };
    setMappings([
      { col: guessCol(["name","NAME","F"]), cell: "C6", type: "text" },
      { col: guessCol(["position","POSITION","G"]), cell: "C7", type: "text" },
      { col: guessCol(["code","CODE","E","STAFF CODE"]), cell: "C5", type: "text" },
      { col: guessCol(["account","ACCOUNT","N"]), cell: "I7", type: "text" },
      { col: guessCol(["bank","BANK","O"]), cell: "I8", type: "text" },
      { col: guessCol(["gross","GROSS","H"]), cell: "F18", type: "number" },
      { col: guessCol(["paye","PAYE","I"]), cell: "F20", type: "number" },
      { col: guessCol(["pension","PENSION","J"]), cell: "F22", type: "number" },
      { col: guessCol(["nhis","NHIS","K","health"]), cell: "F21", type: "number" },
      { col: guessCol(["total deduction","TOTAL","L"]), cell: "F23", type: "number" },
      { col: guessCol(["net","NET","M"]), cell: "F25", type: "number" },
    ]);
    setSheetNameCol(guessCol(["name","NAME","F"]));
  };

  const buildAttendanceTable = (data, nameIdx, posIdx) => {
    return data.filter(row => row[nameIdx]).map((row, i) => ({
      index: i, name: String(row[nameIdx]||"").trim(),
      position: String(row[posIdx??0]||"").trim(),
      daysWorked: 20, daysAbsent: 0, rowData: row
    }));
  };

  const saveMapping = () => {
    if (!mappingName.trim()) { setStatus({ msg: "Please enter a name", type: "error" }); return; }
    const entry = { name: mappingName, mappings, sheetNameCol, headerCell, headerFormat, paymentDateCell, savedAt: new Date().toLocaleDateString() };
    const existing = savedMappings.findIndex(m => m.name === mappingName);
    const updated = existing >= 0 ? savedMappings.map((m,i) => i===existing ? entry : m) : [...savedMappings, entry];
    setSavedMappings(updated);
    localStorage.setItem("hr_payslip_mappings", JSON.stringify(updated));
    setStatus({ msg: `✓ Mapping "${mappingName}" saved!`, type: "success" });
  };

  const loadMapping = (m) => { setMappings(m.mappings); setSheetNameCol(m.sheetNameCol); setHeaderCell(m.headerCell||"D2"); setHeaderFormat(m.headerFormat||"{MONTH} SALARY PAYSLIP"); setPaymentDateCell(m.paymentDateCell||"I5"); setMappingName(m.name); };
  const deleteMapping = (i) => { const u = savedMappings.filter((_,idx) => idx!==i); setSavedMappings(u); localStorage.setItem("hr_payslip_mappings", JSON.stringify(u)); };

  const applyToAll = (type) => {
    const val = parseInt(type==="worked" ? applyWorked : applyAbsent) || 0;
    setStaffAttendance(staffAttendance.map(s => type==="worked" ? {...s, daysWorked: val} : {...s, daysAbsent: val}));
  };

  const updateNumCell = (xml, ref, val) => { const p = new RegExp(`(<c r="${ref}"[^>]*>)(.*?)(</c>)`,"s"); return xml.replace(p, (m,o,i,c) => `${o.replace(/\s+t="[^"]*"/,"")}<v>${val}</v>${c}`); };
  const updateStrCell = (xml, ref, val) => { const safe = String(val).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); const p = new RegExp(`(<c r="${ref}"[^>]*>)(.*?)(</c>)`,"s"); return xml.replace(p, (m,o) => { const s = o.match(/s="(\d+)"/); return `<c r="${ref}"${s?` s="${s[1]}"`:""} t="inlineStr"><is><t>${safe}</t></is></c>`; }); };

  const generate = async () => {
    if (!rawBuffer) { setStatus({ msg: "Please upload a file first", type: "error" }); return; }
    setGenerating(true); setProgress(0);
    try {
      if (!window.JSZip) await new Promise((res,rej) => { const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
      const zip = await window.JSZip.loadAsync(rawBuffer);
      const binExts = [".jpeg",".jpg",".png",".gif",".emf",".wmf",".bin",".wdp"];
      const files = {};
      for (const name of Object.keys(zip.files)) { if (!zip.files[name].dir) { const isBin = binExts.some(e => name.toLowerCase().endsWith(e)); files[name] = await zip.files[name].async(isBin?"uint8array":"string"); } }
      const wbXml = files["xl/workbook.xml"]; const wbRels = files["xl/_rels/workbook.xml.rels"];
      const smArr = [...wbXml.matchAll(/<sheet[^>]+name="([^"]+)"[^>]+r:id="([^"]+)"/g)];
      const tmplInfo = smArr.find(m => m[1]===templateSheet);
      if (!tmplInfo) throw new Error(`Template sheet "${templateSheet}" not found`);
      const relMatch = wbRels.match(new RegExp(`Id="${tmplInfo[2]}"[^>]+Target="([^"]+)"`));
      if (!relMatch) throw new Error("Could not find template file");
      const tmplPath = "xl/"+relMatch[1].replace(/^\.\//,"");
      const tmplXml = files[tmplPath];
      const tmplRelsPath = tmplPath.replace("worksheets/sheet","worksheets/_rels/sheet").replace(".xml",".xml.rels");
      const exSheets = Object.keys(files).filter(f => f.match(/xl\/worksheets\/sheet\d+\.xml$/));
      const maxSN = Math.max(...exSheets.map(f => parseInt(f.match(/sheet(\d+)\.xml$/)[1])));
      const maxSId = Math.max(...[...wbXml.matchAll(/sheetId="(\d+)"/g)].map(m => parseInt(m[1])));
      const payDateFmt = paymentDate ? new Date(paymentDate).toLocaleDateString("en-GB") : "";
      const headerText = headerFormat.replace("{MONTH}", monthYear);
      let newWbXml=wbXml, newWbRels=wbRels, newCT=files["[Content_Types].xml"];

      for (let i=0; i<staffAttendance.length; i++) {
        const s = staffAttendance[i]; const row = s.rowData;
        const sn=maxSN+i+1, sid=maxSId+i+1, rId=`rId_ps${sn}`;
        let xml = tmplXml;
        for (const m of mappings) { const val=row[m.col]??""; xml = m.type==="number" ? updateNumCell(xml,m.cell.toUpperCase(),val) : updateStrCell(xml,m.cell.toUpperCase(),String(val)); }
        xml = updateStrCell(xml, headerCell.toUpperCase(), headerText);
        xml = updateStrCell(xml, paymentDateCell.toUpperCase(), payDateFmt);
        xml = updateStrCell(xml, "C8", location);
        xml = updateStrCell(xml, "I6", String(row[sheetNameCol]||"").trim().toUpperCase());
        xml = updateNumCell(xml, "C9", s.daysWorked);
        xml = updateNumCell(xml, "I9", s.daysAbsent);
        const gross = parseFloat(row[mappings.find(m=>m.cell==="F18")?.col]||0);
        if (gross) { xml=updateNumCell(xml,"F12",(gross*0.40).toFixed(2)); xml=updateNumCell(xml,"F13",(gross*0.15).toFixed(2)); xml=updateNumCell(xml,"F14",(gross*0.15).toFixed(2)); xml=updateNumCell(xml,"F15",(gross*0.15).toFixed(2)); xml=updateNumCell(xml,"F16",(gross*0.15).toFixed(2)); }
        files[`xl/worksheets/sheet${sn}.xml`] = xml;
        if (files[tmplRelsPath]) files[`xl/worksheets/_rels/sheet${sn}.xml.rels`] = files[tmplRelsPath];
        let shName = String(row[sheetNameCol]||`Staff_${i+1}`).substring(0,31).replace(/[\\/:*?"<>|]/g,"").trim();
        newWbXml = newWbXml.replace("</sheets>",`<sheet name="${shName}" sheetId="${sid}" r:id="${rId}"/>\n</sheets>`);
        newWbRels = newWbRels.replace("</Relationships>",`<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${sn}.xml"/>\n</Relationships>`);
        newCT = newCT.replace("</Types>",`<Override PartName="/xl/worksheets/sheet${sn}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n</Types>`);
        setProgress(Math.round(((i+1)/staffAttendance.length)*100));
      }
      files["xl/workbook.xml"]=newWbXml; files["xl/_rels/workbook.xml.rels"]=newWbRels; files["[Content_Types].xml"]=newCT;
      const nz = new window.JSZip();
      for (const [name,data] of Object.entries(files)) { if (data instanceof Uint8Array) nz.file(name,data,{binary:true}); else if (data) nz.file(name,data); }
      const blob = await nz.generateAsync({type:"blob",mimeType:"application/vnd.ms-excel.sheet.macroEnabled.12",compression:"DEFLATE"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`Payslips_${monthYear.replace(" ","_")}.xlsm`; a.click();
      URL.revokeObjectURL(url);
      setStatus({ msg: `✅ Done! Generated ${staffAttendance.length} payslips for ${monthYear}.`, type: "success" });
    } catch(err) { setStatus({ msg: "❌ Error: "+err.message, type: "error" }); console.error(err); }
    setGenerating(false);
  };

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  const monthOptions = [];
  for (let y = now.getFullYear(); y <= now.getFullYear()+1; y++) {
    for (let m = 0; m < 12; m++) monthOptions.push({ value: `${months[m].toUpperCase()} ${y}`, label: `${months[m]} ${y}` });
  }

  const StepIndicator = ({ n, label }) => (
    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, background: step===n ? C.success+"22" : step>n ? C.success+"15" : "transparent", border:`1px solid ${step===n ? C.success : step>n ? C.success : C.border}`, color: step===n ? C.success : step>n ? C.success : C.muted, fontSize:12, fontWeight:700 }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background: step===n ? C.success : step>n ? C.success : C.border, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>{step>n?"✓":n}</div>
      {label}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ color:C.white, fontSize:24, fontWeight:800, margin:0 }}>Payslip Generator</h2>
        <p style={{ color:C.muted, fontSize:13, marginTop:4 }}>Generate monthly payslips — logos and formatting fully preserved</p>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {[["1","Upload"],["2","Sheets"],["3","Map Columns"],["4","Monthly"],["5","Generate"]].map(([n,l]) => <StepIndicator key={n} n={parseInt(n)} label={l} />)}
      </div>

      {/* Step 1 */}
      <Card style={{ marginBottom:16 }}>
        <h3 style={{ color:C.success, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 1 — Upload Payslip Excel File</h3>
        <div onClick={() => fileRef.current.click()} style={{ border:`2px dashed ${file?C.success:C.border}`, borderRadius:12, padding:"32px 20px", textAlign:"center", cursor:"pointer", background:file?C.success+"08":"transparent" }}>
          <Icon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={32} color={file?C.success:C.accent} style={{ margin:"0 auto 12px" }} />
          <div style={{ color:file?C.success:C.muted, fontSize:13, fontWeight:600 }}>{file ? `✓ ${file.name} — ${staffData.length} staff found` : "Click to upload .xlsx or .xlsm file"}</div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xlsm" onChange={handleFile} style={{ display:"none" }} />
      </Card>

      {/* Step 2 */}
      {step>=2 && (
        <Card style={{ marginBottom:16 }}>
          <h3 style={{ color:C.warning, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 2 — Select Sheets</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
            <Select label="Payroll Data Sheet" value={dataSheet} onChange={v => { setDataSheet(v); loadCols(workbook,v); }} options={sheetOptions} />
            <Select label="Payslip Template Sheet" value={templateSheet} onChange={setTemplateSheet} options={sheetOptions} />
          </div>
          <div style={{ marginTop:14, textAlign:"right" }}>
            <Btn color={C.success} onClick={() => setStep(3)}>Next: Map Columns →</Btn>
          </div>
        </Card>
      )}

      {/* Step 3 */}
      {step>=3 && (
        <Card style={{ marginBottom:16 }}>
          <h3 style={{ color:C.accent, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 3 — Map Columns to Template Cells</h3>
          {savedMappings.length>0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Saved Mappings</div>
              {savedMappings.map((m,i) => (
                <div key={i} onClick={() => loadMapping(m)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:10, marginBottom:6, cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=C.success}
                  onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                  <div>
                    <div style={{ color:C.text, fontWeight:600, fontSize:13 }}>📋 {m.name}</div>
                    <div style={{ color:C.muted, fontSize:11 }}>{m.mappings.length} mappings · {m.savedAt}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Badge color={C.success}>Load</Badge>
                    <Btn small color={C.danger} onClick={e => { e.stopPropagation(); deleteMapping(i); }}>🗑</Btn>
                  </div>
                </div>
              ))}
              <div style={{ height:1, background:C.border, margin:"16px 0" }} />
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 24px 120px 100px auto", gap:8, marginBottom:8, padding:"0 12px" }}>
            {["Data Column","","Template Cell","Type",""].map((h,i) => <div key={i} style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase" }}>{h}</div>)}
          </div>
          {mappings.map((m,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 24px 120px 100px auto", gap:8, alignItems:"end", marginBottom:8, padding:10, background:C.bgDeep, borderRadius:10, border:`1px solid ${C.border}` }}>
              <Select value={String(m.col)} onChange={v => setMappings(mappings.map((mp,idx) => idx===i?{...mp,col:parseInt(v)}:mp))} options={columns.map(c => ({value:String(c.index),label:c.label}))} />
              <div style={{ color:C.success, textAlign:"center", fontWeight:700, paddingBottom:4 }}>→</div>
              <Input value={m.cell} onChange={v => setMappings(mappings.map((mp,idx) => idx===i?{...mp,cell:v.toUpperCase()}:mp))} placeholder="e.g. C6" />
              <Select value={m.type} onChange={v => setMappings(mappings.map((mp,idx) => idx===i?{...mp,type:v}:mp))} options={[{value:"text",label:"Text"},{value:"number",label:"Number"}]} />
              <Btn small color={C.danger} onClick={() => setMappings(mappings.filter((_,idx) => idx!==i))}>✕</Btn>
            </div>
          ))}
          <Btn small outline color={C.muted} onClick={() => setMappings([...mappings,{col:0,cell:"",type:"text"}])} style={{ marginBottom:16 }}>+ Add Row</Btn>
          <div style={{ height:1, background:C.border, margin:"8px 0 16px" }} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:14 }}>
            <Input label="Header Cell (Month goes here)" value={headerCell} onChange={setHeaderCell} placeholder="e.g. D2" />
            <Input label="Header Format" value={headerFormat} onChange={setHeaderFormat} placeholder="{MONTH} SALARY PAYSLIP" />
            <Input label="Payment Date Cell" value={paymentDateCell} onChange={setPaymentDateCell} placeholder="e.g. I5" />
            <Select label="Sheet Name Column" value={String(sheetNameCol)} onChange={v => setSheetNameCol(parseInt(v))} options={columns.map(c => ({value:String(c.index),label:c.label}))} />
          </div>
          <div style={{ height:1, background:C.border, margin:"8px 0 16px" }} />
          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <div style={{ flex:1 }}><Input label="Save This Mapping As" value={mappingName} onChange={setMappingName} placeholder="e.g. CBI Payslip Standard..." /></div>
            <Btn outline color={C.muted} onClick={saveMapping}>💾 Save</Btn>
          </div>
          {status.msg && step===3 && <div style={{ marginTop:10, padding:"10px 14px", background:status.type==="success"?C.success+"15":C.danger+"15", borderRadius:8, color:status.type==="success"?C.success:C.danger, fontSize:12 }}>{status.msg}</div>}
          <div style={{ marginTop:14, textAlign:"right" }}>
            <Btn color={C.success} onClick={() => { const nameIdx=sheetNameCol; const posMap=mappings.find(m=>m.cell==="C7"); setStaffAttendance(buildAttendanceTable(staffData,nameIdx,posMap?.col)); setStep(4); }}>Next: Monthly Settings →</Btn>
          </div>
        </Card>
      )}

      {/* Step 4 */}
      {step>=4 && (
        <Card style={{ marginBottom:16 }}>
          <h3 style={{ color:C.warning, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 4 — Monthly Settings & Attendance</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:20 }}>
            <Select label="Month & Year" value={monthYear} onChange={setMonthYear} options={monthOptions} />
            <div><label style={{ display:"block", fontSize:11, color:C.muted, marginBottom:5, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>Payment Date</label>
              <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width:"100%", background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }} /></div>
            <Input label="Location (All Staff)" value={location} onChange={setLocation} placeholder="e.g. MAIDUGURI" />
          </div>

          {/* Apply to all */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.bgDeep, borderRadius:10, marginBottom:16, border:`1px solid ${C.border}`, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Apply to all staff:</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="number" value={applyWorked} onChange={e => setApplyWorked(e.target.value)} min="0" max="31" style={{ width:60, background:C.card, border:`1px solid ${C.success}`, borderRadius:8, padding:"6px 10px", color:C.text, fontSize:13, outline:"none", textAlign:"center" }} />
              <span style={{ fontSize:12, color:C.muted }}>Days Worked</span>
              <Btn small color={C.success} onClick={() => applyToAll("worked")}>Apply All</Btn>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="number" value={applyAbsent} onChange={e => setApplyAbsent(e.target.value)} min="0" max="31" style={{ width:60, background:C.card, border:`1px solid ${C.danger}`, borderRadius:8, padding:"6px 10px", color:C.text, fontSize:13, outline:"none", textAlign:"center" }} />
              <span style={{ fontSize:12, color:C.muted }}>Days Absent</span>
              <Btn small color={C.danger} onClick={() => applyToAll("absent")}>Apply All</Btn>
            </div>
          </div>

          {/* Staff table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                  {["#","Staff Name","Position","Days Worked","Days Absent"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 12px", color:C.muted, fontSize:10, textTransform:"uppercase", fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffAttendance.map((s,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"10px 12px", color:C.muted, fontSize:12 }}>{i+1}</td>
                    <td style={{ padding:"10px 12px", fontWeight:600 }}>{s.name}</td>
                    <td style={{ padding:"10px 12px", color:C.muted, fontSize:12 }}>{s.position}</td>
                    <td style={{ padding:"10px 12px" }}>
                      <input type="number" value={s.daysWorked} min="0" max="31" onChange={e => setStaffAttendance(staffAttendance.map((sa,idx) => idx===i ? {...sa,daysWorked:parseInt(e.target.value)||0} : sa))}
                        style={{ width:60, background:C.bgDeep, border:`1px solid ${C.success}`, borderRadius:8, padding:"6px 10px", color:C.text, fontSize:13, outline:"none", textAlign:"center" }} />
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      <input type="number" value={s.daysAbsent} min="0" max="31" onChange={e => setStaffAttendance(staffAttendance.map((sa,idx) => idx===i ? {...sa,daysAbsent:parseInt(e.target.value)||0} : sa))}
                        style={{ width:60, background:C.bgDeep, border:`1px solid ${C.danger}`, borderRadius:8, padding:"6px 10px", color:C.text, fontSize:13, outline:"none", textAlign:"center" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:14, textAlign:"right" }}>
            <Btn color={C.success} onClick={() => setStep(5)}>Next: Generate →</Btn>
          </div>
        </Card>
      )}

      {/* Step 5 */}
      {step>=5 && (
        <Card>
          <h3 style={{ color:C.success, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 5 — Generate Payslips</h3>
          <div style={{ background:C.bgDeep, borderRadius:10, padding:16, marginBottom:16, fontSize:13, lineHeight:2 }}>
            📅 <strong style={{ color:C.text }}>Month:</strong> <span style={{ color:C.muted }}>{monthYear}</span><br />
            💳 <strong style={{ color:C.text }}>Payment Date:</strong> <span style={{ color:C.muted }}>{paymentDate ? new Date(paymentDate).toLocaleDateString("en-GB") : ""}</span><br />
            👥 <strong style={{ color:C.text }}>Staff:</strong> <span style={{ color:C.muted }}>{staffAttendance.length} payslips</span><br />
            📍 <strong style={{ color:C.text }}>Location:</strong> <span style={{ color:C.muted }}>{location}</span>
          </div>
          {generating && (
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:4 }}>
                <span>Generating payslips...</span><span>{progress}%</span>
              </div>
              <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.success},#059669)`, transition:"width 0.3s" }} />
              </div>
            </div>
          )}
          <Btn color={C.success} onClick={generate} disabled={generating||!rawBuffer} style={{ width:"100%", padding:14, fontSize:14, justifyContent:"center" }}>
            {generating ? `Generating... ${progress}%` : `⚡ Generate All ${staffAttendance.length} Payslips`}
          </Btn>
          {status.msg && status.type === "success" && (
            <Btn color={C.accent} onClick={() => setShowSendModalP(true)} style={{ width:"100%", padding:12, fontSize:13, justifyContent:"center", marginTop:8 }}>
              📤 Convert & Send Payslips to Staff
            </Btn>
          )}
          {status.msg && (
            <div style={{ marginTop:12, padding:"12px 16px", background:status.type==="success"?C.success+"15":status.type==="error"?C.danger+"15":C.accent+"15", border:`1px solid ${status.type==="success"?C.success:status.type==="error"?C.danger:C.accent}44`, borderRadius:10, color:status.type==="success"?C.success:status.type==="error"?C.danger:C.accent, fontSize:13 }}>
              {status.msg}
            </div>
          )}
        </Card>
      )}
      {showSendModalP && <PDFSendToStaff user={window.__hrUser} employees={window.__hrEmployees || []} docType="payslip" onClose={() => setShowSendModalP(false)} />}
    </div>
  );
}


// ── REAL PDF VIEWER ──────────────────────────────────────────────────────────
function RealPDFViewer({ docData, notification }) {
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    renderPages();
  }, [docData]);

  const renderPages = async () => {
    try {
      // Load PDF.js
      if (!window.pdfjsLib) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          s.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            res();
          };
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }

      let pdfDoc = null;

      // Priority 1: Use pdf_data from documents table (base64 of individual staff PDF)
      if (docData?.pdf_data) {
        const base64 = docData.pdf_data;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        pdfDoc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      }
      // Priority 2: Fallback to global PDF with page range (old flow)
      else if (window.__hrPdfBytes) {
        const globalPdf = await window.pdfjsLib.getDocument(
          new Uint8Array(window.__hrPdfBytes.slice(0))
        ).promise;
        const fromPage = notification?.from_page || docData?.from_page || 1;
        const toPage = notification?.to_page || docData?.to_page || globalPdf.numPages;
        // Render only staff's pages from global PDF
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";
        for (let p = fromPage; p <= toPage; p++) {
          const page = await globalPdf.getPage(p);
          const containerW = containerRef.current?.clientWidth || 500;
          const vp = page.getViewport({ scale: 1 });
          const scale = containerW / vp.width;
          const svp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = svp.width; canvas.height = svp.height;
          canvas.style.cssText = "width:100%;display:block;";
          if (p < toPage) canvas.style.borderBottom = "1px solid #e0e0e0";
          await page.render({ canvasContext: canvas.getContext("2d"), viewport: svp }).promise;
          containerRef.current?.appendChild(canvas);
        }
        setLoading(false);
        return;
      }
      else {
        setError("Document not available. Please contact HR.");
        setLoading(false);
        return;
      }

      // Render all pages of individual staff PDF (already split)
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      for (let p = 1; p <= pdfDoc.numPages; p++) {
        const page = await pdfDoc.getPage(p);
        const containerW = containerRef.current?.clientWidth || 500;
        const vp = page.getViewport({ scale: 1 });
        const scale = containerW / vp.width;
        const svp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = svp.width; canvas.height = svp.height;
        canvas.style.cssText = "width:100%;display:block;";
        if (p < pdfDoc.numPages) canvas.style.borderBottom = "1px solid #e0e0e0";
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: svp }).promise;
        containerRef.current?.appendChild(canvas);
      }
      setLoading(false);
    } catch(err) {
      console.error("PDF render error:", err);
      setError("Could not render PDF: " + err.message);
      setLoading(false);
    }
  };

  if (error) return (
    <div style={{ padding: 20, textAlign: "center", color: "#546e7a", fontSize: 12 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
      <div>{error}</div>
    </div>
  );

  return (
    <div>
      {loading && (
        <div style={{ padding: 20, textAlign: "center", color: "#546e7a", fontSize: 12 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          Loading your document...
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// ── DOCUMENT SIGNING MODAL ────────────────────────────────────────────────────
function DocumentSigningModal({ notification, user, onClose, onSigned }) {
  const [step, setStep] = useState(1);
  const [penColor, setPenColor] = useState("#1a1a2e");
  const [penSize, setPenSize] = useState(1.5);
  const [sigDataUrl, setSigDataUrl] = useState(null);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedSig, setTypedSig] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [docData, setDocData] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const canvasRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (notification?.document_id) {
      supabase.from("documents").select("*").eq("id", notification.document_id).single()
        .then(({ data }) => setDocData(data));
    }
  }, [notification]);

  // Setup canvas when step 2 opens
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
      }, 100);
    }
  }, [step]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    setIsDrawing(true);
    lastPos.current = pos;
    setCurrentPath([{ ...pos, color: penColor, size: penSize }]);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    setCurrentPath(prev => [...prev, { ...pos, color: penColor, size: penSize }]);
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 1) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      setSigDataUrl(canvasRef.current?.toDataURL());
    }
    setCurrentPath([]);
  };

  const redrawPaths = (pathList) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width * 2, rect.height * 2);
    pathList.forEach(path => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
        ctx.strokeStyle = path[i].color;
        ctx.lineWidth = path[i].size;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(path[i].x, path[i].y);
      }
    });
  };

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width * 2, rect.height * 2);
    setPaths([]); setSigDataUrl(null); setTypedSig("");
  };

  const undoSig = () => {
    const newPaths = paths.slice(0, -1);
    setPaths(newPaths);
    redrawPaths(newPaths);
    setSigDataUrl(newPaths.length > 0 ? canvasRef.current?.toDataURL() : null);
  };

  const useTyped = () => {
    if (!typedSig.trim()) return;
    clearSig();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.font = `italic ${rect.height * 0.4}px Georgia, serif`;
    ctx.fillStyle = penColor;
    ctx.fillText(typedSig, 16, rect.height * 0.65);
    setSigDataUrl(canvas.toDataURL());
  };

  const downloadPDF = async (sigUrl, staffName, docType, period) => {
    try {
      // Get latest document data including signed_pdf_data
      const { data: doc } = await supabase.from("documents").select("*").eq("id", notification.document_id).single();

      if (doc?.signed_pdf_data) {
        // Decode base64 signed PDF and download
        const binary = atob(doc.signed_pdf_data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Signed_${(staffName || "Staff").replace(/ /g, "_")}_${(period || "").replace(/ /g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (doc?.pdf_data) {
        // Download unsigned original if signed not available yet
        const binary = atob(doc.pdf_data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Contract_${(staffName || "Staff").replace(/ /g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("Document signed and returned to HR successfully!");
      }
    } catch(err) {
      console.error(err);
      alert("Document signed and returned to HR!");
    }
  };

  const submitSignature = async () => {
    if (!sigDataUrl) return;
    setSubmitting(true);
    try {
      // Load PDF-lib
      if (!window.PDFLib) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const { PDFDocument } = window.PDFLib;

      // Embed signature into individual staff PDF and save as signed_pdf_data
      let signedPdfBase64 = null;
      if (docData?.pdf_data) {
        const binary = atob(docData.pdf_data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const staffPdf = await PDFDocument.load(bytes);
        // Signature page within individual PDF
        const sigPageIdx = Math.min(
          Math.max(0, (docData?.sig_page || staffPdf.getPageCount()) - 1),
          staffPdf.getPageCount() - 1
        );
        const sigPage = staffPdf.getPages()[sigPageIdx];
        const { width: pgW, height: pgH } = sigPage.getSize();
        // Embed signature image
        const sigBase64 = sigDataUrl.split(",")[1];
        const sigImgBytes = Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0));
        const sigImg = await staffPdf.embedPng(sigImgBytes);
        // Position using stored sig_x, sig_y coordinates
        const boxW = pgW * 0.30;
        const boxH = pgH * 0.07;
        const posX = Math.max(0, (docData?.sig_x || 0.15) * pgW - boxW / 2);
        const posY = Math.max(0, pgH - ((docData?.sig_y || 0.85) * pgH) - boxH / 2);
        sigPage.drawImage(sigImg, { x: posX, y: posY, width: boxW, height: boxH });
        // Save signed PDF as base64
        const signedBytes = await staffPdf.save();
        signedPdfBase64 = btoa(
          Array.from(signedBytes).map(b => String.fromCharCode(b)).join("")
        );
      }

      // Save to documents table
      if (notification?.document_id) {
        await supabase.from("documents").update({
          signed: true,
          signed_at: new Date().toISOString(),
          signature_data: sigDataUrl,
          signed_pdf_data: signedPdfBase64,
        }).eq("id", notification.document_id);
      }

      // Mark notification as read
      await supabase.from("notifications").update({ is_read: true }).eq("id", notification.id);

      // Notify HR
      const { data: hrRoles } = await supabase.from("user_roles").select("email").in("role", ["hr", "admin"]);
      for (const hr of (hrRoles || [])) {
        await supabase.from("notifications").insert([{
          user_email: hr.email.toLowerCase(),
          type: "signed",
          title: `${docData?.document_type === "contract" ? "Contract" : "Payslip"} Signed & Returned`,
          message: `${docData?.staff_name || user?.email} has signed and returned their ${docData?.document_type === "contract" ? "Employment Contract" : "Payslip"} for ${docData?.period || ""}.`,
          document_id: notification.document_id,
          is_read: false,
        }]);
      }

      setSignedUrl(sigDataUrl);
      if (onSigned) onSigned();
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Error submitting: " + err.message);
    }
    setSubmitting(false);
  };


  const penColors = [
    { c: "#1a1a2e", label: "Black" }, { c: "#1a3a6b", label: "Navy" },
    { c: "#1b5e20", label: "Green" }, { c: "#7b1fa2", label: "Purple" },
  ];

  const isContract = docData?.document_type === "contract";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div style={{ background: C.card, borderRadius: 20, width: "min(720px,100%)", border: `1px solid ${C.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", marginTop: 8, marginBottom: 8 }}>

        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.card, zIndex: 10, borderRadius: "20px 20px 0 0" }}>
          <div>
            <h2 style={{ color: C.white, fontSize: 17, fontWeight: 800, margin: 0 }}>
              {step === 1 ? "📄 Review Document" : step === 2 ? "✍️ Sign Document" : "✅ Document Signed & Returned"}
            </h2>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
              {isContract ? "Employment Contract" : "Monthly Payslip"} · {docData?.period || ""}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: 26, height: 26, borderRadius: "50%", background: step >= s ? C.success : C.border, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                {step > s ? "✓" : s}
              </div>
            ))}
            <Btn small color={C.border} onClick={onClose} style={{ marginLeft: 8 }}>✕</Btn>
          </div>
        </div>

        <div style={{ padding: 22, maxHeight: "80vh", overflowY: "auto" }}>

          {/* ── STEP 1: FULL DOCUMENT PREVIEW ── */}
          {step === 1 && (
            <div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, lineHeight: 1.7 }}>
                Review your full document carefully before signing. Scroll to see all pages.
              </div>
              <div id="realDocViewer" style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 14, background: "white" }}>
                <RealPDFViewer docData={docData} notification={notification} />
              </div>
              <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, fontSize: 12, color: C.warning, marginBottom: 14, lineHeight: 1.7 }}>
                ⚠️ By proceeding to sign, you confirm you have read and understood this document. Your signature will be permanently embedded and returned to HR.
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <Btn outline color={C.muted} onClick={onClose}>Cancel</Btn>
                <Btn color={C.success} onClick={() => setStep(2)}>I Have Read This — Proceed to Sign →</Btn>
              </div>
            </div>
          )}

          {/* ── STEP 2: SIGNATURE PAD ── */}
          {step === 2 && (
            <div>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
                Draw your signature below using your <strong style={{ color: C.text }}>finger or mouse</strong>. This will be embedded into the document and returned to HR.
              </p>

              {/* Pen options */}
              <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap", background: C.bgDeep, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Ink Color</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {penColors.map(({ c, label }) => (
                      <div key={c} onClick={() => setPenColor(c)} title={label}
                        style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer", border: penColor === c ? "3px solid white" : "3px solid transparent", transform: penColor === c ? "scale(1.2)" : "scale(1)", transition: "all 0.15s" }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Pen Size</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {[{ sz: 1.5, w: 8 }, { sz: 2.5, w: 12 }, { sz: 4, w: 16 }].map(({ sz, w }) => (
                      <div key={sz} onClick={() => setPenSize(sz)}
                        style={{ width: w, height: w, borderRadius: "50%", background: C.text, cursor: "pointer", border: penSize === sz ? `2px solid ${C.accent}` : "2px solid transparent", transition: "all 0.15s" }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div style={{ position: "relative", marginBottom: 8 }}>
                <canvas ref={canvasRef}
                  style={{ width: "100%", height: 160, border: `2px solid ${sigDataUrl ? C.success : C.border}`, borderRadius: 12, background: "#0a0f1e", cursor: "crosshair", display: "block", touchAction: "none" }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                />
                {!sigDataUrl && !isDrawing && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13, pointerEvents: "none" }}>
                    ✍️ Draw your signature here
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: C.muted, marginBottom: 12 }}>Use your finger on mobile · Mouse on desktop</div>

              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <Btn small outline color={C.muted} onClick={clearSig}>🗑 Clear</Btn>
                <Btn small outline color={C.muted} onClick={undoSig} disabled={paths.length === 0}>↩ Undo</Btn>
              </div>

              {/* Typed option */}
              <div style={{ padding: 14, background: C.bgDeep, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Or Type Your Name as Signature</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={typedSig} onChange={e => setTypedSig(e.target.value)} placeholder="Type your full name..."
                    style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none" }} />
                  <Btn small outline color={C.accent} onClick={useTyped} disabled={!typedSig.trim()}>Use This</Btn>
                </div>
              </div>

              {/* Live preview */}
              {sigDataUrl && (
                <div style={{ padding: 14, background: C.success+"10", border: `1px solid ${C.success}33`, borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: C.success, fontWeight: 700, marginBottom: 8 }}>✓ Signature Preview — This is how it will appear in the document</div>
                  <div style={{ background: "white", borderRadius: 8, padding: 8, display: "inline-block" }}>
                    <img src={sigDataUrl} alt="Signature" style={{ maxHeight: 60, maxWidth: "100%", display: "block" }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                    Signed by: <strong style={{ color: C.text }}>{docData?.staff_name}</strong> · Date: <strong style={{ color: C.text }}>{new Date().toLocaleDateString("en-GB")}</strong>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <Btn outline color={C.muted} onClick={() => setStep(1)}>← Back to Review</Btn>
                <Btn color={C.success} onClick={submitSignature} disabled={!sigDataUrl || submitting} style={{ padding: "12px 24px" }}>
                  {submitting ? "Submitting..." : "✍️ Sign & Return to HR"}
                </Btn>
              </div>
            </div>
          )}

          {/* ── STEP 3: DONE + DOWNLOAD ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "24px 8px" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Document Signed & Returned!</div>
              <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Your signature has been embedded and returned to HR.<br />HR has been notified.
              </div>

              {/* Signed summary */}
              <div style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, lineHeight: 2, textAlign: "left" }}>
                📄 <strong style={{ color: C.text }}>Document:</strong> <span style={{ color: C.muted }}>{isContract ? "Employment Contract" : "Payslip"} · {docData?.period}</span><br />
                ✍️ <strong style={{ color: C.text }}>Signed by:</strong> <span style={{ color: C.muted }}>{docData?.staff_name}</span><br />
                📅 <strong style={{ color: C.text }}>Date:</strong> <span style={{ color: C.muted }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span><br />
                📬 <strong style={{ color: C.text }}>Returned to:</strong> <span style={{ color: C.muted }}>HR Department</span>
              </div>

              {/* Signature preview */}
              {signedUrl && (
                <div style={{ background: "white", borderRadius: 10, padding: 14, marginBottom: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#546e7a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Your Signature</div>
                  <img src={signedUrl} alt="Your signature" style={{ maxHeight: 60, maxWidth: "100%", display: "block", marginBottom: 6 }} />
                  <div style={{ fontSize: 11, color: "#546e7a" }}>{docData?.staff_name} · {new Date().toLocaleDateString("en-GB")}</div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn color={C.success} onClick={() => downloadPDF(signedUrl, docData?.staff_name, docData?.document_type, docData?.period)} style={{ padding: "12px 20px" }}>
                  ⬇️ Download My Signed Copy
                </Btn>
                <Btn outline color={C.muted} onClick={onClose} style={{ padding: "12px 20px" }}>✓ Done</Btn>
              </div>

              <div style={{ marginTop: 14, padding: "10px 14px", background: C.accent+"15", border: `1px solid ${C.accent}33`, borderRadius: 10, fontSize: 12, color: C.accent }}>
                🔔 HR has been notified and will receive your signed document.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── NOTIFICATIONS MODULE ──────────────────────────────────────────────────────
function Notifications({ user, employees, leaveRequests, setLeaveRequests }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [signingNotif, setSigningNotif] = useState(null);
  const [viewingSignedDoc, setViewingSignedDoc] = useState(null);
  const [signedDocData, setSignedDocData] = useState(null);

  useEffect(() => {
    if (viewingSignedDoc?.document_id) {
      supabase.from("documents").select("*").eq("id", viewingSignedDoc.document_id).single()
        .then(({ data }) => setSignedDocData(data));
    } else {
      setSignedDocData(null);
    }
  }, [viewingSignedDoc]);

  useEffect(() => { loadNotifs(); }, [user?.email]);

  const loadNotifs = async () => {
    setLoading(true);
    const { data } = await supabase.from("notifications")
      .select("*").eq("user_email", user?.email?.toLowerCase())
      .order("created_at", { ascending: false });
    setNotifs(data || []);
    setLoading(false);
  };

  const markRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const dismiss = async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const markAllRead = async () => {
    await supabase.from("notifications").update({ is_read: true }).eq("user_email", user?.email?.toLowerCase());
    setNotifs(notifs.map(n => ({ ...n, is_read: true })));
  };

  const clearAll = async () => {
    await supabase.from("notifications").delete().eq("user_email", user?.email?.toLowerCase());
    setNotifs([]);
  };

  const approveLeave = async (n) => {
    if (!n.document_id) return;
    await supabase.from("leave_requests").update({ status: "Pending - HR" }).eq("id", n.document_id);
    setLeaveRequests(leaveRequests.map(l => l.id === n.document_id ? { ...l, status: "Pending - HR" } : l));
    await dismiss(n.id);
    showToast("✅ Leave approved and forwarded to HR!", C.success);
  };

  const rejectLeave = async (n) => {
    if (!n.document_id) return;
    await supabase.from("leave_requests").update({ status: "Rejected" }).eq("id", n.document_id);
    setLeaveRequests(leaveRequests.map(l => l.id === n.document_id ? { ...l, status: "Rejected" } : l));
    await dismiss(n.id);
    showToast("Leave request rejected.", C.danger);
  };

  const showToast = (msg, color) => {
    const t = document.createElement("div");
    t.style.cssText = `position:fixed;bottom:24px;right:24px;background:#1a2235;border:1px solid ${color}44;color:${color};padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.4);max-width:320px;line-height:1.5`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  const typeConfig = {
    contract: { icon: "📄", color: C.accent, label: "Contract" },
    payslip: { icon: "💰", color: C.success, label: "Payslip" },
    leave_request: { icon: "📋", color: C.warning, label: "Leave" },
    leave_approved: { icon: "✅", color: C.success, label: "Leave" },
    leave_rejected: { icon: "❌", color: C.danger, label: "Leave" },
    leave_forwarded: { icon: "🔄", color: "#8b5cf6", label: "Leave" },
    leave_cc: { icon: "👥", color: C.muted, label: "CC" },
    signed: { icon: "✍️", color: C.success, label: "Signed" },
  };
  // Use notif_type from DB (renamed from 'type' to avoid PostgreSQL reserved word conflict)

  const filtered = filter === "all" ? notifs : notifs.filter(n => {
    if (filter === "documents") return n.type === "contract" || n.type === "payslip" || n.type === "signed";
    if (filter === "leave") return n.type?.startsWith("leave");
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.is_read).length;

  const timeAgo = (ts) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800, margin: 0 }}>
            Notifications {unreadCount > 0 && <span style={{ background: C.danger, color: "white", fontSize: 13, padding: "2px 10px", borderRadius: 20, marginLeft: 8 }}>{unreadCount}</span>}
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>All activity and updates for your account</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small outline color={C.muted} onClick={markAllRead}>✓ Mark All Read</Btn>
          <Btn small color={C.danger} onClick={clearAll}>🗑 Clear All</Btn>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all","All"], ["unread","Unread"], ["documents","Documents"], ["leave","Leave"]].map(([f, label]) => (
          <div key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === f ? C.accent : C.border}`, background: filter === f ? C.accent+"22" : "transparent", color: filter === f ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {label} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>All caught up!</div>
          <div style={{ color: C.muted, fontSize: 13 }}>No {filter !== "all" ? filter : ""} notifications yet.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(n => {
            const cfg = typeConfig[n.type] || { icon: "🔔", color: C.accent, label: "" };
            return (
              <div key={n.id} style={{ background: n.is_read ? C.card : `linear-gradient(135deg, ${cfg.color}08, ${C.card})`, border: `1px solid ${n.is_read ? C.border : cfg.color+"44"}`, borderLeft: `3px solid ${n.is_read ? C.border : cfg.color}`, borderRadius: 14, padding: "16px 20px", transition: "all 0.2s", position: "relative", userSelect: "none" }}>
                {!n.is_read && <div style={{ position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.color+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cfg.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{n.title}</div>
                    <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{n.message}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>🕐 {timeAgo(n.created_at)}</span>
                      {!n.is_read && <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>● New</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      {(n.type === "contract" || n.type === "payslip") && (
                        <Btn small color={C.accent} onClick={() => { markRead(n.id); setSigningNotif(n); }}>✍️ View & Sign</Btn>
                      )}
                      {n.type === "signed" && (
                        <Btn small color={C.success} onClick={() => { markRead(n.id); setViewingSignedDoc(n); }}>👁 View & Download Signed Doc</Btn>
                      )}
                      {n.type === "leave_request" && (
                        <>
                          <Btn small color={C.success} onClick={() => approveLeave(n)}>✅ Approve</Btn>
                          <Btn small color={C.danger} onClick={() => rejectLeave(n)}>❌ Reject</Btn>
                          <Btn small outline color={C.muted} onClick={() => markRead(n.id)}>👁 View</Btn>
                        </>
                      )}
                      {(n.type === "leave_approved" || n.type === "leave_rejected" || n.type === "leave_forwarded" || n.type === "leave_cc") && (
                        <Btn small outline color={C.muted} onClick={() => markRead(n.id)}>👁 View Details</Btn>
                      )}
                      <Btn small color={C.danger} onClick={() => dismiss(n.id)}>Dismiss</Btn>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {signingNotif && (
        <DocumentSigningModal
          notification={signingNotif}
          user={user}
          onClose={() => setSigningNotif(null)}
          onSigned={() => { setSigningNotif(null); loadNotifs(); }}
        />
      )}

      {/* HR Signed Document Viewer */}
      {viewingSignedDoc && signedDocData && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:16, overflowY:"auto" }}>
          <div style={{ background:C.card, borderRadius:20, width:"min(600px,100%)", border:`1px solid ${C.border}`, boxShadow:"0 24px 80px rgba(0,0,0,0.7)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.card, zIndex:10 }}>
              <div>
                <h2 style={{ color:C.white, fontSize:17, fontWeight:800, margin:0 }}>✅ Signed Document</h2>
                <p style={{ color:C.muted, fontSize:12, marginTop:3 }}>{signedDocData.document_type === "contract" ? "Employment Contract" : "Payslip"} · {signedDocData.period}</p>
              </div>
              <Btn small color={C.border} onClick={() => { setViewingSignedDoc(null); setSignedDocData(null); }}>✕</Btn>
            </div>
            <div style={{ padding:22 }}>
              <div style={{ background:"white", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
                <div style={{ background:"#0d1f3c", padding:"12px 18px", textAlign:"center" }}>
                  <div style={{ color:"white", fontWeight:800, fontSize:14 }}>{signedDocData.document_type === "contract" ? "EMPLOYMENT CONTRACT" : "MONTHLY PAYSLIP"}</div>
                  <div style={{ color:"#90caf9", fontSize:11, marginTop:3 }}>CARE BEST INITIATIVE (CBI) · {signedDocData.period}</div>
                </div>
                <div style={{ padding:18 }}>
                  {[["Staff Name",signedDocData.staff_name],["Period",signedDocData.period],["Date Signed",signedDocData.signed_at?new Date(signedDocData.signed_at).toLocaleDateString("en-GB",""):"—"],["Status",signedDocData.signed?"✅ Signed & Returned":"⏳ Pending"]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f0f4f8" }}>
                      <span style={{ fontSize:12, color:"#546e7a", fontWeight:600 }}>{l}</span>
                      <span style={{ fontSize:12, color:"#1a1a2e", fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                  {signedDocData.signature_data && (
                    <div style={{ marginTop:14 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#1a3a6b", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Employee Signature</div>
                      <div style={{ border:"2px solid #10b981", borderRadius:8, padding:8, background:"#f8fafc", display:"inline-block" }}>
                        <img src={signedDocData.signature_data} alt="Signature" style={{ maxHeight:70, maxWidth:280, display:"block" }} />
                      </div>
                      <div style={{ fontSize:11, color:"#546e7a", marginTop:6 }}>{signedDocData.staff_name} · {signedDocData.signed_at?new Date(signedDocData.signed_at).toLocaleDateString("en-GB"):""}</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <Btn color={C.success} onClick={async () => {
                  if (signedDocData?.signed_pdf_data) {
                    const binary = atob(signedDocData.signed_pdf_data);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                    const blob = new Blob([bytes], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Signed_" + (signedDocData.staff_name||"Staff").replace(/ /g,"_") + ".pdf";
                    a.click();
                    URL.revokeObjectURL(url);
                  } else {
                    alert("Signed PDF not yet available.");
                  }
                }}>⬇️ Download Signed PDF</Btn>
                <Btn outline color={C.muted} onClick={() => { setViewingSignedDoc(null); setSignedDocData(null); }}>Close</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── PDF SEND TO STAFF (FULL FLOW) ─────────────────────────────────────────────
function PDFSendToStaff({ user, employees, docType: initialDocType, onClose }) {
  const [step, setStep] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [fileName, setFileName] = useState("");
  const [defaultPages, setDefaultPages] = useState(2);
  const [staffList, setStaffList] = useState([]);
  const [sigX, setSigX] = useState(null);
  const [sigY, setSigY] = useState(null);
  const [sigPageNum, setSigPageNum] = useState(1);
  const [sigMarked, setSigMarked] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sentDocs, setSentDocs] = useState([]);
  const [docType, setDocType] = useState(initialDocType || "contract");
  const [period, setPeriod] = useState("");
  const [mismatch, setMismatch] = useState("");
  const fileRef = useRef();
  const placementCanvasRef = useRef();
  const markerRef = useRef();
  const thumbGridRef = useRef();

  // Month options
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  const periodOptions = [];
  for (let y = now.getFullYear() - 1; y <= now.getFullYear() + 1; y++)
    for (let m = 0; m < 12; m++)
      periodOptions.push({ value: `${months[m].toUpperCase()} ${y}`, label: `${months[m]} ${y}` });

  useEffect(() => {
    const m = now.getMonth();
    const y = now.getFullYear();
    setPeriod(`${months[m].toUpperCase()} ${y}`);
  }, []);

  // Load PDF.js
  const loadPdfJs = async () => {
    if (window.pdfjsLib) return;
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        res();
      };
      s.onerror = rej;
      document.head.appendChild(s);
    });
  };

  // Load PDF-lib
  const loadPdfLib = async () => {
    if (window.PDFLib) return;
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const buf = ev.target.result.slice(0);
      setPdfBytes(buf);
      window.__hrPdfBytes = buf; // global for DocumentSigningModal
      await loadPdfJs();
      const doc = await window.pdfjsLib.getDocument(new Uint8Array(buf.slice(0))).promise;
      window.__hrPdfDoc = doc; // global for DocumentSigningModal
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setSigPageNum(doc.numPages);
      setFileName(file.name);
      setStep(2);
      // Preload PDF-lib in background
      loadPdfLib();
    };
    reader.readAsArrayBuffer(file);
  };

  const renderThumbnails = async () => {
    if (!pdfDoc || !thumbGridRef.current) return;
    thumbGridRef.current.innerHTML = "";
    for (let i = 1; i <= Math.min(totalPages, 12); i++) {
      const page = await pdfDoc.getPage(i);
      const vp = page.getViewport({ scale: 0.22 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      canvas.style.cssText = "width:100%;display:block;border:2px solid #1e2d45;border-radius:6px;";
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      const wrap = document.createElement("div");
      wrap.style.cssText = "text-align:center;";
      const lbl = document.createElement("div");
      lbl.style.cssText = "font-size:9px;color:#64748b;margin-top:3px;";
      lbl.textContent = `Page ${i}`;
      wrap.appendChild(canvas); wrap.appendChild(lbl);
      thumbGridRef.current.appendChild(wrap);
    }
    if (totalPages > 12) {
      const more = document.createElement("div");
      more.style.cssText = "display:flex;align-items:center;justify-content:center;color:#64748b;font-size:11px;padding:16px;border:1px dashed #1e2d45;border-radius:6px;";
      more.textContent = `+${totalPages - 12} more pages`;
      thumbGridRef.current.appendChild(more);
    }
  };

  const renderSigPlacementPage = async (pageNum) => {
    if (!pdfDoc || !placementCanvasRef.current) return;
    const page = await pdfDoc.getPage(pageNum);
    const canvas = placementCanvasRef.current;
    const wrap = canvas.parentElement;
    const containerW = wrap?.clientWidth || 600;
    const vp = page.getViewport({ scale: 1 });
    const scale = containerW / vp.width;
    const svp = page.getViewport({ scale });
    canvas.width = svp.width; canvas.height = svp.height;
    canvas.style.width = "100%";
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: svp }).promise;
    // Restore marker if already set
    if (sigX !== null && markerRef.current) {
      const mw = Math.round(canvas.offsetWidth * 0.28);
      const mh = Math.round(canvas.offsetHeight * 0.055 || 36);
      markerRef.current.style.display = "block";
      markerRef.current.style.left = (sigX * canvas.offsetWidth - mw / 2) + "px";
      markerRef.current.style.top = (sigY * canvas.offsetHeight - mh / 2) + "px";
      markerRef.current.style.width = mw + "px";
      markerRef.current.style.height = mh + "px";
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = placementCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setSigX(x); setSigY(y); setSigMarked(true);
    // Show marker
    if (markerRef.current) {
      const mw = Math.round(canvas.offsetWidth * 0.28);
      const mh = Math.round(Math.max(canvas.offsetHeight * 0.055, 36));
      markerRef.current.style.display = "block";
      markerRef.current.style.left = (x * canvas.offsetWidth - mw / 2) + "px";
      markerRef.current.style.top = (y * canvas.offsetHeight - mh / 2) + "px";
      markerRef.current.style.width = mw + "px";
      markerRef.current.style.height = mh + "px";
    }
  };

  // Similarity matching — same as original SendToStaff
  const similarity = (a, b) => {
    a = a.toLowerCase().trim(); b = b.toLowerCase().trim();
    if (a === b) return 1.0;
    const aW = a.split(/\s+/); const bW = b.split(/\s+/);
    const common = aW.filter(w => bW.some(bw => bw.includes(w) || w.includes(bw)));
    return common.length / Math.max(aW.length, bW.length);
  };

  const buildStaff = () => {
    const dp = defaultPages;
    const cnt = Math.floor(totalPages / dp);
    const list = [];
    for (let i = 0; i < cnt; i++) {
      const fromPage = i * dp + 1;
      const toPage = (i + 1) * dp;
      // Try to match by order first — each page group maps to an employee
      // We use position-based assignment but allow HR to override
      const emp = employees[i] || null;
      if (emp) {
        list.push({
          id: i + 1,
          excelPosition: i + 1,
          name: emp.name,
          email: emp.official_email || "",
          pages: dp,
          fromPage,
          toPage,
          overridden: false,
          matchStatus: emp.official_email ? "exact" : "noemail",
          matchedEmp: emp,
          overrideName: "",
        });
      } else {
        list.push({
          id: i + 1,
          excelPosition: i + 1,
          name: `Staff ${i + 1}`,
          email: "",
          pages: dp,
          fromPage,
          toPage,
          overridden: false,
          matchStatus: "nomatch",
          matchedEmp: null,
          overrideName: "",
        });
      }
    }
    setStaffList(list);
    checkMismatchFn(list, totalPages);
  };

  const checkMismatchFn = (list, total) => {
    const assigned = list.reduce((s, x) => s + x.pages, 0);
    if (assigned !== total) setMismatch(`⚠️ Assigned ${assigned} pages but PDF has ${total}. Adjust page counts.`);
    else setMismatch("");
  };

  const overridePg = (i, val) => {
    const updated = staffList.map((s, idx) => idx === i ? { ...s, pages: parseInt(val) || 1, overridden: true } : s);
    let p = 1;
    updated.forEach(s => { s.fromPage = p; s.toPage = p + s.pages - 1; p += s.pages; });
    setStaffList(updated);
    checkMismatchFn(updated, totalPages);
  };

  const doSend = async () => {
    const toSend = staffList.filter(s => s.email);
    if (!toSend.length) return;
    setSending(true); setSendProgress(0);

    // Load PDF-lib for splitting
    if (!window.PDFLib) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const { PDFDocument } = window.PDFLib;

    // Load the master PDF once
    const masterPdf = await PDFDocument.load(pdfBytes.slice(0));

    const docs = [];
    for (let i = 0; i < toSend.length; i++) {
      const s = toSend[i];

      // Step 1: Create individual PDF for this staff member only
      const individualDoc = await PDFDocument.create();

      // Build 0-indexed page array for this staff (e.g. pages 3-4 → [2,3])
      const pagesToCopy = [];
      for (let p = s.fromPage; p <= s.toPage; p++) {
        pagesToCopy.push(p - 1); // PDF-lib uses 0-based indexing
      }

      // Copy ONLY this staff's pages into individual doc
      const copiedPages = await individualDoc.copyPages(masterPdf, pagesToCopy);
      copiedPages.forEach(page => individualDoc.addPage(page));

      // Save to bytes then convert to base64
      const pdfBytes2 = await individualDoc.save();
      const base64Pdf = btoa(
        Array.from(pdfBytes2).map(b => String.fromCharCode(b)).join("")
      );

      // Step 2: Save to documents table with pdf_data as base64
      const { data: doc } = await supabase.from("documents").insert([{
        staff_email: s.email.toLowerCase(),
        staff_name: s.name,
        document_type: docType,
        period,
        sent_by: user?.email,
        signed: false,
        from_page: s.fromPage,
        to_page: s.toPage,
        sig_page: sigPageNum,
        sig_x: sigX,
        sig_y: sigY,
        pdf_data: base64Pdf,
      }]).select().single();

      // Step 3: Send notification to staff
      await supabase.from("notifications").insert([{
        user_email: s.email.toLowerCase(),
        type: docType,
        title: `New ${docType === "contract" ? "Employment Contract" : "Monthly Payslip"} Ready`,
        message: `HR has sent your ${docType === "contract" ? "Employment Contract" : "Payslip"} for ${period}. Please review, sign and return.`,
        document_id: doc?.id || null,
        is_read: false,
        from_page: s.fromPage,
        to_page: s.toPage,
        sig_page: sigPageNum,
        sig_x: sigX,
        sig_y: sigY,
      }]);

      docs.push({ ...s, docId: doc?.id, type: docType, period, sigX, sigY, sigPageNum });
      setSendProgress(Math.round(((i + 1) / toSend.length) * 100));
    }
    setSentDocs(docs);
    setSending(false);
    setStep(6);
  };

  const StepIndicator = ({ n, label }) => (
    <div style={{ flex: 1, minWidth: 70, padding: "8px 6px", borderRadius: 8, fontSize: 10, fontWeight: 700, textAlign: "center", color: step === n ? C.success : step > n ? C.success : C.muted, background: step === n ? C.success + "22" : "transparent", border: `1px solid ${step === n ? C.success : step > n ? C.success + "44" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: step >= n ? C.success : C.border, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
        {step > n ? "✓" : n}
      </div>
      {label}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <div style={{ background: C.card, borderRadius: 20, width: "min(860px,100%)", border: `1px solid ${C.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", maxHeight: "94vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.card, zIndex: 10 }}>
          <div>
            <h2 style={{ color: C.white, fontSize: 17, fontWeight: 800, margin: 0 }}>📤 Send {docType === "contract" ? "Contracts" : "Payslips"} to Staff</h2>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Upload PDF → Set pages → Mark signature → Send to all staff</p>
          </div>
          <Btn small color={C.border} onClick={onClose}>✕</Btn>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", gap: 6, padding: "12px 22px", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {[["1","Upload"],["2","Set Pages"],["3","Sig Spot"],["4","Review"],["5","Send"],["6","Done"]].map(([n,l]) =>
            <StepIndicator key={n} n={parseInt(n)} label={l} />
          )}
        </div>

        <div style={{ padding: 22 }}>

          {/* STEP 1: Upload */}
          {step === 1 && (
            <div>
              <div style={{ padding: "10px 14px", background: C.accent + "15", border: `1px solid ${C.accent}33`, borderRadius: 10, fontSize: 12, color: C.accent, marginBottom: 16, lineHeight: 1.7 }}>
                💡 Convert your generated Excel to PDF first: <strong>File → Export → Create PDF/XPS</strong> in Excel. Then upload here.
              </div>
              <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${fileName ? C.success : C.border}`, borderRadius: 12, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: fileName ? C.success + "06" : "transparent" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
                <div style={{ color: fileName ? C.success : C.muted, fontSize: 13, fontWeight: 600 }}>
                  {fileName ? `✓ ${fileName}` : "Click to upload converted PDF"}
                </div>
                {totalPages > 0 && <div style={{ color: C.accent, fontWeight: 800, fontSize: 14, marginTop: 6 }}>{totalPages} pages found</div>}
              </div>
              <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} style={{ display: "none" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                <Select label="Document Type" value={docType} onChange={setDocType} options={[{ value: "contract", label: "Employment Contract" }, { value: "payslip", label: "Monthly Payslip" }]} />
                <Select label="Period" value={period} onChange={setPeriod} options={periodOptions} />
              </div>
            </div>
          )}

          {/* STEP 2: Set Pages */}
          {step === 2 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 700 }}>Pages per staff contract</div>
                  <input type="number" value={defaultPages} min="1" max="20"
                    onChange={e => setDefaultPages(parseInt(e.target.value) || 1)}
                    style={{ width: 80, fontSize: 22, fontWeight: 800, fontFamily: "monospace", textAlign: "center", background: C.card, border: `2px solid ${C.success}`, borderRadius: 10, padding: "8px 12px", color: C.text, outline: "none" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>= {Math.floor(totalPages / defaultPages)} staff</div>
                  <div style={{ fontSize: 11, color: totalPages % defaultPages > 0 ? C.warning : C.success, marginTop: 3 }}>
                    {totalPages % defaultPages > 0 ? `⚠️ ${totalPages % defaultPages} leftover page(s)` : "✅ Perfect fit"}
                  </div>
                </div>
                <Btn small color={C.success} onClick={() => { buildStaff(); setStep(3); setTimeout(renderSigPlacementPage.bind(null, sigPageNum), 200); }}>Apply & Next →</Btn>
              </div>
              {/* Thumbnails */}
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Page Preview</div>
              <div ref={thumbGridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(80px,1fr))", gap: 8, marginBottom: 14 }}></div>
              <div style={{ textAlign: "right" }}>
                <Btn outline color={C.muted} onClick={() => setStep(1)} style={{ marginRight: 8 }}>← Back</Btn>
              </div>
              {/* Trigger thumbnail render */}
              {step === 2 && <RenderThumbs fn={renderThumbnails} />}
            </div>
          )}

          {/* STEP 3: Mark Signature */}
          {step === 3 && (
            <div>
              <div style={{ padding: "10px 14px", background: C.accent + "15", border: `1px solid ${C.accent}33`, borderRadius: 10, fontSize: 12, color: C.accent, marginBottom: 14, lineHeight: 1.7 }}>
                👆 Click <strong>exactly on the center of the Employee Signature box</strong> in the document below to mark where signatures will appear.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, color: C.muted }}>Page:</div>
                <select value={sigPageNum} onChange={e => { const n = parseInt(e.target.value); setSigPageNum(n); setTimeout(() => renderSigPlacementPage(n), 100); }}
                  style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none" }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                  ))}
                </select>
                {sigMarked && <span style={{ fontSize: 12, color: C.success, fontWeight: 600 }}>✅ Signature location marked!</span>}
              </div>
              <div style={{ position: "relative" }}>
                <canvas ref={placementCanvasRef}
                  style={{ width: "100%", display: "block", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "crosshair" }}
                  onClick={handleCanvasClick} />
                <div ref={markerRef} style={{ position: "absolute", display: "none", pointerEvents: "none", border: `3px solid ${C.success}`, borderRadius: 4, background: "rgba(16,185,129,0.15)", display: "none", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, color: C.success, fontWeight: 700, whiteSpace: "nowrap" }}>✍️ Sign here</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 6 }}>Click to mark signature location</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8, flexWrap: "wrap" }}>
                <Btn outline color={C.muted} onClick={() => setStep(2)}>← Back</Btn>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small outline color={C.muted} onClick={() => { setSigX(null); setSigY(null); setSigMarked(false); if (markerRef.current) markerRef.current.style.display = "none"; }}>Clear Mark</Btn>
                  <Btn color={C.success} onClick={() => setStep(4)} disabled={!sigMarked}>Next: Review Staff →</Btn>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Staff */}
          {step === 4 && (
            <div>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "✅ Ready", value: staffList.filter(s => s.matchStatus === "exact").length, color: C.success },
                  { label: "📧 No Email", value: staffList.filter(s => s.matchStatus === "noemail").length, color: C.warning },
                  { label: "❌ No Match", value: staffList.filter(s => s.matchStatus === "nomatch").length, color: C.danger },
                  { label: "👥 Total", value: staffList.length, color: C.accent },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: color + "15", border: `1px solid ${color}33`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
                    <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {mismatch && <div style={{ padding: "10px 14px", background: C.warning + "15", border: `1px solid ${C.warning}33`, borderRadius: 10, fontSize: 12, color: C.warning, marginBottom: 12 }}>{mismatch}</div>}

              {staffList.filter(s => s.matchStatus === "noemail").length > 0 && (
                <div style={{ padding: "10px 14px", background: C.accent + "15", border: `1px solid ${C.accent}33`, borderRadius: 10, fontSize: 12, color: C.accent, marginBottom: 12 }}>
                  📧 {staffList.filter(s => s.matchStatus === "noemail").length} staff have no email — they will be skipped. Update their email in the Employees module.
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["#", "Staff Name", "Email", "Pages", "Page Range", "Status", "Action"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((s, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "9px 12px", color: C.muted, fontSize: 10 }}>{s.id}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: C.text }}>{s.name}</td>
                        <td style={{ padding: "9px 12px", color: s.email ? C.muted : C.danger, fontSize: 11 }}>{s.email || "No email"}</td>
                        <td style={{ padding: "9px 12px" }}>
                          <input type="number" value={s.pages} min="1" max="20"
                            onChange={e => overridePg(i, e.target.value)}
                            style={{ width: 55, textAlign: "center", fontSize: 12, background: C.bgDeep, border: `1px solid ${s.overridden ? C.warning : C.border}`, borderRadius: 8, padding: "5px 8px", color: C.text, outline: "none" }} />
                        </td>
                        <td style={{ padding: "9px 12px", color: C.accent, fontWeight: 600, fontSize: 11 }}>{s.fromPage}–{s.toPage}</td>
                        <td style={{ padding: "9px 12px" }}>
                          {s.matchStatus === "exact" && <Badge color={C.success}>✅ Ready</Badge>}
                          {s.matchStatus === "noemail" && <Badge color={C.warning}>📧 No Email</Badge>}
                          {s.matchStatus === "nomatch" && <Badge color={C.danger}>❌ No Match</Badge>}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          {(s.matchStatus === "nomatch" || s.matchStatus === "noemail") ? (
                            <select
                              value={s.email}
                              onChange={e => {
                                const selected = employees.find(emp => emp.official_email === e.target.value);
                                const updated = staffList.map((x, idx) => idx === i ? {
                                  ...x,
                                  name: selected?.name || x.name,
                                  email: e.target.value,
                                  matchStatus: e.target.value ? "exact" : "noemail",
                                  matchedEmp: selected || null,
                                } : x);
                                setStaffList(updated);
                              }}
                              style={{ background: C.bgDeep, border: `1px solid ${C.warning}`, borderRadius: 8, padding: "5px 8px", color: C.text, fontSize: 11, outline: "none", maxWidth: 180 }}>
                              <option value="">-- Select staff --</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.official_email || ""}>{emp.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ fontSize: 11, color: C.success }}>✓ Confirmed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 8, flexWrap: "wrap" }}>
                <Btn outline color={C.muted} onClick={() => setStep(3)}>← Back</Btn>
                <Btn color={C.success} onClick={() => setStep(5)} disabled={!!mismatch}>Next: Send All →</Btn>
              </div>
            </div>
          )}

          {/* STEP 5: Send */}
          {step === 5 && (
            <div>
              <div style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 12, lineHeight: 2.2 }}>
                📄 <strong style={{ color: C.text }}>Type:</strong> <span style={{ color: C.muted }}>{docType === "contract" ? "Employment Contracts" : "Monthly Payslips"} · {period}</span><br />
                👥 <strong style={{ color: C.text }}>Sending to:</strong> <span style={{ color: C.accent, fontWeight: 700 }}>{staffList.filter(s => s.email).length} staff</span><br />
                ✍️ <strong style={{ color: C.text }}>Signature at:</strong> <span style={{ color: C.success }}>Page {sigPageNum} · {sigX ? Math.round(sigX * 100) + "%, " + Math.round(sigY * 100) + "% from top-left" : "Not set"}</span>
              </div>
              <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ height: "100%", width: `${sendProgress}%`, background: `linear-gradient(90deg,${C.success},#059669)`, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
                {staffList.filter(s => s.email).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: C.success + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{docType === "contract" ? "📄" : "💰"}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{s.email} · Pages {s.fromPage}–{s.toPage}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: C.muted }}>⏳ Ready</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <Btn outline color={C.muted} onClick={() => setStep(4)} disabled={sending}>← Back</Btn>
                <Btn color={C.success} onClick={doSend} disabled={sending} style={{ padding: "12px 24px", fontSize: 13 }}>
                  {sending ? `Sending... ${sendProgress}%` : `📤 Send to ${staffList.filter(s => s.email).length} Staff Now`}
                </Btn>
              </div>
            </div>
          )}

          {/* STEP 6: Done */}
          {step === 6 && (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🚀</div>
              <div style={{ fontFamily: "inherit", fontSize: 20, fontWeight: 800, color: C.white, marginBottom: 8 }}>All Documents Sent!</div>
              <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Staff have received notifications in their dashboard.<br />They will review, sign and return.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Documents Sent", value: sentDocs.length, color: C.success },
                  { label: "Pages Split", value: totalPages, color: C.accent },
                  { label: "Awaiting Signature", value: sentDocs.length, color: C.warning },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: color + "15", border: `1px solid ${color}33`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
                    <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <Btn color={C.success} onClick={onClose} style={{ padding: "12px 28px" }}>✓ Done</Btn>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper to trigger thumbnail render after mount
function RenderThumbs({ fn }) {
  useEffect(() => { fn(); }, []);
  return null;
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <Card>
          <h3 style={{ color: C.accent, marginBottom: 16, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Assign Role</h3>
          <Input label="Staff Email" value={email} onChange={setEmail} type="email" placeholder="staff@company.com" required />
          <Select label="Role" value={role} onChange={setRole} options={[{ value: "hr", label: "HR / Admin — Full Access" }, { value: "manager", label: "Line Manager — Can Approve Leave" }, { value: "employee", label: "Employee — Standard Access" }]} />
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
                  <td style={{ padding: "12px" }}><Badge color={r.role === "admin" ? C.danger : r.role === "hr" ? C.accent : r.role === "manager" ? C.warning : C.success}>{r.role === "hr" ? "HR/Admin" : r.role === "manager" ? "Line Manager" : "Employee"}</Badge></td>
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
  const [showSendToStaff, setShowSendToStaff] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const isHR = user?.role === "hr" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = !isHR && !isManager;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getRoleForEmail = async (email) => {
    const adminEmails = ["m.christopher@cbi.ngo"];
    if (adminEmails.includes(email.toLowerCase())) return "admin";
    try {
      const timeout = new Promise(resolve => setTimeout(() => resolve({ data: null }), 3000));
      const query = supabase.from("user_roles").select("role").eq("email", email.toLowerCase()).single();
      const { data } = await Promise.race([query, timeout]);
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
    // Load unread notification count
    const loadNotifCount = async () => {
      const { count } = await supabase.from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_email", user.email?.toLowerCase())
        .eq("is_read", false);
      setUnreadNotifCount(count || 0);
    };
    loadNotifCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadNotifCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <div style={{ color: C.accent, fontSize: 16, fontWeight: 600 }}>Loading HR Central...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const allModules = [
    ...modules,
    ...(isAdmin ? [{ id: "roles", label: "Manage Roles", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }] : [])
  ];

  const visibleModules = isHR ? allModules : allModules.filter(m => ["dashboard", "notifications"].includes(m.id));

  // Make user and employees accessible to modals
  if (typeof window !== "undefined") { window.__hrUser = user; window.__hrEmployees = employees; }

  const renderModule = () => {
    switch (active) {
      case "dashboard": return isHR
        ? <Dashboard employees={employees} leaveRequests={leaveRequests} attendance={attendance} user={user} />
        : <StaffDashboard user={user} employees={employees} leaveRequests={leaveRequests} isManager={isManager} setLeaveRequests={setLeaveRequests} />;
      case "employees": return <Employees employees={employees} setEmployees={setEmployees} isHR={isHR} setSelectedEmployee={setSelectedEmployee} />;
      case "attendance": return <Attendance employees={employees} isHR={isHR} setSelectedEmployee={setSelectedEmployee} />;
      case "leave": return isHR ? <Leave employees={employees} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} isHR={isHR} user={user} /> : null;
      case "payroll": return isHR ? <Payroll employees={employees} /> : null;
      case "contracts": return isHR ? <Contracts /> : null;
      case "payslips": return isHR ? <Payslips /> : null;
      case "notifications": return <Notifications user={user} employees={employees} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />;
      case "roles": return isAdmin ? <RoleManager /> : null;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text }}>
      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar-open { transform: translateX(0) !important; }
          .mobile-backdrop { display: block !important; }
          .main-content { margin-left: 0 !important; padding: 0 !important; }
          .mobile-topbar { display: flex !important; }
          .module-content { padding: 16px 14px; }
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-topbar { display: none !important; }
          .module-content { padding: 0; }
        }
      `}</style>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 98, display: "none" }} className="mobile-backdrop" />
      )}

      {/* Sidebar */}
      <div style={{ width: 220, background: C.bgDeep, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }} className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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
            <Badge color={isAdmin ? C.danger : isHR ? C.accent : isManager ? C.warning : C.success} style={{ fontSize: 10 }}>
              {isAdmin ? "Super Admin" : isHR ? "HR Admin" : isManager ? "Line Manager" : "Employee"}
            </Badge>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto", minHeight: 0 }}>
          {visibleModules.map((m) => (
            <div key={m.id} onClick={() => { setActive(m.id); setSidebarOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10,
              cursor: "pointer", marginBottom: 4, transition: "all 0.15s",
              background: active === m.id ? C.accent + "22" : "transparent",
              borderLeft: active === m.id ? `3px solid ${C.accent}` : "3px solid transparent",
              color: active === m.id ? C.accent : C.muted,
              fontWeight: active === m.id ? 700 : 400, fontSize: 13,
            }}>
              <Icon path={m.icon} size={16} color={active === m.id ? C.accent : C.muted} />
              {m.label}
              {m.id === "notifications" && unreadNotifCount > 0 && (
                <div style={{ marginLeft: "auto", background: C.danger, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, minWidth: 18, textAlign: "center" }}>{unreadNotifCount}</div>
              )}
            </div>
          ))}
        </nav>

        {/* Office icon */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ background: C.accent + "10", borderRadius: 12, padding: "8px", marginBottom: 10, border: `1px solid ${C.accent}22`, textAlign: "center" }} className="desktop-only">
            <img src="data:image/png;base64,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" alt="HR Illustration" style={{ width: "100%", borderRadius: 8, opacity: 0.9 }} />
            <div style={{ fontSize: 9, color: C.muted, marginTop: 4, letterSpacing: 0.5 }}>PEOPLE OPERATIONS HQ</div>
          </div>
                    <button onClick={logout} style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px", color: C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 220, padding: "32px 36px", overflowY: "auto", minHeight: "100vh" }} className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-topbar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: C.bgDeep, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 97, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>HR Central</span>
          </div>
          <Badge color={isAdmin ? C.danger : isHR ? C.accent : isManager ? C.warning : C.success} style={{ fontSize: 10 }}>
            {isAdmin ? "Admin" : isHR ? "HR" : isManager ? "Manager" : "Staff"}
          </Badge>
        </div>
        <div className="module-content">
          {renderModule()}
        </div>
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
