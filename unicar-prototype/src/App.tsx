import { useState } from "react";
import Landing from "./screens/Landing";
import QuoteForm, { type Policy, type QuoteStep } from "./screens/QuoteForm";
import SingpassConsent from "./screens/SingpassConsent";
import { parseDate } from "./components/Form";

const emptyPolicy: Policy = { startDate: "", endDate: "", driveAtWork: "No" };

export default function App() {
  const [step, setStep] = useState<"landing" | "consent" | QuoteStep>("landing");
  const [regNo, setRegNo] = useState<string>();
  const [offPeak, setOffPeak] = useState<"Yes" | "No">("No");
  const [power, setPower] = useState("");
  const [policy, setPolicy] = useState<Policy>(emptyPolicy);

  if (step === "landing") return <Landing onRetrieve={() => setStep("consent")} />;
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
      onPolicy={(p) =>
        setPolicy((prev) => {
          const next = { ...prev, ...p };
          // A new start date clears an end date that no longer falls 9 to 18 months after it.
          if (p.startDate !== undefined && next.endDate) {
            const s = parseDate(next.startDate);
            const e = parseDate(next.endDate);
            const min = s && new Date(s.getFullYear(), s.getMonth() + 9, s.getDate());
            const max = s && new Date(s.getFullYear(), s.getMonth() + 18, s.getDate());
            if (!s || !e || (min && e < min) || (max && e > max)) next.endDate = "";
          }
          return next;
        })
      }
      onClearForm={() => {
        setPolicy(emptyPolicy);
        setOffPeak("No");
        setPower("");
      }}
    />
  );
}
