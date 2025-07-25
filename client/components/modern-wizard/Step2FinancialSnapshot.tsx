import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Target,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  revenue: z.coerce.number().min(0, "Revenue must be 0 or greater").optional(),
  monthlyBurnRate: z.coerce
    .number()
    .min(0, "Burn rate must be 0 or greater")
    .optional(),
  netProfitLoss: z.coerce.number().optional(),
  fundingRaised: z.coerce
    .number()
    .min(0, "Funding raised must be 0 or greater")
    .optional(),
  planningToRaise: z.coerce
    .number()
    .min(0, "Amount to raise must be 0 or greater")
    .optional(),
  skipFinancials: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface Step2Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: Partial<FormData>) => void;
}

const tooltips = {
  revenue: "Your total income from all sources in the last 12 months. Include all revenue streams, subscriptions, one-time sales, etc.",
  monthlyBurnRate: "How much money you spend each month on average. Include salaries, rent, software, marketing, and all other expenses.",
  netProfitLoss: "Revenue minus expenses. Positive means profit, negative means loss. This helps us understand your current financial health.",
  fundingRaised: "Total amount of money you've raised from investors, grants, or loans since starting your business.",
  planningToRaise: "How much funding you're looking to raise in your next round. This helps tailor the valuation for your fundraising goals.",
};

export function Step2FinancialSnapshot({ onNext, onBack, initialData, onSave }: Step2Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      revenue: initialData?.revenue || undefined,
      monthlyBurnRate: initialData?.monthlyBurnRate || undefined,
      netProfitLoss: initialData?.netProfitLoss || undefined,
      fundingRaised: initialData?.fundingRaised || undefined,
      planningToRaise: initialData?.planningToRaise || undefined,
      skipFinancials: initialData?.skipFinancials || false,
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
  }, [watchedValues.revenue, watchedValues.monthlyBurnRate, watchedValues.netProfitLoss, watchedValues.fundingRaised, watchedValues.planningToRaise, watchedValues.skipFinancials, onSave]);

  const onSubmit = (data: FormData) => {
    onNext(data);
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const financialFields = [
    {
      key: "revenue",
      label: "Annual Revenue",
      placeholder: "0",
      icon: DollarSign,
      color: "text-green-400",
      description: "Last 12 months total revenue"
    },
    {
      key: "monthlyBurnRate", 
      label: "Monthly Burn Rate",
      placeholder: "0",
      icon: TrendingDown,
      color: "text-red-400",
      description: "Monthly expenses"
    },
    {
      key: "netProfitLoss",
      label: "Net Profit/Loss",
      placeholder: "0",
      icon: TrendingUp,
      color: "text-blue-400",
      description: "Annual profit or loss"
    },
    {
      key: "fundingRaised",
      label: "Funding Raised",
      placeholder: "0", 
      icon: Building,
      color: "text-purple-400",
      description: "Total funding to date"
    },
    {
      key: "planningToRaise",
      label: "Planning to Raise",
      placeholder: "0",
      icon: Target,
      color: "text-cyan-400", 
      description: "Next funding round target"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Privacy Toggle */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    {showValues ? <Eye className="w-5 h-5 text-blue-400" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div>
                    <div className="font-medium text-white font-mono">Privacy Mode</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {showValues ? "Values visible" : "Values hidden"}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowValues(!showValues)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 font-mono"
                >
                  {showValues ? "Hide" : "Show"} Values
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialFields.map((field) => (
              <Card key={field.key} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <field.icon className={`w-5 h-5 ${field.color}`} />
                      <label className="text-sm font-medium text-white font-mono">
                        {field.label}
                      </label>
                      {watchedValues[field.key as keyof FormData] !== undefined && watchedValues[field.key as keyof FormData] !== "" && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(field.key)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      {...register(field.key as keyof FormData)}
                      type="number"
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                      style={{
                        color: showValues ? 'white' : 'transparent',
                        textShadow: showValues ? 'none' : '0 0 8px rgba(255,255,255,0.8)',
                        caretColor: 'white'
                      }}
                    />
                  </div>

                  <div className="mt-2 text-xs text-slate-400 font-mono">
                    {field.description}
                  </div>

                  {showValues && watchedValues[field.key as keyof FormData] && (
                    <div className="mt-2 text-xs text-green-400 font-mono">
                      {formatCurrency(Number(watchedValues[field.key as keyof FormData]))}
                    </div>
                  )}

                  {errors[field.key as keyof FormData] && (
                    <p className="text-red-400 text-sm mt-2 font-mono">
                      {errors[field.key as keyof FormData]?.message}
                    </p>
                  )}

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltip === field.key && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl z-50 backdrop-blur-xl"
                      >
                        <p className="text-sm text-slate-200 font-mono">
                          {tooltips[field.key as keyof typeof tooltips]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skip Option */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  {...register("skipFinancials")}
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <label className="text-sm font-medium text-white font-mono">
                    Skip financial details for now
                  </label>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    You can add these later. We'll use industry averages for the initial valuation.
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
              <TrendingDown className="w-4 h-4 mr-2 rotate-90" />
              Back to Basics
            </Button>

            <Button
              type="submit"
              disabled={!isValid && !watchedValues.skipFinancials}
              className={`px-8 py-3 rounded-lg font-medium transition-all font-mono ${
                (isValid || watchedValues.skipFinancials)
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue to Market Traction
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
