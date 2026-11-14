MAKAUT Study Platform: Style Guide
Nov 14, 2026 · @Rohan
The platform looks calm, delicate and premium: soft pastel themes, Urbanist headings over EB Garamond body text, generous space and motion that is felt more than seen.
1. Design principles
• Quiet over loud. Low-contrast surfaces, hairline borders, soft shadows and plenty of white space. Colour is an accent, not a flood.
• Reading comes first. Notes, quizzes and exam papers get the best typography and the least clutter.
• Smooth everywhere. Nothing jumps or snaps. Every change of state eases from one look to the next.
• Personal. Students pick their own colour mood, so the app feels like theirs.
• Soft but readable. Pastel is for backgrounds and fills. Text always stays dark enough to read comfortably.
2. Typography
Use
Font
Notes
Headings
Urbanist
Clean, modern sans-serif that contrasts with the serif body
Body text
EB Garamond
Notes, explanations, questions and all long reading
Small interface text
Urbanist (proposed)
Buttons, labels, numbers, table cells, timers, form fields
Bengali body
Noto Serif Bengali
Fallback, since neither main font covers Bengali
Bengali headings
Noto Sans Bengali
Fallback
Hindi
Noto Serif Devanagari and Noto Sans Devanagari
Fallbacks for body and headings
• All fonts are free on Google Fonts. Serve them from the app itself, with only the weights in use, so text appears fast on slow networks.
• EB Garamond gets thin at small sizes on phones. That is why marks, scores, timers and buttons use Urbanist, and why no third font is needed.
• Reading comfort: line length about 60 to 70 characters, line spacing about 1.6 to 1.7, and a slightly larger base size for notes than for the interface.
• Test mixed English and Bengali lines early so the two scripts look balanced together.
3. Colour themes
Colour is built as named roles: page background, card surface, text, soft text, accent, soft accent, border, success and gentle warning. Every screen uses roles, never fixed colours, so changing a theme changes the whole app at once.
Theme
Page background
Accent
Blush Rose
#FCF5F4
#E7A9B5
Sage Mist
#F4F7F2
#A9C5A7
Lavender Haze
#F6F4FB
#B9ABE3
Sky Whisper
#F2F7FB
#A5C8E8
Butter Cream
#FBF8EE
#E8D08E
Peach Glow
#FDF5EF
#F0B79A
November Rain
#F0F3F6
#9DB2C7
Shared across all themes: warm-white card surfaces, text in a soft dark ink (around #3B3540) instead of pure black, and borders in a very light tint of the accent. These values are starting points: adjust by eye on a real phone screen.
Customisation options
• Choose any theme above.
• Light, dark, or follow the phone. Dark versions use deep, muted backgrounds tinted with the theme's hue, never pure black, so the pastel mood carries over.
• A custom accent colour picker. The app generates the matching soft tints and borders and quietly adjusts them if the result would be hard to read.
• Reading settings: text size, and a warmer or cooler paper tone.
• Choices save to the account, and to the device for people who have not signed in. A theme change cross-fades across the screen instead of flashing.
Readability rules
• Pastel accents are for fills, highlights, progress and borders. Small text never uses a pastel colour.
• Where accent-coloured text is needed (links, active tabs), use a deeper shade of the same colour.
• Check text contrast for every theme in both light and dark versions.
• Meaning is never carried by colour alone: a correct answer also gets an icon and a word.
• Right and wrong answers use gentle tones (soft green and muted rose), never harsh red.
4. Surfaces and layout
• Large rounded corners, hairline borders and soft, diffuse shadows that lift cards slightly.
• Generous spacing and a calm rhythm: fewer things on screen, each with room.
• Thin line icons in one consistent style, with fine strokes that suit the typography.
• Frosted-glass and blur effects sparingly or not at all, since they can slow budget phones.
• Mobile first: comfortable tap areas, a thumb-friendly bottom bar, and the same calm look scaled up for desktop.
5. Motion
Motion should be felt, not noticed. The app should seem to breathe.
Moment
Behaviour
Micro-interactions
About 150 to 250 ms, gentle easing that starts and stops softly
Larger transitions
About 300 to 450 ms
Page changes
Short fade with a tiny upward drift, so screens arrive instead of appearing
Lists and cards
Items fade in one after another with a very small delay
Buttons and cards
Slight rise on hover, soft press-down on tap
Progress
Rings and bars fill smoothly, scores count up gently
Correct answer
Soft glow, explanation slides open
Wrong answer
Soft colour change and a kind message, no shaking or buzzing
Waiting states
Slow, soft shimmer skeletons and a gentle breathing pulse while files process or notes generate
Theme change
Colours cross-fade across the whole screen
Exam paper mode
Almost no animation, so the screen stays quiet and focused under a timer
Keeping it smooth on real phones
• Animate only movement and fading. Avoid animating sizes, shadows and blurs on large areas.
• Test on a low-end Android phone, since many students use one. If it stutters, simplify.
• Respect the phone's reduce-motion setting by switching to simple fades, and offer an in-app setting to turn animation down.
• Use plain CSS transitions for most effects. Add an animation library only for page and list transitions, to keep the app light.
6. Key screens
Screen
Feel
Home and dashboard
Soft greeting, today's study plan, progress rings, one clear next action
Session Study
Chapter list with gentle progress, a topic map showing covered, thin and missing topics in soft tones
Notes and reading view
Pure reading: serif text, wide margins, quiet tools that appear on demand, a focus mode that hides everything else
Quiz
One question at a time on a calm card, smooth option selection, gentle feedback
Exam paper
Looks like a real question paper: plain, serif, minimal colour, a quiet timer
Library
Soft cards with subject colours drawn from the chosen theme
Progress
Calm charts in the theme's accent tints, encouraging wording
7. Premium details
• Warm, encouraging wording instead of technical or stern messages.
• Friendly empty states with a light illustration and one clear next step.
• An instant feel: show cached or placeholder content immediately and fill in details, so nothing seems to wait.
• Consistent spacing, sizes and icon style everywhere. Inconsistency is what breaks a premium feel.
• Small touches: soft haptic taps on phones where supported, a gentle moment of completion at the end of a chapter, and a tidy printable layout for notes and papers.
8. Build order for the style work
Phase
Design work
0 Foundations
Fonts, colour roles, first two themes, spacing and motion rules set up once
1 Ingestion
Upload screen, calm processing states, skeletons
2 Session Study
Session, topic map and reading view at full polish
3 Quizzes
Quiz card, feedback animations, progress visuals
4 Exam papers
Paper-style layout, timer, printable version
5 Polish and growth
All themes, custom accent picker, dark mode, reduced-motion setting, device testing
9. Still to decide
• Which two themes ship first, and which is the default.
• Whether dark mode is needed at launch or after the light themes are polished.
• Whether small interface text uses Urbanist (proposed) or another font.
• Which low-end phone you will test on.