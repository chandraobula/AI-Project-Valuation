import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ChevronDown,
  Search,
  CheckCircle,
  Sparkles,
  Star,
  Heart
} from "lucide-react";

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
  { code: "US", name: "United States", flag: "🇺🇸" },
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
  { value: "saas", label: "SaaS/Software", icon: "💻", color: "from-blue-400 to-blue-500" },
  { value: "ecommerce", label: "E-commerce", icon: "🛒", color: "from-green-400 to-green-500" },
  { value: "fintech", label: "FinTech", icon: "💳", color: "from-yellow-400 to-yellow-500" },
  { value: "healthtech", label: "HealthTech", icon: "🏥", color: "from-red-400 to-red-500" },
  { value: "edtech", label: "EdTech", icon: "📚", color: "from-purple-400 to-purple-500" },
  { value: "ai", label: "AI/Machine Learning", icon: "🤖", color: "from-cyan-400 to-cyan-500" },
  { value: "biotech", label: "Biotech", icon: "🧬", color: "from-pink-400 to-pink-500" },
  { value: "cleantech", label: "CleanTech", icon: "🌱", color: "from-emerald-400 to-emerald-500" },
  { value: "gaming", label: "Gaming", icon: "🎮", color: "from-indigo-400 to-indigo-500" },
  { value: "other", label: "Other", icon: "📦", color: "from-gray-400 to-gray-500" },
];

const stages = [
  {
    value: "idea",
    label: "Idea Stage",
    description: "Concept stage, validating the idea",
    icon: "💡",
    color: "from-yellow-400 to-orange-400",
  },
  {
    value: "mvp",
    label: "MVP Stage",
    description: "Building minimum viable product",
    icon: "🔧",
    color: "from-blue-400 to-indigo-400",
  },
  {
    value: "launched",
    label: "Launched",
    description: "Product is live, getting traction",
    icon: "🚀",
    color: "from-green-400 to-emerald-400",
  },
  {
    value: "growth",
    label: "Growth Stage",
    description: "Scaling and expanding",
    icon: "📈",
    color: "from-purple-400 to-pink-400",
  },
];

export function Step1QuickStart({ onNext, initialData, onSave }: Step1Props) {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [completedFields, setCompletedFields] = useState<string[]>([]);

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

  // Track completed fields for celebration
  useEffect(() => {
    const fields = [];
    if (watchedValues.businessName) fields.push('businessName');
    if (watchedValues.country) fields.push('country');
    if (watchedValues.industry) fields.push('industry');
    if (watchedValues.stage) fields.push('stage');
    if (watchedValues.isLaunched !== undefined) fields.push('isLaunched');

    // Only update if the fields actually changed
    setCompletedFields(prev => {
      if (prev.length !== fields.length || !fields.every(field => prev.includes(field))) {
        return fields;
      }
      return prev;
    });
  }, [watchedValues.businessName, watchedValues.country, watchedValues.industry, watchedValues.stage, watchedValues.isLaunched]);

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
    setShowIndustryDropdown(false);
  };

  const handleStageSelect = (stage: (typeof stages)[0]) => {
    setValue("stage", stage.value, { shouldValidate: true });
    setShowStageDropdown(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Header with animated elements */}
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 p-8 text-center relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-20"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
              >
                {['🌟', '✨', '💫', '🎉'][i % 4]}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <div className="text-6xl mb-4">🎂</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Let's Bake Your Perfect Valuation!
            </h1>
            <p className="text-slate-600 text-lg">
              Time to gather the essential ingredients for your startup recipe
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Business Name - Mixing Bowl */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🥣</span>
              <label className="text-lg font-semibold text-slate-800">
                What's your business name?
              </label>
              {completedFields.includes('businessName') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
            <motion.input
              {...register("businessName")}
              placeholder="e.g., CakeTech Solutions"
              className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-2xl text-lg placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.businessName && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm ml-2"
              >
                {errors.businessName.message}
              </motion.p>
            )}
          </motion.div>

          {/* Country Selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 relative"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <label className="text-lg font-semibold text-slate-800">
                Where's your kitchen located?
              </label>
              {completedFields.includes('country') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
            <motion.button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl text-lg focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all flex items-center justify-between"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-3">
                {selectedCountry ? (
                  <>
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="text-slate-800">{selectedCountry.name}</span>
                  </>
                ) : (
                  <span className="text-slate-400">Select your country</span>
                )}
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <motion.button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-slate-800">{country.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.country && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm ml-2"
              >
                {errors.country.message}
              </motion.p>
            )}
          </motion.div>

          {/* Industry Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🧁</span>
              <label className="text-lg font-semibold text-slate-800">
                What flavor is your business?
              </label>
              {completedFields.includes('industry') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {industries.map((industry) => {
                const isSelected = selectedIndustry?.value === industry.value;
                const isHovered = hoveredIndustry === industry.value;
                
                return (
                  <motion.button
                    key={industry.value}
                    type="button"
                    onClick={() => handleIndustrySelect(industry)}
                    onMouseEnter={() => setHoveredIndustry(industry.value)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 scale-105'
                        : 'border-slate-200 bg-white/60 hover:border-purple-300 hover:bg-white/80'
                    }`}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{industry.icon}</div>
                      <div className="text-sm font-medium text-slate-800">{industry.label}</div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-200/20 to-pink-200/20 pointer-events-none"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            {errors.industry && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm ml-2"
              >
                {errors.industry.message}
              </motion.p>
            )}
          </motion.div>

          {/* Stage Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎂</span>
              <label className="text-lg font-semibold text-slate-800">
                How well-baked is your startup?
              </label>
              {completedFields.includes('stage') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stages.map((stage) => {
                const isSelected = selectedStage?.value === stage.value;
                const isHovered = hoveredStage === stage.value;
                
                return (
                  <motion.button
                    key={stage.value}
                    type="button"
                    onClick={() => handleStageSelect(stage)}
                    onMouseEnter={() => setHoveredStage(stage.value)}
                    onMouseLeave={() => setHoveredStage(null)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 scale-105'
                        : 'border-slate-200 bg-white/60 hover:border-blue-300 hover:bg-white/80'
                    }`}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{stage.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 mb-1">{stage.label}</div>
                        <div className="text-sm text-slate-600">{stage.description}</div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-200/20 to-cyan-200/20 pointer-events-none"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            {errors.stage && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm ml-2"
              >
                {errors.stage.message}
              </motion.p>
            )}
          </motion.div>

          {/* Product Launched Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚀</span>
              <label className="text-lg font-semibold text-slate-800">
                Is your creation ready for the world?
              </label>
              {completedFields.includes('isLaunched') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={() => setValue("isLaunched", false, { shouldValidate: true })}
                className={`flex-1 flex items-center justify-center space-x-3 p-6 rounded-2xl border-2 transition-all ${
                  watchedValues.isLaunched === false
                    ? "border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 scale-105"
                    : "border-slate-200 bg-white/60 hover:border-orange-300"
                }`}
                whileHover={{ y: -3, scale: watchedValues.isLaunched !== false ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">🥧</span>
                <div className="text-center">
                  <div className="font-semibold text-slate-800">Still Baking</div>
                  <div className="text-sm text-slate-600">Not launched yet</div>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setValue("isLaunched", true, { shouldValidate: true })}
                className={`flex-1 flex items-center justify-center space-x-3 p-6 rounded-2xl border-2 transition-all ${
                  watchedValues.isLaunched === true
                    ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 scale-105"
                    : "border-slate-200 bg-white/60 hover:border-green-300"
                }`}
                whileHover={{ y: -3, scale: watchedValues.isLaunched !== true ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">🎂</span>
                <div className="text-center">
                  <div className="font-semibold text-slate-800">Fresh from Oven</div>
                  <div className="text-sm text-slate-600">Already launched</div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Next Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-6"
          >
            <motion.button
              type="submit"
              disabled={!isValid}
              className={`w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all relative overflow-hidden ${
                isValid
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-xl hover:shadow-2xl"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
              whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
            >
              {isValid && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Let's Add More Ingredients!</span>
                <Sparkles className="w-6 h-6" />
              </span>
            </motion.button>
          </motion.div>

          {/* Auto-save indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full text-sm text-slate-600">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Recipe auto-saved with love</span>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
