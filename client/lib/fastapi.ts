import axios from "axios";

// FastAPI backend URL configuration
const getBackendURL = () => {
  // Always use local FastAPI backend for development integration
  return "http://127.0.0.1:8000";
};

const FASTAPI_BASE_URL = getBackendURL();

const api = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 0, // No timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("FastAPI Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("FastAPI Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("FastAPI Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);

export interface WizardData {
  step1?: {
    businessName: string;
    country: string;
    industry: string;
    stage: string;
    isLaunched: boolean;
  };
  step2?: {
    revenue?: number;
    monthlyBurnRate?: number;
    netProfitLoss?: number;
    fundingRaised?: number;
    planningToRaise?: number;
    skipFinancials?: boolean;
  };
  step3?: {
    customerCount?: number;
    growthRate?: number;
    growthPeriod?: string;
    uniqueValue?: string;
    competitors?: string;
    skipTraction?: boolean;
  };
  step4?: {
    linkedinUrl?: string;
    crunchbaseUrl?: string;
    websiteUrl?: string;
    uploadedFiles?: any[];
    skipExtras?: boolean;
  };
}

export interface ValuationReport {
  businessSummary: {
    summary: string;
    stageAssessment: string;
    keyStrengths?: string[];
    weaknessesOrRisks?: string[];
  };
  recommendedMethods: {
    recommendedMethods: Array<{
      method: string;
      confidence: number;
      reason: string;
    }>;
  };
  calculations: Array<{
    method: string;
    valuationRange: {
      lower: number;
      upper: number;
    };
    explanation: string;
    calculation: string;
    narrative: string;
  }>;
  competitorAnalysis?: {
    competitors?: string[];
    competitorBenchmarks?: any[];
    commentary?: string;
  };
  strategicContext?: string;
  finalValuation: {
    finalRange: {
      lower: number;
      upper: number;
    };
    methodComparisons?: string;
    justification?: string;
    recommendations?: string[];
  };
}

// Transform wizard data to the new API format
function transformWizardDataToNewAPI(wizardData: WizardData): any {
  const stageMappings: { [key: string]: string } = {
    "idea": "Idea",
    "mvp": "MVP",
    "launched": "Launched",
    "growth": "Growth"
  };

  const industryMappings: { [key: string]: string } = {
    "saas": "SaaS",
    "ecommerce": "E-commerce",
    "fintech": "Fintech/SaaS",
    "healthtech": "HealthTech",
    "edtech": "EdTech",
    "ai": "AI/ML",
    "biotech": "Biotech",
    "cleantech": "CleanTech",
    "gaming": "Gaming",
    "other": "Other"
  };

  const payload: any = {
    name: wizardData.step1?.businessName || "Unknown Company",
    country: wizardData.step1?.country || "United States",
    industry: industryMappings[wizardData.step1?.industry || "other"] || "Other",
    stage: stageMappings[wizardData.step1?.stage || "idea"] || "Idea",
    productLaunched: wizardData.step1?.isLaunched || false,
  };

  // Financial data (convert to thousands for API)
  if (wizardData.step2 && !wizardData.step2.skipFinancials) {
    payload.revenue12m = Math.round((wizardData.step2.revenue || 0) / 1000); // Convert to thousands
    payload.burnRate = Math.round((wizardData.step2.monthlyBurnRate || 0) / 1000); // Convert to thousands
    payload.netProfit = Math.round((wizardData.step2.netProfitLoss || 0) / 1000); // Convert to thousands
    payload.fundingRaised = Math.round((wizardData.step2.fundingRaised || 0) / 1000); // Convert to thousands
    payload.amountToRaise = Math.round((wizardData.step2.planningToRaise || 0) / 1000); // Convert to thousands
  } else {
    payload.revenue12m = 0;
    payload.burnRate = 0;
    payload.netProfit = 0;
    payload.fundingRaised = 0;
    payload.amountToRaise = 0;
  }

  return payload;
}

// Legacy transform function (kept for compatibility)
function transformWizardDataToBackend(wizardData: WizardData): any {
  const payload: any = {
    // Basic company information
    companyName: wizardData.step1?.businessName || "Unknown Company",
    country: wizardData.step1?.country || "Unknown",
    industry: wizardData.step1?.industry || "other",
    stage: wizardData.step1?.stage || "idea",
    isLaunched: wizardData.step1?.isLaunched || false,
  };

  // Financial data
  if (wizardData.step2 && !wizardData.step2.skipFinancials) {
    payload.revenue = wizardData.step2.revenue || 0;
    payload.monthlyBurnRate = wizardData.step2.monthlyBurnRate || 0;
    payload.netProfitLoss = wizardData.step2.netProfitLoss || 0;
    payload.fundingRaised = wizardData.step2.fundingRaised || 0;
    payload.planningToRaise = wizardData.step2.planningToRaise || 0;
  }

  // Traction data
  if (wizardData.step3 && !wizardData.step3.skipTraction) {
    payload.customerCount = wizardData.step3.customerCount || 0;
    payload.growthRate = wizardData.step3.growthRate || 0;
    payload.growthPeriod = wizardData.step3.growthPeriod || "monthly";
    payload.uniqueValue = wizardData.step3.uniqueValue || "";
    payload.competitors = wizardData.step3.competitors || "";
  }

  // Additional data
  if (wizardData.step4 && !wizardData.step4.skipExtras) {
    payload.linkedinUrl = wizardData.step4.linkedinUrl || "";
    payload.crunchbaseUrl = wizardData.step4.crunchbaseUrl || "";
    payload.websiteUrl = wizardData.step4.websiteUrl || "";
    payload.uploadedFiles = wizardData.step4.uploadedFiles || [];
  }

  return payload;
}

// Transform API response to our ValuationReport format
function transformAPIResponseToValuationReport(apiResponse: any, wizardData: WizardData): ValuationReport {
  // If the response already matches our expected format, return it directly
  if (apiResponse.businessSummary && apiResponse.recommendedMethods && apiResponse.calculations) {
    // Parse strategic context if it's a JSON string
    let strategicContext = apiResponse.strategicContext;
    if (typeof strategicContext === 'string' && (strategicContext.includes('strategicValuationContext') || strategicContext.includes('strategicContext'))) {
      try {
        const parsed = JSON.parse(strategicContext);

        // Handle new format with strategicContext object containing paragraph1, paragraph2, etc.
        if (parsed.strategicContext && typeof parsed.strategicContext === 'object') {
          const paragraphs = Object.keys(parsed.strategicContext)
            .filter(key => key.startsWith('paragraph'))
            .sort()
            .map(key => parsed.strategicContext[key]);
          strategicContext = paragraphs.join('\n\n');
        }
        // Handle legacy format
        else if (parsed.strategicValuationContext) {
          strategicContext = parsed.strategicValuationContext
            .map((item: any) => item.paragraph)
            .join('\n\n');
        }
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    // Fix finalValuation.finalRange if it's a string
    let finalValuation = apiResponse.finalValuation;
    if (finalValuation && typeof finalValuation.finalRange === 'string') {
      // Extract numbers from string like "$120M–$160M"
      const rangeMatch = finalValuation.finalRange.match(/\$(\d+(?:\.\d+)?)([KMB])?[–-]\$(\d+(?:\.\d+)?)([KMB])?/);
      if (rangeMatch) {
        const [, lowerNum, lowerUnit, upperNum, upperUnit] = rangeMatch;
        const multipliers: { [key: string]: number } = { K: 1000, M: 1000000, B: 1000000000 };

        const lower = parseFloat(lowerNum) * (multipliers[lowerUnit] || 1000); // Default to thousands
        const upper = parseFloat(upperNum) * (multipliers[upperUnit] || 1000); // Default to thousands

        finalValuation = {
          ...finalValuation,
          finalRange: {
            lower: lower / 1000000, // Convert to millions for consistency
            upper: upper / 1000000   // Convert to millions for consistency
          }
        };
      } else {
        // Fallback: use calculation ranges if finalRange parsing fails
        if (apiResponse.calculations && apiResponse.calculations.length > 0) {
          const ranges = apiResponse.calculations.map((calc: any) => calc.valuationRange);
          const lower = Math.min(...ranges.map((r: any) => r.lower));
          const upper = Math.max(...ranges.map((r: any) => r.upper));
          finalValuation = {
            ...finalValuation,
            finalRange: { lower, upper }
          };
        }
      }
    }

    return {
      ...apiResponse,
      strategicContext: strategicContext || apiResponse.strategicContext,
      finalValuation
    };
  }

  // Fallback transformation for legacy format
  const businessName = wizardData.step1?.businessName || "Your Company";

  // Handle different response formats
  let reportData = apiResponse;
  if (apiResponse.additionalProp1) {
    reportData = apiResponse.additionalProp1;
  }

  return {
    businessSummary: {
      summary: `${businessName} is a ${reportData.industry || 'technology'} startup in the ${reportData.stage || 'growth'} stage. Based on the provided data, the company shows promising potential in its market segment.`,
      stageAssessment: reportData.stage || "Growth",
      keyStrengths: [
        "Strong market positioning",
        "Solid revenue foundation",
        "Clear growth trajectory",
        "Experienced leadership team"
      ],
      weaknessesOrRisks: [
        "Market competition",
        "Scaling challenges",
        "Customer acquisition costs"
      ],
    },
    recommendedMethods: {
      recommendedMethods: [
        {
          method: "Revenue Multiple",
          confidence: 0.85,
          reason: `Strong revenue of $${reportData.revenue12m || 0}K provides solid basis`,
        },
        {
          method: "Market Comparable",
          confidence: 0.78,
          reason: `Good comparable companies exist in ${reportData.industry}`,
        },
        {
          method: "Growth Analysis",
          confidence: 0.72,
          reason: `${reportData.growthRate || 0}% growth rate indicates strong momentum`,
        },
      ],
    },
    calculations: [
      {
        method: "Revenue Multiple Analysis",
        valuationRange: {
          lower: Math.max(5, Math.round((reportData.revenue12m || 0) * 0.003)),
          upper: Math.max(8, Math.round((reportData.revenue12m || 0) * 0.005))
        },
        explanation: `Based on industry revenue multiples for ${reportData.industry} companies`,
        calculation: `Annual Revenue ($${reportData.revenue12m || 0}K) × Industry Multiple (3-5x) × Growth Factor`,
        narrative: "This method values the company based on revenue multiples from comparable companies in the same industry and stage.",
      },
    ],
    competitorAnalysis: {
      competitors: ["Industry Leader 1", "Industry Leader 2", "Emerging Competitor"],
      competitorBenchmarks: [],
      commentary: `The competitive landscape in ${reportData.industry} shows healthy market dynamics with room for multiple players. ${businessName} has positioned itself well with ${reportData.differentiator || 'strong differentiation'}.`,
    },
    strategicContext: `${businessName} operates in the ${reportData.industry} sector. The company has raised $${reportData.fundingRaised || 0}K to date and is positioned for continued growth in this expanding market.`,
    finalValuation: {
      finalRange: {
        lower: Math.max(4, Math.round(((reportData.revenue12m || 0) * 0.0035))),
        upper: Math.max(7, Math.round(((reportData.revenue12m || 0) * 0.0055)))
      },
      methodComparisons: "Revenue multiple and customer value methods show convergent ranges indicating consistent valuation",
      justification: `Valuation reflects current metrics including $${reportData.revenue12m || 0}K revenue`,
      recommendations: [
        "Continue focus on customer acquisition and retention",
        "Optimize unit economics and reduce burn rate",
        "Build strategic partnerships to accelerate growth",
        "Prepare detailed metrics for investor presentations",
        "Consider expanding to adjacent markets"
      ],
    },
  };
}

// Demo data fallback
const generateDemoReport = (wizardData: WizardData): ValuationReport => {
  const businessName = wizardData.step1?.businessName || "Demo Company";
  const industry = wizardData.step1?.industry || "saas";

  return {
    businessSummary: {
      summary: `${businessName} is a ${industry} startup with promising market potential. The company demonstrates strong fundamentals and is positioned well within its industry sector.`,
      stageAssessment: "Growth",
      keyStrengths: [
        "Strong market opportunity",
        "Experienced founding team",
        "Clear value proposition",
        "Scalable business model",
      ],
      weaknessesOrRisks: [
        "Competitive market landscape",
        "Customer acquisition costs",
        "Market timing considerations",
      ],
    },
    recommendedMethods: {
      recommendedMethods: [
        {
          method: "Revenue Multiple",
          confidence: 0.85,
          reason: "Strong revenue metrics available",
        },
        {
          method: "DCF Analysis",
          confidence: 0.78,
          reason: "Predictable cash flow patterns",
        },
        {
          method: "Market Comparable",
          confidence: 0.72,
          reason: "Good comparable companies exist",
        },
      ],
    },
    calculations: [
      {
        method: "Revenue Multiple",
        valuationRange: { lower: 8, upper: 12 },
        explanation:
          "Based on industry revenue multiples and growth projections",
        calculation:
          "Annual Revenue × Industry Multiple (4-6x) × Growth Factor (2x)",
        narrative:
          "This method values the company based on revenue multiples from comparable companies.",
      },
      {
        method: "DCF Analysis",
        valuationRange: { lower: 10, upper: 15 },
        explanation: "Discounted cash flow analysis over 5-year period",
        calculation: "NPV of projected cash flows with 12% discount rate",
        narrative:
          "DCF provides intrinsic value based on projected cash generation capability.",
      },
    ],
    competitorAnalysis: {
      competitors: ["CompetitorA", "CompetitorB", "CompetitorC"],
      competitorBenchmarks: [],
      commentary:
        "The competitive landscape shows healthy market dynamics with room for multiple players.",
    },
    strategicContext:
      "This valuation reflects strong growth potential in a expanding market. The company is well-positioned to capture market share and scale operations effectively.",
    finalValuation: {
      finalRange: { lower: 9, upper: 14 },
      methodComparisons:
        "Revenue multiple and DCF methods show convergent ranges",
      justification:
        "Valuation reflects current metrics with growth potential upside",
      recommendations: [
        "Focus on customer acquisition efficiency",
        "Strengthen unit economics",
        "Build strategic partnerships",
        "Prepare for next funding round",
      ],
    },
  };
};

let currentBackendUrl = FASTAPI_BASE_URL;

export const fastapiService = {
  setBackendUrl(url: string) {
    currentBackendUrl = url;
    api.defaults.baseURL = url === "demo" ? "" : url;
  },

  async generateValuationReport(
    wizardData: WizardData,
  ): Promise<ValuationReport> {
    // Demo mode
    if (currentBackendUrl === "demo") {
      console.log("Using demo mode - generating mock report");
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return generateDemoReport(wizardData);
    }

    try {
      const payload = transformWizardDataToBackend(wizardData);
      console.log("Sending payload to FastAPI:", payload);

      const response = await api.post<ValuationReport>(
        "/valuation-report",
        payload,
      );
      return response.data;
    } catch (error: any) {
      console.error("FastAPI valuation error:", error);

      // Enhanced error handling with CORS-specific messages
      if (
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to backend server. This might be due to CORS restrictions when connecting from a cloud deployment to localhost. Try using Demo Mode instead.",
        );
      } else if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Backend server is not running. Please start your FastAPI server or use Demo Mode.",
        );
      } else if (error.response?.status === 500) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "object" && detail.error) {
          throw new Error(`AI Analysis Error: ${detail.error}`);
        }
        throw new Error("Internal server error occurred during analysis.");
      } else if (error.response?.status === 422) {
        throw new Error("Invalid data format sent to backend.");
      } else if (error.message?.includes("timeout")) {
        throw new Error(
          "Analysis is taking longer than expected. Please try again.",
        );
      }

      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to generate valuation report",
      );
    }
  },

  async generateValuationReportNew(
    wizardData: WizardData,
  ): Promise<ValuationReport> {
    try {
      const payload = transformWizardDataToNewAPI(wizardData);
      console.log("Sending payload to new API:", payload);

      // Create axios instance for external API
      const externalApi = axios.create({
        timeout: 60000, // 60 second timeout
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok warning page
        },
      });

      const response = await externalApi.post(
        "https://e3c8babef5b7.ngrok-free.app/valuation-report",
        payload,
      );

      // Transform response to our expected format
      const apiResponse = response.data;
      return transformAPIResponseToValuationReport(apiResponse, wizardData);
    } catch (error: any) {
      console.error("New API valuation error:", error);

      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        throw new Error("Cannot connect to valuation API. Please check your internet connection.");
      } else if (error.response?.status === 500) {
        throw new Error("Valuation API server error. Please try again later.");
      } else if (error.response?.status === 422) {
        throw new Error("Invalid data format sent to valuation API.");
      } else if (error.message?.includes("timeout")) {
        throw new Error("Valuation analysis is taking longer than expected. Please try again.");
      }

      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to generate valuation report from new API",
      );
    }
  },

  async testConnection(): Promise<boolean> {
    if (currentBackendUrl === "demo") {
      return true;
    }

    try {
      // Test if FastAPI backend is running with a shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${currentBackendUrl}/docs`, {
        signal: controller.signal,
        mode: "cors",
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error: any) {
      console.error("FastAPI connection test failed:", error);

      // Log specific error types for debugging
      if (error.name === "AbortError") {
        console.error("Connection test timed out");
      } else if (error.message?.includes("Failed to fetch")) {
        console.error("CORS or network error - likely cross-origin issue");
      }

      return false;
    }
  },
};

// Streamed valuation report (chunked)
export async function streamValuationReport(wizardData: WizardData, onChunk: (chunk: any) => void) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
  
  try {
    const response = await fetch('http://127.0.0.1:8000/valuation-report-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wizardData),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }
    
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk = JSON.parse(line);
            if (chunk.error) {
              throw new Error(chunk.message || 'Analysis failed');
            }
            onChunk(chunk);
          } catch (e) {
            if (e instanceof SyntaxError) {
              console.error('Failed to parse chunk:', line, e);
            } else {
              throw e;
            }
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Analysis is taking longer than expected. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
