import { useState } from "react";
import Layout from "./components/Layout";
import MyinfoCard from "./components/MyinfoCard";
import QuoteForm, { type FormMode, type FormState } from "./screens/QuoteForm";
import SingpassConsent from "./screens/SingpassConsent";
import { singpassVehicles } from "./data/mock";

// Flow (user's order):
// 1 quote (empty) → 2 Singpass consent → 3 filled (1 vehicle) → 4 user fills policy fields
// → Check Price → 5 multi (3 vehicles found) → 6 open reg dropdown → 7 pick car, fill blanks.
type Step = "quote" | "consent" | "filled" | "multi";

const initialForm: FormState = {
  offPeak: "no",
  driveAtWork: "no",
  promoApplied: true,
  promoInput: "",
};

const firstVehicle = singpassVehicles[0];

export default function App() {
  const [step, setStep] = useState<Step>("quote");
  const [form, setFormState] = useState<FormState>(initialForm);
  const [vehicleLocked, setVehicleLocked] = useState(false);
  const setForm = (patch: Partial<FormState>) => setFormState((f) => ({ ...f, ...patch }));

  const reset = () => {
    setFormState(initialForm);
    setVehicleLocked(false);
    setStep("quote");
  };

  if (step === "consent") {
    return (
      <SingpassConsent
        onCancel={() => setStep("quote")}
        onAgree={() => {
          const { reg, make, power, year } = firstVehicle;
          setFormState({ ...initialForm, reg, make, power, year });
          setVehicleLocked(true);
          setStep("filled");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const mode: FormMode = step === "quote" ? "empty" : step;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {step === "multi" ? (
          <MyinfoCard variant="clear" onClear={reset} />
        ) : (
          <MyinfoCard variant="retrieve" onRetrieve={() => setStep("consent")} />
        )}
        <QuoteForm
          mode={mode}
          form={form}
          setForm={setForm}
          vehicleLocked={vehicleLocked}
          onSelectVehicle={(reg) => {
            const v = singpassVehicles.find((x) => x.reg === reg);
            setForm({ reg, make: v?.make, power: v?.power, year: v?.year });
            // Lock only when Singpass returned details for this vehicle (as in frame 8543:26182).
            setVehicleLocked(!!v?.make);
          }}
          onCheckPrice={() => {
            if (step !== "filled") return;
            // Frame 8543:25408: 3 vehicles found, SKC5500A shown, other fields empty.
            setFormState({ ...initialForm, reg: firstVehicle.reg });
            setVehicleLocked(false);
            setStep("multi");
            window.scrollTo(0, 0);
          }}
        />
      </div>
    </Layout>
  );
}
