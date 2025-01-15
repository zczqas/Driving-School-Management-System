import moment from "moment";

export default function formatTimeToTwelveHours(time: string) {
  return moment(time, "HH:mm:ss").format("hh:mm A");
}
