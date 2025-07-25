import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, BarChart3, TrendingUp, Shield, Zap, Brain, Target, Check, Star, Users, Rocket, Calculator,
  X, AlertCircle, DollarSign, FileText, Eye, MessageCircle, ChevronDown, ChevronUp, Play, Download,
  Briefcase, Building, TrendingDown, BookOpen, Award, Clock, Lock, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LandingPageProps {
  onStartWizard: () => void;
}

export function LandingPage({ onStartWizard }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const problemPoints = [
    {
      icon: AlertCircle,
      title: "No access to finance experts",
      description: "Professional valuations cost thousands and take weeks to complete"
    },
    {
      icon: TrendingDown,
      title: "Unclear how much equity to give",
      description: "Founders struggle with equity decisions without knowing their worth"
    },
    {
      icon: FileText,
      title: "Can't justify numbers to investors",
      description: "Lack credible data and methodology to support valuation claims"
    },
    {
      icon: X,
      title: "No credible report to show",
      description: "Need professional documentation for fundraising and partnerships"
    }
  ];

  const solutionFeatures = [
    "Step-by-step valuation wizard",
    "AI-powered method recommendations", 
    "Investor-grade valuation reports",
    "Built-in benchmarking"
  ];

  const valuationMethods = [
    {
      name: "Berkus Method",
      description: "Ideal for pre-revenue startups",
      icon: Target,
      beginner: true
    },
    {
      name: "Scorecard Method", 
      description: "Angel investor standard",
      icon: Award,
      beginner: true
    },
    {
      name: "DCF Analysis",
      description: "Discounted cash flow",
      icon: BarChart3,
      beginner: false
    },
    {
      name: "VC Method",
      description: "Venture capital approach",
      icon: TrendingUp,
      beginner: false
    },
    {
      name: "Risk Factor",
      description: "Risk-adjusted valuation",
      icon: Shield,
      beginner: false
    },
    {
      name: "Comparable Analysis",
      description: "Market-based valuation",
      icon: Building,
      beginner: true
    }
  ];

  const targetPersonas = [
    {
      title: "Startup Founders",
      description: "Get investor-ready valuations for fundraising rounds",
      icon: Rocket,
      testimonial: "Finally got a professional valuation without breaking the bank!"
    },
    {
      title: "SME Owners", 
      description: "Understand your business value for exit planning",
      icon: Briefcase,
      testimonial: "Perfect for planning our acquisition strategy."
    },
    {
      title: "Angel Investors",
      description: "Quick due diligence and portfolio valuation",
      icon: DollarSign,
      testimonial: "Saves me hours of analysis per deal."
    },
    {
      title: "Accelerators",
      description: "Standardized valuations for your cohort",
      icon: Building,
      testimonial: "Essential tool for our program participants."
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for trying out our platform",
      features: [
        "1 complete valuation",
        "Basic AI recommendations", 
        "PDF report download",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Founder Plan",
      price: { monthly: 29, annual: 290 },
      description: "For individual entrepreneurs", 
      features: [
        "Unlimited valuations",
        "Advanced AI insights",
        "Custom report branding",
        "Priority support",
        "Method explanations",
        "Sensitivity analysis"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Accelerator Pack",
      price: { monthly: 199, annual: 1990 },
      description: "For accelerators and VCs",
      features: [
        "Multi-startup management",
        "Team collaboration tools", 
        "White-label reports",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How accurate is the valuation?",
      answer: "Our AI analyzes thousands of data points and comparable companies to provide valuations within industry-standard ranges. While no valuation is 100% precise, our methodology is used by professional investors and meets institutional standards."
    },
    {
      question: "Do investors trust this report?",
      answer: "Yes! Our reports follow established valuation methodologies (DCF, Comparables, VC Method, etc.) that are recognized by angels, VCs, and institutional investors worldwide."
    },
    {
      question: "What happens if my startup has no revenue?",
      answer: "We specialize in early-stage valuations! Our AI recommends pre-revenue methods like Berkus and Scorecard that focus on team, market size, product, and traction metrics."
    },
    {
      question: "Can I edit or customize my report?",
      answer: "Absolutely! You can customize assumptions, add commentary, include your branding, and export in multiple formats (PDF, Word, Excel) to meet your specific needs."
    },
    {
      question: "How long does a valuation take?",
      answer: "Most valuations are completed in 10-15 minutes. Our AI-guided wizard asks the right questions and generates your report instantly."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption, comply with SOC2 standards, and never share your data. Your sensitive business information is completely protected."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/20 dark:border-slate-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ValuationAI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
              <a href="#methods" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Methods</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onStartWizard}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by Y Combinator | 500 Startups | Techstars
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              Know Your Startup's Worth
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                in Minutes – Backed by AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Investor-ready valuation reports using global methodologies, powered by artificial intelligence.
              Get the credible numbers you need for fundraising, equity decisions, and growth planning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={onStartWizard}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowVideoModal(true)}
                className="px-8 py-4 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Over $40M+ Startups Valued</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">SOC2 Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Valuing a Startup Shouldn't Be a Guessing Game
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Most founders struggle with valuation challenges that cost time, money, and credibility with investors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problemPoints.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-2 border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800 transition-all bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <problem.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {problem.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                Meet Your AI Co-Pilot for
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Startup Valuation</span>
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Transform weeks of complex analysis into minutes with our AI-powered platform. 
                Get professional-grade valuations that investors trust and understand.
              </p>

              <div className="space-y-4 mb-8">
                {solutionFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-slate-700 dark:text-slate-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button 
                size="lg" 
                onClick={onStartWizard}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg shadow-xl"
              >
                Try Interactive Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-3xl"></div>
                <div className="relative">
                  <div className="w-full h-64 bg-white dark:bg-slate-900 rounded-2xl shadow-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-300">Interactive Demo Video</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">$1.2M</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Valuation Range</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Simple Process, Professional Results
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our AI-guided wizard makes professional startup valuation accessible to everyone
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  number: "01",
                  title: "Tell us about your startup",
                  description: "Business stage, industry, revenue",
                  icon: Target
                },
                {
                  number: "02", 
                  title: "Let the AI recommend methods",
                  description: "Berkus, DCF, Comparables, etc.",
                  icon: Brain
                },
                {
                  number: "03",
                  title: "Review your valuation insights", 
                  description: "Understand the analysis",
                  icon: Eye
                },
                {
                  number: "04",
                  title: "Download a professional report",
                  description: "PDF/Word/Excel-ready",
                  icon: Download
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                    STEP {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                  
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8">
                      <ArrowRight className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Valuation Methods */}
      <section id="methods" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Powered by Global Standards
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Our AI uses established methodologies trusted by investors worldwide
            </p>
            
            <div className="flex justify-center">
              <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg">
                <div className="flex">
                  <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium">
                    Beginner Friendly
                  </button>
                  <button className="px-6 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">
                    Advanced Finance
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuationMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-2 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {method.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {method.description}
                    </p>
                    <Badge variant={method.beginner ? "default" : "secondary"}>
                      {method.beginner ? "Beginner" : "Advanced"}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                Smarter Valuations with
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> AI Insights</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Confidence Scoring + Sensitivity Range
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Get confidence intervals and understand how key variables affect your valuation
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Benchmark Against Similar Startups
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Compare your valuation to startups in the same vertical and stage
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Justification for Each Method
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Understand why the AI chose specific methods for your startup
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-white dark:bg-slate-900 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-center">AI Valuation Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Valuation Range</span>
                      <span className="text-sm text-slate-500">95% confidence</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$1.2M - $1.8M</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Top 3 Comparable Startups</h4>
                    <div className="space-y-2">
                      {["TechCorp", "StartupAI", "InnovateCo"].map((company, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                          <span className="text-sm">{company}</span>
                          <span className="text-sm font-medium">${(1.5 + index * 0.2).toFixed(1)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Methods Applied</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">Berkus</div>
                        <div className="text-xs text-slate-500">Primary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">Scorecard</div>
                        <div className="text-xs text-slate-500">Secondary</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              See What You'll Get
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
              Professional, investor-ready reports that build credibility and trust
            </p>

            <Card className="bg-white dark:bg-slate-900 shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="aspect-[4/5] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">Sample Valuation Report</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Interactive Preview</div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Investor-ready • Shareable • Credible
                  </Badge>
                </div>

                <Button size="lg" variant="outline" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Download Sample Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Built for Everyone in the Ecosystem
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From first-time founders to experienced investors, our platform serves the entire startup community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {targetPersonas.map((persona, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-2 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group-hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <persona.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {persona.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      {persona.description}
                    </p>
                    <blockquote className="text-sm italic text-slate-500 dark:text-slate-400 border-l-4 border-blue-200 pl-4">
                      "{persona.testimonial}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg">
                <div className="flex">
                  <button 
                    onClick={() => setPricingPeriod('monthly')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      pricingPeriod === 'monthly' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setPricingPeriod('annual')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      pricingPeriod === 'annual' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Annual <Badge className="ml-2">Save 17%</Badge>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-6 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card className={`h-full ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl bg-white dark:bg-slate-900' 
                    : 'border-2 border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80'
                } backdrop-blur-sm transition-all hover:shadow-xl`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {plan.description}
                      </p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                          ${plan.price[pricingPeriod]}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          /{pricingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={plan.name === 'Free Trial' ? onStartWizard : undefined}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                          : 'border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to know about our platform
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-100 dark:border-slate-700 px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Start Your Valuation Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of founders who've already discovered their startup's true worth
            </p>
            
            <Button 
              size="lg" 
              onClick={onStartWizard}
              className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Launch Free Valuation
              <Rocket className="ml-3 w-6 h-6" />
            </Button>

            <div className="mt-8 text-blue-100 text-sm">
              No credit card required • Get results in minutes • Trusted by 10,000+ startups
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  ValuationAI
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The AI-powered platform that makes professional startup valuation accessible to everyone. 
                Trusted by founders, investors, and accelerators worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-slate-800 text-slate-300">SOC2 Compliant</Badge>
                <Badge className="bg-slate-800 text-slate-300">GDPR Ready</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              © 2024 ValuationAI. All rights reserved. Built with AI for the future of startup valuation.
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <div className="text-slate-400 text-sm">
                Need help? <a href="#" className="text-blue-400 hover:text-blue-300">Contact support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Product Demo</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowVideoModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Demo video would play here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
