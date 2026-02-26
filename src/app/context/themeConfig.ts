// Theme color configuration
export const themeColors = {
  dark: {
    // Backgrounds
    bg: {
      primary: '#0A0E1A',
      secondary: '#0F1628',
      tertiary: '#1A2035',
      input: '#1A2035',
      card: 'rgba(15,22,40,0.95)',
      hover: 'rgba(255,255,255,0.05)',
    },
    // Text
    text: {
      primary: '#FFFFFF',
      secondary: '#8892A4',
      muted: '#6B7280',
      accent: '#00F5A0',
    },
    // Borders
    border: {
      primary: 'rgba(255,255,255,0.08)',
      secondary: 'rgba(255,255,255,0.10)',
      light: 'rgba(255,255,255,0.20)',
    },
    // Status colors
    status: {
      error: '#FF4757',
      success: '#00F5A0',
      warning: '#FFB800',
      info: '#00D9F5',
    },
  },
  light: {
    // Backgrounds
    bg: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      input: '#F1F5F9',
      card: '#FFFFFF',
      hover: 'rgba(0,0,0,0.02)',
    },
    // Text
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      muted: '#9CA3AF',
      accent: '#3B82F6',
    },
    // Borders
    border: {
      primary: 'rgba(0,0,0,0.08)',
      secondary: 'rgba(0,0,0,0.10)',
      light: 'rgba(0,0,0,0.15)',
    },
    // Status colors
    status: {
      error: '#DC2626',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#0891B2',
    },
  },
};

// CSS variable names that will be applied to :root
export const themeVariables = {
  // Backgrounds
  '--color-bg-primary': true,
  '--color-bg-secondary': true,
  '--color-bg-tertiary': true,
  '--color-bg-input': true,
  '--color-bg-card': true,
  '--color-bg-hover': true,
  // Text
  '--color-text-primary': true,
  '--color-text-secondary': true,
  '--color-text-muted': true,
  '--color-text-accent': true,
  // Borders
  '--color-border-primary': true,
  '--color-border-secondary': true,
  '--color-border-light': true,
  // Status
  '--color-status-error': true,
  '--color-status-success': true,
  '--color-status-warning': true,
  '--color-status-info': true,
};

// Function to apply theme variables to document root
export function applyThemeVariables(isDark: boolean) {
  const root = document.documentElement;
  const colors = isDark ? themeColors.dark : themeColors.light;

  // Apply background colors
  root.style.setProperty('--color-bg-primary', colors.bg.primary);
  root.style.setProperty('--color-bg-secondary', colors.bg.secondary);
  root.style.setProperty('--color-bg-tertiary', colors.bg.tertiary);
  root.style.setProperty('--color-bg-input', colors.bg.input);
  root.style.setProperty('--color-bg-card', colors.bg.card);
  root.style.setProperty('--color-bg-hover', colors.bg.hover);

  // Apply text colors
  root.style.setProperty('--color-text-primary', colors.text.primary);
  root.style.setProperty('--color-text-secondary', colors.text.secondary);
  root.style.setProperty('--color-text-muted', colors.text.muted);
  root.style.setProperty('--color-text-accent', colors.text.accent);

  // Apply border colors
  root.style.setProperty('--color-border-primary', colors.border.primary);
  root.style.setProperty('--color-border-secondary', colors.border.secondary);
  root.style.setProperty('--color-border-light', colors.border.light);

  // Apply status colors
  root.style.setProperty('--color-status-error', colors.status.error);
  root.style.setProperty('--color-status-success', colors.status.success);
  root.style.setProperty('--color-status-warning', colors.status.warning);
  root.style.setProperty('--color-status-info', colors.status.info);
}

// Utility function to get current theme colors
export function getThemeColors(isDark: boolean) {
  return isDark ? themeColors.dark : themeColors.light;
}
