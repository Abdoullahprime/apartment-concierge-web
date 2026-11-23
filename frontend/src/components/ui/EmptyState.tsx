interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-12 text-center space-y-3">
      <div className="text-4xl">{icon}</div>
      <p className="font-semibold text-[#333333]">{title}</p>
      {description && (
        <p className="text-sm text-[#757575] max-w-xs mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 bg-[#2E7D32] text-white text-sm font-semibold rounded-xl px-5 py-2 hover:bg-[#1B5E20] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
