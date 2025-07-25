import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ChevronDown,
  Search,
  CheckCircle,
  Building,
  Globe,
  Briefcase,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  country: z.string().min(1, "Please select your country"),
  industry: z.string().min(1, "Please select your industry"),
  stage: z.string().min(1, "Please select your business stage"),
  isLaunched: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface Step1Props {
  onNext: (data: FormData) => void;
  initialData?: Partial<FormData>;
  onSave?: (data: Partial<FormData>) => void;
}

const countries = [
  { code: "US", name: "United States", flag: "��🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

const industries = [
  { value: "saas", label: "SaaS/Software", icon: "💻" },
  { value: "ecommerce", label: "E-commerce", icon: "🛒" },
  { value: "fintech", label: "FinTech", icon: "💳" },
  { value: "healthtech", label: "HealthTech", icon: "🏥" },
  { value: "edtech", label: "EdTech", icon: "📚" },
  { value: "ai", label: "AI/ML", icon: "🤖" },
  { value: "biotech", label: "Biotech", icon: "🧬" },
  { value: "cleantech", label: "CleanTech", icon: "🌱" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "other", label: "Other", icon: "📦" },
];

const stages = [
  {
    value: "idea",
    label: "Idea Stage",
    description: "Concept validation phase",
    icon: "💡",
  },
  {
    value: "mvp",
    label: "MVP",
    description: "Building product",
    icon: "🔧",
  },
  {
    value: "launched",
    label: "Launched",
    description: "Product is live",
    icon: "🚀",
  },
  {
    value: "growth",
    label: "Growth",
    description: "Scaling phase",
    icon: "📈",
  },
];

export function Step1QuickStart({ onNext, initialData, onSave }: Step1Props) {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCountryDropdown) {
        const target = event.target as Element;
        if (!target.closest('.country-dropdown-container')) {
          setShowCountryDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCountryDropdown]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: initialData?.businessName || "",
      country: initialData?.country || "",
      industry: initialData?.industry || "",
      stage: initialData?.stage || "",
      isLaunched: initialData?.isLaunched || false,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Autosave functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSave) {
        onSave(watchedValues);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedValues.businessName, watchedValues.country, watchedValues.industry, watchedValues.stage, watchedValues.isLaunched, onSave]);

  const selectedCountry = countries.find(
    (c) => c.name === watchedValues.country,
  );
  const selectedIndustry = industries.find(
    (i) => i.value === watchedValues.industry,
  );
  const selectedStage = stages.find((s) => s.value === watchedValues.stage);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const onSubmit = (data: FormData) => {
    onNext(data);
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setValue("country", country.name, { shouldValidate: true });
    setShowCountryDropdown(false);
    setCountrySearch("");
  };

  const handleIndustrySelect = (industry: (typeof industries)[0]) => {
    setValue("industry", industry.value, { shouldValidate: true });
  };

  const handleStageSelect = (stage: (typeof stages)[0]) => {
    setValue("stage", stage.value, { shouldValidate: true });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Name & Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Building className="w-5 h-5 text-blue-400" />
                  <label className="text-sm font-medium text-white font-mono">
                    Business Name
                  </label>
                  {watchedValues.businessName && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <input
                  {...register("businessName")}
                  placeholder="e.g., TechCorp Solutions"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
                {errors.businessName && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    {errors.businessName.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Country */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm relative">
              <CardContent className="p-6 relative">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <label className="text-sm font-medium text-white font-mono">
                    Country
                  </label>
                  {watchedValues.country && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all flex items-center justify-between font-mono"
                >
                  <div className="flex items-center space-x-3">
                    {selectedCountry ? (
                      <>
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">Select country</span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                <AnimatePresence>
                  {showCountryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl z-[99999] max-h-64 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-3 border-b border-slate-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-800/50 transition-colors text-left font-mono"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-white">{country.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.country && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    {errors.country.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Industry Selection */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <label className="text-sm font-medium text-white font-mono">
                  Industry
                </label>
                {watchedValues.industry && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {industries.map((industry) => {
                  const isSelected = selectedIndustry?.value === industry.value;
                  
                  return (
                    <motion.button
                      key={industry.value}
                      type="button"
                      onClick={() => handleIndustrySelect(industry)}
                      className={`p-3 rounded-lg border transition-all text-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-1">{industry.icon}</div>
                      <div className="text-xs font-mono">{industry.label}</div>
                    </motion.button>
                  );
                })}
              </div>
              {errors.industry && (
                <p className="text-red-400 text-sm mt-2 font-mono">
                  {errors.industry.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stage & Launch Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Stage */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-5 h-5 text-blue-400" />
                  <label className="text-sm font-medium text-white font-mono">
                    Business Stage
                  </label>
                  {watchedValues.stage && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="space-y-2">
                  {stages.map((stage) => {
                    const isSelected = selectedStage?.value === stage.value;
                    
                    return (
                      <motion.button
                        key={stage.value}
                        type="button"
                        onClick={() => handleStageSelect(stage)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{stage.icon}</span>
                          <div>
                            <div className="font-medium font-mono">{stage.label}</div>
                            <div className="text-xs text-slate-400 font-mono">{stage.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.stage && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    {errors.stage.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Product Launch Status */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <label className="text-sm font-medium text-white font-mono">
                    Product Status
                  </label>
                  {watchedValues.isLaunched !== undefined && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="space-y-3">
                  <motion.button
                    type="button"
                    onClick={() => setValue("isLaunched", false, { shouldValidate: true })}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      watchedValues.isLaunched === false
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔧</span>
                      <div>
                        <div className="font-medium font-mono">Pre-Launch</div>
                        <div className="text-xs text-slate-400 font-mono">Still building</div>
                      </div>
                    </div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setValue("isLaunched", true, { shouldValidate: true })}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      watchedValues.isLaunched === true
                        ? 'border-green-500 bg-green-500/20 text-white'
                        : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚀</span>
                      <div>
                        <div className="font-medium font-mono">Launched</div>
                        <div className="text-xs text-slate-400 font-mono">Live product</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={!isValid}
              className={`px-8 py-3 rounded-lg font-medium transition-all font-mono ${
                isValid
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue to Financial Data
              <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
            </Button>
          </div>

          {/* Auto-save indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800/50 rounded-full text-xs text-slate-400 font-mono">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Auto-saved</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
