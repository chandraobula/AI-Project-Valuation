import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Step1QuickStart } from "./Step1QuickStart";
import { Step2FinancialSnapshot } from "./Step2FinancialSnapshot";
import { Step3ProductTraction } from "./Step3ProductTraction";
import { Step4AIExtras } from "./Step4AIExtras";
import { ConfirmationStep } from "./ConfirmationStep";
import { BackendConfig } from "../BackendConfig";
import { CheckCircle, Circle, Home, Terminal, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fastapiService } from "@/lib/fastapi";

interface WizardData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
}

const steps = [
  { 
    id: 1, 
    name: "Business Info", 
    shortName: "Basics",
    description: "Company details and basic information"
  },
  { 
    id: 2, 
    name: "Financial Data", 
    shortName: "Finances",
    description: "Revenue, funding, and financial metrics"
  },
  { 
    id: 3, 
    name: "Market Traction", 
    shortName: "Traction",
    description: "Customer metrics and growth data"
  },
  { 
    id: 4, 
    name: "AI Analysis", 
    shortName: "Analysis",
    description: "AI-powered insights and recommendations"
  },
];

export function ModernWizardApp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [userID] = useState(
    `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );
  const [isComplete, setIsComplete] = useState(false);
  const [currentBackendMode, setCurrentBackendMode] = useState<string>("demo");

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("wizardData");
      const savedStep = localStorage.getItem("currentStep");
      const savedBackendMode = localStorage.getItem("backendMode");
      const savedBackendUrl = localStorage.getItem("customBackendUrl");

      if (savedData) {
        setWizardData(JSON.parse(savedData));
      }

      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }

      // Initialize backend URL based on saved preferences or environment
      if (savedBackendMode === "custom" && savedBackendUrl) {
        fastapiService.setBackendUrl(savedBackendUrl);
        setCurrentBackendMode("Custom Backend");
      } else if (savedBackendMode === "demo") {
        fastapiService.setBackendUrl("demo");
        setCurrentBackendMode("Demo Mode");
      } else if (savedBackendMode === "local") {
        fastapiService.setBackendUrl("http://127.0.0.1:8000");
        setCurrentBackendMode("Local Backend");
      } else {
        // Auto-detect based on environment
        const isDevelopment =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const defaultUrl = isDevelopment ? "http://127.0.0.1:8000" : "demo";
        fastapiService.setBackendUrl(defaultUrl);
        setCurrentBackendMode(isDevelopment ? "Local Backend" : "Demo Mode");

        // Save the default choice
        localStorage.setItem("backendMode", isDevelopment ? "local" : "demo");
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wizardData", JSON.stringify(wizardData));
      localStorage.setItem("currentStep", currentStep.toString());
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [wizardData, currentStep]);

  const updateWizardData = (stepKey: keyof WizardData, data: any) => {
    setWizardData((prev) => ({ ...prev, [stepKey]: data }));
  };

  const handleStep1Next = (data: any) => {
    updateWizardData("step1", data);
    setCurrentStep(2);
  };

  const handleStep2Next = (data: any) => {
    updateWizardData("step2", data);
    setCurrentStep(3);
  };

  const handleStep3Next = (data: any) => {
    updateWizardData("step3", data);
    setCurrentStep(4);
  };

  const handleStep4Next = (data: any) => {
    updateWizardData("step4", data);
    setIsComplete(true);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const getProgressPercentage = () => {
    if (isComplete) return 100;
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  // Clear saved data when starting fresh
  const clearSavedData = () => {
    localStorage.removeItem("wizardData");
    localStorage.removeItem("currentStep");
    setWizardData({});
    setCurrentStep(1);
    setIsComplete(false);
  };

  // Handle backend URL changes
  const handleBackendChange = (url: string) => {
    fastapiService.setBackendUrl(url);
    setCurrentBackendMode(
      url === "demo"
        ? "Demo Mode"
        : url === "http://127.0.0.1:8000"
          ? "Local Backend"
          : "Custom Backend",
    );
    console.log("Backend URL changed to:", url);
  };

  if (isComplete) {
    return (
      <ConfirmationStep
        wizardData={wizardData}
        onStartOver={clearSavedData}
        userID={userID}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Navigation */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white font-mono">Startup Valuation</h1>
                  <p className="text-xs text-slate-400 font-mono">AI-powered analysis</p>
                </div>
              </div>
            </div>

            {/* Right Side - Progress */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-300 font-mono">
                  Step {currentStep} of {steps.length}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {Math.round(getProgressPercentage())}% complete
                </div>
              </div>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-slate-900/30 border-b border-slate-700/30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center space-x-3">
                    {/* Step Circle */}
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        status === "completed"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                          : status === "active"
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-mono">{step.id}</span>
                      )}
                    </motion.div>

                    {/* Step Info */}
                    <div className="hidden md:block">
                      <div className={`font-semibold font-mono transition-colors ${
                        status === "active" ? "text-white" : "text-slate-400"
                      }`}>
                        {step.shortName}
                      </div>
                      <div className="text-xs text-slate-500 max-w-32">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Connection Line */}
                  {!isLast && (
                    <div className="flex-1 mx-6 h-px relative">
                      <div className="h-full bg-slate-700 rounded-full"></div>
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: index < currentStep - 1 ? "100%" : "0%" 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Current Step Header */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-mono">
              {steps[currentStep - 1]?.name}
            </h2>
            <p className="text-slate-400 font-mono">
              {steps[currentStep - 1]?.description}
            </p>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Step1QuickStart
                  onNext={handleStep1Next}
                  initialData={wizardData.step1}
                  onSave={(data) => updateWizardData("step1", data)}
                />
              )}
              {currentStep === 2 && (
                <Step2FinancialSnapshot
                  onNext={handleStep2Next}
                  onBack={handleBack}
                  initialData={wizardData.step2}
                  onSave={(data) => updateWizardData("step2", data)}
                />
              )}
              {currentStep === 3 && (
                <Step3ProductTraction
                  onNext={handleStep3Next}
                  onBack={handleBack}
                  initialData={wizardData.step3}
                  onSave={(data) => updateWizardData("step3", data)}
                />
              )}
              {currentStep === 4 && (
                <Step4AIExtras
                  onNext={handleStep4Next}
                  onBack={handleBack}
                  initialData={wizardData.step4}
                  onSave={(data) => updateWizardData("step4", data)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 font-mono"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {steps[currentStep - 2]?.shortName}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Backend Configuration Footer */}
      <div className="bg-slate-950/50 border-t border-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <BackendConfig
            currentBackendMode={currentBackendMode}
            onBackendChange={handleBackendChange}
          />
        </div>
      </div>
    </div>
  );
}
