export interface DiagnosticResult {
  title: string;
  severity: "low" | "med" | "hi";
  summary: string;
  type: string;
  steps: string[];
  difficulty: string;
  estTime: string;
  safetyWarning: string;
}

export interface ErrorCodeEntry {
  c: string; // code
  p: string; // platform
  cat: "hw-e" | "ios-e" | "and-e" | "net-e"; // category
  d: string; // description
  sv: "crit" | "warn" | "inf"; // severity
  f: string; // fix
}

export interface RepairGuide {
  b: string; // brand
  t: string; // title
  d: string; // description
  df: "Easy" | "Medium" | "Hard"; // difficulty
  tm: string; // duration
  im: string; // image seed url
}

export interface SafetyTip {
  t: string; // title
  d: string; // description
}

export const PHONE_BRANDS: Record<string, string[]> = {
  iphone: [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 
    'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 
    'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 12', 'iPhone SE 3', 
    'iPhone 11', 'iPhone XR', 'iPhone X/XS'
  ],
  samsung: [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 
    'Galaxy S23', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54', 
    'Galaxy A34', 'Galaxy A14', 'Galaxy M54', 'Galaxy Note 20'
  ],
  xiaomi: [
    'Xiaomi 14 Pro', 'Xiaomi 14', 'Xiaomi 13 Ultra', 'Xiaomi 13', 
    'Redmi Note 13 Pro+', 'Redmi Note 13', 'Redmi Note 12', 'POCO F6 Pro', 
    'POCO X6 Pro', 'POCO M6 Pro'
  ],
  oneplus: [
    'OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'OnePlus Nord CE 3', 
    'OnePlus Nord 3', 'OnePlus 11R', 'OnePlus 10 Pro'
  ],
  pixel: [
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7', 
    'Pixel 6a', 'Pixel 6 Pro', 'Pixel 6'
  ],
  huawei: [
    'P60 Pro', 'P60', 'Mate 60 Pro', 'Mate 50 Pro', 'Nova 11 Pro', 'Y74'
  ],
  oppo: [
    'OPPO F11 Pro', 'OPPO F11', 'Find X7 Ultra', 'Find X7', 'Reno 11 Pro', 
    'Reno 11', 'Reno 10 Pro', 'A79', 'A58', 'F25 Pro', 'A78', 'Reno 8T', 'A57'
  ],
  vivo: [
    'X100 Pro', 'X100', 'V30 Pro', 'V29', 'Y78', 'Y35+', 'iQOO 12', 'iQOO Neo 9 Pro'
  ],
  sony: [
    'Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V'
  ],
  motorola: [
    'Edge 40 Pro', 'Edge 40', 'Moto G84', 'Moto G54', 'Razr 40 Ultra'
  ]
};

export const SYMPTOMS = [
  { id: 'battery_drain', icon: 'Battery', label: 'Battery Draining Fast' },
  { id: 'overheating', icon: 'Flame', label: 'Overheating' },
  { id: 'screen_unresponsive', icon: 'MousePointerClick', label: 'Screen Unresponsive' },
  { id: 'ghost_touch', icon: 'Sparkles', label: 'Ghost Touches' },
  { id: 'black_screen', icon: 'Tv', label: 'Black Screen' },
  { id: 'wifi_issues', icon: 'Wifi', label: 'WiFi Problems' },
  { id: 'bluetooth_issues', icon: 'Bluetooth', label: 'Bluetooth Issues' },
  { id: 'no_sound', icon: 'VolumeX', label: 'No Sound' },
  { id: 'camera_fail', icon: 'Camera', label: 'Camera Failure' },
  { id: 'app_crash', icon: 'Bug', label: 'Apps Crashing' },
  { id: 'boot_loop', icon: 'RefreshCw', label: 'Boot Loop' },
  { id: 'charging_issue', icon: 'ZapOff', label: 'Not Charging' },
  { id: 'fingerprint_fail', icon: 'Fingerprint', label: 'Fingerprint Scanner' },
  { id: 'face_id_fail', icon: 'Smile', label: 'Face Unlock Fail' },
  { id: 'storage_full', icon: 'HardDrive', label: 'Storage Full' },
  { id: 'lag_slow', icon: 'Hourglass', label: 'Lag / Slow' },
  { id: 'sim_not_detected', icon: 'Smartphone', label: 'SIM Not Detected' },
  { id: 'network_drop', icon: 'SignalHigh', label: 'Network Drops' },
  { id: 'water_damage', icon: 'Droplets', label: 'Water Damage' },
  { id: 'screen_flicker', icon: 'Lightbulb', label: 'Screen Flickering' }
];

export const RULE_DIAGNOSTICS: Record<string, DiagnosticResult> = {
  battery_drain: {
    title: "Battery Drain Diagnosis",
    severity: "med",
    summary: "Battery draining faster than normal. Typically caused by software processes, background apps, or hardware degradation.",
    type: "hardware/software",
    steps: [
      "Check Battery Health in Settings (if below 80%, replacement is highly recommended).",
      "Go to Settings > Battery to identify top resource-consuming apps.",
      "Force close active background applications.",
      "Reduce screen brightness or enable Auto-Brightness.",
      "Disable 'Background App Refresh' and switch push email to manual fetch.",
      "Turn off location services for non-essential applications.",
      "Uninstall recently installed apps that may have runaways tasks."
    ],
    difficulty: "Easy",
    estTime: "15-30 mins",
    safetyWarning: "Never attempt to open or pierce a lithium battery. Swollen batteries require immediate professional attention."
  },
  overheating: {
    title: "Overheating Diagnosis",
    severity: "hi",
    summary: "Device operating above threshold. Can cause severe damage to the battery, processor, and display panel.",
    type: "hardware/software",
    steps: [
      "Remove any protective case immediately to improve heat dissipation.",
      "Stop charging the device and close all intensive gaming/streaming apps.",
      "Check for runaway background processes in Settings > Battery.",
      "Keep the phone in a cool, shaded environment (avoid direct sunlight).",
      "Disable gaming/high-performance modes.",
      "Inspect charger and cable. Faulty charging components often cause excess heating.",
      "Perform a factory reset if the device continues to overheat without active apps."
    ],
    difficulty: "Medium",
    estTime: "30-45 mins",
    safetyWarning: "If the backplate is swollen, do not charge the device. It is a potential thermal runaway and fire risk."
  },
  screen_unresponsive: {
    title: "Unresponsive Screen",
    severity: "med",
    summary: "Display touch registering fails. Can be caused by a software crash, physical digitizer separation, or static charge.",
    type: "hardware/software",
    steps: [
      "Remove the screen protector and test again to isolate physical interference.",
      "Gently clean the screen surface using a microfiber cloth and 99% isopropyl alcohol.",
      "Perform a forced hardware restart (hold Power + Vol Down for 15s).",
      "Boot into Safe Mode to see if a third-party app is causing freezing.",
      "If the issue persists in safe mode, the touch digitizer is likely cracked or disconnected internally."
    ],
    difficulty: "Hard",
    estTime: "45-60 mins",
    safetyWarning: "Be careful of glass splinters if the screen is physically shattered."
  },
  black_screen: {
    title: "Black Screen of Death",
    severity: "hi",
    summary: "Phone appears powered on (vibrates/rings) but display is totally black. Caused by display cable separation or panel damage.",
    type: "hardware",
    steps: [
      "Perform a forced hardware reboot to clear any deep GPU display crashes.",
      "Plug into a certified wall charger for 15 minutes and check for a charge indicator.",
      "Call the phone from another device. If it rings but stays black, the backlight or display panel is faulty.",
      "Connect the device to a computer. If recognized, the motherboard is active and the issue lies in the display assembly."
    ],
    difficulty: "Hard",
    estTime: "1-2 hours",
    safetyWarning: "Do not press hard on the black screen; cracked glass beneath can rupture the OLED layer completely."
  },
  boot_loop: {
    title: "Boot Loop / Freeze",
    severity: "hi",
    summary: "Device gets stuck on the launcher logo or restarts indefinitely. Caused by firmware corruption, partition failure, or bad storage.",
    type: "software",
    steps: [
      "Press and hold physical buttons to force power off.",
      "Boot into Recovery Mode (Power + Volume Up on most Androids).",
      "Select 'Wipe Cache Partition' (this will not erase your photos or personal data).",
      "Try to launch in Safe Mode to isolate background startup services.",
      "If cache wiping fails, connect to a computer and flash original factory firmware via official recovery tools (Odin/MiFlash/iTunes)."
    ],
    difficulty: "Hard",
    estTime: "1-2 hours",
    safetyWarning: "Ensure your battery is above 50% before flashing firmware, otherwise a sudden power off can brick the phone forever."
  },
  charging_issue: {
    title: "Charging Issue",
    severity: "med",
    summary: "Device fails to draw current, charges slowly, or requires specific cable angles. Port corrosion or lint blockage.",
    type: "hardware",
    steps: [
      "Inspect the port under bright light with a magnifying glass.",
      "Gently scrape out compressed pocket lint or debris using a non-conductive wooden toothpick.",
      "Test with a known-good certified adapter and thick premium copper cable.",
      "Check if wireless charging works (to confirm if motherboard charging IC is healthy).",
      "If the port has physical looseness, it requires a replacement daughterboard."
    ],
    difficulty: "Medium",
    estTime: "20-40 mins",
    safetyWarning: "Never use metal needles, pins, or paperclips to clean the port. Doing so will short-circuit the sensitive golden pins."
  },
  camera_fail: {
    title: "Camera Module Failure",
    severity: "low",
    summary: "Black preview screen, blurriness, or flash sync crash. Caused by modular lens disconnection or camera driver corruption.",
    type: "hardware/software",
    steps: [
      "Clear the camera app's storage and cache files in Settings > Apps.",
      "Restart the smartphone to reload hardware kernel driver modules.",
      "Test front and rear cameras separately to isolate the broken module.",
      "Try using a third-party camera app (e.g., GCam, Instagram camera) to check.",
      "Check if the physical lens is loose or rattling (optical stabilizer failure)."
    ],
    difficulty: "Medium",
    estTime: "30-50 mins",
    safetyWarning: "Do not touch exposed camera lenses with fingers as sweat oils can permanently haze the fine protective coat."
  },
  wifi_issues: {
    title: "WiFi Drops & Connection Fails",
    severity: "low",
    summary: "WiFi antenna dropouts, authentication errors, or networks missing entirely. Typically software network profile glitches.",
    type: "software",
    steps: [
      "Toggle Airplane mode on for 30 seconds and then off again.",
      "Navigate to Settings > WiFi, long press your network, and tap 'Forget Network'. Reconnect.",
      "Reset Network Settings (Wipes saved WiFi keys, Bluetooth pairings, and APN configs).",
      "Restart your home router and check if other devices can connect.",
      "If no WiFi networks can be seen at all, the internal coaxial antenna has detached."
    ],
    difficulty: "Easy",
    estTime: "5-15 mins",
    safetyWarning: "Always back up your network security keys before resetting configuration folders."
  }
};

export const GUIDES: RepairGuide[] = [
  { b: 'oppo', t: 'OPPO F11 Pro Screen Replacement', d: 'Replace the 6.5" FHD+ bezel-less LCD assembly including pop-up camera frame alignment.', df: 'Hard', tm: '60-90 min', im: 'https://picsum.photos/seed/opf11-scr/600/320.jpg' },
  { b: 'oppo', t: 'OPPO F11 Pro Battery Replacement', d: 'Safe swap of the 4000mAh BLP705 high-capacity cell with backplate adhesive reapplication.', df: 'Medium', tm: '30-40 min', im: 'https://picsum.photos/seed/opf11-bat/600/320.jpg' },
  { b: 'oppo', t: 'OPPO F11 Pro Charging Port Flex', d: 'Replace the micro-USB daughterboard with microphonic lines and audio jack contact pads.', df: 'Easy', tm: '20-30 min', im: 'https://picsum.photos/seed/opf11-chg/600/320.jpg' },
  { b: 'oppo', t: 'OPPO F11 Pro Pop-up Camera Repair', d: 'Teardown step to repair the mechanical motorized stepper motor and ribbon connector.', df: 'Hard', tm: '60-100 min', im: 'https://picsum.photos/seed/opf11-cam/600/320.jpg' },
  { b: 'iphone', t: 'iPhone 15 Display Glass Assembly', d: 'Replacing the Super Retina XDR OLED panel with TrueTone sensor calibration.', df: 'Hard', tm: '45-60 min', im: 'https://picsum.photos/seed/ip15-scr/600/320.jpg' },
  { b: 'iphone', t: 'iPhone 13 Taptic Engine swap', d: 'Isolate or swap a rattling vibration component near the charging ribbon.', df: 'Easy', tm: '15-25 min', im: 'https://picsum.photos/seed/ip13-tap/600/320.jpg' },
  { b: 'iphone', t: 'iPhone Battery Swap & Pull-Tabs', d: 'Extract battery safely using horizontal pull-tabs on standard iPhone 12/13.', df: 'Medium', tm: '30-40 min', im: 'https://picsum.photos/seed/ip-bat/600/320.jpg' },
  { b: 'samsung', t: 'Galaxy S24 Ultra Back Plate replacement', d: 'Use high-temperature heat pad to separate delicate Corning glass backplates.', df: 'Easy', tm: '20-30 min', im: 'https://picsum.photos/seed/sm-back/600/320.jpg' },
  { b: 'samsung', t: 'Galaxy S23 Screen & Battery Frame', d: 'Full front chassis swap including AMOLED panel, display IC, and pre-glued thermal pads.', df: 'Hard', tm: '60-90 min', im: 'https://picsum.photos/seed/sm-scr/600/320.jpg' },
  { b: 'pixel', t: 'Pixel 8 Camera Lens Glass Shield', d: 'Heat gun extraction of shattered rear camera protective visor shields.', df: 'Easy', tm: '15-20 min', im: 'https://picsum.photos/seed/px-cam/600/320.jpg' },
  { b: 'pixel', t: 'Pixel 7 Pro Screen Assembly', d: 'Screen restoration with screen-off optical under-display fingerprint recalibration.', df: 'Hard', tm: '60-80 min', im: 'https://picsum.photos/seed/px-scr/600/320.jpg' },
  { b: 'oneplus', t: 'OnePlus 12 Battery Replacement', d: 'Unsealing the dual-cell battery assembly safely without tearing sensitive flash-charge paths.', df: 'Medium', tm: '40-50 min', im: 'https://picsum.photos/seed/op-bat/600/320.jpg' }
];

export const ERROR_DATABASE: ErrorCodeEntry[] = [
  { c: 'Error 4013', p: 'iOS', cat: 'hw-e', d: 'Severe hardware disruption during system flashing, caused by NAND flash memory degradation or loose USB connection.', sv: 'crit', f: 'Change USB cable and port. If unsuccessful, enter DFU mode or check for flash memory physical soldering issues.' },
  { c: 'Error 53', p: 'iOS', cat: 'hw-e', d: 'Security mismatch trigger. Triggered when Touch ID button or Face ID sensor is replaced by third-party without cryptographic verification.', sv: 'crit', f: 'Original home button/sensor must be transplanted back, or serviced at an authorized Apple service center to bind cryptographic security.' },
  { c: 'Error 14', p: 'iOS', cat: 'ios-e', d: 'Storage overflow. Device fails to boot or update because write space is completely saturated, stopping core system initialization.', sv: 'warn', f: 'Connect to computer and choose "Update" to compress cache files. If it fails, a full restore in Recovery Mode is necessary.' },
  { c: 'F11_PRO_BOOTLOOP', p: 'ColorOS / Android', cat: 'hw-e', d: 'OPPO F11 Pro recurring boot loader animation. Generally occurs after partial flash partition corruption or battery wear.', sv: 'crit', f: 'Boot to ColorOS Recovery by holding Power + Vol Down. Select "Wipe data" > "Wipe cache". Flash stock OTA package if still looping.' },
  { c: 'COLOROS_UPDATE_FAIL', p: 'ColorOS / Android', cat: 'and-e', d: 'ColorOS OTA update stops or fails at verification stage. Usually caused by insufficient space (requires 5GB+) or damaged partition tables.', sv: 'warn', f: 'Clear local app files. Do not close the installer. Download the official full stock ROM ZIP file from OPPO support and install via recovery.' },
  { c: 'SYSTEM_UI_CRASH', p: 'Android', cat: 'and-e', d: 'Android graphic manager system server crashed. Triggered by resource exhaustion, faulty themes, or conflicting overlay software.', sv: 'warn', f: 'Clear cache of Android System Webview and Google app. Boot into Safe Mode to delete newly active launcher themes.' },
  { c: 'WIFI_AUTH_ERROR', p: 'Android / iOS', cat: 'net-e', d: 'WPA network key mismatch or local DHCP lease collision. Phone cannot resolve IP address.', sv: 'inf', f: 'Reset Phone Network Settings, forget the SSID, restart router. Assign static IP address under advanced network parameters.' },
  { c: 'BATTERY_SWOLLEN', p: 'All Platforms', cat: 'hw-e', d: 'Battery shell expand from gas accumulation (Lithium gas pocket). Extreme danger.', sv: 'crit', f: 'Power down immediately. Do not charge. Transport the phone to an experienced recycling depot. Swollen battery must be extracted immediately.' },
  { c: 'ERR_SIM_NOT_PRESENT', p: 'Android / iOS', cat: 'net-e', d: 'SIM card contact pads dirty or tray is physically bent, keeping card from connecting.', sv: 'warn', f: 'Remove tray, wipe golden contacts on SIM card with isopropyl alcohol. Ensure card sits flush inside tray frame.' },
  { c: 'CAMERA_FAIL_ERR', p: 'Android', cat: 'hw-e', d: 'Camera app fails to handshake with motherboard sensors. Can be triggered by hardware disconnection after a drop.', sv: 'warn', f: 'Force restart device. Check if flashlight turns on. If flashlight is disabled, the camera module ribbon is disconnected.' },
  { c: 'OVERCURRENT_USB', p: 'All Platforms', cat: 'hw-e', d: 'Short-circuit warning. Foreign material or liquid in the charging port forces power system shutdown to protect internal logic.', sv: 'warn', f: 'Clear port with air can. Do not insert any charger. Inspect copper pins for physical touching or dark carbonized copper deposits.' }
];

export const SAFETY_TIPS: Record<string, SafetyTip[]> = {
  'gen-s': [
    { t: 'Enable Automatic Security Patches', d: 'Always verify under Settings > Security that monthly system security updates are active. Outdated kernels leave devices open to major zero-day vulnerabilities.' },
    { t: 'Disable Unknown App Sources', d: 'Ensure that the "Install Unknown Apps" permission is disabled for web browsers, file managers, and SMS messengers to prevent sideloading drive-by downloads.' },
    { t: 'Set Up Strong Secondary PINs', d: 'Avoid simple 4-digit codes or drawing patterns. Switch your primary screen lock to a 6-digit complex PIN or alphanumeric phrase for critical theft protection.' },
    { t: 'Audit Running Background Apps', d: 'Check active background RAM hogs in Developer Options monthly. Malicious spyware apps often run invisibly without displaying on your app list.' }
  ],
  'dat-s': [
    { t: 'Daily Cloud Backup Setup', d: 'Ensure daily automated syncs are enabled on Google Account or iCloud. This acts as a complete safeguard when performing physical repairs.' },
    { t: 'Enable Remote Easing (Find My)', d: 'Register Find My Device (Android) or Find My iPhone (Apple). If your phone is stolen, wiping the storage partition remotely is the ultimate defense.' },
    { t: 'Enable SIM Card PIN Locks', d: 'Set a lock PIN on your physical SIM card. This stops malicious actors from inserting your card into another phone to receive your OTP recovery text messages.' },
    { t: 'Use App-Based 2FA over SMS', d: 'Whenever possible, migrate two-factor authenticators from SMS texts to specialized security apps like Google Authenticator or hardware keys.' }
  ],
  'phy-s': [
    { t: 'Maintain Critical Battery Margins', d: 'To extend lithium battery lifespan, aim to keep your state of charge between 20% and 80%. Avoid keeping it fully discharged or connected to chargers indefinitely.' },
    { t: 'Install Tempered Glass Shockguards', d: 'Tempered glass with 9H hardness is engineered to shatter under impact, dispersing kinetic force away from your high-value OLED display.' },
    { t: 'Regulate Extreme Temperatures', d: 'Exposure to temperatures above 35°C (such as inside a hot car) triggers chemical degradation inside batteries and causes permanent capacity loss.' },
    { t: 'Apply Hydrophobic Screen Coating', d: 'Periodically clean with specialized screenshield liquid. Re-establishing oleophobic and hydrophobic coatings minimizes fingerprint grease and dust friction.' }
  ],
  'rep-s': [
    { t: 'Disconnect the Battery FIRST', d: 'When opening any device, the very first connection to uncouple must be the physical battery connector. This prevents high-current logic board short circuits.' },
    { t: 'Keep Track of Screws precisely', d: 'Always place screws on a magnetic grid chart. Accidentally inserting a slightly longer screw into a board socket can crack critical traces under the motherboard.' },
    { t: 'Use Safe Plastic Spudgers', d: 'Never insert metallic knives, tweezers, or razor blades near battery edges. One micro-puncture of the battery sleeve triggers dramatic thermal fires.' },
    { t: 'Apply Heat Safely and Uniformly', d: 'Use a heat plate or gun at 80°C to soften glass adhesive. Applying concentrated heat above 100°C will permanently warp LCD colors or burn delicate camera optics.' }
  ]
};

export const EMERGENCY_STEPS: Record<string, { t: string; s: string[] }> = {
  lost: {
    t: "Lost or Stolen Phone Emergency Recovery",
    s: [
      "Access another browser immediately: log in to icloud.com/find or google.com/android/find.",
      "Track the GPS location. If active and moving in unfamiliar territory, DO NOT confront individuals directly; contact local law enforcement.",
      "Trigger the 'Lost Mode' or 'Lock Device' action. Display a secondary phone number and custom message directly on the lockscreen.",
      "If you suspect the phone is gone forever or contains un-encrypted sensitive passwords, choose the 'Erase Device' command immediately to wipe everything.",
      "Notify your cellular carrier to suspend your SIM card number, stopping malicious OTP verification hijacking.",
      "Report your device IMEI number to the police to blacklist the device carrier network registration globally."
    ]
  },
  water: {
    t: "Water & Liquid Damage Instant Intervention",
    s: [
      "POWER OFF THE PHONE IMMEDIATELY. Never attempt to press buttons to check if the display works, as electrical currents trigger instant trace corrosion.",
      "Remove protective cases, headphone plugs, charging jacks, and pull out the SIM card tray immediately (this creates an exit route for trapped water).",
      "Wipe the phone down vigorously using an ultra-absorbent microfiber towel. Do not shake the device heavily, as this can force moisture deeper into screen gaskets.",
      "NEVER PLACE THE PHONE IN RICE. Rice dust and starch enter ports and create conductive paste with moisture, destroying connectors. Instead, use silica gel packs or place in a dry ventilated area.",
      "Do not charge the phone for at least 48 to 72 hours. Let internal moisture dry completely before re-introducing power."
    ]
  },
  screen: {
    t: "Cracked Glass & Broken LCD Damage Steps",
    s: [
      "Assess the damage: check if loose glass splinters are shedding or protruding from the display.",
      "Apply clear packing tape over the entire glass front. This locks loose shards in place and prevents fingers from getting cut while interacting.",
      "Back up all your device data immediately. If the touchscreen is unresponsive, connect a USB mouse via an OTG adapter to control the screen.",
      "If the display is leaking purple/black fluid (damaged active OLED), backup as fast as possible as the screen will become fully blank within a few hours.",
      "Schedule a display replacement. Full glass assemblies are recommended over glass-only repairs for beginners."
    ]
  }
};
