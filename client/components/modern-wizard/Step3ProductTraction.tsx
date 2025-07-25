import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  Calendar,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  customerCount: z.coerce
    .number()
    .min(0, "Customer count must be 0 or greater")
    .optional(),
  growthRate: z.coerce
    .number()
    .min(0, "Growth rate must be 0 or greater")
    .optional(),
  growthPeriod: z.string().optional(),
  uniqueValue: z.string().optional(),
  competitors: z.string().optional(),
  skipTraction: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface Step3Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: Partial<FormData>) => void;
}

const growthPeriods = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Month-over-month growth",
    icon: "📈"
  },
  {
    value: "quarterly",
    label: "Quarterly", 
    description: "Quarter-over-quarter growth",
    icon: "📊"
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Year-over-year growth",
    icon: "📋"
  },
];

const competitiveAdvantages = [
  {
    value: "technology",
    label: "Technology Edge",
    description: "Superior tech or proprietary algorithms",
    icon: "⚡"
  },
  {
    value: "network",
    label: "Network Effects",
    description: "Product gets better with more users",
    icon: "🌐"
  },
  {
    value: "brand",
    label: "Brand Recognition",
    description: "Strong brand and customer loyalty",
    icon: "🏆"
  },
  {
    value: "data",
    label: "Data Advantage",
    description: "Unique data sources or insights",
    icon: "🧠"
  },
  {
    value: "cost",
    label: "Cost Leadership",
    description: "Lower costs than competitors",
    icon: "💰"
  },
  {
    value: "speed",
    label: "Speed to Market",
    description: "First mover or fast execution",
    icon: "🚀"
  }
];

export function Step3ProductTraction({ onNext, onBack, initialData, onSave }: Step3Props) {
  const [showGrowthPeriodDropdown, setShowGrowthPeriodDropdown] = useState(false);
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerCount: initialData?.customerCount || undefined,
      growthRate: initialData?.growthRate || undefined,
      growthPeriod: initialData?.growthPeriod || "",
      uniqueValue: initialData?.uniqueValue || "",
      competitors: initialData?.competitors || "",
      skipTraction: initialData?.skipTraction || false,
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
  }, [watchedValues.customerCount, watchedValues.growthRate, watchedValues.growthPeriod, watchedValues.uniqueValue, watchedValues.competitors, watchedValues.skipTraction, onSave]);

  const selectedGrowthPeriod = growthPeriods.find(
    (period) => period.value === watchedValues.growthPeriod,
  );

  const onSubmit = (data: FormData) => {
    onNext({
      ...data,
      uniqueValue: selectedAdvantages.join(", ") || data.uniqueValue
    });
  };

  const handleGrowthPeriodSelect = (period: typeof growthPeriods[0]) => {
    setValue("growthPeriod", period.value, { shouldValidate: true });
    setShowGrowthPeriodDropdown(false);
  };

  const toggleAdvantage = (advantageValue: string) => {
    setSelectedAdvantages(prev => 
      prev.includes(advantageValue)
        ? prev.filter(a => a !== advantageValue)
        : [...prev, advantageValue]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Count */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <label className="text-sm font-medium text-white font-mono">
                    Total Customers
                  </label>
                  {watchedValues.customerCount !== undefined && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <input
                  {...register("customerCount")}
                  type="number"
                  placeholder="e.g., 1500"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
                <div className="mt-2 text-xs text-slate-400 font-mono">
                  Total number of paying customers or active users
                </div>
                {errors.customerCount && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    {errors.customerCount.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Growth Rate */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <label className="text-sm font-medium text-white font-mono">
                    Growth Rate %
                  </label>
                  {watchedValues.growthRate !== undefined && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex space-x-3">
                  <input
                    {...register("growthRate")}
                    type="number"
                    placeholder="e.g., 15"
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                  <span className="flex items-center px-3 text-slate-400 font-mono">%</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono">
                  Customer or revenue growth percentage
                </div>
                {errors.growthRate && (
                  <p className="text-red-400 text-sm mt-2 font-mono">
                    {errors.growthRate.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Growth Period */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 relative">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <label className="text-sm font-medium text-white font-mono">
                  Growth Period
                </label>
                {watchedValues.growthPeriod && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setShowGrowthPeriodDropdown(!showGrowthPeriodDropdown)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all flex items-center justify-between font-mono"
              >
                <div className="flex items-center space-x-3">
                  {selectedGrowthPeriod ? (
                    <>
                      <span className="text-lg">{selectedGrowthPeriod.icon}</span>
                      <span>{selectedGrowthPeriod.label}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">Select growth period</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {showGrowthPeriodDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl z-[99999] backdrop-blur-xl"
                  >
                    {growthPeriods.map((period) => (
                      <button
                        key={period.value}
                        type="button"
                        onClick={() => handleGrowthPeriodSelect(period)}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left font-mono border-b border-slate-700 last:border-b-0"
                      >
                        <span className="text-lg">{period.icon}</span>
                        <div>
                          <div className="text-white">{period.label}</div>
                          <div className="text-xs text-slate-400">{period.description}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 text-xs text-slate-400 font-mono">
                Time period for your growth rate measurement
              </div>
            </CardContent>
          </Card>

          {/* Competitive Advantages */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <label className="text-sm font-medium text-white font-mono">
                  Competitive Advantages
                </label>
                {selectedAdvantages.length > 0 && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {competitiveAdvantages.map((advantage) => {
                  const isSelected = selectedAdvantages.includes(advantage.value);
                  
                  return (
                    <motion.button
                      key={advantage.value}
                      type="button"
                      onClick={() => toggleAdvantage(advantage.value)}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{advantage.icon}</span>
                        <div>
                          <div className="font-medium font-mono text-sm">{advantage.label}</div>
                          <div className="text-xs text-slate-400 font-mono mt-1">{advantage.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Select all that apply to your business
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-red-400" />
                <label className="text-sm font-medium text-white font-mono">
                  Main Competitors
                </label>
                {watchedValues.competitors && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              <textarea
                {...register("competitors")}
                placeholder="e.g., Slack, Microsoft Teams, Discord"
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono resize-none"
              />
              <div className="mt-2 text-xs text-slate-400 font-mono">
                List your top 3-5 competitors or alternatives
              </div>
            </CardContent>
          </Card>

          {/* Skip Option */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  {...register("skipTraction")}
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <label className="text-sm font-medium text-white font-mono">
                    Skip traction details for now
                  </label>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    We'll estimate based on your business stage and industry benchmarks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-mono"
            >
              <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
              Back to Finances
            </Button>

            <Button
              type="submit"
              disabled={!isValid && !watchedValues.skipTraction}
              className={`px-8 py-3 rounded-lg font-medium transition-all font-mono ${
                (isValid || watchedValues.skipTraction)
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue to AI Analysis
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
