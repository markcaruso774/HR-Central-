import { useState, useRef } from "react";
import * as XLSX from "xlsx";

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  border: "#2a2d3e",
  accent: "#4f8ef7",
  accent2: "#f7934f",
  accent3: "#4ff7a0",
  text: "#e8eaf0",
  muted: "#6b7280",
  danger: "#f75b5b",
};

const modules = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "employees", label: "Employees", icon: "◈" },
  { id: "attendance", label: "Attendance", icon: "◷" },
  { id: "leave", label: "Leave", icon: "◻" },
  { id: "payroll", label: "Payroll", icon: "◈" },
  { id: "contracts", label: "Contracts", icon: "◉" },
  { id: "payslips", label: "Payslips", icon: "◈" },
];

function Card({ children, style: s = {} }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px", ...s }}>
      {children}
    </div>
  );
}

function Badge({ color = COLORS.accent, children }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = COLORS.accent, small = false, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? COLORS.border : color, color: disabled ? COLORS.muted : "#fff", border: "none", borderRadius: 8, padding: small ? "6px 14px" : "10px 22px", fontSize: small ? 13 : 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: COLORS.muted, marginBottom: 5, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 13px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: COLORS.muted, marginBottom: 5, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 13px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}>
        <option value="">-- Select --</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ employees, leaveRequests, attendance }) {
  const present = attendance.filter((a) => a.status === "Present").length;
  const onLeave = leaveRequests.filter((l) => l.status === "Approved").length;
  const pending = leaveRequests.filter((l) => l.status === "Pending").length;

  const stats = [
    { label: "Total Employees", value: employees.length, color: COLORS.accent, icon: "◈" },
    { label: "Present Today", value: present, color: COLORS.accent3, icon: "◷" },
    { label: "On Leave", value: onLeave, color: COLORS.accent2, icon: "◻" },
    { label: "Pending Requests", value: pending, color: COLORS.danger, icon: "⚠" },
  ];

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 6, fontWeight: 800 }}>Overview</h2>
      <p style={{ color: COLORS.muted, marginBottom: 28, fontSize: 14 }}>Welcome to your HR Command Centre</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ color: COLORS.text, marginBottom: 16, fontSize: 15 }}>Recent Employees</h3>
          {employees.slice(-5).reverse().map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{e.department}</div>
              </div>
              <Badge color={COLORS.accent}>{e.jobTitle}</Badge>
            </div>
          ))}
          {employees.length === 0 && <p style={{ color: COLORS.muted, fontSize: 13 }}>No employees yet.</p>}
        </Card>
        <Card>
          <h3 style={{ color: COLORS.text, marginBottom: 16, fontSize: 15 }}>Leave Requests</h3>
          {leaveRequests.slice(-5).reverse().map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{l.employeeName}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{l.type} · {l.from} → {l.to}</div>
              </div>
              <Badge color={l.status === "Approved" ? COLORS.accent3 : l.status === "Rejected" ? COLORS.danger : COLORS.accent2}>{l.status}</Badge>
            </div>
          ))}
          {leaveRequests.length === 0 && <p style={{ color: COLORS.muted, fontSize: 13 }}>No requests yet.</p>}
        </Card>
      </div>
    </div>
  );
}

// ── EMPLOYEES ─────────────────────────────────────────────────────────────────
function Employees({ employees, setEmployees }) {
  const [form, setForm] = useState({ name: "", jobTitle: "", department: "", email: "", phone: "", salary: "", startDate: "" });
  const [search, setSearch] = useState("");

  const add = () => {
    if (!form.name || !form.jobTitle) return;
    setEmployees([...employees, { ...form, id: Date.now() }]);
    setForm({ name: "", jobTitle: "", department: "", email: "", phone: "", salary: "", startDate: "" });
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || (e.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 24, fontWeight: 800 }}>Employee Database</h2>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: COLORS.accent, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Add Employee</h3>
          <Input label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Job Title *" value={form.jobTitle} onChange={(v) => setForm({ ...form, jobTitle: v })} />
          <Input label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="Basic Salary (₦)" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} type="number" />
          <Input label="Start Date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} type="date" />
          <Btn onClick={add}>Add Employee</Btn>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, fontSize: 15 }}>All Staff ({filtered.length})</h3>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              style={{ background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 12px", color: COLORS.text, fontSize: 13, outline: "none", width: 180 }} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  {["Name", "Title", "Dept", "Email", "Salary", "Start", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: COLORS.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px", color: COLORS.text, fontWeight: 600 }}>{e.name}</td>
                    <td style={{ padding: "10px", color: COLORS.muted }}>{e.jobTitle}</td>
                    <td style={{ padding: "10px" }}><Badge color={COLORS.accent}>{e.department || "—"}</Badge></td>
                    <td style={{ padding: "10px", color: COLORS.muted, fontSize: 12 }}>{e.email}</td>
                    <td style={{ padding: "10px", color: COLORS.accent3, fontFamily: "monospace" }}>{e.salary ? `₦${Number(e.salary).toLocaleString()}` : "—"}</td>
                    <td style={{ padding: "10px", color: COLORS.muted, fontSize: 12 }}>{e.startDate}</td>
                    <td style={{ padding: "10px" }}><Btn small color={COLORS.danger} onClick={() => setEmployees(employees.filter(x => x.id !== e.id))}>✕</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ color: COLORS.muted, textAlign: "center", padding: 30 }}>No employees found.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── ATTENDANCE ────────────────────────────────────────────────────────────────
function Attendance({ employees, attendance, setAttendance }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const mark = (empId, empName, status) => {
    const idx = attendance.findIndex((a) => a.employeeId === empId && a.date === date);
    if (idx >= 0) {
      const u = [...attendance]; u[idx] = { ...u[idx], status }; setAttendance(u);
    } else {
      setAttendance([...attendance, { id: Date.now(), employeeId: empId, employeeName: empName, date, status }]);
    }
  };

  const getStatus = (empId) => attendance.find((a) => a.employeeId === empId && a.date === date)?.status || null;
  const recs = attendance.filter((a) => a.date === date);

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 24, fontWeight: 800 }}>Attendance Tracker</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 14, outline: "none" }} />
        <Badge color={COLORS.accent3}>{recs.filter(r => r.status === "Present").length} Present</Badge>
        <Badge color={COLORS.danger}>{recs.filter(r => r.status === "Absent").length} Absent</Badge>
        <Badge color={COLORS.accent2}>{recs.filter(r => r.status === "Late").length} Late</Badge>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Employee", "Department", "Status", "Mark Attendance"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const s = getStatus(e.id);
              return (
                <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "12px", color: COLORS.text, fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: "12px", color: COLORS.muted }}>{e.department}</td>
                  <td style={{ padding: "12px" }}>
                    {s ? <Badge color={s === "Present" ? COLORS.accent3 : s === "Absent" ? COLORS.danger : COLORS.accent2}>{s}</Badge>
                      : <span style={{ color: COLORS.muted, fontSize: 12 }}>Not marked</span>}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small color={COLORS.accent3} onClick={() => mark(e.id, e.name, "Present")}>Present</Btn>
                      <Btn small color={COLORS.danger} onClick={() => mark(e.id, e.name, "Absent")}>Absent</Btn>
                      <Btn small color={COLORS.accent2} onClick={() => mark(e.id, e.name, "Late")}>Late</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {employees.length === 0 && <p style={{ color: COLORS.muted, textAlign: "center", padding: 30 }}>Add employees first.</p>}
      </Card>
    </div>
  );
}

// ── LEAVE ─────────────────────────────────────────────────────────────────────
function Leave({ employees, leaveRequests, setLeaveRequests }) {
  const [form, setForm] = useState({ employeeId: "", type: "", from: "", to: "", reason: "" });

  const submit = () => {
    if (!form.employeeId || !form.type || !form.from || !form.to) return;
    const emp = employees.find((e) => String(e.id) === String(form.employeeId));
    setLeaveRequests([...leaveRequests, { ...form, id: Date.now(), employeeName: emp?.name || "Unknown", status: "Pending" }]);
    setForm({ employeeId: "", type: "", from: "", to: "", reason: "" });
  };

  const updateStatus = (id, status) => setLeaveRequests(leaveRequests.map((l) => l.id === id ? { ...l, status } : l));

  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity/Paternity", "Emergency Leave", "Unpaid Leave"].map(v => ({ value: v, label: v }));

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 24, fontWeight: 800 }}>Leave Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: COLORS.accent, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>New Request</h3>
          <SelectField label="Employee" value={form.employeeId} onChange={(v) => setForm({ ...form, employeeId: v })}
            options={employees.map((e) => ({ value: e.id, label: e.name }))} />
          <SelectField label="Leave Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={leaveTypes} />
          <Input label="From" value={form.from} onChange={(v) => setForm({ ...form, from: v })} type="date" />
          <Input label="To" value={form.to} onChange={(v) => setForm({ ...form, to: v })} type="date" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: COLORS.muted, marginBottom: 5, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Reason</label>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
              style={{ width: "100%", background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 13px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 70 }} />
          </div>
          <Btn onClick={submit}>Submit Request</Btn>
        </Card>
        <Card>
          <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>All Requests</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                {["Employee", "Type", "Period", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: COLORS.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((l) => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "10px", color: COLORS.text, fontWeight: 600 }}>{l.employeeName}</td>
                  <td style={{ padding: "10px" }}><Badge color={COLORS.accent2}>{l.type}</Badge></td>
                  <td style={{ padding: "10px", color: COLORS.muted, fontSize: 12 }}>{l.from} → {l.to}</td>
                  <td style={{ padding: "10px" }}><Badge color={l.status === "Approved" ? COLORS.accent3 : l.status === "Rejected" ? COLORS.danger : COLORS.accent2}>{l.status}</Badge></td>
                  <td style={{ padding: "10px" }}>
                    {l.status === "Pending" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small color={COLORS.accent3} onClick={() => updateStatus(l.id, "Approved")}>Approve</Btn>
                        <Btn small color={COLORS.danger} onClick={() => updateStatus(l.id, "Rejected")}>Reject</Btn>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaveRequests.length === 0 && <p style={{ color: COLORS.muted, textAlign: "center", padding: 30 }}>No leave requests yet.</p>}
        </Card>
      </div>
    </div>
  );
}

// ── PAYROLL ───────────────────────────────────────────────────────────────────
function Payroll({ employees }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [overrides, setOverrides] = useState({});
  const setOv = (id, field, val) => setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

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
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 24, fontWeight: 800 }}>Payroll</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
          style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 14, outline: "none" }} />
        <Badge color={COLORS.accent3}>Total Payroll: ₦{total.toLocaleString()}
