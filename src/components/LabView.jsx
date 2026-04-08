import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import JobBoard from './lab/JobBoard';
import LabTestForm from './lab/LabTestForm';

/**
 * LabView — the root of the Lab Tester Portal.
 * Switches between the Job Board and the full 6-section Test Data Entry Form.
 */
export default function LabView() {
  // activeBatch: { batch, draftReport } | null
  const [activeBatch, setActiveBatch] = useState(null);
  const [formKey, setFormKey] = useState(0); // force remount after submit

  const handleOpenForm = (batchData) => {
    setActiveBatch(batchData);
  };

  const handleBack = () => {
    setActiveBatch(null);
  };

  const handleSubmitted = () => {
    // After posting, show a fresh job board
    setActiveBatch(null);
    setFormKey(k => k + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Portal Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2.5 bg-blue-700 rounded-lg">
          <FlaskConical size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Lab Tester Portal</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeBatch ? `Entering data for: ${activeBatch.batch.batchId}` : 'Pharmacognostic Assessment System · AYUSH Standards'}
          </p>
        </div>
      </div>

      {activeBatch ? (
        <LabTestForm
          key={activeBatch.batch.batchId}
          batchData={activeBatch}
          draftReport={activeBatch.draftReport}
          onBack={handleBack}
          onSubmitted={handleSubmitted}
        />
      ) : (
        <JobBoard key={formKey} onOpenForm={handleOpenForm} />
      )}
    </div>
  );
}
