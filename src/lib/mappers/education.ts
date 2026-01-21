export function educationLabel(level: string) {
  switch (level) {
    case "phd":
      return "PhD";
    case "masters":
      return "Master’s";
    case "bachelors":
      return "Bachelor’s";
    case "associate":
      return "Associate";
    case "some_college":
      return "Some College";
    case "high_school":
      return "High School";
    case "less_than_high_school":
      return "Less than High School";
    case "unknown_or_other":
      return "Unknown / Other";
    default:
      return level;
  }
}
