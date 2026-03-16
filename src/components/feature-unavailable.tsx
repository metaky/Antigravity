import { AlertTriangle } from "lucide-react";

type FeatureUnavailableProps = {
  title: string;
  description: string;
};

export function FeatureUnavailable({
  title,
  description,
}: FeatureUnavailableProps) {
  return (
    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <AlertTriangle className="h-12 w-12 text-slate-400" />
        <p className="text-2xl font-bold text-slate-500">{title}</p>
        <p className="text-slate-400 text-sm max-w-md">{description}</p>
      </div>
    </div>
  );
}
