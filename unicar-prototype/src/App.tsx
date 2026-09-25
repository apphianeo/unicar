import { useState } from "react";
import { emptyPolicy, endDateRange, type Policy } from "./components/PolicySection";
import { parseDate } from "./components/Form";
import Landing from "./screens/Landing";
import ManualForm, { type ManualVehicle } from "./screens/ManualForm";
import QuoteForm, { type QuoteStep } from "./screens/QuoteForm";
import SingpassConsent from "./screens/SingpassConsent";

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
  const [step, setStep] = useState<"landing" | "consent" | "manual" | QuoteStep>("landing");
  const [manual, setManual] = useState<ManualVehicle>(emptyVehicle);
  const [regNo, setRegNo] = useState<string>();
  const [offPeak, setOffPeak] = useState<"Yes" | "No">("No");
  const [power, setPower] = useState("");
  const [policy, setPolicy] = useState<Policy>(emptyPolicy);

  if (step === "landing") {
    return (
      <Landing
        onRetrieve={() => setStep("consent")}
        onFillManually={() => {
          setManual(emptyVehicle);
          setOffPeak("No");
          setPolicy(emptyPolicy);
          setStep("manual");
        }}
      />
    );
  }
  if (step === "manual") {
    return (
      <ManualForm
        vehicle={manual}
        offPeak={offPeak}
        policy={policy}
        onVehicle={(v) => setManual((prev) => ({ ...prev, ...v }))}
        onOffPeak={setOffPeak}
        onPolicy={(p) => setPolicy((prev) => applyPolicy(prev, p))}
      />
    );
  }
  if (step === "consent") {
    return (
      <SingpassConsent
        onCancel={() => setStep("landing")}
        onAgree={() => {
          // 8543:25408: SKC5500A preselected; the user still has to pick it.
          setRegNo("SKC5500A");
          setStep("found");
        }}
      />
    );
  }

  return (
    <QuoteForm
      step={step}
      regNo={regNo}
      offPeak={offPeak}
      power={power}
      policy={policy}
      onPickVehicle={(r) => {
        setRegNo(r);
        setStep("picked");
      }}
      // Row 3 (8641:3667 onwards) starts when the user moves on to the policy details.
      onStartPolicy={() => setStep((s) => (s === "picked" ? "details" : s))}
      onOffPeak={setOffPeak}
      onPower={setPower}
      onPolicy={(p) => setPolicy((prev) => applyPolicy(prev, p))}
      // Clear Form takes the form back to how it looked right after Singpass (8543:25408).
      onClearForm={() => {
        setRegNo("SKC5500A");
        setStep("found");
        setPolicy(emptyPolicy);
        setOffPeak("No");
        setPower("");
      }}
    />
  );
}
