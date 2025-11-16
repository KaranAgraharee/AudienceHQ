// components/PriorityBadge.tsx
const styles: Record<string, string> = {
  LOW: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  MEDIUM: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
  HIGH: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  URGENT: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const cls = styles[priority] || styles.MEDIUM;
  return <span className={`text-xs px-2 py-0.5 rounded ${cls}`}>{priority}</span>;
}
