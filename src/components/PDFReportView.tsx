'use client';

import React, { useState } from 'react';
import { Download, Printer, CheckCircle2, XCircle, ShieldAlert, Award, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

interface PDFReportViewProps {
  attempt: {
    id?: string;
    attemptId?: string;
    mode?: string;
    startedAt: string;
    submittedAt: string | null;
    timeSpentSeconds?: number;
    durationSeconds?: number;
    passed: boolean;
    scoredCorrect?: number;
    scoredIncorrect?: number;
    unscoredCorrect?: number;
    unscoredIncorrect?: number;
    totalCorrect?: number;
    scorePercentage?: number;
    proctoringClean?: boolean;
    violationCount?: number;
  };
  summary: {
    scoredScore: number;
    totalScored: number;
    unscoredScore: number;
    totalUnscored: number;
    totalCorrect: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    domainBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  };
  questions: Array<{
    position: number;
    questionCode: string;
    questionText: string;
    domain: string;
    topic: string;
    isScored: boolean;
    isCorrect: boolean;
    correctAnswers: string[];
    selectedOptions: string[];
    explanation: string;
    sourceModule?: string;
  }>;
}

export function PDFReportView({ attempt, summary, questions }: PDFReportViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleDownloadPDF = () => {
    try {
      setIsGenerating(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 18;

      // Header Banner
      doc.setFillColor(11, 15, 25); // #0B0F19
      doc.rect(0, 0, pageWidth, 36, 'F');

      // Accent gold bar
      doc.setFillColor(255, 153, 0); // AWS Amber #FF9900
      doc.rect(0, 36, pageWidth, 2.5, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CloudPrep — AWS Certification Practice Report', 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(203, 213, 225);
      doc.text('AWS Certified Cloud Practitioner (CLF-C02) • Official Examination Audit', 14, 24);

      const examDate = new Date(attempt.startedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      doc.setFontSize(9);
      const attemptIdStr = attempt.id || attempt.attemptId || 'UNKNOWN';
      const duration = attempt.timeSpentSeconds || attempt.durationSeconds || 0;
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Exam ID: ${attemptIdStr.substring(0, 16)}... | Date: ${examDate} | Time: ${formatDuration(duration)}`, 14, 31);

      y = 48;

      // Result Status Block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      if (summary.passed) {
        doc.setFillColor(16, 185, 129, 0.15); // Emerald bg
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, 'FD');
        doc.setTextColor(16, 185, 129);
        doc.text('RESULT: PASSED', 20, y + 10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(`Scored: ${summary.scoredScore} / ${summary.totalScored} (${summary.percentage}%) — Minimum 35 / 50 (70%) required to pass.`, 20, y + 18);
      } else {
        doc.setFillColor(239, 68, 68, 0.15); // Red bg
        doc.setDrawColor(239, 68, 68);
        doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, 'FD');
        doc.setTextColor(239, 68, 68);
        doc.text('RESULT: DID NOT PASS', 20, y + 10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(`Scored: ${summary.scoredScore} / ${summary.totalScored} (${summary.percentage}%) — Minimum 35 / 50 (70%) required to pass.`, 20, y + 18);
      }

      y += 32;

      // Stats Grid
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('EXAM PERFORMANCE METRICS', 14, y);
      y += 5;

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 28, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);

      // Col 1: Scored
      doc.text('Scored Questions', 20, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(`${summary.scoredScore} / ${summary.totalScored}`, 20, y + 18);

      // Col 2: Unscored Pretest
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Unscored Questions', 65, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(`${summary.unscoredScore} / ${summary.totalUnscored}`, 65, y + 18);

      // Col 3: Total Raw
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Total Correct', 115, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(`${summary.totalCorrect} / ${summary.totalQuestions}`, 115, y + 18);

      // Col 4: Proctor Status
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Proctoring Integrity', 155, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      if (attempt.violationCount === 0) {
        doc.setTextColor(16, 185, 129);
        doc.text('Verified Clean', 155, y + 18);
      } else {
        doc.setTextColor(239, 68, 68);
        doc.text(`${attempt.violationCount} Violations`, 155, y + 18);
      }

      y += 36;

      // Domain Breakdown Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('CLF-C02 DOMAIN BREAKDOWN', 14, y);
      y += 6;

      const domains = Object.entries(summary.domainBreakdown);
      domains.forEach(([domainName, data]) => {
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y, pageWidth - 14, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(domainName, 16, y);

        const domainResult = `${data.correct}/${data.total} (${data.percentage}%)`;
        doc.setFont('helvetica', 'bold');
        if (data.percentage >= 70) {
          doc.setTextColor(16, 185, 129);
        } else {
          doc.setTextColor(225, 29, 72);
        }
        doc.text(domainResult, pageWidth - 45, y);
        y += 4;
      });

      y += 10;

      // Verification Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Generated by CloudPrep — AWS Certified Cloud Practitioner Practice & Proctored Examination System.', 14, y);
      doc.text('This diagnostic report represents a certified simulation based on the official AWS CLF-C02 Exam Blueprint.', 14, y + 5);

      // Save PDF
      const pdfId = attempt.id || attempt.attemptId || 'UNKNOWN';
      doc.save(`CloudPrep_ScoreReport_${pdfId.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Could not generate PDF. You can also use Print to save as PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>{isGenerating ? 'Generating Scorecard...' : 'Download Official Scorecard (PDF)'}</span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all hover:scale-105"
      >
        <Printer className="w-4 h-4" />
        <span>Print Full Review</span>
      </button>
    </div>
  );
}
