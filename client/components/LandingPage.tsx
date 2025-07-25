import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, Sparkles, BarChart3, TrendingUp, Shield, Zap, Brain, Target, Check, Star, Users, Rocket, Calculator,
  ChevronDown, Play, Download, Terminal, Code, X, AlertCircle, DollarSign, FileText, Eye, MessageCircle,
  Briefcase, Building, BookOpen, Award, Clock, Lock, CheckCircle2, ChevronUp, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LandingPageProps {
  onStartWizard: () => void;
}

export function LandingPage({ onStartWizard }: LandingPageProps) {
  const [commandText, setCommandText] = useState("");
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [methodToggle, setMethodToggle] = useState<'beginner' | 'advanced'>('beginner');
  const fullCommand = "> ai valuation generate --doc --method=comprehensive --output=pdf";
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);

  // Typing animation for command line
  useEffect(() => {
    if (commandText.length < fullCommand.length) {
      const timeout = setTimeout(() => {
        setCommandText(fullCommand.slice(0, commandText.length + 1));
      }, 50 + Math.random() * 50);
      return () => clearTimeout(timeout);
    } else if (commandText.length === fullCommand.length) {
      setTimeout(() => {
        setCommandText("");
      }, 3000);
    }
  }, [commandText, fullCommand]);

  const problemPoints = [
    {
      icon: X,
      title: "No access to finance experts",
      description: "Professional valuations cost thousands and take weeks to complete"
    },
    {
      icon: X,
      title: "Unclear how much equity to give",
      description: "Founders struggle with equity decisions without knowing their worth"
    },
    {
      icon: X,
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

  const howItWorksSteps = [
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
      title: "Accelerators / Incubators",
      description: "Standardized valuations for your cohort",
      icon: Building,
      testimonial: "Essential tool for our program participants."
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: { monthly: 0, annual: 0 },
      description: "1 valuation",
      features: [
        "1 complete valuation",
        "Basic AI recommendations", 
        "PDF report download",
        "Email support"
      ],
      cta: "Get Started for Free",
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
      description: "Multi-startup management",
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

  const testimonials = [
    {
      quote: "This tool saved us months of expensive consultant work. The AI recommendations were spot-on for our Series A.",
      author: "Sarah Chen",
      role: "CEO at DataFlow",
      company: "Y Combinator S23"
    },
    {
      quote: "Finally, a valuation platform that speaks our language. The technical depth is impressive.",
      author: "Marcus Rodriguez", 
      role: "CTO at DevTools Inc",
      company: "Techstars 2023"
    },
    {
      quote: "Used this for our exit planning. The multi-method approach gave us confidence in our numbers.",
      author: "Alex Kim",
      role: "Founder at CloudScale",
      company: "500 Startups"
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
    }
  ];

  const filteredMethods = valuationMethods.filter(method => 
    methodToggle === 'beginner' ? method.beginner : !method.beginner
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              valuation.ai
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-mono">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">features</a>
            <a href="#methods" className="text-slate-400 hover:text-white transition-colors">methods</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">pricing</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">faq</a>
          </div>

          <Button 
            onClick={onStartWizard}
            className="bg-white text-black hover:bg-slate-100 font-mono text-sm px-6"
          >
            Try the Valuation Wizard
          </Button>
        </div>
      </motion.nav>

      {/* 1. Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex items-center justify-center px-6 relative"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Social Proof */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-full text-sm font-mono text-blue-400">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by: Y Combinator | 500 Startups | Techstars
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Know Your Startup's Worth
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                in Minutes – Backed by AI
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto font-mono leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Investor-ready valuation reports using global methodologies, powered by artificial intelligence.
            </motion.p>

            {/* Command Line Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-block bg-slate-900/80 border border-slate-700/50 rounded-lg p-4 text-left font-mono text-sm backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400">
                  {commandText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                onClick={onStartWizard}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-mono shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg font-mono"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </motion.section>

      {/* 2. Problem Section */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Valuing a Startup Shouldn't Be a Guessing Game
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Most founders struggle with valuation challenges that cost time, money, and credibility with investors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problemPoints.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-slate-900/50 border-red-800/30 hover:border-red-600/50 transition-all backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <problem.icon className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3 font-mono">
                          🚫 {problem.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-mono">
                Meet Your AI Co-Pilot for
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Startup Valuation</span>
              </h2>
              
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
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
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg text-slate-300 font-mono">✅ {feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Tool Mockup */}
              <div className="relative bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800 p-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-sm text-slate-400 font-mono">valuation-wizard.ai</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">1</span>
                      </div>
                      <span className="text-slate-300 font-mono">Business basics collected ✓</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">2</span>
                      </div>
                      <span className="text-slate-300 font-mono">Financial data analyzed ✓</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">3</span>
                      </div>
                      <span className="text-slate-300 font-mono">AI generating report...</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-slate-950/50 rounded-lg">
                    <div className="text-sm font-mono text-green-400">
                      Estimated Valuation: $1.2M - $1.8M
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      95% confidence • Berkus Method recommended
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Simple Process, Professional Results
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our AI-guided wizard makes professional startup valuation accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-blue-400 dark:text-blue-400 mb-2 font-mono">
                      STEP {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">
                      {step.title}
                    </h3>
                    <p className="text-slate-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Supported Valuation Methods */}
      <section id="methods" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Powered by Global Standards
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Our AI uses established methodologies trusted by investors worldwide
            </p>
            
            <div className="flex justify-center">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-full p-1 shadow-lg">
                <div className="flex">
                  <button 
                    onClick={() => setMethodToggle('beginner')}
                    className={`px-6 py-2 rounded-full font-medium transition-all font-mono ${
                      methodToggle === 'beginner' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Beginner Friendly
                  </button>
                  <button 
                    onClick={() => setMethodToggle('advanced')}
                    className={`px-6 py-2 rounded-full font-medium transition-all font-mono ${
                      methodToggle === 'advanced' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Advanced Finance
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all backdrop-blur-sm h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">
                      {method.name}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {method.description}
                    </p>
                    <Badge variant={method.beginner ? "default" : "secondary"} className="font-mono">
                      {method.beginner ? "Beginner" : "Advanced"}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI Intelligence Section */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Smarter Valuations with AI Insights
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Get confidence intervals, benchmarking, and detailed methodology explanations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-900/30 border border-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-mono">
                      Confidence scoring + sensitivity range
                    </h3>
                    <p className="text-slate-400">
                      Get confidence intervals and understand how key variables affect your valuation
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-900/30 border border-green-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-mono">
                      Benchmark against startups in the same vertical
                    </h3>
                    <p className="text-slate-400">
                      Compare your valuation to startups in the same vertical and stage
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-900/30 border border-purple-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-mono">
                      Justification for each method chosen
                    </h3>
                    <p className="text-slate-400">
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
              <Card className="bg-slate-900/80 border border-slate-700/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-center font-mono text-white">AI Valuation Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 font-mono">Valuation Range</span>
                      <span className="text-sm text-slate-500 font-mono">95% confidence</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-2 font-mono">$1.2M – $1.8M</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-white font-mono">Top 3 comparable startups</h4>
                    <div className="space-y-2">
                      {["TechCorp", "StartupAI", "InnovateCo"].map((company, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700">
                          <span className="text-sm text-slate-300 font-mono">{company}</span>
                          <span className="text-sm font-medium text-slate-200 font-mono">${(1.5 + index * 0.2).toFixed(1)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-white font-mono">Justification for each method chosen</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400 font-mono">Berkus</div>
                        <div className="text-xs text-slate-500 font-mono">Primary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400 font-mono">Scorecard</div>
                        <div className="text-xs text-slate-500 font-mono">Secondary</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Sample Report Preview */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              See What You'll Get
            </h2>
            <p className="text-xl text-slate-400 mb-12">
              Professional, investor-ready reports that build credibility and trust
            </p>

            <Card className="bg-slate-900/80 border border-slate-700/50 shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="aspect-[4/5] bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-700/50">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <div className="text-lg font-semibold text-white font-mono">Sample Valuation Report</div>
                    <div className="text-sm text-slate-400 font-mono">Interactive Preview</div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <Badge className="bg-green-900/30 border border-green-800/50 text-green-400 font-mono">
                    Investor-ready. Shareable. Credible.
                  </Badge>
                </div>

                <Button size="lg" variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 font-mono">
                  <Download className="w-5 h-5 mr-2" />
                  Download Sample Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 8. Who It's For */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Built for Everyone in the Ecosystem
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
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
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all backdrop-blur-sm h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <persona.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">
                      {persona.title}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {persona.description}
                    </p>
                    <blockquote className="text-sm italic text-slate-500 border-l-4 border-blue-500/30 pl-4 font-mono">
                      "{persona.testimonial}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-full p-1 shadow-lg">
                <div className="flex">
                  <button 
                    onClick={() => setPricingPeriod('monthly')}
                    className={`px-6 py-2 rounded-full font-medium transition-all font-mono ${
                      pricingPeriod === 'monthly' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setPricingPeriod('annual')}
                    className={`px-6 py-2 rounded-full font-medium transition-all font-mono ${
                      pricingPeriod === 'annual' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Annual <Badge className="ml-2 font-mono">Save 17%</Badge>
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
                    <Badge className="bg-blue-600 text-white px-6 py-1 font-mono">Most Popular</Badge>
                  </div>
                )}
                <Card className={`h-full ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl bg-slate-900/80' 
                    : 'border border-slate-700/50 bg-slate-900/50'
                } backdrop-blur-sm transition-all hover:shadow-xl`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                        {plan.name}
                      </h3>
                      <p className="text-slate-400 mb-6 font-mono">
                        {plan.description}
                      </p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white font-mono">
                          ${plan.price[pricingPeriod]}
                        </span>
                        <span className="text-slate-400 font-mono">
                          /{pricingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300 font-mono text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={plan.name === 'Free Trial' ? onStartWizard : undefined}
                      className={`w-full font-mono ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                          : 'border border-slate-600 text-slate-300 hover:bg-slate-700'
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

      {/* 10. Testimonials / Logos / Case Studies */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Trusted by <span className="text-blue-400">builders</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Over $40M worth of startups valued using our tool.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <p className="text-slate-300 mb-6 italic font-mono text-sm leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t border-slate-700 pt-4">
                      <div className="font-semibold text-white text-sm">
                        {testimonial.author}
                      </div>
                      <div className="text-slate-400 text-xs font-mono">
                        {testimonial.role}
                      </div>
                      <div className="text-blue-400 text-xs font-mono">
                        {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-400">
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
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold text-white font-mono">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 pb-6 font-mono">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 12. Final CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Start Your Valuation Journey Today
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Join thousands of founders who've already discovered their startup's true worth
            </p>
            
            <Button 
              size="lg" 
              onClick={onStartWizard}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-mono shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Launch Free Valuation
              <Rocket className="ml-3 w-6 h-6" />
            </Button>

            <div className="mt-8 text-slate-400 text-sm font-mono">
              No credit card required • Get results in minutes • Trusted by 10,000+ startups
            </div>
          </motion.div>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="border-t border-slate-800 py-16 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-mono text-white">
                  valuation.ai
                </span>
              </div>
              <p className="text-slate-400 text-sm font-mono max-w-md mb-6">
                The developer-first startup valuation platform.
                Built for the modern stack.
              </p>
              <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                <span>SOC2 Type II</span>
                <span>•</span>
                <span>GDPR Ready</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3 text-slate-400 text-sm font-mono">
                <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm font-mono">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm font-mono mb-4 md:mb-0">
              © 2024 valuation.ai • All rights reserved
            </div>
            <div className="flex items-center space-x-6 text-slate-500 text-sm font-mono">
              <span>Newsletter subscription</span>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
