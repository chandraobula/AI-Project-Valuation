import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { 
  ArrowRight, Sparkles, BarChart3, TrendingUp, Shield, Zap, Brain, Target, Check, Star, Users, Rocket, Calculator,
  ChevronDown, Play, Download, Terminal, Code, GitBranch, Database, Cpu, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LandingPageProps {
  onStartWizard: () => void;
}

export function LandingPage({ onStartWizard }: LandingPageProps) {
  const [commandText, setCommandText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullCommand = "> ai valuation generate --doc --method=comprehensive --output=pdf";
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);

  // Typing animation for command line
  useEffect(() => {
    if (commandText.length < fullCommand.length && isTyping) {
      const timeout = setTimeout(() => {
        setCommandText(fullCommand.slice(0, commandText.length + 1));
      }, 50 + Math.random() * 50);
      return () => clearTimeout(timeout);
    } else if (commandText.length === fullCommand.length) {
      setTimeout(() => {
        setCommandText("");
        setIsTyping(true);
      }, 3000);
    }
  }, [commandText, isTyping, fullCommand]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your startup data with institutional-grade precision",
      code: `const valuation = await ai.analyze({
  financials: data.metrics,
  market: data.sector,
  stage: data.phase
});`,
      glow: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: BarChart3,
      title: "Multi-Method Validation", 
      description: "Cross-validate using DCF, Comparables, VC Method, and Risk Factor approaches",
      code: `const methods = [
  'dcf', 'comparables', 
  'vc_method', 'risk_factor'
];
validate(methods);`,
      glow: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Benchmarking",
      description: "Compare against 10,000+ startups in our proprietary database",
      code: `benchmark.compare({
  industry: 'saas',
  stage: 'series_a',
  metrics: userMetrics
});`,
      glow: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with end-to-end encryption and zero-trust architecture",
      code: `security.encrypt({
  data: sensitive_data,
  level: 'enterprise',
  compliance: 'soc2'
});`,
      glow: "from-orange-500/20 to-red-500/20"
    }
  ];

  const metrics = [
    { value: "$2.4B+", label: "Total Valuations Generated", icon: DollarSign },
    { value: "15,000+", label: "Startups Analyzed", icon: Rocket },
    { value: "97%", label: "Investor Acceptance Rate", icon: TrendingUp },
    { value: "< 5min", label: "Average Generation Time", icon: Clock }
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
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">pricing</a>
            <a href="#docs" className="text-slate-400 hover:text-white transition-colors">docs</a>
          </div>

          <Button 
            onClick={onStartWizard}
            className="bg-white text-black hover:bg-slate-100 font-mono text-sm px-6"
          >
            launch_app()
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex items-center justify-center px-6 relative"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>

        {/* Floating Code Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono text-blue-400/30"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            >
              {['npm install', 'git commit', 'docker build', 'yarn dev', 'pip install', 'go run'][i]}
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-full text-sm font-mono text-blue-400">
                <Sparkles className="w-4 h-4 mr-2" />
                v2.0.0 • Now with real-time AI analysis
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Startup Valuation,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                Redefined.
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto font-mono leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Generate investor-grade valuations in minutes, not months.
              <br />
              Powered by AI that understands your business.
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
                start_valuation()
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg font-mono"
              >
                <Play className="mr-2 w-5 h-5" />
                watch_demo()
              </Button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: "$2.4B+", label: "valuations" },
                { value: "15k+", label: "startups" },
                { value: "97%", label: "accuracy" },
                { value: "<5min", label: "generation" }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-mono text-blue-400">
                    {metric.value}
                  </div>
                  <div className="text-sm text-slate-500 font-mono">
                    {metric.label}
                  </div>
                </div>
              ))}
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

      {/* Features Section with Code Previews */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Built for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-xl text-slate-400 font-mono max-w-2xl mx-auto">
              API-first platform with the tools you expect
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.glow} rounded-lg flex items-center justify-center border border-slate-700/50`}>
                          <feature.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 font-mono">
                            {feature.title}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Code Preview */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group-hover:border-blue-800/50 transition-all">
                      <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                        <code>{feature.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono text-white">
              Trusted by <span className="text-blue-400">builders</span>
            </h2>
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

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-mono">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Ship faster with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                confidence
              </span>
            </h2>
            
            <p className="text-xl text-slate-400 mb-12 font-mono">
              Join 15,000+ startups using valuation.ai
            </p>
            
            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={onStartWizard}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-mono shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all"
              >
                npm install @valuation/ai
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              
              <div className="text-slate-500 text-sm font-mono">
                Free tier • No credit card • Deploy in 30 seconds
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
                <span>ISO 27001</span>
                <span>•</span>
                <span>GDPR Ready</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-slate-400 text-sm font-mono">
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SDKs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webhooks</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3 text-slate-400 text-sm font-mono">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm font-mono mb-4 md:mb-0">
              © 2024 valuation.ai • All rights reserved
            </div>
            <div className="flex items-center space-x-6 text-slate-500 text-sm font-mono">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add missing import for DollarSign and Clock icons
import { DollarSign, Clock } from "lucide-react";
