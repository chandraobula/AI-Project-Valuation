import jsPDF from 'jspdf';
import { ValuationReport, WizardData } from './fastapi';

export function generateValuationPDF(
  wizardData: WizardData,
  valuationReport: ValuationReport,
  confidence: number
): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  let pageNumber = 1;

  // Helper function to add page header
  const addPageHeader = () => {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${wizardData.step1?.businessName || 'Startup'} Valuation Report - Page ${pageNumber}`, pageWidth - 80, 10);
    pageNumber++;
  };

  // Helper function to check if new page is needed
  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
      addPageHeader();
    }
  };

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, indent: number = 0) => {
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(fontSize);
    
    const lines = pdf.splitTextToSize(text, pageWidth - 40 - indent);
    
    checkNewPage(lines.length * fontSize * 0.5);
    
    pdf.text(lines, 20 + indent, yPosition);
    yPosition += lines.length * fontSize * 0.5 + 3;
  };

  // Helper function to add section divider
  const addSectionDivider = () => {
    checkNewPage(15);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(2)}B`;
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)}M`;
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Helper function to add calculation details
  const addCalculationDetails = (calculation: any) => {
    if (typeof calculation === 'object' && calculation !== null) {
      Object.entries(calculation).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        if (typeof value === 'number') {
          let formattedValue: string;
          if (key.toLowerCase().includes('rate')) {
            formattedValue = `${(value * 100).toFixed(1)}%`;
          } else if (key.toLowerCase().includes('value') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('cash')) {
            formattedValue = `$${value.toLocaleString()}${key.toLowerCase().includes('12m') ? 'K' : ''}`;
          } else {
            formattedValue = value.toLocaleString();
          }
          addText(`${formattedKey}: ${formattedValue}`, 10, false, 10);
        } else if (Array.isArray(value)) {
          addText(`${formattedKey}:`, 10, true, 10);
          value.forEach((item, idx) => {
            addText(`Year ${idx + 1}: $${typeof item === 'number' ? item.toLocaleString() : item}`, 9, false, 20);
          });
        } else if (typeof value === 'object') {
          addText(`${formattedKey}:`, 10, true, 10);
          Object.entries(value).forEach(([subKey, subValue]) => {
            addText(`${subKey}: ${typeof subValue === 'number' ? subValue.toLocaleString() : String(subValue)}`, 9, false, 20);
          });
        } else {
          addText(`${formattedKey}: ${String(value)}`, 10, false, 10);
        }
      });
    } else {
      addText(String(calculation), 10, false, 10);
    }
  };

  // Start document
  addPageHeader();

  // Title Page
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text(`${wizardData.step1?.businessName || 'Startup'} Valuation Report`, 20, 40);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
  pdf.text(`Analysis Confidence: ${confidence}%`, 20, 70);

  // Valuation Summary Box
  yPosition = 90;
  if (valuationReport.finalValuation?.finalRange || valuationReport.calculations?.length) {
    let lower = 0, upper = 0;
    
    if (valuationReport.finalValuation?.finalRange && 
        !isNaN(valuationReport.finalValuation.finalRange.lower) && 
        !isNaN(valuationReport.finalValuation.finalRange.upper)) {
      lower = valuationReport.finalValuation.finalRange.lower * 1000000;
      upper = valuationReport.finalValuation.finalRange.upper * 1000000;
    } else if (valuationReport.calculations?.length > 0) {
      const ranges = valuationReport.calculations.map(calc => calc.valuationRange);
      const validRanges = ranges.filter(r => r && !isNaN(r.lower) && !isNaN(r.upper));
      if (validRanges.length > 0) {
        lower = Math.min(...validRanges.map(r => r.lower)) * (validRanges[0].lower < 10000 ? 1000 : 1);
        upper = Math.max(...validRanges.map(r => r.upper)) * (validRanges[0].upper < 10000 ? 1000 : 1);
      }
    }

    if (lower > 0 && upper > 0) {
      pdf.setDrawColor(59, 130, 246);
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 30, 5, 5, 'FD');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('ESTIMATED VALUATION RANGE', 25, yPosition + 10);
      
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${formatCurrency(lower)} - ${formatCurrency(upper)}`, 25, yPosition + 25);
      
      yPosition += 45;
    }
  }

  pdf.setTextColor(0, 0, 0);
  yPosition += 20;

  // Company Overview
  addText('COMPANY OVERVIEW', 16, true);
  addSectionDivider();
  
  if (wizardData.step1?.businessName) addText(`Business Name: ${wizardData.step1.businessName}`, 12, true);
  if (wizardData.step1?.country) addText(`Country: ${wizardData.step1.country}`);
  if (wizardData.step1?.industry) addText(`Industry: ${wizardData.step1.industry.charAt(0).toUpperCase() + wizardData.step1.industry.slice(1)}`);
  if (wizardData.step1?.stage) addText(`Stage: ${wizardData.step1.stage.charAt(0).toUpperCase() + wizardData.step1.stage.slice(1)}`);
  if (wizardData.step1?.isLaunched !== undefined) addText(`Product Launched: ${wizardData.step1.isLaunched ? 'Yes' : 'No'}`);
  
  // Financial Summary
  if (wizardData.step2 && !wizardData.step2.skipFinancials) {
    yPosition += 10;
    addText('FINANCIAL SUMMARY', 14, true);
    if (wizardData.step2.revenue) addText(`Annual Revenue: ${formatCurrency(wizardData.step2.revenue)}`);
    if (wizardData.step2.monthlyBurnRate) addText(`Monthly Burn Rate: ${formatCurrency(wizardData.step2.monthlyBurnRate)}`);
    if (wizardData.step2.netProfitLoss !== undefined) addText(`Net Profit/Loss: ${formatCurrency(wizardData.step2.netProfitLoss)}`);
    if (wizardData.step2.fundingRaised) addText(`Funding Raised: ${formatCurrency(wizardData.step2.fundingRaised)}`);
    if (wizardData.step2.planningToRaise) addText(`Amount to Raise: ${formatCurrency(wizardData.step2.planningToRaise)}`);
  }

  yPosition += 15;

  // Executive Summary
  addText('EXECUTIVE SUMMARY', 16, true);
  addSectionDivider();
  
  if (valuationReport.businessSummary?.summary) {
    addText(valuationReport.businessSummary.summary);
  }
  
  addText(`Analysis Confidence Level: ${confidence}%`, 12, true);
  addText(`Business Stage Assessment: ${valuationReport.businessSummary?.stageAssessment || 'N/A'}`, 12, true);
  yPosition += 10;

  // Key Strengths and Risks
  if (valuationReport.businessSummary?.keyStrengths?.length || valuationReport.businessSummary?.weaknessesOrRisks?.length) {
    addText('STRENGTHS & RISK ANALYSIS', 16, true);
    addSectionDivider();
    
    if (valuationReport.businessSummary.keyStrengths?.length) {
      addText('Key Strengths:', 12, true);
      valuationReport.businessSummary.keyStrengths.forEach(strength => {
        addText(`• ${strength}`, 11, false, 5);
      });
      yPosition += 5;
    }

    if (valuationReport.businessSummary.weaknessesOrRisks?.length) {
      addText('Risks & Considerations:', 12, true);
      valuationReport.businessSummary.weaknessesOrRisks.forEach(risk => {
        addText(`• ${risk}`, 11, false, 5);
      });
      yPosition += 5;
    }
  }

  // Recommended Valuation Methods
  if (valuationReport.recommendedMethods?.recommendedMethods?.length) {
    addText('RECOMMENDED VALUATION METHODS', 16, true);
    addSectionDivider();
    
    valuationReport.recommendedMethods.recommendedMethods.forEach((method, index) => {
      addText(`${index + 1}. ${method.method}`, 12, true);
      addText(`Confidence Level: ${Math.round(method.confidence * 100)}%`, 11);
      addText(`Rationale: ${method.reason}`, 11);
      yPosition += 5;
    });
  }

  // Detailed Valuation Calculations
  if (valuationReport.calculations?.length) {
    addText('DETAILED VALUATION CALCULATIONS', 16, true);
    addSectionDivider();
    
    valuationReport.calculations.forEach((calc, index) => {
      checkNewPage(40);
      
      addText(`${index + 1}. ${calc.method}`, 14, true);
      addText(`Valuation Range: $${calc.valuationRange.lower}M - $${calc.valuationRange.upper}M`, 12, true);
      
      addText('Methodology:', 11, true);
      addText(calc.explanation, 10, false, 5);
      
      addText('Analysis:', 11, true);
      addText(calc.narrative, 10, false, 5);
      
      if (calc.calculation) {
        addText('Detailed Calculations:', 11, true);
        addCalculationDetails(calc.calculation);
      }
      
      yPosition += 10;
    });
  }

  // Competitor Analysis
  if (valuationReport.competitorAnalysis) {
    addText('COMPETITIVE LANDSCAPE ANALYSIS', 16, true);
    addSectionDivider();
    
    if (valuationReport.competitorAnalysis.competitors?.length) {
      addText('Key Competitors:', 12, true);
      valuationReport.competitorAnalysis.competitors.forEach(competitor => {
        addText(`• ${competitor}`, 11, false, 5);
      });
      yPosition += 5;
    }

    if (valuationReport.competitorAnalysis.competitorBenchmarks?.length) {
      addText('Competitor Benchmarks:', 12, true);
      valuationReport.competitorAnalysis.competitorBenchmarks.forEach((benchmark: any) => {
        addText(`• ${benchmark.name}: ${benchmark.valuation}`, 11, false, 5);
        if (benchmark.difference) {
          addText(`  ${benchmark.difference}`, 10, false, 10);
        }
      });
      yPosition += 5;
    }
    
    if (valuationReport.competitorAnalysis.commentary) {
      addText('Market Commentary:', 12, true);
      addText(valuationReport.competitorAnalysis.commentary, 11, false, 5);
      yPosition += 5;
    }
  }

  // Strategic Investment Context
  if (valuationReport.strategicContext) {
    addText('STRATEGIC INVESTMENT CONTEXT', 16, true);
    addSectionDivider();
    
    const paragraphs = valuationReport.strategicContext.split('\n\n');
    paragraphs.forEach((paragraph, index) => {
      addText(`Strategic Insight ${index + 1}:`, 12, true);
      addText(paragraph, 11, false, 5);
      yPosition += 5;
    });
  }

  // Final Valuation Summary
  if (valuationReport.finalValuation) {
    addText('FINAL VALUATION SUMMARY', 16, true);
    addSectionDivider();
    
    if (valuationReport.finalValuation.methodComparisons) {
      if (Array.isArray(valuationReport.finalValuation.methodComparisons)) {
        addText('Method Comparisons:', 12, true);
        valuationReport.finalValuation.methodComparisons.forEach((comparison: any) => {
          addText(`• ${comparison.method}: ${comparison.range}`, 11, false, 5);
          if (comparison.rationale) {
            addText(`  ${comparison.rationale}`, 10, false, 10);
          }
        });
      } else {
        addText('Method Analysis:', 12, true);
        addText(valuationReport.finalValuation.methodComparisons, 11, false, 5);
      }
      yPosition += 5;
    }
    
    if (valuationReport.finalValuation.justification) {
      addText('Valuation Justification:', 12, true);
      addText(valuationReport.finalValuation.justification, 11, false, 5);
      yPosition += 5;
    }
  }

  // Strategic Recommendations
  if (valuationReport.finalValuation?.recommendations?.length) {
    addText('STRATEGIC RECOMMENDATIONS', 16, true);
    addSectionDivider();
    
    if (Array.isArray(valuationReport.finalValuation.recommendations)) {
      valuationReport.finalValuation.recommendations.forEach(rec => {
        addText(`• ${rec}`, 11, false, 5);
      });
    } else {
      addText(`• ${valuationReport.finalValuation.recommendations}`, 11, false, 5);
    }
    yPosition += 10;
  }

  // Disclaimer
  checkNewPage(30);
  addText('DISCLAIMER', 14, true);
  addSectionDivider();
  addText('This valuation report was generated using AI analysis and is intended for informational purposes only. The valuations and recommendations contained herein should not be considered as professional investment advice. Please consult with qualified financial advisors before making any investment decisions.', 10);
  
  yPosition += 10;
  addText(`Report generated on: ${new Date().toLocaleString()}`, 9);
  addText(`Total pages: ${pageNumber - 1}`, 9);

  // Save the PDF
  const fileName = `${wizardData.step1?.businessName || 'startup'}-comprehensive-valuation-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
