<?php
/**
 * GenZ Time - Ultra-Premium Visual Brand Identity & Logo Component
 * Aerodynamic Chrono-GZ Emblem with Neon Cyber Gradient & Precision Typography.
 */

function render_logo(string $size = 'md', bool $showText = true, bool $asLink = true): string {
    $sizes = [
        'sm' => ['icon' => 38, 'titleFont' => '1.28rem', 'subFont' => '0.58rem', 'gap' => '10px'],
        'md' => ['icon' => 48, 'titleFont' => '1.60rem', 'subFont' => '0.64rem', 'gap' => '13px'],
        'lg' => ['icon' => 62, 'titleFont' => '2.10rem', 'subFont' => '0.72rem', 'gap' => '16px'],
    ];

    $cfg = $sizes[$size] ?? $sizes['md'];
    $iconSize = $cfg['icon'];
    $titleFont = $cfg['titleFont'];
    $subFont = $cfg['subFont'];
    $gap = $cfg['gap'];

    $svg = <<<SVG
<svg width="{$iconSize}" height="{$iconSize}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-emblem-svg">
  <defs>
    <!-- Multi-stage Cyber Gradients -->
    <linearGradient id="gzRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5FF" />
      <stop offset="50%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="gzGStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5FF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <linearGradient id="gzZStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC" />
      <stop offset="50%" stop-color="#F472B6" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="gzDiscBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#040711" />
    </linearGradient>
    <radialGradient id="gzAmbientGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F5FF" stop-opacity="0.3" />
      <stop offset="70%" stop-color="#8B5CF6" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <filter id="gzGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Obsidian Chrono Disc with Precision Rim -->
  <circle cx="50" cy="50" r="46" fill="url(#gzDiscBg)" stroke="#1E293B" stroke-width="1.5" />
  <circle cx="50" cy="50" r="42" fill="url(#gzAmbientGlow)" />
  
  <!-- Outer Chrono Precision Arcs -->
  <path d="M 23 18 A 44 44 0 0 1 77 18" stroke="url(#gzRimGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <path d="M 23 82 A 44 44 0 0 0 77 82" stroke="url(#gzRimGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" />
  
  <!-- Precision Chrono Cardinal Ticks -->
  <line x1="50" y1="8" x2="50" y2="13" stroke="#00F5FF" stroke-width="2.2" stroke-linecap="round" />
  <line x1="50" y1="87" x2="50" y2="92" stroke="#EC4899" stroke-width="2.2" stroke-linecap="round" />
  <line x1="8" y1="50" x2="13" y2="50" stroke="#00F5FF" stroke-width="2.2" stroke-linecap="round" />
  <line x1="87" y1="50" x2="92" y2="50" stroke="#EC4899" stroke-width="2.2" stroke-linecap="round" />

  <!-- Aerodynamic 'G' Monogram (Left Hemisphere) -->
  <path d="M 45 31 L 31 31 C 23.5 31 18 36.5 18 44 L 18 56 C 18 63.5 23.5 69 31 69 L 45 69 L 45 52 L 34 52" 
        stroke="url(#gzGStroke)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#gzGlowFilter)" />

  <!-- High-Velocity 'Z' Lightning Monogram (Right Hemisphere) -->
  <path d="M 55 31 L 82 31 L 56 69 L 83 69" 
        stroke="url(#gzZStroke)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#gzGlowFilter)" />

  <!-- Quantum Chrono Node (Center Specular Accent) -->
  <circle cx="69" cy="50" r="2.5" fill="#FFFFFF" />
</svg>
SVG;

    $text = '';
    if ($showText) {
        $text = <<<HTML
<div class="logo-text" style="display: flex; flex-direction: column; line-height: 1; user-select: none;">
  <div style="display: flex; align-items: baseline; gap: 6px;">
    <span style="font-family: 'Space Grotesk', -apple-system, sans-serif; font-weight: 800; font-size: {$titleFont}; letter-spacing: -0.02em; color: #FFFFFF; text-shadow: 0 0 20px rgba(0, 245, 255, 0.4); display: inline-flex; align-items: baseline;">
      Gen<span style="color: #00F5FF; text-shadow: 0 0 14px #00F5FF;">Z</span>
    </span>
    <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: {$titleFont}; letter-spacing: -0.02em; background: linear-gradient(135deg, #00F5FF 0%, #A855F7 50%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      Time
    </span>
  </div>
  <div style="display: flex; align-items: center; gap: 6px; margin-top: 5px;">
    <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #00F5FF; box-shadow: 0 0 8px #00F5FF;"></span>
    <span style="font-size: {$subFont}; color: #94A3B8; letter-spacing: 0.24em; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-weight: 700;">
      TECH &amp; GADGETS
    </span>
  </div>
</div>
HTML;
    }

    $content = <<<HTML
<div class="brand-logo" style="display: inline-flex; align-items: center; gap: {$gap}; text-decoration: none;">
  {$svg}
  {$text}
</div>
HTML;

    if ($asLink) {
        $homeUrl = url('/');
        return "<a href=\"{$homeUrl}\" style=\"text-decoration: none; display: inline-flex; align-items: center;\" class=\"brand-logo-link\">{$content}</a>";
    }

    return $content;
}

