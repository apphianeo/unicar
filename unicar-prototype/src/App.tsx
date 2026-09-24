import { useState } from "react";
import QuoteForm, { type Policy, type QuoteStep } from "./screens/QuoteForm";
import SingpassConsent from "./screens/SingpassConsent";

const emptyPolicy: Policy = { startDate: "", endDate: "", driveAtWork: "No" };

export default function App() {
  const [step, setStep] = useState<QuoteStep | "consent">("quote");
  const [regNo, setRegNo] = useState<string>();
  const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
  const [offPeak, setOffPeak] = useState<"Yes" | "No">("No");
  const [power, setPower] = useState("");
  const [policy, setPolicy] = useState<Policy>(emptyPolicy);

  if (step === "consent") {
    return <SingpassConsent onCancel={() => setStep("quote")} onAgree={() => setStep("filled")} />;
  }

  return (
    <QuoteForm
      step={step}
      regNo={regNo}
      vehicleConfirmed={vehicleConfirmed}
      offPeak={offPeak}
      power={power}
      policy={policy}
      onRetrieve={() => setStep("consent")}
      onCheckPrice={() => {
        // 8543:25408: SKC5500A preselected, other fields empty, info alert shown.
        setRegNo("SKC5500A");
        setVehicleConfirmed(false);
        setPower("");
        setPolicy(emptyPolicy);
        setStep("found");
      }}
      onPickVehicle={(r) => {
        setRegNo(r);
        setVehicleConfirmed(true);
      }}
      onOffPeak={setOffPeak}
      onPower={setPower}
      onPolicy={(p) => setPolicy((prev) => ({ ...prev, ...p }))}
    />
  );
}
