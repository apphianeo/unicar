import { useEffect, useState } from "react";
import { HeaderSummary, PriceSummary } from "./components/Flow";
import { parseDate } from "./components/Form";
import { emptyPolicy, endDateRange, type Policy } from "./components/PolicySection";
import {
  addOnCost,
  addOnCount,
  addOns,
  plans,
  powerByMake,
  singpassApplicant,
  promoCode,
  money,
  promoRate,
  singpassVehicle,
  type AddOnTab,
  type PlanId,
} from "./data/mock";
import AddOnsScreen, { type AddOnState } from "./screens/AddOns";
import Confirmation from "./screens/Confirmation";
import DriverDetails, { emptyExtraDriver, type ExtraDriver, type YesNo } from "./screens/DriverDetails";
import Landing from "./screens/Landing";
import Loading from "./screens/Loading";
import QuoteForm, { type ManualVehicle } from "./screens/QuoteForm";
import Review from "./screens/Review";
import SelectPlan from "./screens/SelectPlan";
import SingpassConsent from "./screens/SingpassConsent";

// Each page has its own URL hash, so the browser's Back and Forward buttons move through the flow.
type Page = "landing" | "consent" | "quote" | "manual" | "loading" | "plan" | "addons" | "driver" | "review" | "confirmation";
const pages: Page[] = ["landing", "consent", "quote", "manual", "loading", "plan", "addons", "driver", "review", "confirmation"];
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


// A chosen add-on in the price summary: the right column is always an amount (8398:39153), e.g.
// "Policy excess  S$600.00", "Additional named drivers (x1)  Free".
function addOnRow(id: (typeof addOns)[number]["id"], title: string, s: AddOnState) {
  if (id === "excess") {
    const cost = addOnCost(id, s.drivers, s.excess);
    return { label: `${title} (${s.excess.replace(" (Default)", "")})`, value: money(cost) };
  }
  if (id === "drivers") {
    const cost = addOnCost(id, s.drivers);
    return { label: `${title} (x${addOnCount(s.drivers)})`, value: cost ? money(cost) : "Free" };
  }
  return { label: title, value: money(addOnCost(id, s.drivers, s.excess)) };
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
  const [agreed, setAgreed] = useState(false);

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
  const picked = addOns.filter((a) => addOnState.selected.includes(a.id));
  // Subtotal: the plan plus every paid add-on, updated as add-ons are switched on and off.
  const subtotal =
    chosenPlan.list + picked.reduce((sum, a) => sum + addOnCost(a.id, addOnState.drivers, addOnState.excess), 0);
  const chosenAddOns = picked.map((a) => addOnRow(a.id, a.title, addOnState));
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
      plan={{ label: chosenPlan.name, value: money(chosenPlan.list) }}
      addOns={chosenAddOns}
      subtotal={subtotal}
      promoRate={promoRate}
      promoCode={promoCode}
      onEditCar={() => go(formPage)}
      onEditPlan={() => go("plan")}
      onEditAddOns={() => go("addons")}
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

  if (page === "review") {
    const a = singpassApplicant;
    const dash = (v?: string) => v || "-";
    const power = singpassFilled ? singpassVehicle.power : (vehicle.make && powerByMake[vehicle.make]) || vehicle.power;
    const year = singpassFilled ? singpassVehicle.year : vehicle.year;
    return (
      <Review
        summary={summary}
        priceSummary={priceSummary("driver")}
        applicant={[
          { label: "Full name as per NRIC/FIN", value: a.name },
          { label: "Date of birth", value: a.dob },
          { label: "NRIC/FIN", value: a.nric },
          { label: "Mobile Number", value: `${a.phoneCode} ${a.phone}` },
          { label: "Email address", value: a.email },
          { label: "Postal code", value: a.postalCode },
          { label: "Address", value: a.address },
          { label: "Unit no.", value: a.unit },
          { label: "Years of driving experience", value: dash(policy.experience) },
          { label: "I drive at work", value: policy.driveAtWork },
        ]}
        extraDrivers={extraDrivers.map((d) => [
          { label: "Full name as per NRIC/FIN", value: dash(d.name) },
          { label: "Date of birth", value: dash(d.dob) },
          { label: "NRIC/FIN", value: dash(d.nric) },
          { label: "Years of driving experience", value: dash(d.experience) },
          { label: "I drive at work", value: d.driveAtWork },
        ])}
        vehicle={[
          { label: "Vehicle Make and Model", value: make },
          { label: "Power Rating/Engine Capacity", value: dash(power) },
          { label: "Year of Registration", value: dash(year) },
          { label: "Off-peak Vehicle", value: offPeak },
          { label: "Chassis number", value: a.chassis },
          { label: "Brand new vehicle?", value: brandNew },
          { label: "Vehicle registration number", value: regNo },
          { label: "Is your car under financing?", value: financing },
          // Driver Details has no fields for the finance company, so these show "-" when financed.
          ...(financing === "Yes"
            ? [
                { label: "Hire Purchase / Finance Company", value: "-" },
                { label: "Name of Hire Purchase / Finance Company", value: "-" },
              ]
            : []),
          { label: "No Claims Discount (NCD)", value: dash(policy.ncd) },
          { label: "How many claims have you made in the last 3 years?", value: dash(policy.claims) },
        ]}
        agreed={agreed}
        onAgreed={setAgreed}
        onEditDrivers={() => go("driver")}
        onEditVehicle={() => go("driver")}
        onBack={() => go("driver")}
        onPay={() => go("confirmation")}
      />
    );
  }

  if (page === "confirmation") return <Confirmation />;

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
        onNext={() => go("review")}
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
