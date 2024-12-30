import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  const inputDate = new Date(dateString);

  const hours = inputDate.getHours().toString().padStart(2, "0");
  const minutes = inputDate.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

export function formatDateWithTimezone(date: Date): string {
  const pad = (num: number, size: number) => String(num).padStart(size, "0");

  // Format date and time parts
  const datePart = format(date, "yyyy-MM-dd HH:mm:ss");

  // Handle milliseconds (6 digits)
  const milliseconds = pad(date.getMilliseconds() * 1000, 6); // Convert ms to microseconds and pad

  // Handle timezone offset
  const timezoneOffset = -date.getTimezoneOffset(); // In minutes
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const hoursOffset = pad(Math.floor(Math.abs(timezoneOffset) / 60), 2);
  const minutesOffset = pad(Math.abs(timezoneOffset) % 60, 2);

  return `${datePart}.${milliseconds}${sign}${hoursOffset}${minutesOffset}`;
}
