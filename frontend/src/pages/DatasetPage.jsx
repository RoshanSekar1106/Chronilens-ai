import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Edit3, 
  Trash2, 
  Link, 
  Download, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  FileText, 
  Thermometer,
  Save,
  X
} from 'lucide-react';
import { datasetService, symptomService, reportService } from '../services/api';

export const DatasetPage = () => {
  const [dataset, setDataset] = useState({ symptoms: [], reports: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Editing state for Symptoms
  const [editingSymptomId, setEditingSymptomId] = useState(null);
  const [editSymptomForm, setEditSymptomForm] = useState({ symptomName: '', severity: 5, notes: '' });

  // Editing state for Reports
  const [editingReportId, setEditingReportId] = useState(null);
  const [editReportForm, setEditReportForm] = useState({ fileName: '', hemoglobin: '', tsh: '', bloodSugar: '' });

  // Custom Dataset Import text state
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const fetchDataset = async () => {
    setLoading(true);
    try {
      const data = await datasetService.getDataset();
      setDataset(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  // Symptom Editing Actions
  const handleStartEditSymptom = (item) => {
    setEditingSymptomId(item._id);
    setEditSymptomForm({
      symptomName: item.symptomName,
      severity: item.severity,
      notes: item.notes || ''
    });
  };

  const handleSaveSymptom = async (id) => {
    try {
      await symptomService.updateSymptom(id, editSymptomForm);
      setMessage('Symptom updated successfully');
      setEditingSymptomId(null);
      fetchDataset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update symptom');
    }
  };

  const handleDeleteSymptom = async (id) => {
    if (!window.confirm('Delete this symptom record from dataset?')) return;
    try {
      await symptomService.deleteSymptom(id);
      setMessage('Symptom removed from dataset');
      fetchDataset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Report Editing Actions
  const handleStartEditReport = (item) => {
    setEditingReportId(item._id);
    setEditReportForm({
      fileName: item.fileName,
      hemoglobin: item.hemoglobin !== null ? item.hemoglobin : '',
      tsh: item.tsh !== null ? item.tsh : '',
      bloodSugar: item.bloodSugar !== null ? item.bloodSugar : ''
    });
  };

  const handleSaveReport = async (id) => {
    try {
      await reportService.updateReport(id, editReportForm);
      setMessage('Report record updated successfully');
      setEditingReportId(null);
      fetchDataset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update report');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this report record from dataset?')) return;
    try {
      await reportService.deleteReport(id);
      setMessage('Report removed from dataset');
      fetchDataset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Clear Entire Dataset Action
  const handleClearEntireDataset = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently remove all symptoms and lab reports from your dataset! Proceed?')) return;
    try {
      await datasetService.clearEntireDataset();
      setMessage('Entire dataset has been removed!');
      setShareUrl('');
      fetchDataset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to clear dataset');
    }
  };

  // Shareable Link & Export
  const handleGenerateLink = async () => {
    try {
      const link = await datasetService.generateShareableLink();
      setShareUrl(link);
      setMessage('Shareable link generated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to generate link');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadDataset = async () => {
    const dataStr = await datasetService.exportDatasetJson();
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chronilens_dataset_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Custom Dataset Import
  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      if (parsed.symptoms && Array.isArray(parsed.symptoms)) {
        for (const s of parsed.symptoms) {
          await symptomService.addSymptom({ symptomName: s.symptomName, severity: s.severity, notes: s.notes });
        }
      }
      if (parsed.reports && Array.isArray(parsed.reports)) {
        for (const r of parsed.reports) {
          await reportService.updateReport('new', r);
        }
      }
      setMessage('Custom dataset imported successfully!');
      setShowImportArea(false);
      setRawJsonInput('');
      fetchDataset();
    } catch (err) {
      setErrorMessage('Invalid JSON format. Please check your dataset JSON.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={28} color="#38bdf8" />
            Dataset Management & Link Sharing
          </h1>
          <p className="text-sub">
            Add custom health dataset, edit biomarker readings, clear datasets, and generate instant shareable links.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button onClick={handleGenerateLink} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)' }}>
            <Link size={16} />
            Generate Shareable Link
          </button>

          <button onClick={handleDownloadDataset} className="btn btn-secondary">
            <Download size={16} />
            Export JSON Dataset
          </button>

          <button onClick={handleClearEntireDataset} className="btn btn-danger">
            <Trash2 size={16} />
            Remove Entire Dataset
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.88rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.88rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Generated Link Banner */}
      {shareUrl && (
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            🔗 Shareable Link Generated
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              className="form-input"
              value={shareUrl}
              style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}
            />
            <button onClick={handleCopyLink} className="btn btn-primary btn-sm">
              {copiedLink ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}

      {/* Custom Dataset Import Drawer Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setShowImportArea(!showImportArea)} className="btn btn-secondary btn-sm">
          <Upload size={14} />
          {showImportArea ? 'Close Import Area' : 'Import Custom Dataset JSON'}
        </button>
      </div>

      {showImportArea && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Paste Custom Dataset JSON</h3>
          <textarea
            className="form-textarea"
            rows="5"
            placeholder='{ "symptoms": [{ "symptomName": "Fatigue", "severity": 7 }], "reports": [{ "fileName": "Panel.png", "hemoglobin": 11.2 }] }'
            value={rawJsonInput}
            onChange={(e) => setRawJsonInput(e.target.value)}
          />
          <button onClick={handleImportJson} className="btn btn-primary btn-sm" style={{ marginTop: '0.8rem' }}>
            Import Dataset Records
          </button>
        </div>
      )}

      {/* Dataset Tables */}
      <div className="grid-2">
        
        {/* Symptoms Dataset Table */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer size={20} color="#38bdf8" />
                Symptoms Dataset ({dataset.symptoms.length})
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Edit or delete individual symptom records</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {dataset.symptoms.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                No symptom records in dataset.
              </div>
            ) : (
              dataset.symptoms.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'rgba(9, 13, 22, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  {editingSymptomId === item._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editSymptomForm.symptomName}
                        onChange={(e) => setEditSymptomForm({ ...editSymptomForm, symptomName: e.target.value })}
                        placeholder="Symptom Name"
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Severity: {editSymptomForm.severity}/10</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          className="severity-slider"
                          value={editSymptomForm.severity}
                          onChange={(e) => setEditSymptomForm({ ...editSymptomForm, severity: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        value={editSymptomForm.notes}
                        onChange={(e) => setEditSymptomForm({ ...editSymptomForm, notes: e.target.value })}
                        placeholder="Notes"
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                        <button onClick={() => handleSaveSymptom(item._id)} className="btn btn-primary btn-sm">
                          <Save size={14} /> Save
                        </button>
                        <button onClick={() => setEditingSymptomId(null)} className="btn btn-secondary btn-sm">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.symptomName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Severity: {item.severity}/10 • {item.notes || 'No notes'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleStartEditSymptom(item)} className="btn btn-secondary btn-sm" title="Edit row">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteSymptom(item._id)} className="btn btn-danger btn-sm" title="Delete row">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reports Dataset Table */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#2dd4bf" />
                Reports Dataset ({dataset.reports.length})
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Edit parsed biomarkers or remove report records</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {dataset.reports.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                No lab report records in dataset.
              </div>
            ) : (
              dataset.reports.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'rgba(9, 13, 22, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  {editingReportId === item._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editReportForm.fileName}
                        onChange={(e) => setEditReportForm({ ...editReportForm, fileName: e.target.value })}
                        placeholder="File Name"
                      />
                      <div className="grid-3" style={{ gap: '0.5rem' }}>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input"
                          value={editReportForm.hemoglobin}
                          onChange={(e) => setEditReportForm({ ...editReportForm, hemoglobin: e.target.value })}
                          placeholder="Hemoglobin"
                        />
                        <input
                          type="number"
                          step="0.1"
                          className="form-input"
                          value={editReportForm.tsh}
                          onChange={(e) => setEditReportForm({ ...editReportForm, tsh: e.target.value })}
                          placeholder="TSH"
                        />
                        <input
                          type="number"
                          className="form-input"
                          value={editReportForm.bloodSugar}
                          onChange={(e) => setEditReportForm({ ...editReportForm, bloodSugar: e.target.value })}
                          placeholder="Blood Sugar"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                        <button onClick={() => handleSaveReport(item._id)} className="btn btn-primary btn-sm">
                          <Save size={14} /> Save
                        </button>
                        <button onClick={() => setEditingReportId(null)} className="btn btn-secondary btn-sm">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.fileName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Hemo: {item.hemoglobin || 'N/A'} • TSH: {item.tsh || 'N/A'} • Sugar: {item.bloodSugar || 'N/A'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleStartEditReport(item)} className="btn btn-secondary btn-sm" title="Edit row">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteReport(item._id)} className="btn btn-danger btn-sm" title="Delete row">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
