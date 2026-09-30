import { useEffect, useState } from "react";
import { HeaderSummary, PriceSummary } from "./components/Flow";
import { parseDate } from "./components/Form";
import { emptyPolicy, endDateRange, type Policy } from "./components/PolicySection";
import { addOns, gstRate, plans, promoCode, promoRate, singpassVehicle, type AddOnTab, type PlanId } from "./data/mock";
import AddOnsScreen, { type AddOnState } from "./screens/AddOns";
import DriverDetails, { emptyExtraDriver, type ExtraDriver, type YesNo } from "./screens/DriverDetails";
import Landing from "./screens/Landing";
import Loading from "./screens/Loading";
import QuoteForm, { type ManualVehicle } from "./screens/QuoteForm";
import SelectPlan from "./screens/SelectPlan";
import SingpassConsent from "./screens/SingpassConsent";

// Each page has its own URL hash, so the browser's Back and Forward buttons move through the flow.
type Page = "landing" | "consent" | "quote" | "manual" | "loading" | "plan" | "addons" | "driver";
const pages: Page[] = ["landing", "consent", "quote", "manual", "loading", "plan", "addons", "driver"];
const pageFromHash = (): Page => {
  const h = window.location.hash.replace("#", "") as Page;
  return pages.includes(h) ? h : "landing";
};

const emptyVehicle: ManualVehicle = { regNo: "", power: "" };
const emptyAddOns: AddOnState = { selected: [], excess: "S$600.00 (Default)", drivers: "1 (free)" };

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

// How a chosen add-on reads in the price summary (the Driver Details frame shows "S$600.00" and "1 (Free)").
function addOnValue(id: string, s: AddOnState, price: string) {
  if (id === "excess") return s.excess.replace(" (Default)", "");
  if (id === "drivers") return s.drivers.replace("(free)", "(Free)");
  return price;
}

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  // true once Singpass has filled the vehicle details; Clear Form sets it back to false.
  const [singpassFilled, setSingpassFilled] = useState(false);
  const [formPage, setFormPage] = useState<"quote" | "manual">("quote");
  const [vehicle, setVehicle] = useState<ManualVehicle>(emptyVehicle);
  const [offPeak, setOffPeak] = useState<"Yes" | "No">("No");
  const [policy, setPolicy] = useState<Policy>(emptyPolicy);
  // Essential is the plan selected by default in 8391:11581.
  const [plan, setPlan] = useState<PlanId>("essential");
  const [addOnTab, setAddOnTab] = useState<AddOnTab>("Recommended");
  const [addOnState, setAddOnState] = useState<AddOnState>(emptyAddOns);
  const [extraDrivers, setExtraDrivers] = useState<ExtraDriver[]>([]);
  const [brandNew, setBrandNew] = useState<YesNo>("No");
  const [financing, setFinancing] = useState<YesNo>("No");

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

  // Singpass fills the vehicle; otherwise it is what was keyed in (the frames show the Singpass car).
  const make = (singpassFilled ? singpassVehicle.make : vehicle.make) || singpassVehicle.make;
  const regNo = (singpassFilled ? singpassVehicle.regNo : vehicle.regNo) || singpassVehicle.regNo;
  const period =
    policy.startDate && policy.endDate ? `${policy.startDate} - ${policy.endDate}` : "02/01/2026 - 01/01/2027";
  const chosenPlan = plans.find((p) => p.id === plan)!;
  const subtotal = parseFloat(chosenPlan.price.replace("S$", ""));
  const chosenAddOns = addOns
    .filter((a) => addOnState.selected.includes(a.id))
    .map((a) => ({ label: a.title, value: addOnValue(a.id, addOnState, a.price) }));
  const driverCount = addOnState.selected.includes("drivers") ? parseInt(addOnState.drivers, 10) : 0;

  const summary = <HeaderSummary make={make} period={period} onEdit={() => go(formPage)} />;
  const priceSummary = (variant: "addons" | "driver") => (
    <PriceSummary
      variant={variant}
      car={
        variant === "addons"
          ? [
              { label: "No claims discount (NCD)", value: policy.ncd || "10%" },
              { label: "Claims made in the last 3 years", value: policy.claims || "1" },
            ]
          : undefined
      }
      plan={{ label: chosenPlan.name, value: chosenPlan.price }}
      addOns={chosenAddOns}
      subtotal={subtotal}
      promoRate={promoRate}
      gstRate={gstRate}
      promoCode={promoCode}
      onEditCar={() => go(formPage)}
      onEditPlan={() => go("plan")}
    />
  );

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
          // Every field is emptied; the card switches to Retrieve with Singpass.
          setSingpassFilled(false);
          resetForm();
        }}
        onRetrieve={() => go("consent")}
        onCheckPrice={() => {
          setFormPage(page);
          go("loading");
        }}
      />
    );
  }

  if (page === "loading") {
    // Replace the loading entry so Back from Select Plan returns to the form.
    return <Loading onDone={() => window.location.replace("#plan")} />;
  }

  if (page === "plan") {
    return (
      <SelectPlan
        summary={summary}
        selected={plan}
        onSelect={setPlan}
        onBack={() => go(formPage)}
        onNext={() => go("addons")}
      />
    );
  }

  if (page === "addons") {
    return (
      <AddOnsScreen
        summary={summary}
        priceSummary={priceSummary("addons")}
        tab={addOnTab}
        onTab={setAddOnTab}
        state={addOnState}
        onChange={(s) => setAddOnState((prev) => ({ ...prev, ...s }))}
        onBack={() => go("plan")}
        onNext={() => {
          setExtraDrivers((prev) => Array.from({ length: driverCount }, (_, i) => prev[i] ?? emptyExtraDriver));
          go("driver");
        }}
      />
    );
  }

  if (page === "driver") {
    return (
      <DriverDetails
        summary={summary}
        priceSummary={priceSummary("driver")}
        make={make}
        regNo={regNo}
        driveAtWork={policy.driveAtWork}
        onDriveAtWork={(driveAtWork) => setPolicy((prev) => ({ ...prev, driveAtWork }))}
        extraDrivers={extraDrivers}
        onExtraDriver={(i, d) => setExtraDrivers((prev) => prev.map((x, j) => (j === i ? { ...x, ...d } : x)))}
        brandNew={brandNew}
        onBrandNew={setBrandNew}
        financing={financing}
        onFinancing={setFinancing}
        onBack={() => go("addons")}
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
