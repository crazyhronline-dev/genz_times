import React from 'react';
import { GadgetSpecs } from '@/types/blog';
import { getCategorySpecConfig, getSpecFieldLabel } from '@/lib/category-specs';
import { 
  Monitor, 
  Cpu, 
  Layers, 
  HardDrive, 
  BatteryCharging, 
  Camera, 
  Settings, 
  Tag, 
  Scale,
  Zap,
  Volume2,
  Activity,
  Shield,
  Radio,
  Droplets,
  Mic,
  Eye,
  Video,
  Gamepad2,
  Home,
  Plug,
  Sparkles,
  LucideIcon
} from 'lucide-react';

interface Props {
  specs: GadgetSpecs;
  gadgetTitle?: string;
  categorySlug?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Cpu,
  Layers,
  HardDrive,
  BatteryCharging,
  Camera,
  Settings,
  Tag,
  Scale,
  Zap,
  Volume2,
  Activity,
  Shield,
  Radio,
  Droplets,
  Mic,
  Eye,
  Video,
  Gamepad2,
  Home,
  Plug,
};

export default function GadgetSpecsBox({ specs, gadgetTitle, categorySlug }: Props) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const config = getCategorySpecConfig(categorySlug);

  // 1. Gather configured fields with non-empty values
  const configuredItems = config.fields
    .map((f) => ({
      key: f.key,
      label: f.label,
      value: (specs as any)[f.key] as string | undefined,
      icon: (f.icon && ICON_MAP[f.icon]) ? ICON_MAP[f.icon] : Cpu,
      highlight: f.key === 'price',
    }))
    .filter((item) => Boolean(item.value && item.value.trim()));

  // 2. Gather any extra custom keys in specs not in category definition
  const configuredKeys = new Set(config.fields.map((f) => f.key));
  const extraItems = Object.entries(specs)
    .filter(([k, v]) => !configuredKeys.has(k) && Boolean(v && typeof v === 'string' && v.trim()))
    .map(([k, v]) => ({
      key: k,
      label: getSpecFieldLabel(k, categorySlug),
      value: v as string,
      icon: k === 'price' ? Tag : Cpu,
      highlight: k === 'price',
    }));

  const allSpecItems = [...configuredItems, ...extraItems];
  if (allSpecItems.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl bg-tech-900/90 border border-slate-800/90 overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-tech-950 via-tech-900 to-tech-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-tech-cyan font-semibold block">
              {config.title || 'Lab Specifications Sheet'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {gadgetTitle ? `${gadgetTitle} Tech Specs` : `${config.categoryName} Specifications`}
            </h2>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-tech-cyan" />
          <span>{config.categoryName} Lab Metrics</span>
        </span>
      </div>

      {/* Grid of specs */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSpecItems.map((spec) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.key}
              className={`p-3.5 rounded-xl border transition-all ${
                spec.highlight
                  ? 'bg-tech-cyan/10 border-tech-cyan/30 text-tech-cyan'
                  : 'bg-tech-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Icon className={`w-4 h-4 ${spec.highlight ? 'text-tech-cyan' : 'text-slate-400'}`} />
                <span>{spec.label}</span>
              </div>
              <p className={`text-sm font-semibold ${spec.highlight ? 'text-tech-cyan font-mono text-base' : 'text-white'}`}>
                {spec.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
