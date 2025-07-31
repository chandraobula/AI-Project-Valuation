import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Brain,
  Link,
  CheckCircle,
  Loader2,
  ExternalLink,
  Globe,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  crunchbaseUrl: z
    .string()
    .url("Please enter a valid Crunchbase URL")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  skipExtras: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface Step4Props {
  onNext: (data: FormData) => void;
  onBack: () => void;
  initialData?: Partial<FormData>;
  onSave?: (data: Partial<FormData>) => void;
}

const urlFields = [
  {
    key: "websiteUrl",
    label: "Company Website",
    placeholder: "https://yourcompany.com",
    icon: Globe,
    color: "text-blue-400",
    description: "Your main company website"
  },
  {
    key: "linkedinUrl", 
    label: "LinkedIn Company Page",
    placeholder: "https://linkedin.com/company/yourcompany",
    icon: ExternalLink,
    color: "text-cyan-400",
    description: "LinkedIn company profile"
  },
  {
    key: "crunchbaseUrl",
    label: "Crunchbase Profile", 
    placeholder: "https://crunchbase.com/organization/yourcompany",
    icon: ExternalLink,
    color: "text-green-400",
    description: "Crunchbase company profile"
  }
];

export function Step4AIExtras({ onNext, onBack, initialData, onSave }: Step4Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinUrl: initialData?.linkedinUrl || "",
      crunchbaseUrl: initialData?.crunchbaseUrl || "",
      websiteUrl: initialData?.websiteUrl || "",
      skipExtras: initialData?.skipExtras || false,
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
  }, [watchedValues.linkedinUrl, watchedValues.crunchbaseUrl, watchedValues.websiteUrl, watchedValues.skipExtras, onSave]);

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onNext(data);
  };



  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information Header */}
          <Card className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Company Information</h3>
                  <p className="text-sm text-slate-300 font-mono">
                    Add your company links for enhanced analysis and more accurate valuations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* URLs Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Link className="w-5 h-5 text-cyan-400" />
                <label className="text-lg font-medium text-white font-mono">
                  Company Links
                </label>
              </div>

              <div className="space-y-6">
                {urlFields.map((field) => (
                  <div key={field.key}>
                    <div className="flex items-center space-x-3 mb-3">
                      <field.icon className={`w-4 h-4 ${field.color}`} />
                      <label className="text-sm font-medium text-white font-mono">
                        {field.label}
                      </label>
                      {watchedValues[field.key as keyof FormData] && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <input
                      {...register(field.key as keyof FormData)}
                      type="url"
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    />
                    <div className="mt-1 text-xs text-slate-400 font-mono">
                      {field.description}
                    </div>
                    {errors[field.key as keyof FormData] && (
                      <p className="text-red-400 text-sm mt-1 font-mono">
                        {errors[field.key as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skip Option */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  {...register("skipExtras")}
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <label className="text-sm font-medium text-white font-mono">
                    Skip company links for now
                  </label>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Generate valuation without additional company information.
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
              <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
              Back to Traction
            </Button>

            <Button
              type="submit"
              disabled={isAnalyzing}
              className={`px-8 py-3 rounded-lg font-medium transition-all font-mono ${
                isAnalyzing
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Valuation
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              )}
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

        {/* AI Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-cyan-900/30 border-blue-500/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white font-mono mb-2">
                        AI Analysis in Progress
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-300 font-mono">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing business data...</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
