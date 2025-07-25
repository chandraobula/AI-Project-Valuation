import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/LandingPage";

export default function Index() {
  const navigate = useNavigate();

  return <LandingPage onStartWizard={() => navigate('/wizard')} />;
}
