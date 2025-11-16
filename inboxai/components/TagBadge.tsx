export default function TagBadge({ tag }: { tag: string }) {
    return (
      <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize transition-colors">
        {tag}
      </span>
    );
  }
  