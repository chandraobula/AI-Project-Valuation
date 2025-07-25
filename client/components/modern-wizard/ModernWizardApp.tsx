import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Step1QuickStart } from "./Step1QuickStart";
import { Step2FinancialSnapshot } from "./Step2FinancialSnapshot";
import { Step3ProductTraction } from "./Step3ProductTraction";
import { Step4AIExtras } from "./Step4AIExtras";
import { ConfirmationStep } from "./ConfirmationStep";
import { BackendConfig } from "../BackendConfig";
import { CheckCircle, Circle, Home, Sparkles, ChefHat, Star, Zap } from "lucide-react";
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
    name: "Quick Start", 
    shortName: "Basics",
    icon: "🌟",
    description: "Let's gather your business essentials",
    color: "from-pink-400 to-rose-400",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50"
  },
  { 
    id: 2, 
    name: "Financial Snapshot", 
    shortName: "Finances",
    icon: "💰",
    description: "Adding the financial ingredients",
    color: "from-emerald-400 to-green-400",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50"
  },
  { 
    id: 3, 
    name: "Product & Traction", 
    shortName: "Traction",
    icon: "🚀",
    description: "Mixing in your growth metrics",
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  { 
    id: 4, 
    name: "AI-Powered Extras", 
    shortName: "Extras",
    icon: "✨",
    description: "Final magical touches",
    color: "from-purple-400 to-violet-400",
    bgColor: "bg-gradient-to-br from-purple-50 to-violet-50"
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
  const [showCelebration, setShowCelebration] = useState(false);

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

  // Celebration effect when moving to next step
  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  const updateWizardData = (stepKey: keyof WizardData, data: any) => {
    setWizardData((prev) => ({ ...prev, [stepKey]: data }));
  };

  const handleStep1Next = (data: any) => {
    updateWizardData("step1", data);
    triggerCelebration();
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleStep2Next = (data: any) => {
    updateWizardData("step2", data);
    triggerCelebration();
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleStep3Next = (data: any) => {
    updateWizardData("step3", data);
    triggerCelebration();
    setTimeout(() => setCurrentStep(4), 500);
  };

  const handleStep4Next = (data: any) => {
    updateWizardData("step4", data);
    triggerCelebration();
    setTimeout(() => setIsComplete(true), 500);
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

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${currentStepData?.bgColor || 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(i * 30 * Math.PI / 180) * 200,
                  y: Math.sin(i * 30 * Math.PI / 180) * 200,
                  rotate: 360
                }}
                transition={{ duration: 1 }}
                className="absolute text-2xl"
              >
                {['🎉', '✨', '🌟', '💫'][i % 4]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-full px-4 py-2"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="hidden md:block w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Valuation Kitchen</h1>
                  <p className="text-xs text-slate-600">Cooking up your startup's worth</p>
                </div>
              </div>
            </div>

            {/* Right Side - Progress */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-700">
                  {Math.round(getProgressPercentage())}% Ready
                </div>
                <div className="text-xs text-slate-500">Step {currentStep} of {steps.length}</div>
              </div>
              <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Steps Navigation */}
      <div className="bg-white/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <motion.div 
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Step Circle */}
                    <div className="relative">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                          status === "completed"
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-110"
                            : status === "active"
                              ? `bg-gradient-to-br ${step.color} text-white shadow-xl scale-125`
                              : "bg-white/60 text-slate-400 hover:bg-white/80"
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {status === "completed" ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="text-xl">{step.icon}</span>
                        )}
                      </motion.div>
                      
                      {/* Sparkle Effect for Active Step */}
                      {status === "active" && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 0, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity 
                          }}
                        />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="hidden md:block">
                      <div className={`font-semibold transition-colors ${
                        status === "active" ? "text-slate-900" : "text-slate-600"
                      }`}>
                        {step.shortName}
                      </div>
                      <div className="text-xs text-slate-500 max-w-32">
                        {step.description}
                      </div>
                    </div>
                  </motion.div>

                  {/* Connection Line */}
                  {!isLast && (
                    <div className="flex-1 mx-4 h-px relative">
                      <div className="h-full bg-slate-200 rounded-full"></div>
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: index < currentStep - 1 ? "100%" : "0%" 
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Step Header */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 mb-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-3xl">{currentStepData?.icon}</span>
              <span className="text-lg font-bold text-slate-800">{currentStepData?.name}</span>
            </motion.div>
            <p className="text-slate-600 text-lg">{currentStepData?.description}</p>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Backend Configuration */}
      <div className="bg-white/40 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="max-w-6xl mx-auto">
          <BackendConfig
            currentBackendMode={currentBackendMode}
            onBackendChange={handleBackendChange}
          />
        </div>
      </div>

      {/* Floating Help Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white z-30"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity },
          hover: { duration: 0.2 }
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
