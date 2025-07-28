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
  Terminal,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  AlertTriangle,
  Award,
  TrendingDown,
  Building,
  Globe
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    summary: true,
    methods: true,
    calculations: false,
    competitors: false,
    strategic: false
  });

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
    if (!valuationReport?.finalValuation?.finalRange) {
      // Try to get range from calculations if finalValuation is empty
      if (valuationReport?.calculations?.length > 0) {
        const ranges = valuationReport.calculations.map(calc => calc.valuationRange);
        const lower = Math.min(...ranges.map(r => r.lower));
        const upper = Math.max(...ranges.map(r => r.upper));
        return { lower: lower * 1000000, upper: upper * 1000000 };
      }
      return null;
    }

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

  const getMethodConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-blue-400";
    if (confidence >= 0.4) return "text-yellow-400";
    return "text-orange-400";
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSummaryStats = () => {
    const stats = [];

    if (wizardData.step1?.businessName) {
      stats.push({
        icon: Building,
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
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            Your comprehensive AI-powered startup analysis is ready
          </p>
        </motion.div>

        {/* Main Content */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-400 font-mono mb-4">
                  Analysis Error
                </h3>
                <p className="text-red-300 max-w-md mx-auto font-mono mb-6">{error}</p>
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
              </CardContent>
            </Card>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-white font-mono mb-4">
                  {statusMessage || getAnalysisStages()[currentStage - 1]}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-slate-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">Stage {currentStage} of 6</span>
                </div>
                <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStage / 6) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : valuationReport ? (
          <>
            {/* Valuation Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white mb-6 font-mono">
                    Estimated Valuation Range
                  </h3>
                  {getValuationRange() ? (
                    <div className="space-y-4">
                      <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                        {formatCurrency(getValuationRange()!.lower)} - {formatCurrency(getValuationRange()!.upper)}
                      </div>
                      <p className="text-lg text-slate-300 font-mono">
                        Based on {valuationReport.calculations?.length || 0} valuation methodologies
                      </p>
                      
                      {/* Confidence Meter */}
                      <div className="max-w-md mx-auto mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-slate-400">Analysis Confidence</span>
                          <Badge className={`px-3 py-1 rounded-full text-sm font-mono border ${getConfidenceColor(confidence)}`}>
                            {getConfidenceLabel(confidence)}
                          </Badge>
                        </div>
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence}%` }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                          <span>0%</span>
                          <span className="font-medium text-white">{confidence}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-slate-400 font-mono">
                      Analysis Complete
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </motion.div>

            {/* Business Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection('summary')}
                >
                  <CardTitle className="flex items-center justify-between text-white font-mono">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-400" />
                      Business Analysis Summary
                    </div>
                    {expandedSections.summary ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-medium text-white mb-3 font-mono">Executive Summary</h4>
                          <p className="text-slate-300 leading-relaxed font-mono">
                            {valuationReport.businessSummary.summary}
                          </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-white mb-3 font-mono flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-green-400" />
                              Key Strengths
                            </h4>
                            <ul className="space-y-2">
                              {valuationReport.businessSummary.keyStrengths?.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-300 text-sm font-mono">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-white mb-3 font-mono flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                              Risks & Considerations
                            </h4>
                            <ul className="space-y-2">
                              {valuationReport.businessSummary.weaknessesOrRisks?.map((risk, index) => (
                                <li key={index} className="flex items-start">
                                  <AlertCircle className="w-4 h-4 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-300 text-sm font-mono">{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <Badge className="bg-blue-900/30 border border-blue-500/30 text-blue-400 font-mono">
                            Stage Assessment: {valuationReport.businessSummary.stageAssessment}
                          </Badge>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Recommended Methods Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection('methods')}
                >
                  <CardTitle className="flex items-center justify-between text-white font-mono">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-400" />
                      Recommended Valuation Methods
                    </div>
                    {expandedSections.methods ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections.methods && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent>
                        <div className="grid gap-4">
                          {valuationReport.recommendedMethods.recommendedMethods.map((method, index) => (
                            <div key={index} className="border border-slate-700 bg-slate-800/30 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white font-mono">{method.method}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className={`font-bold font-mono ${getMethodConfidenceColor(method.confidence)}`}>
                                    {Math.round(method.confidence * 100)}%
                                  </span>
                                  <Badge className={`px-2 py-1 text-xs ${getMethodConfidenceColor(method.confidence)} bg-slate-800 border border-current`}>
                                    Confidence
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm font-mono">{method.reason}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Detailed Calculations Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection('calculations')}
                >
                  <CardTitle className="flex items-center justify-between text-white font-mono">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                      Detailed Valuation Calculations
                    </div>
                    {expandedSections.calculations ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections.calculations && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="space-y-6">
                        {valuationReport.calculations.map((calc, index) => (
                          <div key={index} className="border border-slate-700 bg-slate-800/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-white font-mono text-lg">{calc.method}</h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-400 font-mono">
                                  ${calc.valuationRange.lower}M - ${calc.valuationRange.upper}M
                                </div>
                                <div className="text-xs text-slate-400 font-mono">Valuation Range</div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-medium text-white mb-2 font-mono">Methodology</h5>
                                <p className="text-slate-300 text-sm font-mono leading-relaxed">
                                  {calc.explanation}
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-white mb-2 font-mono">Analysis</h5>
                                <p className="text-slate-300 text-sm font-mono leading-relaxed">
                                  {calc.narrative}
                                </p>
                              </div>
                              
                              {typeof calc.calculation === 'object' ? (
                                <details className="text-xs text-slate-400 font-mono">
                                  <summary className="cursor-pointer hover:text-slate-300 transition-colors mb-2">
                                    View detailed calculation breakdown
                                  </summary>
                                  <div className="mt-2 p-4 bg-slate-950/50 rounded-lg border border-slate-700">
                                    <pre className="whitespace-pre-wrap text-slate-300">
                                      {JSON.stringify(calc.calculation, null, 2)}
                                    </pre>
                                  </div>
                                </details>
                              ) : (
                                <details className="text-xs text-slate-400 font-mono">
                                  <summary className="cursor-pointer hover:text-slate-300 transition-colors">
                                    View calculation details
                                  </summary>
                                  <div className="mt-2 p-4 bg-slate-950/50 rounded-lg border border-slate-700 whitespace-pre-wrap">
                                    {calc.calculation}
                                  </div>
                                </details>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Competitor Analysis Section */}
            {valuationReport.competitorAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-8"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleSection('competitors')}
                  >
                    <CardTitle className="flex items-center justify-between text-white font-mono">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-orange-400" />
                        Competitive Landscape Analysis
                      </div>
                      {expandedSections.competitors ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.competitors && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="space-y-6">
                          {valuationReport.competitorAnalysis.competitors && (
                            <div>
                              <h4 className="font-medium text-white mb-3 font-mono">Key Competitors</h4>
                              <div className="flex flex-wrap gap-2">
                                {valuationReport.competitorAnalysis.competitors.map((competitor, index) => (
                                  <Badge key={index} className="bg-orange-900/30 border border-orange-500/30 text-orange-400 font-mono">
                                    {competitor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {valuationReport.competitorAnalysis.competitorBenchmarks && 
                           valuationReport.competitorAnalysis.competitorBenchmarks.length > 0 && (
                            <div>
                              <h4 className="font-medium text-white mb-3 font-mono">Competitor Benchmarks</h4>
                              <div className="space-y-3">
                                {valuationReport.competitorAnalysis.competitorBenchmarks.map((benchmark: any, index) => (
                                  <div key={index} className="border border-slate-700 bg-slate-800/30 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-white font-mono">{benchmark.name}</h5>
                                      <Badge className="bg-slate-700 text-slate-200 font-mono text-xs">
                                        {benchmark.valuation}
                                      </Badge>
                                    </div>
                                    <p className="text-slate-300 text-sm font-mono">{benchmark.difference}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {valuationReport.competitorAnalysis.commentary && (
                            <div>
                              <h4 className="font-medium text-white mb-3 font-mono">Market Commentary</h4>
                              <p className="text-slate-300 leading-relaxed font-mono">
                                {valuationReport.competitorAnalysis.commentary}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )}

            {/* Strategic Context Section */}
            {valuationReport.strategicContext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="mb-8"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleSection('strategic')}
                  >
                    <CardTitle className="flex items-center justify-between text-white font-mono">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-400" />
                        Strategic Investment Context
                      </div>
                      {expandedSections.strategic ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.strategic && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            {valuationReport.strategicContext.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="text-slate-300 leading-relaxed font-mono mb-4">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8"
            >
              <Button
                onClick={() => {
                  if (!valuationReport) return;
                  generateValuationPDF(wizardData, valuationReport, confidence);
                }}
                disabled={!valuationReport}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl py-3 px-6 text-lg font-mono"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Comprehensive Report
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
                New Analysis
              </Button>
            </motion.div>

            {/* Recommendations Section */}
            {valuationReport.finalValuation?.recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white font-mono">
                      <ArrowRight className="w-5 h-5 mr-2 text-blue-400" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {Array.isArray(valuationReport.finalValuation.recommendations) ? (
                        valuationReport.finalValuation.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 font-mono">{rec}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start space-x-3 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 font-mono">{valuationReport.finalValuation.recommendations}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}