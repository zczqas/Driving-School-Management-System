export const convertTo24HourFormat = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  // Ensure hours and minutes are strings
  hours = hours?.padStart(2, "0") || "00";
  minutes = minutes?.padStart(2, "0") || "00";

  return `${hours}:${minutes}`;
};
