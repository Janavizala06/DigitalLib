import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateFine = (dueDate: string, returnDate?: string): number => {
  const due = new Date(dueDate)
  const actualDate = returnDate ? new Date(returnDate) : new Date()
  actualDate.setHours(0, 0, 0, 0) // Normalize actual date to start of day
  due.setHours(0, 0, 0, 0) // Normalize due date to start of day

  if (actualDate > due) {
    const diffTime = Math.abs(actualDate.getTime() - due.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * 5 // ₹5 per day
  }
  return 0
}
