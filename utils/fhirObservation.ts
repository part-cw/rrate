// Formats the respiratory rate as a Vital Signs Observation, compatible with FHIR standards. 
export function getFHIRObservation({
  patientId,
  rrate,
  timestamp,
}: {
  patientId: string;
  rrate: string;
  timestamp: string;
}) {
  return {
    resourceType: "Observation",
    status: "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "vital-signs",
        display: "Vital Signs",
      }],
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "9279-1",
        display: "Respiratory rate",
      }],
      text: "Respiratory rate",
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: timestamp,
    valueQuantity: {
      value: parseFloat(rrate),
      unit: "breaths/minute",
      system: "http://unitsofmeasure.org",
      code: "/min",
    },
  };
}
