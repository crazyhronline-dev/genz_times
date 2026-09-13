export interface SpecField {
  key: string;
  label: string;
  placeholder: string;
  icon?: string;
}

export interface CategorySpecConfig {
  categorySlug: string;
  categoryName: string;
  title: string;
  description: string;
  fields: SpecField[];
}

export const CATEGORY_SPEC_CONFIGS: Record<string, CategorySpecConfig> = {
  smartphones: {
    categorySlug: 'smartphones',
    categoryName: 'Smartphones',
    title: 'Smartphone Hardware Specifications',
    description: 'Mobile silicon, display optics, camera arrays, and fast charging metrics.',
    fields: [
      { key: 'processor', label: 'Processor / SoC', placeholder: 'e.g. Snapdragon 8 Elite / Apple A18 Pro', icon: 'Cpu' },
      { key: 'display', label: 'Display & Refresh', placeholder: 'e.g. 6.82" LTPO AMOLED 120Hz 4500 nits', icon: 'Monitor' },
      { key: 'ram', label: 'Memory (RAM)', placeholder: 'e.g. 16GB LPDDR5X (8533 Mbps)', icon: 'Layers' },
      { key: 'storage', label: 'Internal Storage', placeholder: 'e.g. 512GB UFS 4.0', icon: 'HardDrive' },
      { key: 'camera', label: 'Rear Camera Array', placeholder: 'e.g. 200MP Main + 50MP 5x Periscope + 50MP UW', icon: 'Camera' },
      { key: 'battery', label: 'Battery & Charging', placeholder: 'e.g. 5,400 mAh • 100W Wired / 50W Wireless', icon: 'BatteryCharging' },
      { key: 'os', label: 'Operating System', placeholder: 'e.g. Android 15 (One UI 7) • 7 Yrs Updates', icon: 'Settings' },
      { key: 'weight', label: 'Chassis & Protection', placeholder: 'e.g. 219g • Grade 5 Titanium • IP68', icon: 'Scale' },
      { key: 'price', label: 'Launch Price', placeholder: 'e.g. $1,199 / ₹1,29,999', icon: 'Tag' },
    ],
  },
  'laptops-computing': {
    categorySlug: 'laptops-computing',
    categoryName: 'Laptops & Computing',
    title: 'Computing & Laptop Hardware Sheet',
    description: 'CPU cores, dedicated GPU, display resolution, thermals, and port selection.',
    fields: [
      { key: 'processor', label: 'Processor (CPU)', placeholder: 'e.g. Apple M4 Pro (12C CPU / 16C GPU) / Core Ultra 9 285H', icon: 'Cpu' },
      { key: 'gpu', label: 'Dedicated Graphics (GPU)', placeholder: 'e.g. NVIDIA RTX 4080 Mobile 12GB GDDR6 (175W TGP)', icon: 'Zap' },
      { key: 'display', label: 'Display & Resolution', placeholder: 'e.g. 16.2" Liquid Retina XDR 120Hz Mini-LED (3456x2234)', icon: 'Monitor' },
      { key: 'ram', label: 'Memory (RAM)', placeholder: 'e.g. 36GB Unified Memory / 32GB DDR5-5600', icon: 'Layers' },
      { key: 'storage', label: 'Storage (SSD)', placeholder: 'e.g. 1TB PCIe 4.0 NVMe M.2 SSD (7,400 MB/s)', icon: 'HardDrive' },
      { key: 'battery', label: 'Battery & Power Adapter', placeholder: 'e.g. 96Wh Li-Polymer • 140W MagSafe / USB-PD GaN', icon: 'BatteryCharging' },
      { key: 'ports', label: 'Ports & Connectivity', placeholder: 'e.g. 3x Thunderbolt 5, HDMI 2.1, SDXC, Wi-Fi 7', icon: 'Plug' },
      { key: 'os', label: 'Operating System', placeholder: 'e.g. macOS Sequoia 15 / Windows 11 Pro', icon: 'Settings' },
      { key: 'weight', label: 'Weight & Dimensions', placeholder: 'e.g. 1.62 kg • 15.5mm Unibody Aluminum', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $1,999 / ₹2,19,900', icon: 'Tag' },
    ],
  },
  'audio-earbuds': {
    categorySlug: 'audio-earbuds',
    categoryName: 'Audio & Earbuds',
    title: 'Acoustic & Wireless Audio Specifications',
    description: 'Driver diameter, ANC noise reduction, Bluetooth audio codecs, and playback endurance.',
    fields: [
      { key: 'driver', label: 'Acoustic Drivers', placeholder: 'e.g. 11mm Dual-Magnet Dynamic + Balanced Armature', icon: 'Volume2' },
      { key: 'frequency', label: 'Frequency Response', placeholder: 'e.g. 20Hz – 40,000Hz (Hi-Res Audio Certified)', icon: 'Activity' },
      { key: 'anc', label: 'Active Noise Cancellation', placeholder: 'e.g. Adaptive Hybrid ANC up to -49dB with Smart Ambient', icon: 'Shield' },
      { key: 'codecs', label: 'Bluetooth & Codecs', placeholder: 'e.g. Bluetooth 5.4 • LDAC, LHDC 5.0, LC3, AAC', icon: 'Radio' },
      { key: 'battery', label: 'Battery Life (Buds/Case)', placeholder: 'e.g. 8.5 hours ANC on (34 hours total with case)', icon: 'BatteryCharging' },
      { key: 'ports', label: 'Charging & Case', placeholder: 'e.g. Qi Wireless Charging + USB-C (10 min = 3 hrs)', icon: 'Zap' },
      { key: 'mics', label: 'Microphones & Calls', placeholder: 'e.g. 6-mic beamforming array with AI Bone Conduction VPU', icon: 'Mic' },
      { key: 'waterproof', label: 'Water & Dust Rating', placeholder: 'e.g. IP55 Earbuds / IPX2 Case', icon: 'Droplets' },
      { key: 'weight', label: 'Weight & Ergonomics', placeholder: 'e.g. 4.9g per bud • Ergonomic oval silicone tips', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $249 / ₹19,999', icon: 'Tag' },
    ],
  },
  'vr-wearables': {
    categorySlug: 'vr-wearables',
    categoryName: 'VR & Wearables',
    title: 'Spatial Computing & Wearable Specifications',
    description: 'Optics, micro-OLED pixels, field of view, spatial tracking, and biometric sensors.',
    fields: [
      { key: 'display', label: 'Displays & Optics', placeholder: 'e.g. Dual Micro-OLED 25M Pixels, 120Hz Pancake Optics', icon: 'Monitor' },
      { key: 'processor', label: 'SoC & Sensor Co-Processor', placeholder: 'e.g. Dual Apple M4 (10-Core) + R2 Sensor Silicon', icon: 'Cpu' },
      { key: 'fov', label: 'Field of View (FOV)', placeholder: 'e.g. 110° diagonal FOV • Continuous motorized IPD 51-75mm', icon: 'Eye' },
      { key: 'tracking', label: 'Spatial Tracking & Cameras', placeholder: 'e.g. 12 Cameras, LiDAR, TrueDepth, Hand & Eye 6DoF', icon: 'Camera' },
      { key: 'audio', label: 'Spatial Audio', placeholder: 'e.g. Dual-driver Spatial Audio pods with Dynamic Head Tracking', icon: 'Volume2' },
      { key: 'battery', label: 'Battery Life & Tether', placeholder: 'e.g. 3.5 hrs spatial playback • External GaN power pack', icon: 'BatteryCharging' },
      { key: 'storage', label: 'Internal Storage & RAM', placeholder: 'e.g. 512GB PCIe 4.0 • 16GB Unified RAM', icon: 'HardDrive' },
      { key: 'os', label: 'Operating System', placeholder: 'e.g. visionOS 3.0 / Wear OS 5', icon: 'Settings' },
      { key: 'weight', label: 'Weight & Chassis', placeholder: 'e.g. 485g • Magnesium-carbon alloy frame', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $3,299 / ₹2,99,999', icon: 'Tag' },
    ],
  },
  'drones-cameras': {
    categorySlug: 'drones-cameras',
    categoryName: 'Drones & Cameras',
    title: 'Camera & Aerial Drone Specifications',
    description: 'Image sensor, video codec bitrates, flight endurance, stabilization, and transmission.',
    fields: [
      { key: 'camera', label: 'Image Sensor', placeholder: 'e.g. 1-inch CMOS 20MP / 45MP Full-Frame BSI', icon: 'Camera' },
      { key: 'video', label: 'Video Recording & FPS', placeholder: 'e.g. 5.1K 50fps / 4K 120fps 10-bit D-Log M & ProRes', icon: 'Video' },
      { key: 'lens', label: 'Lens & Aperture', placeholder: 'e.g. 24mm f/2.8-f/11 + 3x 70mm Telephoto f/2.8', icon: 'Eye' },
      { key: 'flightTime', label: 'Flight Time / Battery', placeholder: 'e.g. 46 minutes max flight time • 5000 mAh LiPo 4S', icon: 'BatteryCharging' },
      { key: 'transmission', label: 'Transmission & Range', placeholder: 'e.g. O4 HD Video Transmission 20km (1080p/60fps)', icon: 'Radio' },
      { key: 'gimbal', label: 'Gimbal & Stabilization', placeholder: 'e.g. 3-Axis Mechanical Gimbal (Tilt, Roll, Pan)', icon: 'Activity' },
      { key: 'sensors', label: 'Obstacle Sensing', placeholder: 'e.g. Omnidirectional APAS 5.0 binocular vision sensors', icon: 'Shield' },
      { key: 'storage', label: 'Storage & Slots', placeholder: 'e.g. 8GB on-board + MicroSD (up to 512GB)', icon: 'HardDrive' },
      { key: 'weight', label: 'Takeoff Weight', placeholder: 'e.g. 249g Ultralight (FAA Sub-250g) / 958g', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $919 / ₹89,900', icon: 'Tag' },
    ],
  },
  'gaming-gear': {
    categorySlug: 'gaming-gear',
    categoryName: 'Gaming Gear',
    title: 'Gaming Gear & Handheld Specifications',
    description: 'Gaming silicon, GPU performance, high-refresh panel, cooling thermals, and battery TDP.',
    fields: [
      { key: 'processor', label: 'Processor & Graphics', placeholder: 'e.g. AMD Ryzen Z1 Extreme (8C/16T) • RDNA 3 12 CUs', icon: 'Cpu' },
      { key: 'display', label: 'Display & Refresh', placeholder: 'e.g. 7" FHD 120Hz VRR 500 nits IPS FreeSync Premium', icon: 'Monitor' },
      { key: 'ram', label: 'Memory (RAM)', placeholder: 'e.g. 24GB LPDDR5X-7500 dual-channel', icon: 'Layers' },
      { key: 'storage', label: 'Storage & Expansion', placeholder: 'e.g. 1TB M.2 2280 NVMe PCIe 4.0 SSD + MicroSD slot', icon: 'HardDrive' },
      { key: 'battery', label: 'Battery & TDP Power', placeholder: 'e.g. 80Wh 4-cell Li-ion • 10W-30W APU TDP', icon: 'BatteryCharging' },
      { key: 'controls', label: 'Controls & Ergonomics', placeholder: 'e.g. Hall Effect Joysticks & Triggers, M-buttons', icon: 'Gamepad2' },
      { key: 'thermals', label: 'Thermals & Cooling', placeholder: 'e.g. Dual 0.1mm fluid fans • Anti-gravity heatpipes', icon: 'Zap' },
      { key: 'ports', label: 'Ports & I/O', placeholder: 'e.g. USB4 40Gbps + USB-C 3.2 Gen 2, 3.5mm Hi-Res jack', icon: 'Plug' },
      { key: 'weight', label: 'Weight & Dimensions', placeholder: 'e.g. 678g • 280 x 111 x 24.7 mm contoured grip', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $799 / ₹69,999', icon: 'Tag' },
    ],
  },
  'ai-gadgets': {
    categorySlug: 'ai-gadgets',
    categoryName: 'AI Gadgets & Future Tech',
    title: 'AI Hardware & Ambient Tech Specifications',
    description: 'On-device NPU compute, multimodal sensor array, ambient projection, and cellular AI.',
    fields: [
      { key: 'processor', label: 'AI Processor & NPU', placeholder: 'e.g. Qualcomm Snapdragon AI • 45 TOPS On-Device NPU', icon: 'Cpu' },
      { key: 'sensors', label: 'Sensors & Camera', placeholder: 'e.g. 13MP ultra-wide RGB sensor, ToF depth sensor', icon: 'Camera' },
      { key: 'display', label: 'Display & Projection', placeholder: 'e.g. Laser Projection Interface (720p) • Touchpad', icon: 'Monitor' },
      { key: 'mics', label: 'Microphones & Audio', placeholder: 'e.g. Dual beamforming mics • Ambient bone conduction speaker', icon: 'Mic' },
      { key: 'connectivity', label: 'Wireless Connectivity', placeholder: 'e.g. Dedicated eSIM 5G, Wi-Fi 6E, Bluetooth 5.3', icon: 'Radio' },
      { key: 'battery', label: 'Battery & Boosters', placeholder: 'e.g. Hot-swappable Battery Booster • All-day use', icon: 'BatteryCharging' },
      { key: 'storage', label: 'Storage & RAM', placeholder: 'e.g. 32GB eMMC • 4GB LPDDR4X', icon: 'HardDrive' },
      { key: 'os', label: 'Cloud & AI Engine', placeholder: 'e.g. Multimodal Gemini 2.0 / OpenAI GPT-4o integration', icon: 'Settings' },
      { key: 'weight', label: 'Weight & Form Factor', placeholder: 'e.g. 34g wearable pin with magnetic clothing clip', icon: 'Scale' },
      { key: 'price', label: 'Hardware Price', placeholder: 'e.g. $699 + $24/mo cellular AI subscription', icon: 'Tag' },
    ],
  },
  'smart-home': {
    categorySlug: 'smart-home',
    categoryName: 'Smart Home & IoT',
    title: 'Smart Home & Automation Specifications',
    description: 'Protocol standards, suction/motor performance, power supply, and navigation sensors.',
    fields: [
      { key: 'ecosystem', label: 'Smart Ecosystems', placeholder: 'e.g. Matter over Thread, Apple Home, Google Home, Alexa', icon: 'Home' },
      { key: 'sensors', label: 'Sensors & Navigation', placeholder: 'e.g. Dual-LiDAR 3D Obstacle Avoidance, Ultrasonic Carpet', icon: 'Eye' },
      { key: 'processor', label: 'Cleaning & Motor Power', placeholder: 'e.g. 8,000 Pa Hyper-Suction • 200 RPM Dual Mopping', icon: 'Cpu' },
      { key: 'battery', label: 'Power & Battery', placeholder: 'e.g. 5,200 mAh Li-ion • Auto-empty & hot water wash dock', icon: 'BatteryCharging' },
      { key: 'connectivity', label: 'Connectivity & Radios', placeholder: 'e.g. Wi-Fi 6 (2.4/5GHz), Bluetooth 5.2, Thread Border', icon: 'Radio' },
      { key: 'storage', label: 'Tanks & Dust Capacity', placeholder: 'e.g. 4L Clean Water / 3.5L Dirty Water / 2.5L Dust Bag', icon: 'HardDrive' },
      { key: 'camera', label: 'Camera & Privacy', placeholder: 'e.g. RGB AI Obstacle Cam with Physical Privacy Shutter', icon: 'Camera' },
      { key: 'dimensions', label: 'Dimensions & Weight', placeholder: 'e.g. 350 x 350 x 97 mm • 4.1 kg robot vacuum', icon: 'Scale' },
      { key: 'price', label: 'Retail Price', placeholder: 'e.g. $799 / ₹64,999', icon: 'Tag' },
    ],
  },
};

export function getCategorySpecConfig(categorySlug?: string): CategorySpecConfig {
  const slug = (categorySlug || '').toLowerCase().trim();
  if (slug && CATEGORY_SPEC_CONFIGS[slug]) {
    return CATEGORY_SPEC_CONFIGS[slug];
  }

  // Smart fallback by partial match
  if (slug.includes('laptop') || slug.includes('pc') || slug.includes('mac')) return CATEGORY_SPEC_CONFIGS['laptops-computing'];
  if (slug.includes('audio') || slug.includes('earbud') || slug.includes('headphone')) return CATEGORY_SPEC_CONFIGS['audio-earbuds'];
  if (slug.includes('vr') || slug.includes('wearable') || slug.includes('watch')) return CATEGORY_SPEC_CONFIGS['vr-wearables'];
  if (slug.includes('drone') || slug.includes('camera')) return CATEGORY_SPEC_CONFIGS['drones-cameras'];
  if (slug.includes('game') || slug.includes('gaming') || slug.includes('console')) return CATEGORY_SPEC_CONFIGS['gaming-gear'];
  if (slug.includes('ai') || slug.includes('future')) return CATEGORY_SPEC_CONFIGS['ai-gadgets'];
  if (slug.includes('home') || slug.includes('iot')) return CATEGORY_SPEC_CONFIGS['smart-home'];

  // Default to smartphones
  return CATEGORY_SPEC_CONFIGS.smartphones;
}

export function getSpecFieldLabel(key: string, categorySlug?: string): string {
  const config = getCategorySpecConfig(categorySlug);
  const found = config.fields.find((f) => f.key === key);
  if (found) return found.label;

  // Global fallbacks
  const globalLabels: Record<string, string> = {
    processor: 'Processor / SoC',
    display: 'Display & Screen',
    ram: 'Memory (RAM)',
    storage: 'Internal Storage',
    battery: 'Battery & Power',
    camera: 'Camera Array',
    os: 'Operating System',
    weight: 'Weight & Chassis',
    price: 'Retail Price',
    gpu: 'Graphics (GPU)',
    ports: 'Ports & I/O',
    driver: 'Acoustic Drivers',
    frequency: 'Frequency Response',
    anc: 'Noise Cancellation',
    codecs: 'Bluetooth Codecs',
    mics: 'Microphones',
    waterproof: 'Water Resistance',
    fov: 'Field of View',
    tracking: 'Spatial Tracking',
    sensors: 'Sensors',
    video: 'Video Recording',
    lens: 'Lens & Optics',
    flightTime: 'Flight Endurance',
    transmission: 'Transmission',
    gimbal: 'Gimbal Stabilization',
    controls: 'Controls & Inputs',
    thermals: 'Cooling & Thermals',
    ecosystem: 'Smart Ecosystem',
    dimensions: 'Dimensions & Form',
    connectivity: 'Wireless Connectivity',
  };

  return globalLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
