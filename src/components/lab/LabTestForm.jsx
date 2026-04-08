import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Send, Loader2, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { LabService } from '../../services/api';
import FormSection from './FormSection';

// ── Small reusable field primitives ──────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ reg, type = 'text', placeholder, step }) => (
  <input
    {...reg}
    type={type} step={step} placeholder={placeholder}
    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
  />
);

const ReadOnly = ({ value }) => (
  <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-600 bg-gray-50 font-mono">
    {value || '—'}
  </div>
);

const Select = ({ reg, children }) => (
  <select
    {...reg}
    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
  >
    {children}
  </select>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function LabTestForm({ batchData, draftReport, onBack, onSubmitted }) {
  const { batch } = batchData;
  const farmer = batch?.farmerId;

  const [saving, setSaving] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [saveOk, setSaveOk] = React.useState(false);
  const [postResult, setPostResult] = React.useState(null); // { success, cid, decision }
  const [error, setError] = React.useState('');

  const { register, handleSubmit, getValues, reset, watch } = useForm({
    defaultValues: draftReport ? {
      // pre-fill from draft
      color: draftReport.identityTests?.color,
      odor: draftReport.identityTests?.odor,
      taste: draftReport.identityTests?.taste,
      texture: draftReport.identityTests?.texture,
      foreignMatterPercent: draftReport.identityTests?.foreignMatterPercent,
      microscopicFeatures: draftReport.identityTests?.microscopicFeatures,
      moisturePercent: draftReport.physicochemical?.moisturePercent,
      totalAsh: draftReport.physicochemical?.totalAsh,
      acidInsolubleAsh: draftReport.physicochemical?.acidInsolubleAsh,
      waterSolubleAsh: draftReport.physicochemical?.waterSolubleAsh,
      alcoholExtractPercent: draftReport.physicochemical?.alcoholExtractPercent,
      waterExtractPercent: draftReport.physicochemical?.waterExtractPercent,
      phLevel: draftReport.physicochemical?.phLevel,
      swellingIndex: draftReport.physicochemical?.swellingIndex,
      foamingIndex: draftReport.physicochemical?.foamingIndex,
      markerCompound: draftReport.phytochemical?.markerCompound,
      activeCompoundPercent: draftReport.phytochemical?.activeCompoundPercent,
      phenolicContent: draftReport.phytochemical?.phenolicContent,
      flavonoidContent: draftReport.phytochemical?.flavonoidContent,
      totalPlateCount: draftReport.contaminants?.totalPlateCount,
      yeastMoldCount: draftReport.contaminants?.yeastMoldCount,
      salmonella: draftReport.contaminants?.salmonella || 'Absent',
      eColi: draftReport.contaminants?.eColi || 'Absent',
      leadPpm: draftReport.contaminants?.leadPpm,
      arsenicPpm: draftReport.contaminants?.arsenicPpm,
      cadmiumPpm: draftReport.contaminants?.cadmiumPpm,
      mercuryPpm: draftReport.contaminants?.mercuryPpm,
      finalDecision: draftReport.finalDecision || 'PASS',
      rejectionReason: draftReport.rejectionReason,
      labComments: draftReport.labComments,
      technicianName: draftReport.technicianName,
      testDate: draftReport.testDate ? new Date(draftReport.testDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    } : {
      salmonella: 'Absent',
      eColi: 'Absent',
      finalDecision: 'PASS',
      testDate: new Date().toISOString().split('T')[0],
    }
  });

  const finalDecision = watch('finalDecision');

  // ── Save Draft ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true); setSaveOk(false); setError('');
    try {
      await LabService.saveDraft(batch.batchId, getValues());
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e) {
      setError(e?.response?.data?.error || 'Save failed.');
    } finally { setSaving(false); }
  };

  // ── Submit Final ────────────────────────────────────────────────────────────
  const onPost = async (data) => {
    setPosting(true); setError('');
    try {
      const res = await LabService.submitResults(batch.batchId, data);
      const cid = res.data?.data?.ipfs?.cid;
      setPostResult({ success: true, cid, decision: data.finalDecision });
      onSubmitted?.();
    } catch (e) {
      setError(e?.response?.data?.error || 'Submit failed. Check all required fields.');
    } finally { setPosting(false); }
  };

  if (postResult) return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center space-y-4">
      {postResult.decision === 'PASS'
        ? <CheckCircle size={56} className="mx-auto text-green-600" />
        : <AlertTriangle size={56} className="mx-auto text-red-500" />}
      <h3 className="text-2xl font-black text-gray-800">
        {postResult.decision === 'PASS' ? 'Batch Certified — Auction Live!' : 'Batch FAILED — Admin Notified'}
      </h3>
      <p className="text-gray-500 text-sm">Certificate pinned to IPFS and blockchain record created.</p>
      {postResult.cid && (
        <a href={`https://gateway.pinata.cloud/ipfs/${postResult.cid}`} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
          <ExternalLink size={14} /> View IPFS Certificate
        </a>
      )}
      <div className="pt-4">
        <button onClick={onBack} className="px-6 py-2.5 bg-blue-700 text-white rounded font-bold text-sm hover:bg-blue-800 transition-colors">
          ← Back to Job Board
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-blue-700 font-semibold text-sm hover:underline">
          <ArrowLeft size={15} /> Job Board
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600 font-medium">Test Data Entry</span>
      </div>

      {/* Batch identity strip */}
      <div className="bg-blue-700 text-white rounded-lg px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-0.5">Testing Sample</p>
          <p className="text-xl font-black">{batch.speciesName}</p>
          <p className="text-xs text-blue-200 font-mono mt-0.5">{batch.batchId}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-blue-100">
          <div><span className="text-blue-300 font-bold">Farmer:</span> {farmer?.name}</div>
          <div><span className="text-blue-300 font-bold">Phone:</span> {farmer?.phone}</div>
          <div><span className="text-blue-300 font-bold">Location:</span> {farmer?.farmerProfile?.location || '—'}</div>
          <div><span className="text-blue-300 font-bold">Status:</span> {batch.status}</div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm font-medium flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {saveOk && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm font-medium flex items-center gap-2">
          <CheckCircle size={15} /> Draft saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onPost)} className="space-y-3">

        {/* ── S1: HERB INFORMATION ── */}
        <FormSection number="1" title="Herb Information" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Batch ID"><ReadOnly value={batch.batchId} /></Field>
            <Field label="Herb / Species Name"><ReadOnly value={batch.speciesName} /></Field>
            <Field label="Collection Place"><ReadOnly value={farmer?.farmerProfile?.location} /></Field>
            <Field label="Estimated Qty (Kg)"><ReadOnly value={batch.cultivationDetails?.estimatedQuantityKg} /></Field>
            <Field label="Collector Verified"><ReadOnly value={batch.mlVerification?.verifiedSpecies || '—'} /></Field>
            <Field label="Dried Status">
              <Select reg={register('driedStatus')}>
                <option value="Dried">Dried</option>
                <option value="Fresh">Fresh</option>
                <option value="Semi-Dried">Semi-Dried</option>
              </Select>
            </Field>
          </div>
        </FormSection>

        {/* ── S2: IDENTITY TEST RESULTS ── */}
        <FormSection number="2" title="Identity Test Results" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Color" required><Input reg={register('color', { required: true })} placeholder="e.g. Pale Green" /></Field>
            <Field label="Odor" required><Input reg={register('odor', { required: true })} placeholder="e.g. Characteristic" /></Field>
            <Field label="Taste" required><Input reg={register('taste', { required: true })} placeholder="e.g. Bitter" /></Field>
            <Field label="Texture" required><Input reg={register('texture', { required: true })} placeholder="e.g. Fine Powder" /></Field>
            <Field label="Foreign Matter (%)"><Input reg={register('foreignMatterPercent')} type="number" step="0.01" placeholder="0.00" /></Field>
            <Field label="Microscopic Features">
              <textarea {...register('microscopicFeatures')} rows={2} placeholder="Starch grains, trichomes..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
            </Field>
          </div>
        </FormSection>

        {/* ── S3: PHYSICOCHEMICAL RESULTS ── */}
        <FormSection number="3" title="Physicochemical Results" defaultOpen={false}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ['Moisture (%)', 'moisturePercent'],
              ['Total Ash (%)', 'totalAsh'],
              ['Acid Insoluble Ash (%)', 'acidInsolubleAsh'],
              ['Water Soluble Ash (%)', 'waterSolubleAsh'],
              ['Alcohol Extract (%)', 'alcoholExtractPercent'],
              ['Water Extract (%)', 'waterExtractPercent'],
              ['pH Level', 'phLevel'],
              ['Swelling Index', 'swellingIndex'],
              ['Foaming Index', 'foamingIndex'],
            ].map(([label, name]) => (
              <Field key={name} label={label} required>
                <Input reg={register(name, { required: true })} type="number" step="0.01" placeholder="0.00" />
              </Field>
            ))}
          </div>
        </FormSection>

        {/* ── S4: PHYTOCHEMICAL RESULTS ── */}
        <FormSection number="4" title="Phytochemical Results" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Marker Compound" required>
              <Input reg={register('markerCompound', { required: true })} placeholder="e.g. Withanolides" />
            </Field>
            <Field label="Active Compound (%)" required>
              <Input reg={register('activeCompoundPercent', { required: true })} type="number" step="0.01" placeholder="0.00" />
            </Field>
            <Field label="Phenolic Content">
              <Input reg={register('phenolicContent')} placeholder="e.g. 12.4 mg GAE/g" />
            </Field>
            <Field label="Flavonoid Content">
              <Input reg={register('flavonoidContent')} placeholder="e.g. 8.2 mg QE/g" />
            </Field>
          </div>
        </FormSection>

        {/* ── S5: MICROBIAL & CONTAMINANTS ── */}
        <FormSection number="5" title="Microbial & Contaminants" defaultOpen={false}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Total Plate Count">
              <Input reg={register('totalPlateCount')} placeholder="e.g. <10⁵ cfu/g" />
            </Field>
            <Field label="Yeast & Mold Count">
              <Input reg={register('yeastMoldCount')} placeholder="e.g. <10³ cfu/g" />
            </Field>
            <Field label="Salmonella">
              <Select reg={register('salmonella')}>
                <option value="Absent">Absent</option>
                <option value="Present">Present</option>
              </Select>
            </Field>
            <Field label="E. Coli">
              <Select reg={register('eColi')}>
                <option value="Absent">Absent</option>
                <option value="Present">Present</option>
              </Select>
            </Field>
            {[
              ['Lead (ppm)', 'leadPpm'],
              ['Arsenic (ppm)', 'arsenicPpm'],
              ['Cadmium (ppm)', 'cadmiumPpm'],
              ['Mercury (ppm)', 'mercuryPpm'],
            ].map(([label, name]) => (
              <Field key={name} label={label}>
                <Input reg={register(name)} type="number" step="0.001" placeholder="0.000" />
              </Field>
            ))}
          </div>
        </FormSection>

        {/* ── S6: FINAL LAB DECISION ── */}
        <FormSection number="6" title="Final Lab Decision" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Final Decision" required>
              <Select reg={register('finalDecision', { required: true })}>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
              </Select>
            </Field>
            <Field label="Technician Name" required>
              <Input reg={register('technicianName', { required: true })} placeholder="Full name of technician" />
            </Field>
            <Field label="Test Date" required>
              <Input reg={register('testDate', { required: true })} type="date" />
            </Field>
            {finalDecision === 'FAIL' && (
              <Field label="Rejection Reason" required>
                <Input reg={register('rejectionReason', { required: finalDecision === 'FAIL' })} placeholder="Reason for rejection" />
              </Field>
            )}
            <div className="sm:col-span-2">
              <Field label="Laboratory Comments & Observations">
                <textarea {...register('labComments')} rows={3} placeholder="Additional observations, special notes..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
              </Field>
            </div>
          </div>
        </FormSection>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 gap-3 flex-wrap">
          <p className="text-xs text-gray-400">
            * Required fields must be filled before posting. Save anytime as draft.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 border border-blue-700 text-blue-700 rounded font-bold text-sm hover:bg-blue-50 transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button type="submit" disabled={posting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white rounded font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-60">
              {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {posting ? 'Submitting…' : 'Post Final Results'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
