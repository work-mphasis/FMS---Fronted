import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import FresherForm from "../components/FresherForm";
import { getFreshers, createFresher, updateFresher, deleteFresher } from "../api/fresherApi";

const formatDate = (s) => {
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}-${m}-${y}`;
};

export default function FreshersPage() {
  const [freshers, setFreshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [formModal, setFormModal] = useState(null); // null | { mode: "add" | "edit", data? }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setError("");
      setFreshers(await getFreshers());
    } catch {
      setError("Failed to load freshers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return freshers.filter((f) =>
      [f.employeeId, f.name, f.email, f.technology, f.status].some((v) =>
        v?.toLowerCase().includes(q)
      )
    );
  }, [freshers, search]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (formModal.mode === "edit") await updateFresher(formModal.data.id, data);
      else await createFresher(data);
      setFormModal(null);
      await load();
    } catch {
      alert("Could not save. Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFresher(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch {
      alert("Could not delete.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-head">
          <div>
            <h1>Freshers</h1>
            <p className="muted">{freshers.length} total</p>
          </div>
          <button className="btn btn-primary" onClick={() => setFormModal({ mode: "add" })}>
            + Add Fresher
          </button>
        </div>

        <input
          className="search"
          placeholder="Search by ID, name, email, technology or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="card">
          {loading ? (
            <p className="empty">Loading...</p>
          ) : error ? (
            <p className="empty error-text">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="empty">No freshers found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th><th>Name</th><th>Email</th><th>Phone</th>
                  <th>Technology</th><th>Joined</th><th>Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.employeeId || "—"}</td>
                    <td className="strong">{f.name}</td>
                    <td>{f.email || "—"}</td>
                    <td>{f.phone || "—"}</td>
                    <td>{f.technology || "—"}</td>
                    <td>{formatDate(f.joiningDate)}</td>
                    <td>
                      {f.status
                        ? <span className={`badge status-${f.status.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{f.status}</span>
                        : "—"}
                    </td>
                    <td className="right nowrap">
                      <button className="btn btn-sm btn-outline" onClick={() => setFormModal({ mode: "edit", data: f })}>Edit</button>{" "}
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(f)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {formModal && (
        <Modal
          title={formModal.mode === "edit" ? "Edit Fresher" : "Add Fresher"}
          onClose={() => setFormModal(null)}
        >
          <FresherForm
            initial={formModal.data}
            onSubmit={handleSave}
            onCancel={() => setFormModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete fresher?" onClose={() => setDeleteTarget(null)}>
          <p>Are you sure you want to delete <b>{deleteTarget.name}</b>? This cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger-solid" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}