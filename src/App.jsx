import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const API = "https://lead-engine-production-0516.up.railway.app";

export default function App() {
  // -------------------------
  // AUTH (EMAIL ONLY)
  // -------------------------
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // -------------------------
  // SEARCH
  // -------------------------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // -------------------------
  // LOGIN (EMAIL ONLY)
  // -------------------------
  const handleLogin = async () => {
    if (!email) return alert("Email required");

    await fetch(`${API}/save-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoggedIn(true);
  };

  // -------------------------
  // SEARCH LEADS
  // -------------------------
  const handleSearch = async () => {
    if (!query) return alert("Enter search query");

    const res = await fetch(`${API}/search?query=${query}`);
    const data = await res.json();

    setResults(data.results || []);
  };

  // -------------------------
  // EXPORT CSV (FULL SCHEMA)
  // -------------------------
  const exportCSV = () => {
    if (!results.length) return alert("No data to export");

    const headers = [
      "first_name",
      "last_name",
      "title",
      "company_name",
      "mailing_address",
      "primary_city",
      "primary_state",
      "zip_code",
      "country",
      "phone",
      "web_address",
      "email",
      "revenue",
      "employee",
      "industry",
      "sub_industry",
    ];

    const csvRows = [
      headers.join(","),
      ...results.map((row) =>
        headers
          .map((h) => {
            const value = row[h] ?? "";
            return `"${String(value).replaceAll('"', '""')}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "findb2b_leads.csv";
    a.click();
  };

  // -------------------------
  // LOGIN SCREEN
  // -------------------------
  if (!loggedIn) {
    return (
      <>
        <div style={{ padding: 40, maxWidth: 400 }}>
          <h2>FindB2B Access</h2>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, width: "100%", marginTop: 10 }}
          />

          <button
            onClick={handleLogin}
            style={{ marginTop: 15, padding: 10, width: "100%" }}
          >
            Continue
          </button>
        </div>
        <Analytics />
      </>
    );
  }

  // -------------------------
  // MAIN APP
  // -------------------------
  return (
    <>
      <div style={{ padding: 40 }}>
        <h2>FindB2B Lead Search</h2>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search (e.g. software companies in Texas)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, width: 400 }}
        />

        <button onClick={handleSearch} style={{ marginLeft: 10, padding: 10 }}>
          Search
        </button>

        <button
          onClick={exportCSV}
          style={{
            marginLeft: 10,
            padding: 10,
            background: "green",
            color: "white",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* RESULTS TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Title</th>
              <th>Company</th>
              <th>City</th>
              <th>State</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Website</th>
              <th>Industry</th>
              <th>Employees</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.first_name || "N/A"}</td>
                <td>{r.last_name || "N/A"}</td>
                <td>{r.title || "N/A"}</td>
                <td>{r.company_name || "N/A"}</td>
                <td>{r.primary_city || "N/A"}</td>
                <td>{r.primary_state || "N/A"}</td>
                <td>{r.phone || "N/A"}</td>
                <td>{r.email || "N/A"}</td>
                <td>
                  {r.web_address ? (
                    <a href={r.web_address} target="_blank">
                      Visit
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{r.industry || "N/A"}</td>
                <td>{r.employee || "N/A"}</td>
                <td>{r.revenue || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <Analytics />
    </>
  );
}
