import React from 'react';
import {
  // Mobile & Wearables
  Smartphone,
  Tablet,
  TabletSmartphone,
  Watch,
  Glasses,
  Fingerprint,
  // Computing & Silicon
  Laptop,
  Monitor,
  Cpu,
  CircuitBoard,
  HardDrive,
  Server,
  MemoryStick,
  Terminal,
  Database,
  // Audio & Sound
  Headphones,
  Mic,
  Speaker,
  Volume2,
  Music,
  Radio,
  Disc,
  // Cameras & Vision
  Camera,
  Video,
  Film,
  Aperture,
  Image,
  Microscope,
  Eye,
  // Gaming & AI
  Gamepad2,
  Gamepad,
  Joystick,
  Bot,
  Sparkles,
  Atom,
  Rocket,
  Flame,
  Trophy,
  // Smart Home & Power
  Home,
  Lightbulb,
  Tv,
  Thermometer,
  Plug,
  Power,
  BatteryCharging,
  Battery,
  // Drones, Robotics & Mobility
  Plane,
  Radar,
  Satellite,
  Compass,
  Car,
  Bike,
  // Connectivity & Network
  Wifi,
  Bluetooth,
  Cable,
  Usb,
  Cast,
  Cloud,
  QrCode,
  Scan,
  // Peripherals & Tools
  Keyboard,
  Mouse,
  Printer,
  Wrench,
  Sliders,
  Layers,
  ShieldCheck,
  Shield,
  Zap,
  Sun,
  Gauge,
  Activity,
  HeartPulse,
  Box,
  Package,
  Tag,
  FolderTree,
} from 'lucide-react';

export interface CategoryIconDef {
  name: string;
  icon: React.ElementType;
  group: 'mobile' | 'computing' | 'audio' | 'camera' | 'gaming_ai' | 'smarthome' | 'mobility' | 'network' | 'peripherals';
  keywords: string[];
}

export const CATEGORY_ICON_GROUPS: { id: string; label: string; iconEmoji: string }[] = [
  { id: 'all', label: 'All Icons', iconEmoji: '✨' },
  { id: 'mobile', label: 'Mobile & Wearables', iconEmoji: '📱' },
  { id: 'computing', label: 'Computing & Silicon', iconEmoji: '💻' },
  { id: 'audio', label: 'Audio & Sound', iconEmoji: '🎧' },
  { id: 'camera', label: 'Cameras & Vision', iconEmoji: '📷' },
  { id: 'gaming_ai', label: 'Gaming & AI', iconEmoji: '🎮' },
  { id: 'smarthome', label: 'Smart Home & Power', iconEmoji: '🏠' },
  { id: 'mobility', label: 'Drones & Mobility', iconEmoji: '🚁' },
  { id: 'network', label: 'Network & Wireless', iconEmoji: '📡' },
  { id: 'peripherals', label: 'Peripherals & Gear', iconEmoji: '⌨️' },
];

export const CATEGORY_ICONS_LIST: CategoryIconDef[] = [
  // Mobile & Wearables
  { name: 'Smartphone', icon: Smartphone, group: 'mobile', keywords: ['phone', 'mobile', 'android', 'iphone', 'foldable', 'cell'] },
  { name: 'Tablet', icon: Tablet, group: 'mobile', keywords: ['ipad', 'tablet', 'screen', 'surface'] },
  { name: 'TabletSmartphone', icon: TabletSmartphone, group: 'mobile', keywords: ['devices', 'responsive', 'cross-platform', 'ecosystem'] },
  { name: 'Watch', icon: Watch, group: 'mobile', keywords: ['smartwatch', 'apple watch', 'fitness', 'tracker', 'wearable'] },
  { name: 'Glasses', icon: Glasses, group: 'mobile', keywords: ['ar', 'smart glasses', 'meta', 'rayban', 'vision', 'wearable'] },
  { name: 'Fingerprint', icon: Fingerprint, group: 'mobile', keywords: ['biometrics', 'security', 'touch id', 'scanner'] },

  // Computing & Silicon
  { name: 'Laptop', icon: Laptop, group: 'computing', keywords: ['macbook', 'notebook', 'ultrabook', 'pc', 'computer'] },
  { name: 'Monitor', icon: Monitor, group: 'computing', keywords: ['display', 'screen', 'oled', '4k', 'ultrawide'] },
  { name: 'Cpu', icon: Cpu, group: 'computing', keywords: ['processor', 'chip', 'silicon', 'intel', 'amd', 'snapdragon', 'hardware'] },
  { name: 'CircuitBoard', icon: CircuitBoard, group: 'computing', keywords: ['motherboard', 'pcb', 'electronics', 'chipset', 'diy'] },
  { name: 'HardDrive', icon: HardDrive, group: 'computing', keywords: ['ssd', 'storage', 'nvme', 'm2', 'disk', 'drive'] },
  { name: 'Server', icon: Server, group: 'computing', keywords: ['nas', 'homelab', 'datacenter', 'backend', 'cloud'] },
  { name: 'MemoryStick', icon: MemoryStick, group: 'computing', keywords: ['ram', 'memory', 'ddr5', 'usb drive', 'flash'] },
  { name: 'Terminal', icon: Terminal, group: 'computing', keywords: ['code', 'cli', 'linux', 'dev', 'command line'] },
  { name: 'Database', icon: Database, group: 'computing', keywords: ['sql', 'storage', 'data', 'cloud', 'backup'] },

  // Audio & Sound
  { name: 'Headphones', icon: Headphones, group: 'audio', keywords: ['earphones', 'earbuds', 'anc', 'wireless', 'music', 'airpods'] },
  { name: 'Mic', icon: Mic, group: 'audio', keywords: ['microphone', 'podcast', 'recording', 'voice', 'streaming', 'studio'] },
  { name: 'Speaker', icon: Speaker, group: 'audio', keywords: ['bluetooth speaker', 'soundbar', 'hifi', 'subwoofer', 'audio'] },
  { name: 'Volume2', icon: Volume2, group: 'audio', keywords: ['sound', 'acoustics', 'audio', 'loudness', 'hearing'] },
  { name: 'Music', icon: Music, group: 'audio', keywords: ['tracks', 'streaming', 'audio', 'melody', 'hi-res'] },
  { name: 'Radio', icon: Radio, group: 'audio', keywords: ['fm', 'am', 'tuner', 'broadcast', 'frequency', 'rf'] },
  { name: 'Disc', icon: Disc, group: 'audio', keywords: ['vinyl', 'cd', 'media', 'physical audio', 'records'] },

  // Cameras & Vision
  { name: 'Camera', icon: Camera, group: 'camera', keywords: ['dslr', 'mirrorless', 'sony', 'canon', 'nikon', 'photography', 'lens'] },
  { name: 'Video', icon: Video, group: 'camera', keywords: ['video camera', 'camcorder', 'youtube', 'vlog', 'filming'] },
  { name: 'Film', icon: Film, group: 'camera', keywords: ['cinema', 'movie', 'reels', 'hollywood', 'production'] },
  { name: 'Aperture', icon: Aperture, group: 'camera', keywords: ['lens', 'optics', 'focal length', 'depth of field', 'bokeh'] },
  { name: 'Image', icon: Image, group: 'camera', keywords: ['photo', 'picture', 'gallery', 'sensor', 'megapixels'] },
  { name: 'Microscope', icon: Microscope, group: 'camera', keywords: ['lab', 'testing', 'scientific', 'macro', 'inspection'] },
  { name: 'Eye', icon: Eye, group: 'camera', keywords: ['vision', 'sensor', 'view', 'tracking', 'optics'] },

  // Gaming & AI
  { name: 'Gamepad2', icon: Gamepad2, group: 'gaming_ai', keywords: ['playstation', 'xbox', 'controller', 'console', 'nintendo'] },
  { name: 'Gamepad', icon: Gamepad, group: 'gaming_ai', keywords: ['steam deck', 'rog ally', 'handheld', 'switch', 'gaming'] },
  { name: 'Joystick', icon: Joystick, group: 'gaming_ai', keywords: ['flight stick', 'arcade', 'simulator', 'racing', 'hotas'] },
  { name: 'Bot', icon: Bot, group: 'gaming_ai', keywords: ['ai', 'robot', 'automation', 'agent', 'machine learning', 'chatgpt'] },
  { name: 'Sparkles', icon: Sparkles, group: 'gaming_ai', keywords: ['ai tech', 'next gen', 'magic', 'generative', 'smart'] },
  { name: 'Atom', icon: Atom, group: 'gaming_ai', keywords: ['quantum', 'future tech', 'science', 'research', 'core'] },
  { name: 'Rocket', icon: Rocket, group: 'gaming_ai', keywords: ['speed', 'launch', 'boost', 'overclock', 'high performance'] },
  { name: 'Flame', icon: Flame, group: 'gaming_ai', keywords: ['hot', 'trending', 'benchmarks', 'fps', 'fire'] },
  { name: 'Trophy', icon: Trophy, group: 'gaming_ai', keywords: ['esports', 'award', 'top pick', 'editor choice', 'winner'] },

  // Smart Home & Living
  { name: 'Home', icon: Home, group: 'smarthome', keywords: ['smart home', 'matter', 'apple home', 'google home', 'alexa'] },
  { name: 'Lightbulb', icon: Lightbulb, group: 'smarthome', keywords: ['smart lighting', 'philips hue', 'led', 'rgb', 'bulbs'] },
  { name: 'Tv', icon: Tv, group: 'smarthome', keywords: ['television', 'oled tv', 'apple tv', 'streaming box', '4k display'] },
  { name: 'Thermometer', icon: Thermometer, group: 'smarthome', keywords: ['climate', 'thermostat', 'sensor', 'temperature', 'hvac'] },
  { name: 'Plug', icon: Plug, group: 'smarthome', keywords: ['smart plug', 'outlet', 'electricity', 'energy', 'socket'] },
  { name: 'Power', icon: Power, group: 'smarthome', keywords: ['ups', 'power supply', 'psu', 'wattage', 'on off'] },
  { name: 'BatteryCharging', icon: BatteryCharging, group: 'smarthome', keywords: ['charger', 'gan', 'fast charging', 'magsafe', 'wireless pad'] },
  { name: 'Battery', icon: Battery, group: 'smarthome', keywords: ['powerbank', 'battery pack', 'portable power', 'mah', 'cell'] },

  // Drones, Robotics & Mobility
  { name: 'Plane', icon: Plane, group: 'mobility', keywords: ['drone', 'dji', 'fpv', 'quadcopter', 'aerial', 'flight'] },
  { name: 'Radar', icon: Radar, group: 'mobility', keywords: ['sensors', 'lidar', 'sonar', 'detection', 'frequency'] },
  { name: 'Satellite', icon: Satellite, group: 'mobility', keywords: ['starlink', 'gps', 'telecom', 'orbit', 'satellite comms'] },
  { name: 'Compass', icon: Compass, group: 'mobility', keywords: ['navigation', 'outdoor', 'adventure', 'travel', 'geo'] },
  { name: 'Car', icon: Car, group: 'mobility', keywords: ['ev', 'electric vehicle', 'tesla', 'carplay', 'automotive tech'] },
  { name: 'Bike', icon: Bike, group: 'mobility', keywords: ['ebike', 'e-bike', 'electric scooter', 'micromobility'] },

  // Connectivity & Network
  { name: 'Wifi', icon: Wifi, group: 'network', keywords: ['router', 'mesh', 'wifi 7', 'wifi 6e', 'internet', 'wireless'] },
  { name: 'Bluetooth', icon: Bluetooth, group: 'network', keywords: ['le audio', 'pairing', 'wireless', 'accessories', 'ble'] },
  { name: 'Cable', icon: Cable, group: 'network', keywords: ['ethernet', 'thunderbolt', 'hdmi', 'cat6', 'cord', 'wire'] },
  { name: 'Usb', icon: Usb, group: 'network', keywords: ['type-c', 'usb4', 'usb-c', 'dongle', 'hub', 'adapter'] },
  { name: 'Cast', icon: Cast, group: 'network', keywords: ['chromecast', 'airplay', 'miracast', 'streaming', 'screen share'] },
  { name: 'Cloud', icon: Cloud, group: 'network', keywords: ['backup', 'sync', 'icloud', 'google drive', 'onedrive'] },
  { name: 'QrCode', icon: QrCode, group: 'network', keywords: ['qr scanner', 'barcode', 'scan', 'nfc', 'pairing'] },
  { name: 'Scan', icon: Scan, group: 'network', keywords: ['sensor scan', 'nfc', 'rfid', 'biometric', 'laser'] },

  // Peripherals & Tools
  { name: 'Keyboard', icon: Keyboard, group: 'peripherals', keywords: ['mechanical keyboard', 'switches', 'keycaps', 'typing', 'rgb'] },
  { name: 'Mouse', icon: Mouse, group: 'peripherals', keywords: ['gaming mouse', 'trackpad', 'dpi', 'sensor', 'wireless mouse'] },
  { name: 'Printer', icon: Printer, group: 'peripherals', keywords: ['3d printer', 'laser printer', 'creality', 'bambu', 'filament'] },
  { name: 'Wrench', icon: Wrench, group: 'peripherals', keywords: ['repair', 'teardown', 'ifixit', 'tools', 'screws', 'modding'] },
  { name: 'Sliders', icon: Sliders, group: 'peripherals', keywords: ['mixer', 'audio interface', 'eq', 'tuning', 'settings'] },
  { name: 'Layers', icon: Layers, group: 'peripherals', keywords: ['modular', 'ecosystem', 'stack', 'components'] },
  { name: 'ShieldCheck', icon: ShieldCheck, group: 'peripherals', keywords: ['security', 'verified', 'rugged', 'mil-spec', 'ip68'] },
  { name: 'Shield', icon: Shield, group: 'peripherals', keywords: ['protection', 'armor', 'case', 'screen protector'] },
  { name: 'Zap', icon: Zap, group: 'peripherals', keywords: ['energy', 'lightning', 'quick charge', 'voltage', 'power'] },
  { name: 'Sun', icon: Sun, group: 'peripherals', keywords: ['solar panel', 'outdoor power', 'portable solar', 'eco'] },
  { name: 'Gauge', icon: Gauge, group: 'peripherals', keywords: ['speedometer', 'performance', 'latency', 'benchmark score'] },
  { name: 'Activity', icon: Activity, group: 'peripherals', keywords: ['telemetry', 'heart rate', 'health', 'diagnostics'] },
  { name: 'HeartPulse', icon: HeartPulse, group: 'peripherals', keywords: ['health monitor', 'ecg', 'spo2', 'wellness', 'biotech'] },
  { name: 'Box', icon: Box, group: 'peripherals', keywords: ['unboxing', 'package', 'retail box', 'shipping'] },
  { name: 'Package', icon: Package, group: 'peripherals', keywords: ['bundle', 'accessories', 'kit', 'supplies'] },
  { name: 'Tag', icon: Tag, group: 'peripherals', keywords: ['deals', 'budget', 'price to performance', 'bargain', 'value'] },
  { name: 'FolderTree', icon: FolderTree, group: 'peripherals', keywords: ['sectors', 'categories', 'directory', 'catalog'] },
];

export const CATEGORY_ICONS: Record<string, React.ElementType> = CATEGORY_ICONS_LIST.reduce(
  (acc, item) => {
    acc[item.name] = item.icon;
    return acc;
  },
  {} as Record<string, React.ElementType>
);

export function getCategoryIcon(iconName: string): React.ElementType {
  return CATEGORY_ICONS[iconName] || Cpu;
}
