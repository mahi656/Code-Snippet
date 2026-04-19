import { format } from 'date-fns';

export const formatStandardDate = (date) => {
  if (!date) return "";
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatFullDate = (date) => {
  if (!date) return "";
  return format(new Date(date), 'MMM dd, HH:mm');
};
