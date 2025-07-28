import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Download,
  Share2,
  RefreshCw,
  ArrowRight,
  Clock,
  Target,
  AlertCircle,
  Brain,
  BarChart3,
  Zap,
  Eye,
  Sparkles,
  Terminal
} from "lucide-react";
import {
  fastapiService,
  ValuationReport,
  WizardData,
  streamValuationReport,
} from "@/lib/fastapi";
import { generateValuationPDF } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConfirmationStepProps {
  wizardData: WizardData;
  onStartOver: () => void;
  userID: string;
}

export function ConfirmationStep({
  wizardData,
  onStartOver,
  userID,
}: ConfirmationStepProps) {
  const [confidence, setConfidence] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [valuationReport, setValuationReport] =
    useState<ValuationReport | null>(null);
  const [error, setError] = useState<string>("");
  const [currentStage, setCurrentStage] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Initializing analysis...",
  );

  // Calculate confidence score based on data completeness
  useEffect(() => {
    let score = 30; // Base score

    // Step 1 data
    if (wizardData.step1) {
      score += 20; // Basic info provided
    }

    // Step 2 data
    if (wizardData.step2 && !wizardData.step2.skipFinancials) {
      if (wizardData.step2.revenue !== undefined) score += 15;
      if (wizardData.step2.monthlyBurnRate !== undefined) score += 10;
      if (wizardData.step2.fundingRaised !== undefined) score += 5;
    }

    // Step 3 data
    if (wizardData.step3 && !wizardData.step3.skipTraction) {
      if (wizardData.step3.customerCount !== undefined) score += 10;
      if (wizardData.step3.growthRate !== undefined) score += 10;
      if (wizardData.step3.uniqueValue) score += 5;
    }

    // Step 4 data
    if (wizardData.step4 && !wizardData.step4.skipExtras) {
      if (wizardData.step4.uploadedFiles?.length > 0) score += 10;
      if (wizardData.step4.linkedinUrl) score += 2;
      if (wizardData.step4.websiteUrl) score += 3;
    }

    const finalScore = Math.min(score, 100);

    // Animate confidence meter
    const timer = setTimeout(() => {
      setConfidence(finalScore);
    }, 1000);

    return () => clearTimeout(timer);
  }, [wizardData]);

  // Generate valuation using new API endpoint
  useEffect(() => {
    const generateValuation = async () => {
      setIsGenerating(true);
      setError("");
      setValuationReport(null);
      setCurrentStage(1);
      setStatusMessage("Initializing valuation analysis...");

      try {
        // Simulate progress stages for better UX
        const stages = [
          "Analyzing business model and metrics...",
          "Identifying optimal valuation methods...",
          "Performing detailed calculations...",
          "Analyzing market comparables...",
          "Generating strategic insights...",
          "Finalizing valuation report..."
        ];

        for (let i = 0; i < stages.length - 1; i++) {
          setCurrentStage(i + 1);
          setStatusMessage(stages[i]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setCurrentStage(6);
        setStatusMessage(stages[5]);

        // Call the new API
        const report = await fastapiService.generateValuationReportNew(wizardData);

        setValuationReport(report);
        setIsGenerating(false);
        setStatusMessage("Analysis complete!");
      } catch (error: any) {
        console.error("Valuation generation error:", error);
        setError(error.message || "Analysis failed. Please try again.");
        setIsGenerating(false);
      }
    };

    generateValuation();
  }, [wizardData]);

  const getValuationRange = () => {
    if (!valuationReport?.finalValuation?.finalRange) return null;

    const { lower, upper } = valuationReport.finalValuation.finalRange;
    return { lower: lower * 1000000, upper: upper * 1000000 }; // Convert from millions to actual values
  };

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

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-900/30 border-green-500/30";
    if (score >= 60) return "text-blue-400 bg-blue-900/30 border-blue-500/30";
    if (score >= 40) return "text-yellow-400 bg-yellow-900/30 border-yellow-500/30";
    return "text-red-400 bg-red-900/30 border-red-500/30";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return "High Confidence";
    if (score >= 60) return "Good Confidence";
    if (score >= 40) return "Moderate Confidence";
    return "Initial Estimate";
  };

  const getSummaryStats = () => {
    const stats = [];

    if (wizardData.step1?.businessName) {
      stats.push({
        icon: FileText,
        label: "Business",
        value: wizardData.step1.businessName,
        color: "text-blue-400",
      });
    }

    if (wizardData.step1?.industry) {
      stats.push({
        icon: Target,
        label: "Industry",
        value:
          wizardData.step1.industry.charAt(0).toUpperCase() +
          wizardData.step1.industry.slice(1),
        color: "text-purple-400",
      });
    }

    if (wizardData.step2?.revenue && wizardData.step2.revenue > 0) {
      stats.push({
        icon: DollarSign,
        label: "Revenue",
        value: formatCurrency(wizardData.step2.revenue),
        color: "text-green-400",
      });
    }

    if (wizardData.step3?.customerCount && wizardData.step3.customerCount > 0) {
      stats.push({
        icon: Users,
        label: "Customers",
        value: wizardData.step3.customerCount.toLocaleString(),
        color: "text-orange-400",
      });
    }

    // Add valuation methods count if available
    if (valuationReport?.calculations?.length) {
      stats.push({
        icon: BarChart3,
        label: "Methods",
        value: `${valuationReport.calculations.length} analyses`,
        color: "text-indigo-400",
      });
    }

    return stats;
  };

  const getAnalysisStages = () => [
    "Analyzing business model...",
    "Identifying valuation methods...",
    "Performing detailed calculations...",
    "Analyzing competitors...",
    "Generating strategic insights...",
    "Finalizing valuation report...",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-mono">
            Valuation Complete!
          </h1>
          <p className="text-xl text-slate-400 font-mono">
            Your AI-powered startup analysis is ready
          </p>
        </motion.div>

        {/* Confidence Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white font-mono">
                  Analysis Confidence
                </h3>
                <Badge className={`px-3 py-1 rounded-full text-sm font-mono border ${getConfidenceColor(confidence)}`}>
                  {getConfidenceLabel(confidence)}
                </Badge>
              </div>

              <div className="relative">
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400 mt-2 font-mono">
                  <span>0%</span>
                  <span className="font-medium text-white">{confidence}%</span>
                  <span>100%</span>
                </div>
              </div>

              <p className="text-sm text-slate-400 mt-3 font-mono">
                Based on data completeness and quality
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-8">
            <CardContent className="p-8 text-center">
              {error ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-400 font-mono">
                    Analysis Error
                  </h3>
                  <p className="text-red-300 max-w-md mx-auto font-mono">{error}</p>
                  <Button
                    onClick={() => {
                      setError("");
                      setIsGenerating(true);
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-mono"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : isGenerating ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-mono">
                    {statusMessage || getAnalysisStages()[currentStage - 1]}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-mono">Stage {currentStage} of 6</span>
                  </div>
                  <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStage / 6) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ) : valuationReport ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 font-mono">
                      Estimated Valuation Range
                    </h3>
                    {getValuationRange() ? (
                      <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                          {formatCurrency(getValuationRange()!.lower)} -{" "}
                          {formatCurrency(getValuationRange()!.upper)}
                        </div>
                        <p className="text-sm text-slate-400 font-mono">
                          Based on {valuationReport.calculations?.length || 0}{" "}
                          valuation methodologies
                        </p>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-slate-400 font-mono">
                        Analysis Complete
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-slate-400">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-mono">Professional analysis complete</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-mono">
                    Initializing Analysis...
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Results */}
        {!isGenerating && !error && valuationReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-8 mb-8"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {getSummaryStats().map((stat, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-sm text-slate-400 font-mono">{stat.label}</div>
                    <div className="font-semibold text-white text-sm truncate font-mono">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Summary */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white font-mono">
                  <Eye className="w-5 h-5 mr-2 text-blue-400" />
                  AI Business Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-medium text-white mb-2 font-mono">Summary</h4>
                  <p className="font-mono">{valuationReport.businessSummary.summary}</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2 font-mono">
                    Stage Assessment
                  </h4>
                  <Badge className="bg-blue-900/30 border border-blue-500/30 text-blue-400 font-mono">
                    {valuationReport.businessSummary.stageAssessment}
                  </Badge>
                </div>
                {valuationReport.businessSummary.keyStrengths && (
                  <div>
                    <h4 className="font-medium text-white mb-2 font-mono">
                      Key Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 font-mono">
                      {valuationReport.businessSummary.keyStrengths.map(
                        (strength, index) => (
                          <li key={index}>{strength}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Valuation Methods */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white font-mono">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                  Valuation Methods Applied
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {valuationReport.calculations.map((calc, index) => (
                  <div
                    key={index}
                    className="border border-slate-700 bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white font-mono">
                        {calc.method}
                      </h4>
                      <span className="text-lg font-bold text-blue-400 font-mono">
                        ${calc.valuationRange.lower}M - $
                        {calc.valuationRange.upper}M
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2 font-mono">
                      {calc.explanation}
                    </p>
                    <details className="text-xs text-slate-400 font-mono">
                      <summary className="cursor-pointer hover:text-slate-300 transition-colors">
                        View calculation details
                      </summary>
                      <div className="mt-2 p-3 bg-slate-950/50 rounded-lg whitespace-pre-wrap">
                        {calc.calculation}
                      </div>
                    </details>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strategic Context */}
            {valuationReport.strategicContext && (
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-mono">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Strategic Investment Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed font-mono">
                    {valuationReport.strategicContext}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8"
        >
          <Button
            onClick={() => {
              if (!valuationReport) return;
              generateValuationPDF(wizardData, valuationReport, confidence);
            }}
            disabled={isGenerating || error || !valuationReport}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl py-3 px-6 text-lg font-mono"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Report
          </Button>

          <Button
            onClick={() => {
              const valRange = getValuationRange();
              const shareText = valRange
                ? `${wizardData.step1?.businessName} valuation: ${formatCurrency(valRange.lower)} - ${formatCurrency(valRange.upper)}`
                : `${wizardData.step1?.businessName} valuation analysis complete`;

              if (navigator.share) {
                navigator.share({
                  title: `${wizardData.step1?.businessName} Valuation`,
                  text: shareText,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(shareText);
              }
            }}
            disabled={isGenerating || error}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-3 px-6 font-mono"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>

          <Button
            onClick={onStartOver}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-3 px-6 font-mono"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Start Over
          </Button>
        </motion.div>

        {/* Next Steps */}
        {!isGenerating && !error && valuationReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white font-mono">
                  <ArrowRight className="w-5 h-5 mr-2 text-blue-400" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300 font-mono">
                <p>• Use this AI-powered valuation as a starting point for investor discussions</p>
                <p>• Review the detailed calculations and methodology for each valuation method</p>
                <p>• Consider the competitive analysis to understand your market position</p>
                <p>• Update your metrics regularly and re-run the analysis as you grow</p>
                <p>• Share these insights with advisors and potential investors</p>

                {valuationReport.finalValuation?.recommendations && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <h4 className="font-medium text-blue-400 mb-2 font-mono flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Recommendations
                    </h4>
                    <div className="text-sm text-blue-300 font-mono">
                      {Array.isArray(valuationReport.finalValuation.recommendations) ? (
                        <ul className="space-y-1">
                          {valuationReport.finalValuation.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>• {valuationReport.finalValuation.recommendations}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
