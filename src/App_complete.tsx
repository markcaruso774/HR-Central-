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

function Employees({ employees, setEmployees }) {
  const [form, setForm] = useState({ name: "", jobTitle: "", department: "", email: "", phone: "", salary: "", startDate: "" });
  const [search, setSearch] = useState("");
  const add = () => {
    if (!form.name || !form.jobTitle) return;
    setEmployees([...employees, { ...form, id: Date.now() }]);
    setForm({ name: "", jobTitle: "", department: "", email: "", phone: "", salary: "", startDate: "" });
  };
  const filtered = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || (e.department || "").toLowerCase().includes(search.toLowerCase()));
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
          <Input label="Basic Salary" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} type="number" />
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

function Attendance({ employees, attendance, setAttendance }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const mark = (empId, empName, status) => {
    const idx = attendance.findIndex((a) => a.employeeId === empId && a.date === date);
    if (idx >= 0) { const u = [...attendance]; u[idx] = { ...u[idx], status }; setAttendance(u); }
    else { setAttendance([...attendance, { id: Date.now(), employeeId: empId, employeeName: empName, date, status }]); }
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
          <SelectField label="Employee" value={form.employeeId} onChange={(v) => setForm({ ...form, employeeId: v })} options={employees.map((e) => ({ value: e.id, label: e.name }))} />
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
        <Badge color={COLORS.accent3}>Total Payroll: ₦{total.toLocaleString()}</Badge>
      </div>
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                {["Employee", "Basic Salary", "Allowance", "Tax (7%)", "Pension (8%)", "Net Pay"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const { base, allowance, tax, pension, net } = getRow(e);
                return (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 600 }}>{e.name}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <input type="number" defaultValue={e.salary} onChange={(ev) => setOv(e.id, "salary", ev.target.value)}
                        style={{ width: 110, background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 8px", color: COLORS.text, fontSize: 13, outline: "none" }} />
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <input type="number" defaultValue={0} placeholder="0" onChange={(ev) => setOv(e.id, "allowance", ev.target.value)}
                        style={{ width: 90, background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 8px", color: COLORS.text, fontSize: 13, outline: "none" }} />
                    </td>
                    <td style={{ padding: "10px 12px", color: COLORS.danger, fontFamily: "monospace" }}>₦{tax.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.accent2, fontFamily: "monospace" }}>₦{pension.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.accent3, fontFamily: "monospace", fontWeight: 700, fontSize: 15 }}>₦{net.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {employees.length === 0 && <p style={{ color: COLORS.muted, textAlign: "center", padding: 30 }}>No employees found.</p>}
        </div>
      </Card>
    </div>
  );
}

function Contracts() {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [contractSheet, setContractSheet] = useState("");
  const [sheetOptions, setSheetOptions] = useState([]);
  const [mappings, setMappings] = useState([{ column: "", cell: "" }]);
  const [status, setStatus] = useState("");
  const [generated, setGenerated] = useState([]);
  const fileRef = useRef();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f); setStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb); setSheetOptions(wb.SheetNames.map((s) => ({ value: s, label: s })));
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (rows.length > 0) {
          const headers = rows[0].filter(Boolean); setColumns(headers);
          const dataRows = rows.slice(1).filter((r) => r.some((c) => c !== undefined && c !== ""));
          setStaffData(dataRows.map((r) => { const obj = {}; headers.forEach((h, i) => { obj[h] = r[i] ?? ""; }); return obj; }));
          setStatus(`✓ Loaded ${dataRows.length} staff. Select contract sheet and map columns.`);
        }
      } catch (err) { setStatus("Error: " + err.message); }
    };
    reader.readAsArrayBuffer(f);
  };
  const addMapping = () => setMappings([...mappings, { column: "", cell: "" }]);
  const updateMapping = (i, field, val) => { const u = [...mappings]; u[i] = { ...u[i], [field]: val }; setMappings(u); };
  const removeMapping = (i) => setMappings(mappings.filter((_, idx) => idx !== i));
  const generate = () => {
    if (!workbook || !contractSheet || staffData.length === 0) { setStatus("⚠ Please upload file, select contract sheet, and add mappings."); return; }
    const results = [];
    staffData.forEach((staff, idx) => {
      try {
        const wsClone = JSON.parse(JSON.stringify(workbook.Sheets[contractSheet]));
        mappings.forEach(({ column, cell }) => {
          if (!column || !cell) return;
          const value = staff[column] ?? ""; const cellKey = cell.toUpperCase();
          if (wsClone[cellKey]) { wsClone[cellKey].v = value; wsClone[cellKey].w = String(value); wsClone[cellKey].t = "s"; }
          else { wsClone[cellKey] = { v: value, w: String(value), t: "s" }; }
        });
        const newWb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(newWb, wsClone, "Contract");
        const xlsxData = XLSX.write(newWb, { bookType: "xlsx", type: "base64" });
        results.push({ name: staff[columns[0]] || `Staff_${idx + 1}`, data: xlsxData });
      } catch (err) { console.error(err); }
    });
    setGenerated(results); setStatus(`✓ Generated ${results.length} contracts!`);
  };
  const downloadOne = (item) => {
    const link = document.createElement("a");
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${item.data}`;
    link.download = `Contract_${item.name}.xlsx`; link.click();
  };
  const downloadAll = () => generated.forEach((item, i) => setTimeout(() => downloadOne(item), i * 400));
  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 8, fontWeight: 800 }}>Contract Generation</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24, fontSize: 14, lineHeight: 1.7 }}>Upload Excel — Sheet 1 = Staff Data, another sheet = Contract Template. Map columns to cells and generate all contracts.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: COLORS.accent, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Step 1 — Upload Excel File</h3>
          <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{file ? `✓ ${file.name}` : "Click to upload .xlsx file"}</div>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: "none" }} />
          {sheetOptions.length > 0 && (
            <>
              <h3 style={{ color: COLORS.accent2, marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginTop: 20 }}>Step 2 — Select Contract Sheet</h3>
              <SelectField label="Contract Sheet" value={contractSheet} onChange={setContractSheet} options={sheetOptions} />
              <div style={{ background: "#0f1117", borderRadius: 8, padding: 10, fontSize: 12, color: COLORS.muted }}>Detected: <strong style={{ color: COLORS.accent3 }}>{staffData.length} staff</strong> | Columns: <strong style={{ color: COLORS.text }}>{columns.join(", ")}</strong></div>
            </>
          )}
        </Card>
        <Card>
          <h3 style={{ color: COLORS.accent3, marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Step 3 — Map Columns to Cells</h3>
          <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 14 }}>E.g. "Staff Name" → G5, "Salary" → F12</p>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}><SelectField label={i === 0 ? "Column" : ""} value={m.column} onChange={(v) => updateMapping(i, "column", v)} options={columns.map((c) => ({ value: c, label: c }))} /></div>
              <div style={{ color: COLORS.muted, paddingBottom: 14, fontSize: 20 }}>→</div>
              <div style={{ flex: 1 }}><Input label={i === 0 ? "Target Cell" : ""} value={m.cell} onChange={(v) => updateMapping(i, "cell", v)} placeholder="e.g. G5" /></div>
              <div style={{ paddingBottom: 14 }}><Btn small color={COLORS.danger} onClick={() => removeMapping(i)}>✕</Btn></div>
            </div>
          ))}
          <Btn small color={COLORS.muted} onClick={addMapping}>+ Add Mapping</Btn>
          <div style={{ marginTop: 20 }}><Btn onClick={generate} disabled={!workbook || mappings.length === 0}>⚡ Generate All Contracts</Btn></div>
        </Card>
      </div>
      {status && <div style={{ marginTop: 16, padding: "12px 16px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: status.startsWith("✓") ? COLORS.accent3 : COLORS.accent2, fontSize: 13 }}>{status}</div>}
      {generated.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, fontSize: 15 }}>Generated Contracts ({generated.length})</h3>
            <Btn small color={COLORS.accent} onClick={downloadAll}>⬇ Download All</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10 }}>
            {generated.map((item, i) => (
              <div key={i} onClick={() => downloadOne(item)} style={{ background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div><div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{item.name}</div><div style={{ color: COLORS.accent, fontSize: 11 }}>Click to download</div></div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Payslips() {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [payslipSheet, setPayslipSheet] = useState("");
  const [sheetOptions, setSheetOptions] = useState([]);
  const [mappings, setMappings] = useState([{ column: "", cell: "" }]);
  const [status, setStatus] = useState("");
  const [generated, setGenerated] = useState([]);
  const fileRef = useRef();
  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb); setSheetOptions(wb.SheetNames.map((s) => ({ value: s, label: s })));
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (rows.length > 0) {
          const headers = rows[0].filter(Boolean); setColumns(headers);
          const dataRows = rows.slice(1).filter((r) => r.some((c) => c !== undefined && c !== ""));
          setStaffData(dataRows.map((r) => { const obj = {}; headers.forEach((h, i) => { obj[h] = r[i] ?? ""; }); return obj; }));
          setStatus(`✓ Loaded ${dataRows.length} staff.`);
        }
      } catch (err) { setStatus("Error: " + err.message); }
    };
    reader.readAsArrayBuffer(f);
  };
  const addMapping = () => setMappings([...mappings, { column: "", cell: "" }]);
  const updateMapping = (i, field, val) => { const u = [...mappings]; u[i] = { ...u[i], [field]: val }; setMappings(u); };
  const removeMapping = (i) => setMappings(mappings.filter((_, idx) => idx !== i));
  const generate = () => {
    if (!workbook || !payslipSheet || staffData.length === 0) { setStatus("⚠ Please upload file, select payslip sheet, and add mappings."); return; }
    const results = [];
    staffData.forEach((staff, idx) => {
      try {
        const wsClone = JSON.parse(JSON.stringify(workbook.Sheets[payslipSheet]));
        mappings.forEach(({ column, cell }) => {
          if (!column || !cell) return;
          const value = staff[column] ?? ""; const cellKey = cell.toUpperCase();
          if (wsClone[cellKey]) { wsClone[cellKey].v = value; wsClone[cellKey].w = String(value); wsClone[cellKey].t = "s"; }
          else { wsClone[cellKey] = { v: value, w: String(value), t: "s" }; }
        });
        const newWb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(newWb, wsClone, "Payslip");
        const xlsxData = XLSX.write(newWb, { bookType: "xlsx", type: "base64" });
        results.push({ name: staff[columns[0]] || `Staff_${idx + 1}`, data: xlsxData });
      } catch (err) { console.error(err); }
    });
    setGenerated(results); setStatus(`✓ Generated ${results.length} payslips!`);
  };
  const downloadOne = (item) => {
    const link = document.createElement("a");
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${item.data}`;
    link.download = `Payslip_${item.name}.xlsx`; link.click();
  };
  const downloadAll = () => generated.forEach((item, i) => setTimeout(() => downloadOne(item), i * 400));
  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 28, marginBottom: 8, fontWeight: 800 }}>Payslip Generation</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24, fontSize: 14, lineHeight: 1.7 }}>Upload Excel — Sheet 1 = Salary Data, another sheet = Payslip Template. Map columns to cells and generate all payslips.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: COLORS.accent, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Step 1 — Upload Excel File</h3>
          <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{file ? `✓ ${file.name}` : "Click to upload .xlsx file"}</div>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: "none" }} />
          {sheetOptions.length > 0 && (
            <>
              <h3 style={{ color: COLORS.accent2, marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginTop: 20 }}>Step 2 — Select Payslip Sheet</h3>
              <SelectField label="Payslip Sheet" value={payslipSheet} onChange={setPayslipSheet} options={sheetOptions} />
              <div style={{ background: "#0f1117", borderRadius: 8, padding: 10, fontSize: 12, color: COLORS.muted }}>Detected: <strong style={{ color: COLORS.accent3 }}>{staffData.length} staff</strong> | Columns: <strong style={{ color: COLORS.text }}>{columns.join(", ")}</strong></div>
            </>
          )}
        </Card>
        <Card>
          <h3 style={{ color: COLORS.accent3, marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Step 3 — Map Columns to Cells</h3>
          <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 14 }}>E.g. "Basic Salary" → F8, "Staff Name" → C3</p>
          {mappings.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}><SelectField label={i === 0 ? "Column" : ""} value={m.column} onChange={(v) => updateMapping(i, "column", v)} options={columns.map((c) => ({ value: c, label: c }))} /></div>
              <div style={{ color: COLORS.muted, paddingBottom: 14, fontSize: 20 }}>→</div>
              <div style={{ flex: 1 }}><Input label={i === 0 ? "Target Cell" : ""} value={m.cell} onChange={(v) => updateMapping(i, "cell", v)} placeholder="e.g. F8" /></div>
              <div style={{ paddingBottom: 14 }}><Btn small color={COLORS.danger} onClick={() => removeMapping(i)}>✕</Btn></div>
            </div>
          ))}
          <Btn small color={COLORS.muted} onClick={addMapping}>+ Add Mapping</Btn>
          <div style={{ marginTop: 20 }}><Btn onClick={generate} disabled={!workbook || mappings.length === 0}>⚡ Generate All Payslips</Btn></div>
        </Card>
      </div>
      {status && <div style={{ marginTop: 16, padding: "12px 16px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: status.startsWith("✓") ? COLORS.accent3 : COLORS.accent2, fontSize: 13 }}>{status}</div>}
      {generated.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, fontSize: 15 }}>Generated Payslips ({generated.length})</h3>
            <Btn small color={COLORS.accent} onClick={downloadAll}>⬇ Download All</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10 }}>
            {generated.map((item, i) => (
              <div key={i} onClick={() => downloadOne(item)} style={{ background: "#0f1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>💵</span>
                <div><div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{item.name}</div><div style={{ color: COLORS.accent, fontSize: 11 }}>Click to download</div></div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [employees, setEmployees] = useState([
    { id: 1, name: "Adaeze Okonkwo", jobTitle: "Senior Accountant", department: "Finance", email: "adaeze@company.ng", phone: "08012345678", salary: 350000, startDate: "2022-03-01" },
    { id: 2, name: "Chukwuemeka Nwosu", jobTitle: "HR Manager", department: "Human Resources", email: "emeka@company.ng", phone: "08087654321", salary: 420000, startDate: "2021-07-15" },
    { id: 3, name: "Fatima Al-Hassan", jobTitle: "Software Engineer", department: "Technology", email: "fatima@company.ng", phone: "08055566677", salary: 500000, startDate: "2023-01-10" },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeId: 1, employeeName: "Adaeze Okonkwo", type: "Annual Leave", from: "2025-03-10", to: "2025-03-17", reason: "Family vacation", status: "Approved" },
    { id: 2, employeeId: 2, employeeName: "Chukwuemeka Nwosu", type: "Sick Leave", from: "2025-02-20", to: "2025-02-22", reason: "Flu", status: "Pending" },
  ]);
  const [attendance, setAttendance] = useState([]);

  const renderModule = () => {
    switch (active) {
      case "dashboard": return <Dashboard employees={employees} leaveRequests={leaveRequests} attendance={attendance} />;
      case "employees": return <Employees employees={employees} setEmployees={setEmployees} />;
      case "attendance": return <Attendance employees={employees} attendance={attendance} setAttendance={setAttendance} />;
      case "leave": return <Leave employees={employees} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />;
      case "payroll": return <Payroll employees={employees} />;
      case "contracts": return <Contracts />;
      case "payslips": return <Payslips />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text }}>
      <div style={{ width: 210, background: COLORS.card, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 18, color: COLORS.accent, fontWeight: 800 }}>HR Central</div>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 3, letterSpacing: 1.2, textTransform: "uppercase" }}>People Operations</div>
        </div>
        <nav style={{ padding: "14px 8px", flex: 1 }}>
          {modules.map((m) => (
            <div key={m.id} onClick={() => setActive(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 3, background: active === m.id ? COLORS.accent + "18" : "transparent", borderLeft: active === m.id ? `3px solid ${COLORS.accent}` : "3px solid transparent", color: active === m.id ? COLORS.accent : COLORS.muted, fontSize: 14, fontWeight: active === m.id ? 700 : 400 }}>
              <span>{m.icon}</span>{m.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.7 }}>
            <span style={{ color: COLORS.accent3, fontWeight: 700 }}>Free &amp; Open Source</span><br />No subscriptions · No ads
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>{renderModule()}</div>
    </div>
  );
}
