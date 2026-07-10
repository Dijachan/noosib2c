#!/usr/bin/env bash
# Noosi colour migration v2 — uses find with -print0 to handle spaces in path

SRC="/Users/mac/Documents/Antigravity/noosib2c copy/src"

replace() {
  local old="$1"
  local new="$2"
  find "$SRC" \( -name "*.tsx" -o -name "*.ts" \) -print0 | \
    xargs -0 grep -l "$old" 2>/dev/null | \
    while IFS= read -r f; do
      sed -i '' "s|$old|$new|g" "$f"
    done
}

# PRIMARY BLUE → MAIN TEAL
replace '#0463DD' '#06565F'
replace '#0563DD' '#06565F'
replace 'rgba(4,99,221,0.08)' 'rgba(6,86,95,0.08)'
replace 'rgba(4,99,221,0.1)' 'rgba(6,86,95,0.1)'
replace 'rgba(4,99,221,0.15)' 'rgba(6,86,95,0.15)'
replace 'rgba(4,99,221,0.2)' 'rgba(6,86,95,0.2)'

# SECONDARY BLUE → TEAL
replace '#3B82F6' '#06565F'
replace 'rgba(59,130,246,0.08)' 'rgba(6,86,95,0.08)'
replace 'rgba(59,130,246,0.1)' 'rgba(6,86,95,0.1)'
replace 'rgba(59,130,246,0.15)' 'rgba(6,86,95,0.15)'

# PURPLE (AI accent) → LIME (support1)
replace '#8B5CF6' '#D6FB00'
replace 'rgba(139,92,246,0.08)' 'rgba(214,251,0,0.15)'
replace 'rgba(139,92,246,0.1)' 'rgba(214,251,0,0.15)'
replace 'rgba(139,92,246,0.15)' 'rgba(214,251,0,0.2)'
replace '#6366F1' '#D6FB00'
replace '#F5F3FF' '#ECFFB6'

# RED / DESTRUCTIVE → MACRO CORAL
replace '#EF4444' '#FF6F61'
replace 'rgba(239,68,68,0.1)' 'rgba(255,111,97,0.1)'
replace 'rgba(239,68,68,0.08)' 'rgba(255,111,97,0.08)'
replace '#DC2626' '#FF6F61'
replace '#991B1B' '#7F2218'
replace '#7F1D1D' '#7F2218'
replace '#FFF5F5' '#FFF1EE'
replace '#FEF2F2' '#FFF1EE'
replace '#FFF1F2' '#FFF1EE'
replace '#FECDD3' '#FFD5CF'

# LIGHT BLUE TINTS → TEAL TINTS
replace '#EBF5FF' '#E6F3F4'
replace '#F0F7FF' '#E6F3F4'

# OLD GREENS/TEALS → MAIN TEAL (cleanup)
replace '#15F597' '#D6FB00'
replace '#065F46' '#06565F'
replace '#047857' '#06565F'
replace '#14B8A6' '#06565F'

# PINK / MAGENTA → CORAL
replace '#EC4899' '#FF6F61'
replace 'rgba(236,72,153,0.08)' 'rgba(255,111,97,0.08)'

# ORANGE → MACRO CORAL  
replace '#F97316' '#FF6F61'

echo "✅ v2 Color migration complete."
