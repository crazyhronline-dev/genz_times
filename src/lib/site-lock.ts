/**
 * ==============================================================================
 *  GenZ Time - Master Architecture & Production Configuration Lock
 * ==============================================================================
 *  This configuration is STRICTLY LOCKED and FROZEN against automated changes.
 *  - Design, layout, theme, and color schemes are immutable.
 *  - Post persistence is hardened with multi-tier backups and atomic file writes.
 *  - Default author is permanently locked to 'Sahil'.
 *  - Header and footer structures are frozen.
 * ==============================================================================
 */

export interface SiteLockConfig {
  readonly isLocked: boolean;
  readonly lockedTimestamp: string;
  readonly lockVersion: string;
  readonly brand: {
    readonly name: string;
    readonly alternateNames: readonly string[];
    readonly tagline: string;
    readonly domain: string;
    readonly author: string;
    readonly authorRole: string;
    readonly footerCredit: string;
  };
  readonly security: {
    readonly adminPin: string;
    readonly publicAdminButtonVisible: boolean;
    readonly deleteProtectionEnabled: boolean;
  };
  readonly storage: {
    readonly atomicWrites: boolean;
    readonly dualBackups: boolean;
    readonly dailySnapshots: boolean;
    readonly autoHealing: boolean;
  };
  readonly layout: {
    readonly theme: string;
    readonly primaryColor: string;
    readonly accentColor: string;
    readonly backgroundColor: string;
    readonly surfaceColor: string;
    readonly fontSans: string;
    readonly fontMono: string;
  };
}

export const SITE_LOCK: SiteLockConfig = Object.freeze({
  isLocked: true,
  lockedTimestamp: '2026-09-18T19:00:00Z',
  lockVersion: '2.0.0-FROZEN',
  brand: {
    name: 'GenZ Time',
    alternateNames: ['Gen Z Time', 'GenZ Tech', 'GenZ Reviews'],
    tagline: 'Hardware Lab & Next-Gen Gadget Benchmarks',
    domain: 'https://genztime.com',
    author: 'Sahil',
    authorRole: 'Founder & Lead Hardware Editor',
    footerCredit: 'Powered By - CrazyHR Technologies Pvt. Ltd.',
  },
  security: {
    adminPin: '050505',
    publicAdminButtonVisible: false,
    deleteProtectionEnabled: true,
  },
  storage: {
    atomicWrites: true,
    dualBackups: true,
    dailySnapshots: true,
    autoHealing: true,
  },
  layout: {
    theme: 'dark-cyber',
    primaryColor: '#00F0FF',
    accentColor: '#10B981',
    backgroundColor: '#030712',
    surfaceColor: '#0F172A',
    fontSans: 'Inter, system-ui, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
  },
});

export function isSiteLocked(): boolean {
  return SITE_LOCK.isLocked;
}
