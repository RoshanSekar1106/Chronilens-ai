import React, { useState, useEffect } from 'react';
import { Thermometer, Plus, Search, Trash2, Calendar, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { symptomService } from '../services/api';

export const SymptomsPage = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ symptomName: '', severity: 5, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const res = await symptomService.getSymptoms(search, page, 8);
      if (res.success) {
        setSymptoms(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, [search, page]);

  const handleAddSymptom = async (e) => {
    e.preventDefault();
    if (!form.symptomName.trim()) return;

    setSubmitting(true);
    try {
      await symptomService.addSymptom({
        symptomName: form.symptomName,
        severity: Number(form.severity),
        notes: form.notes
      });
      setMessage('Symptom entry added!');
      setForm({ symptomName: '', severity: 5, notes: '' });
      fetchSymptoms();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSymptom = async (id) => {
    if (!window.confirm('Delete this symptom record?')) return;
    try {
      await symptomService.deleteSymptom(id);
      fetchSymptoms();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity >= 8) return 'badge-rose';
    if (severity >= 5) return 'badge-amber';
    return 'badge-teal';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Thermometer size={28} color="#38bdf8" />
            Symptom Tracking Center
          </h1>
          <p className="text-sub">
            Log physical sensations, severity intensity, and timing for AI correlation analysis.
          </p>
        </div>
        <div className="badge badge-blue" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {totalCount} Logged Entries
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Form Column: Add Symptom */}
        <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem' }}>
            Add Symptom Record
          </h3>

          {message && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleAddSymptom}>
            <div className="form-group">
              <label className="form-label">Symptom Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Brain Fog, Muscle Pain..."
                value={form.symptomName}
                onChange={(e) => setForm({ ...form, symptomName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Severity Level</label>
                <span className={`badge ${getSeverityBadgeClass(form.severity)}`}>
                  {form.severity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="severity-slider"
                style={{ marginTop: '0.6rem' }}
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                <span>Mild (1-3)</span>
                <span>Moderate (4-7)</span>
                <span>Severe (8-10)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe triggers, time of day, duration..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              <Plus size={16} />
              {submitting ? 'Recording...' : 'Log Symptom Entry'}
            </button>
          </form>
        </div>

        {/* List Column: Symptom Logs & Search */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
          
          {/* Search Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recorded Symptoms</h3>
            
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search symptom..."
                style={{ paddingLeft: '2.4rem', padding: '0.45rem 2.4rem', fontSize: '0.85rem' }}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Table / List */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                Loading symptoms...
              </div>
            ) : symptoms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                No symptoms recorded yet. Add your first symptom entry on the left!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {symptoms.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      background: 'rgba(9, 13, 22, 0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem 1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`badge ${getSeverityBadgeClass(item.severity)}`} style={{ padding: '0.4rem 0.7rem', fontSize: '0.85rem' }}>
                        Sev: {item.severity}
                      </span>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {item.symptomName}
                        </div>
                        {item.notes && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            "{item.notes}"
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                          <Calendar size={13} />
                          {new Date(item.symptomDate || item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSymptom(item._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete symptom log"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-secondary btn-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
