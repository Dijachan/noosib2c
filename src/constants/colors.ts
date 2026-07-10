/**
 * Noosi Design System – Color Palette
 *
 * Main:       #06565F  Deep Teal       – primary actions, CTA buttons, headers
 * Support 1:  #D6FB00  Electric Lime   – highlights, active states, badges
 * Support 2:  #ECFFB6  Soft Lime       – backgrounds, tinted cards, chips
 * Macro:      #FF6F61  Coral           – alerts, warnings, missed dose, destructive actions
 *
 * Semantic aliases:
 *   primary    → main
 *   accent     → support1
 *   success    → #10B981 (kept neutral green for taken/success states)
 *   error      → macro (coral replaces red for missed/warning)
 */

export const Colors = {
  // Brand
  main: '#06565F',
  support1: '#D6FB00',
  support2: '#ECFFB6',
  macro: '#FF6F61',

  // Semantic shorthands
  primary: '#06565F',
  primaryLight: '#E6F3F4',  // light teal tint for backgrounds
  accent: '#D6FB00',
  accentMuted: '#ECFFB6',
  danger: '#FF6F61',
  dangerLight: '#FFF1EE',   // light coral tint

  // Neutrals (unchanged)
  white: '#FFFFFF',
  black: '#040921',
  ink: 'rgba(4,9,33,0.76)',
  inkMid: 'rgba(4,9,33,0.4)',
  inkFaint: 'rgba(4,9,33,0.06)',
  border: '#E5E7EB',
  surface: '#F8FAFC',
  surfaceAlt: '#F9FAFB',

  // Status
  success: '#10B981',
  successLight: 'rgba(16,185,129,0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245,158,11,0.1)',

  // Main with opacity (frequently used)
  mainAlpha10: 'rgba(6,86,95,0.08)',
  mainAlpha20: 'rgba(6,86,95,0.15)',
} as const;

export default Colors;
