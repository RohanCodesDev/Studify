---
name: studify-visual-style
description: >-
  Use this skill whenever designing, authoring, styling, or reviewing user interface components,
  pages, layouts, animations, or themes for the Studify frontend.
---

# Studify Visual Style & Frontend Design Skill

This skill governs all UI/UX implementations in the Studify platform. The goal is to provide a calm, delicate, and premium learning environment tailored for MAKAUT students.

---

## 1. Core Design Philosophy

- **Quiet over loud:** Low-contrast surfaces, hairline borders (`border border-[#E7A9B5]/20`), soft diffuse shadows, generous whitespace. Color is an accent, never a flood.
- **Reading comes first:** Notes, quizzes, and exam papers get the best typography and the least visual clutter.
- **Smooth everywhere:** No jarring jumps or snaps. Every state eases gently into the next.
- **Personal:** Students can pick their mood theme; themes cross-fade across the screen.
- **Soft but readable:** Pastels are strictly for backgrounds and fills. Text always stays sufficiently dark to ensure high readability and pass WCAG contrast standards.

---

## 2. Typography Rules

| Role | Font Family | Usage |
| :--- | :--- | :--- |
| **Headings** | `Urbanist` | Clean, modern sans-serif for headers (`font-light` to `font-semibold`) |
| **Body & Notes** | `Product Sans` | Modern, clean geometric sans-serif for study notes, explanations, questions, long reading |
| **Small UI & Data** | `Urbanist` | Buttons, labels, badges, numbers, table cells, timers, inputs |
| **Bengali Fallback**| `Noto Serif Bengali` / `Noto Sans Bengali` | Notes & Headings in Bengali |
| **Hindi Fallback**  | `Noto Serif Devanagari` / `Noto Sans Devanagari` | Notes & Headings in Hindi |

### Reading View Typography Rules
- **Line Length:** Max 60 to 70 characters (`max-w-prose` or `max-w-2xl`).
- **Line Height:** Relaxed line spacing (`leading-relaxed` or `leading-[1.65]`).
- **Base Size:** 18px–20px (`text-lg` or `text-xl`) for serif reading notes.
- **Ink Color:** Soft dark ink (`#3B3540`) instead of pure black (`#000000`).

---

## 3. Color Themes & Roles

Colors are mapped to semantic roles (`bg`, `card`, `ink`, `accent`, `border`, `success`, `warning`). Never hardcode arbitrary bright neon hex codes in UI components.

| Theme Name | Page Background | Primary Accent |
| :--- | :--- | :--- |
| **Blush Rose** (Default) | `#FCF5F4` | `#E7A9B5` |
| **Sage Mist** | `#F4F7F2` | `#A9C5A7` |
| **Lavender Haze** | `#F6F4FB` | `#B9ABE3` |
| **Sky Whisper** | `#F2F7FB` | `#A5C8E8` |
| **Butter Cream** | `#FBF8EE` | `#E8D08E` |
| **Peach Glow** | `#FDF5EF` | `#F0B79A` |
| **November Rain** | `#F0F3F6` | `#9DB2C7` |

### General Palette Roles:
- **Card Surface:** Warm-white (`#FFFFFF` with 70–90% opacity or `#FAFAF9`)
- **Default Text (Ink):** `#3B3540`
- **Muted Text:** `#3B3540` with 60–75% opacity (`text-[#3B3540]/70`)
- **Hairline Borders:** Accent color with 20–30% opacity (`border-[#E7A9B5]/25`)
- **Gentle Success:** Soft muted green (`#EAF3E8` bg, `#2E5929` text)
- **Gentle Warning / Missed:** Muted rose / peach (`#FBECEE` bg, `#8C3A48` text) — **NEVER harsh bright red**.
- **Dark Mode:** Deep, muted, tinted tones matching the theme's hue (e.g. `#1A1618` for Blush Rose), **never pure `#000000`**.

---

## 4. Motion & Animation Standards

The interface should feel like it gently breathes:
- **Micro-interactions:** 150ms–250ms with `cubic-bezier(0.16, 1, 0.3, 1)` or standard gentle ease-out.
- **Card & Button press:** Slight rise on hover (`-translate-y-0.5`), soft press-down on active (`scale-[0.98]`).
- **Waiting states:** Soft shimmer skeletons and gentle breathing pulses (`animate-pulse`). Avoid spinning loaders where possible.
- **Correct answer:** Soft glowing halo and gentle slide-open of the explanation.
- **Wrong answer:** Soft color shift and encouraging text; **no screen shaking, red flashes, or vibration buzzer**.
- **Exam paper mode:** Animations disabled or minimized to keep total focus under the exam timer.
- **Accessibility:** Always respect `prefers-reduced-motion: reduce` by replacing drifts with simple opacity fades.

---

## 5. Key Screen Blueprints

1. **Dashboard:** Warm greeting, today's focus topic, progress rings, single prominent next action.
2. **Session Study / Topic Map:** Chapter lists showing topic badges with soft tones:
   - Covered: soft green tint
   - Thin: soft amber/cream tint
   - Missing: soft rose tint
3. **Reading View:** Serif text, wide margins, unobtrusive tool panel that hides in "Focus Mode".
4. **Quiz Card:** Single question per card, clear tap targets, generous padding, gentle immediate feedback.
5. **Exam Paper:** Designed like a formal MAKAUT printed question paper: serif, structured sections (Group A, Group B, Group C), unobtrusive countdown timer.

---

## 6. Mobile-First Standards & Thumb Ergonomics

Studify is strictly **mobile-first**:
- **Touch Target Size:** All buttons, pills, options, and interactive controls must have at least `44px × 44px` physical touch area (`min-h-[44px]`).
- **Thumb Reach & Navigation:** Primary controls and navigation belong in the lower half of the screen (bottom bars and floating bottom docks) so students can comfortably reach them with one hand.
- **Bottom Sheets over Modals:** Use sliding bottom sheets with a grab bar rather than desktop-style centered popup dialogs or awkward right-side drawers on phone screens.
- **Safe-Area Insets:** Always support modern mobile notch/home-bar geometry using `env(safe-area-inset-bottom)`.
- **Performance on Budget Phones:** Many MAKAUT students use budget Android devices. Avoid heavy GPU filters, continuous heavy blurs, and large box-shadow cascades. Rely on CSS opacity, translates, and hairline borders.
