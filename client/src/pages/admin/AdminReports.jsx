import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [reasonFilter, setReasonFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/admin/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReports(res.data);
        setFilteredReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let updated = [...reports];

    if (reasonFilter) {
      updated = updated.filter(r =>
        r.reason.toLowerCase().includes(reasonFilter.toLowerCase())
      );
    }

    if (searchTerm) {
      updated = updated.filter(r =>
        r.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(updated);
  }, [reasonFilter, searchTerm, reports]);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        📊 Admin Analytics / Reports
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Reporter"
          className="px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
        >
          <option value="">All Reasons</option>
          <option value="Scam Job">Scam Job</option>
          <option value="Fake Company Profile">Fake Company Profile</option>
          <option value="Misleading Salary Info">Misleading Salary Info</option>
          <option value="Harassment Complaint">Harassment Complaint</option>
          <option value="Terms Violation">Terms Violation</option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          🚫 No reports match your filter.
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredReports.map((report, index) => (
            <li
              key={index}
              className="transition hover:scale-[1.01] duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm"
            >
              <p className="text-gray-800 dark:text-gray-100 mb-1">
                <span className="font-semibold">📝 Reason:</span> {report.reason}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <span className="font-semibold">👤 Reported By:</span>{" "}
                {report.reportedBy}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🕒 {new Date(report.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
