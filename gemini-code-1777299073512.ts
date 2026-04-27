import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tiwukijaoejvgrnyhnzi.supabase.co";
const SUPABASE_KEY = "sb_publishable_rkmTH1nTl5qkn-_7jLmQAw_-ExQC-WP";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── THEME (STRICT ADHERENCE) ──────────────────────────────────────────────────
const C = {
  bg: "#0d1f3c",
  bgDeep: "#071428",
  card: "#132040",
  border: "#1e3a6e",
  accent: "#3b82f6",
  white: "#f0f6ff",
  muted: "#7a9cc4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#e2eeff"
};

// ── UI HELPERS ───────────────────────────────────────────────────────────────
const Rnd = (v) => Math.round((v || 0) * 100) / 100;
const F = (v) => '₦' + Rnd(v || 0).toLocaleString('en-NG', {minimumFractionDigits:2, maximumFractionDigits:2});

const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, style, color = C.accent, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: disabled ? C.bgDeep : color, color: "#fff", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, ...style }}>{children}</button>
);

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13, outline: "none" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13 }}>
      <option value="">-- Select --</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// ── PAYROLL MODULE (AUDITED & SYNCED) ────────────────────────────────────────
function Payroll() {
  const [activeTab, setActiveTab] = useState("upload");
  const [currency, setCurrency] = useState("NGN");
  const [rate, setRate] = useState(1);
  const [results, setResults] = useState([]);
  const [manualList, setManualList] = useState([]);
  const [mapping, setMapping] = useState({ name: "", position: "", cumulative: "", duration: "" });
  const [excelCols, setExcelCols] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [currentSheet, setCurrentSheet] = useState("");
  const [workbook, setWorkbook] = useState(null);

  // Manual Form State
  const [mForm, setMForm] = useState({ name: "", position: "", cumulative: "", duration: "6", rent: "0", otherIncome: "0", otherDeductions: "0" });

  const calcPAYE = (taxable) => {
    if (taxable <= 0) return 0;
    let tax = 0;
    const bands = [
      { limit: 300000, rate: 0.15 }, { limit: 300000, rate: 0.18 },
      { limit: 400000, rate: 0.20 }, { limit: 300000, rate: 0.23 },
      { limit: Infinity, rate: 0.25 }
    ];
    let remaining = taxable;
    for (const b of bands) {
      const amt = Math.min(remaining, b.limit);
      tax += amt * b.rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    return tax;
  };

  const processRow = (d) => {
    const cumNGN = (parseFloat(d.cumulative) || 0) * rate;
    const otherNGN = (parseFloat(d.otherIncome) || 0) * rate;
    const rentNGN = (parseFloat(d.rent) || 0) * rate;
    const otherDedNGN = (parseFloat(d.otherDeductions) || 0) * rate;
    const dur = parseInt(d.duration) || 6;

    const emp10 = (cumNGN / dur) * 0.10;
    const monthlyGross = (cumNGN / dur) + emp10 + otherNGN;
    const nhisMo = monthlyGross * 0.015;
    const pens8Mo = (monthlyGross * 0.7) * 0.08;
    const annualGross = monthlyGross * 12;
    const rentRelief = Math.min(rentNGN * 12, annualGross * 0.15);
    const pens8Ann = pens8Mo * 12;
    const annTaxable = Math.max(0, annualGross - rentRelief - pens8Ann);
    const payeAnn = calcPAYE(annTaxable);
    const payeMo = payeAnn / 12;
    const netMo = monthlyGross - nhisMo - pens8Mo - payeMo - otherDedNGN;

    return { ...d, cumNGN, emp10, monthlyGross, dur, nhisMo, pens8Mo, annualGross, rentRelief, pens8Ann, annTaxable, payeAnn, payeMo, otherDed: otherDedNGN, netMo };
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.XLSX) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      document.head.appendChild(script);
      await new Promise(r => script.onload = r);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = window.XLSX.read(evt.target.result, { type: "binary" });
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      setCurrentSheet(wb.SheetNames[0]);
      loadSheetData(wb, wb.SheetNames[0]);
    };
    reader.readAsBinaryString(file);
  };

  const loadSheetData = (wb, sheetName) => {
    const ws = wb.Sheets[sheetName];
    const json = window.XLSX.utils.sheet_to_json(ws);
    if (json.length > 0) {
      setExcelCols(Object.keys(json[0]));
      setRawData(json);
    }
  };

  const calculateResults = () => {
    const dataToProcess = activeTab === "manual" ? manualList : rawData.map(row => ({
      name: row[mapping.name],
      position: row[mapping.position],
      cumulative: row[mapping.cumulative],
      duration: row[mapping.duration] || 6,
      rent: row[mapping.rent] || 0,
      otherIncome: row[mapping.otherIncome] || 0,
      otherDeductions: row[mapping.otherDeductions] || 0
    }));
    setResults(dataToProcess.map(processRow));
    setActiveTab("results");
  };

  const downloadExcel = () => {
    const hdrs = ['S/N','Staff Name','Position','Total Package (NGN)','10% Emp Pension','Monthly Gross','Duration','Monthly NHIS','Monthly 8% Pension','Annual Gross','Rent Relief','Annual 8% Pension','Annual Taxable','Annual PAYE','Monthly PAYE','Other Deductions','Net Pay (Monthly)'];
    const rows = results.map((r,i) => [i+1, r.name, r.position, Rnd(r.cumNGN), Rnd(r.emp10), Rnd(r.monthlyGross), r.dur, Rnd(r.nhisMo), Rnd(r.pens8Mo), Rnd(r.annualGross), Rnd(r.rentRelief), Rnd(r.pens8Ann), Rnd(r.annTaxable), Rnd(r.payeAnn), Rnd(r.payeMo), Rnd(r.otherDed), Rnd(r.netMo)]);
    const ws = window.XLSX.utils.aoa_to_sheet([hdrs, ...rows]);
    ws['!cols'] = [5, 25, 20, 15, 15, 15, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15].map(w => ({ wch: w }));
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Payroll_2026");
    window.XLSX.writeFile(wb, `CBI_Payroll_${new Date().getTime()}.xlsx`);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800 }}>Payroll Center</h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Nigeria PAYE 2026 Integrated Standards</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Btn onClick={() => setActiveTab("upload")} color={activeTab === "upload" ? C.accent : C.bgDeep} style={{ flex: 1 }}>📤 Upload</Btn>
        <Btn onClick={() => setActiveTab("manual")} color={activeTab === "manual" ? C.accent : C.bgDeep} style={{ flex: 1 }}>✏️ Manual</Btn>
        {results.length > 0 && <Btn onClick={() => setActiveTab("results")} color={C.success} style={{ flex: 1 }}>📊 View Results</Btn>}
      </div>

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Select label="Reporting Currency" value={currency} onChange={setCurrency} options={["NGN", "USD", "EUR"]} />
          {currency !== "NGN" && <Input label={`${currency} to NGN Rate`} type="number" value={rate} onChange={setRate} />}
        </div>
      </Card>

      {activeTab === "upload" && (
        <Card>
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer" }} onClick={() => document.getElementById('fUp').click()}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
            <div style={{ color: C.white, fontWeight: 700 }}>Click to Upload Excel</div>
            <input type="file" id="fUp" hidden accept=".xlsx,.xls" onChange={handleFile} />
          </div>
          {sheets.length > 1 && <Select label="Select Sheet" value={currentSheet} onChange={v => { setCurrentSheet(v); loadSheetData(workbook, v); }} options={sheets} />}
          {excelCols.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Select label="Staff Name" value={mapping.name} onChange={v => setMapping({ ...mapping, name: v })} options={excelCols} />
                <Select label="Total Package" value={mapping.cumulative} onChange={v => setMapping({ ...mapping, cumulative: v })} options={excelCols} />
                <Select label="Position" value={mapping.position} onChange={v => setMapping({ ...mapping, position: v })} options={excelCols} />
                <Select label="Duration" value={mapping.duration} onChange={v => setMapping({ ...mapping, duration: v })} options={excelCols} />
              </div>
              <Btn style={{ width: "100%", marginTop: 20 }} onClick={calculateResults}>Process Excel Payroll</Btn>
            </div>
          )}
        </Card>
      )}

      {activeTab === "manual" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Name" value={mForm.name} onChange={v => setMForm({ ...mForm, name: v })} />
            <Input label="Position" value={mForm.position} onChange={v => setMForm({ ...mForm, position: v })} />
            <Input label="Total Package" type="number" value={mForm.cumulative} onChange={v => setMForm({ ...mForm, cumulative: v })} />
            <Input label="Duration (Months)" type="number" value={mForm.duration} onChange={v => setMForm({ ...mForm, duration: v })} />
          </div>
          <Btn style={{ width: "100%", marginTop: 10 }} onClick={() => { setManualList([...manualList, mForm]); setMForm({ ...mForm, name: "", position: "", cumulative: "" }); }}>Add Staff ({manualList.length})</Btn>
          {manualList.length > 0 && <Btn color={C.success} style={{ width: "100%", marginTop: 10 }} onClick={calculateResults}>Run Manual Payroll</Btn>}
        </Card>
      )}

      {activeTab === "results" && (
        <div style={{ overflowX: "auto" }}>
          <Card style={{ padding: 0 }}>
            <div style={{ padding: 16, display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ color: C.white }}>Payroll Register</h3>
              <Btn color={C.success} onClick={downloadExcel}>Download Excel Export</Btn>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1400, fontSize: 11 }}>
              <thead style={{ background: C.bgDeep }}>
                <tr>{['#', 'Name', 'Position', 'Total (NGN)', '10% Pension', 'Mo. Gross', 'Dur', 'NHIS', '8% Pens', 'Ann. Gross', 'Rent Relief', 'Taxable', 'Mo. PAYE', 'Net Pay'].map(h => <th key={h} style={{ padding: 12, textAlign: "left", color: C.muted }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: 12 }}>{i + 1}</td>
                    <td style={{ padding: 12, fontWeight: 700, color: C.white }}>{r.name}</td>
                    <td style={{ padding: 12 }}>{r.position}</td>
                    <td style={{ padding: 12 }}>{F(r.cumNGN)}</td>
                    <td style={{ padding: 12 }}>{F(r.emp10)}</td>
                    <td style={{ padding: 12 }}>{F(r.monthlyGross)}</td>
                    <td style={{ padding: 12 }}>{r.dur}</td>
                    <td style={{ padding: 12 }}>{F(r.nhisMo)}</td>
                    <td style={{ padding: 12 }}>{F(r.pens8Mo)}</td>
                    <td style={{ padding: 12 }}>{F(r.annualGross)}</td>
                    <td style={{ padding: 12 }}>{F(r.rentRelief)}</td>
                    <td style={{ padding: 12 }}>{F(r.annTaxable)}</td>
                    <td style={{ padding: 12, color: C.warning }}>{F(r.payeMo)}</td>
                    <td style={{ padding: 12, fontWeight: 800, color: C.success }}>{F(r.netMo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <Payroll />
    </div>
  );
}