import { useEffect, useState } from "react";
import { parseDate } from "./components/Form";
import { emptyPolicy, endDateRange, type Policy } from "./components/PolicySection";
import Landing from "./screens/Landing";
import QuoteForm, { type ManualVehicle } from "./screens/QuoteForm";
import SingpassConsent from "./screens/SingpassConsent";

// Each page has its own URL hash, so the browser's Back and Forward buttons move through the flow.
type Page = "landing" | "consent" | "quote" | "manual";
const pages: Page[] = ["landing", "consent", "quote", "manual"];
const pageFromHash = (): Page => {
  const h = window.location.hash.replace("#", "") as Page;
  return pages.includes(h) ? h : "landing";
};

const emptyVehicle: ManualVehicle = { regNo: "", power: "" };

// A new start date clears an end date that no longer falls 9 to 18 months after it.
function applyPolicy(prev: Policy, p: Partial<Policy>): Policy {
  const next = { ...prev, ...p };
  if (p.startDate !== undefined && next.endDate) {
    const { min, max } = endDateRange(next.startDate);
    const e = parseDate(next.endDate);
    if (!min || !max || !e || e < min || e > max) next.endDate = "";
  }
  return next;
}

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  // true once Singpass has filled the vehicle details; Clear Form sets it back to false.
  const [singpassFilled, setSingpassFilled] = useState(false);
  const [vehicle, setVehicle] = useState<ManualVehicle>(emptyVehicle);
  const [offPeak, setOffPeak] = useState<"Yes" | "No">("No");
  const [policy, setPolicy] = useState<Policy>(emptyPolicy);

  useEffect(() => {
    // Start at the landing page; a form page opened directly has no data to show.
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    const onHash = () => {
      setPage(pageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (p: Page) => {
    window.location.hash = p;
  };

  const resetForm = () => {
    setVehicle(emptyVehicle);
    setOffPeak("No");
    setPolicy(emptyPolicy);
  };

  if (page === "consent") {
    return (
      <SingpassConsent
        onCancel={() => history.back()}
        onAgree={() => {
          // One vehicle per customer in this prototype: Singpass fills it in straight away.
          setSingpassFilled(true);
          go("quote");
        }}
      />
    );
  }

  if (page === "quote" || page === "manual") {
    return (
      <QuoteForm
        mode={page === "manual" ? "manual" : singpassFilled ? "singpass" : "cleared"}
        vehicle={vehicle}
        offPeak={offPeak}
        policy={policy}
        onVehicle={(v) => setVehicle((prev) => ({ ...prev, ...v }))}
        onOffPeak={setOffPeak}
        onPolicy={(p) => setPolicy((prev) => applyPolicy(prev, p))}
        onClearForm={() => {
          // The autofilled vehicle details go away; the card switches to Retrieve with Singpass.
          setSingpassFilled(false);
          setVehicle(emptyVehicle);
        }}
        onRetrieve={() => go("consent")}
      />
    );
  }

  return (
    <Landing
      onRetrieve={() => {
        resetForm();
        go("consent");
      }}
      onFillManually={() => {
        resetForm();
        setSingpassFilled(false);
        go("manual");
      }}
    />
  );
}
