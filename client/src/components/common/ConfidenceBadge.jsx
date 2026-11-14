import React from 'react';
import { useMode } from '../../context/ModeContext';
import { CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';

export default function ConfidenceBadge({ confidence = 'CONFIRMED', size = 'sm' }) {
  const { isStory } = useMode();

  const configs = {
    CONFIRMED: {
      storyText: "We're sure!",
      storyClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      explorerText: "CONFIRMED",
      explorerClass: "bg-emerald-950/70 text-emerald-400 border-emerald-600/50",
      icon: CheckCircle2,
      desc: "Orbital imagery and telemetry independently confirm these coordinates."
    },
    ESTIMATED: {
      storyText: "Scientists think so",
      storyClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      explorerText: "ESTIMATED",
      explorerClass: "bg-amber-950/70 text-amber-400 border-amber-600/50",
      icon: HelpCircle,
      desc: "Based on radio telemetry tracking; not yet imaged at sub-meter resolution."
    },
    UNKNOWN: {
      storyText: "Nobody knows yet",
      storyClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      explorerText: "UNKNOWN",
      explorerClass: "bg-purple-950/70 text-purple-400 border-purple-600/50",
      icon: AlertCircle,
      desc: "Hardware remains on surface but exact coordinates have not been verified."
    }
  };

  const current = configs[confidence] || configs.CONFIRMED;
  const Icon = current.icon;
  const text = isStory ? current.storyText : current.explorerText;
  const classes = isStory ? current.storyClass : current.explorerClass;

  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm transition-all duration-200 ${classes} ${sizeClasses}`}
      title={current.desc}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </span>
  );
}
