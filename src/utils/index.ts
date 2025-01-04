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

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // 1 KB = 1024 Bytes
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Calculate the index of the size unit to use
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Format the number with the appropriate size unit
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    sizes[i]
  }`;
}

export const getFilePreview = (file: File) => {
  if (file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }

  return undefined;
};
