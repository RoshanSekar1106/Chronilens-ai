import React, { useState, useEffect } from 'react';
import { FileText, UploadCloud, Scan, Search, AlertCircle, CheckCircle2, FileCheck, Eye, RefreshCw } from 'lucide-react';
import { reportService } from '../services/api';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload & OCR State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrRunning, setOcrRunning] = useState({});
  const [activeReportText, setActiveReportText] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports(search);
      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a medical report file to upload');
      return;
    }

    setUploading(true);
    setMessage('');
    setErrorMsg('');

    try {
      const res = await reportService.uploadReport(selectedFile);
      if (res.success) {
        setMessage('Report uploaded! Triggering OCR text extraction...');
        setSelectedFile(null);
        await fetchReports();
        
        // Auto trigger OCR on newly uploaded report if ID exists
        if (res.report?._id) {
          handleRunOcr(res.report._id);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const handleRunOcr = async (id) => {
    setOcrRunning((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await reportService.extractText(id);
      if (res.success) {
        setMessage('OCR text extraction complete! Biomarkers identified.');
        fetchReports();
      }
    } catch (err) {
      setErrorMsg(err.message || 'OCR extraction failed');
    } finally {
      setOcrRunning((prev) => ({ ...prev, [id]: false }));
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={28} color="#2dd4bf" />
            Lab Reports & OCR Analysis
          </h1>
          <p className="text-sub">
            Upload blood lab tests (PDF, PNG, JPG) or diagnostic scans for automatic text & biomarker parsing.
          </p>
        </div>
        <div className="badge badge-teal" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          PDF & Tesseract.js OCR Powered
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Upload Column */}
        <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem' }}>
            Upload Medical Report
          </h3>

          {message && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpload}>
            <div 
              style={{
                border: '2px dashed var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                background: 'rgba(9, 13, 22, 0.6)',
                cursor: 'pointer',
                marginBottom: '1.2rem',
                transition: 'var(--transition)'
              }}
              onClick={() => document.getElementById('report-file-input').click()}
            >
              <UploadCloud size={36} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedFile ? selectedFile.name : 'Click or Drag & Drop File'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                Supports PDF, PNG, JPG, JPEG lab reports & scans
              </p>
              <input
                id="report-file-input"
                type="file"
                accept="image/*,application/pdf,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
              <Scan size={16} />
              {uploading ? 'Uploading File...' : 'Upload & Extract Text'}
            </button>
          </form>
        </div>

        {/* Reports List Column */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Parsed Lab Documents</h3>
            
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search file name..."
                style={{ paddingLeft: '2.4rem', padding: '0.45rem 2.4rem', fontSize: '0.85rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                Loading lab reports...
              </div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                No lab reports uploaded yet. Upload a PDF or blood lab test image on the left!
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  style={{
                    background: 'rgba(9, 13, 22, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileCheck size={20} color="#2dd4bf" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{report.fileName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Uploaded: {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleRunOcr(report._id)}
                        className="btn btn-secondary btn-sm"
                        disabled={ocrRunning[report._id]}
                      >
                        <RefreshCw size={14} className={ocrRunning[report._id] ? 'pulse-glow' : ''} />
                        {ocrRunning[report._id] ? 'Extracting Text...' : 'Run Extraction'}
                      </button>

                      {report.extractedText && (
                        <button
                          onClick={() => setActiveReportText(activeReportText === report._id ? null : report._id)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} />
                          {activeReportText === report._id ? 'Hide Text' : 'View Text'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Biomarker Badges Display */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    
                    {/* Hemoglobin */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Hemoglobin</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: report.hemoglobin && report.hemoglobin < 12 ? '#fb7185' : '#2dd4bf' }}>
                        {report.hemoglobin ? `${report.hemoglobin} g/dL` : 'Not Detected'}
                      </span>
                    </div>

                    {/* TSH */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>TSH (Thyroid)</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: report.tsh && report.tsh > 4.5 ? '#fb7185' : '#2dd4bf' }}>
                        {report.tsh ? `${report.tsh} mIU/L` : 'Not Detected'}
                      </span>
                    </div>

                    {/* Blood Sugar */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Blood Sugar</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: report.bloodSugar && report.bloodSugar > 125 ? '#fb7185' : '#2dd4bf' }}>
                        {report.bloodSugar ? `${report.bloodSugar} mg/dL` : 'Not Detected'}
                      </span>
                    </div>

                  </div>

                  {/* Accordion Raw OCR Text View */}
                  {activeReportText === report._id && report.extractedText && (
                    <div style={{ background: 'rgba(9, 13, 22, 0.9)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(14, 165, 233, 0.3)', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        Raw Extracted Text:
                      </div>
                      <pre style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {report.extractedText}
                      </pre>
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
