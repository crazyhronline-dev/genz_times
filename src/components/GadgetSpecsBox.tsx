import React from 'react';
import { GadgetSpecs } from '@/types/blog';
import { 
  Monitor, 
  Cpu, 
  Layers, 
  HardDrive, 
  BatteryCharging, 
  Camera, 
  Settings, 
  Tag, 
  Scale 
} from 'lucide-react';

interface Props {
  specs: GadgetSpecs;
  gadgetTitle?: string;
}

export default function GadgetSpecsBox({ specs, gadgetTitle }: Props) {
  const specItems = [
    { label: 'Display', value: specs.display, icon: Monitor },
    { label: 'Processor', value: specs.processor, icon: Cpu },
    { label: 'RAM / Memory', value: specs.ram, icon: Layers },
    { label: 'Storage', value: specs.storage, icon: HardDrive },
    { label: 'Battery Life', value: specs.battery, icon: BatteryCharging },
    { label: 'Camera Array', value: specs.camera, icon: Camera },
    { label: 'Operating System', value: specs.os, icon: Settings },
    { label: 'Starting Price', value: specs.price, icon: Tag, highlight: true },
    { label: 'Weight & Form', value: specs.weight, icon: Scale },
  ].filter((item) => Boolean(item.value));

  if (specItems.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl bg-tech-900/90 border border-slate-800/90 overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-tech-950 via-tech-900 to-tech-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-tech-cyan font-semibold">
              Lab Specifications Sheet
            </span>
            <h3 className="text-base font-bold text-white">
              {gadgetTitle ? `${gadgetTitle} Tech Specs` : 'Hardware Specifications'}
            </h3>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
          Verified Specs
        </span>
      </div>

      {/* Grid of specs */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specItems.map((spec) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.label}
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
