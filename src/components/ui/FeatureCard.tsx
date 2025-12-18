import { Icon } from "lucide-react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-(--md-sys-color-surface-container) p-6 rounded-2xl shadow-lg border border-(--md-sys-color-outline) transition duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-3 bg-(--md-sys-color-primary) rounded-full w-fit mb-4">
        <Icon className="w-6 h-6  text-(--md-sys-color-on-primary)" />
      </div>
      <h3 className="text-xl font-bold text-(--md-sys-color-primary) mb-2">
        {title}
      </h3>
      <p className=" text-sm">{description}</p>
    </div>
  );
}
