import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import FundingFocusAreas from "./pages/FundingFocusAreas";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import OurOffer from "./pages/OurOffer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SubmitProposal from "./pages/SubmitProposal";
import TermsOfUse from "./pages/TermsOfUse";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/about-us" component={AboutUs} />
    <Route path="/funding-focus-areas" component={FundingFocusAreas} />
    <Route path="/our-offer" component={OurOffer} />
    <Route path="/faq" component={FAQ} />
    <Route path="/blog" component={Blog} />
    <Route path="/contact-us" component={ContactUs} />
    <Route path="/submit-proposal" component={SubmitProposal} />
    <Route path="/privacy-policy" component={PrivacyPolicy} />
    <Route path="/terms-of-use" component={TermsOfUse} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
