# HeroUI v3 component icons

Research date: 2026-08-08

## Scope and source baseline

This note answers which HeroUI v3 components provide default icons, which icons consumers must
compose or supply, where the glyphs come from, and whether the glyph itself carries behavior or
accessibility semantics.

The workspace contains `@heroui/styles@3.2.4`, but not `@heroui/react`. The installed manifest is
[`apps/web/node_modules/@heroui/styles/package.json`](../../apps/web/node_modules/@heroui/styles/package.json),
and its generated component CSS is under
`apps/web/node_modules/@heroui/styles/dist/components/`. `@heroui/styles` contains selectors for icon
slots, but no React markup or SVG assets.

The React conclusions below use the official HeroUI repository at commit
[`21b1e8e`](https://github.com/heroui-inc/heroui/tree/21b1e8e53fd147284f7a19325db40330b84d0684).
At that commit both the official
[`@heroui/react` manifest](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/package.json)
and this workspace's installed styles manifest report version `3.2.4`.

Terminology used here:

- **Root automatic** means rendering the high-level/default path inserts the icon without the
  consumer adding an icon-bearing part.
- **Part fallback** means the consumer must place a compound part such as `Select.Indicator`; that
  part supplies a default glyph only when its own children are absent.
- **Consumer-supplied** means HeroUI has no default glyph for that visual slot.

This distinction matters in HeroUI v3 because most components are compound. A glyph can be built
into `Accordion.Indicator` without being automatically inserted by `Accordion.Root`.

## Executive findings

1. HeroUI v3 does **not** have a runtime icon-library dependency for these defaults. The
   [`@heroui/react` manifest](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/package.json#L36-L88)
   has no icon package in `dependencies` or `peerDependencies`. `@iconify/react` is a
   `devDependency`, and official docs also import `@gravity-ui/icons`; those packages are demo/story
   inputs, not runtime sources for HeroUI defaults.
2. The internal icon module exports 15 inline-SVG components. Chevron, close, calendar, status and
   navigation glyphs used here come from
   [`packages/react/src/components/icons.tsx`](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/icons.tsx).
   Checkbox and list-box checkmarks are inline SVG local to their component source. Spinner owns a
   separate inline SVG implementation.
3. React Aria supplies primitives, state, keyboard interaction, ARIA relationships and accessible
   button naming. It does **not** supply the HeroUI SVG artwork. This can be seen in each component's
   simultaneous imports from `react-aria-components` and HeroUI's local `../icons` module.
4. With the exception of Spinner's surrounding live status, all audited glyphs are decorative:
   internal SVGs use `aria-hidden="true"`/`role="presentation"`, or sit inside an `aria-hidden`
   wrapper. Behavior and accessible state come from the button/field/listbox React Aria primitive,
   not from the image.
5. Most defaults are **part fallbacks**, not Root-automatic icons. The main Root/default-path
   exceptions are the default Toast provider composition and Spinner.

## Component matrix

| Component / part                  | What appears by default                                                                             | Who must compose it?                                                                                       | Implementation source                        | Semantic classification                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Modal / Dialog close              | `Modal.CloseTrigger` renders the shared `CloseButton`, whose empty state contains an X              | Consumer must include `Modal.CloseTrigger`; `Modal.Root` does not inject it                                | Internal inline `CloseIcon`                  | X is decorative; close button and accessible name are behavior/a11y                  |
| Modal icon                        | No default glyph                                                                                    | Consumer supplies children to `Modal.Icon`, or omits the part                                              | None                                         | Consumer-defined                                                                     |
| AlertDialog close and status icon | CloseTrigger gets the same X fallback; `AlertDialog.Icon` gets Info/Success/Warning/Danger fallback | Consumer must include the respective parts                                                                 | Internal inline SVGs                         | Glyphs decorative; close action is behavioral                                        |
| Select chevron                    | `Select.Indicator` falls back to down chevron                                                       | Consumer must include `Select.Indicator`                                                                   | Internal inline `IconChevronDown`            | Decorative open-state cue                                                            |
| Select / ComboBox item check      | `ListBox.ItemIndicator` falls back to an animated checkmark                                         | Consumer must include one per item                                                                         | Inline SVG in list-box-item source           | Decorative; item selection semantics come from listbox option state                  |
| ComboBox trigger                  | Empty `ComboBox.Trigger` automatically gets a down chevron                                          | Consumer must include Trigger, but need not supply its child                                               | Internal inline `IconChevronDown`            | Decorative open-state cue                                                            |
| Autocomplete indicator / clear    | Indicator falls back to chevron; ClearButton always renders internal X                              | Consumer must include these parts                                                                          | Internal inline chevron/X                    | Decorative; clear action and names are behavioral/a11y                               |
| Accordion / Disclosure indicator  | Indicator part falls back to down chevron                                                           | Consumer must include Indicator                                                                            | Internal inline `IconChevronDown`            | Decorative expanded-state cue                                                        |
| Checkbox indicator                | Indicator falls back to checkmark or indeterminate line                                             | Consumer must include `Checkbox.Indicator`                                                                 | Inline SVG in checkbox source                | Decorative; checked/indeterminate semantics are on the field/button                  |
| Radio indicator                   | No SVG; empty indicator is drawn as a CSS pseudo-element dot                                        | Consumer includes Control + Indicator; no icon child required                                              | `@heroui/styles` CSS                         | Decorative visual state                                                              |
| Switch                            | No default icon; track and thumb are CSS                                                            | Consumer supplies children to `Switch.Icon` if desired                                                     | `@heroui/styles` CSS; no glyph               | Icons optional and decorative                                                        |
| DatePicker trigger                | TriggerIndicator falls back to calendar glyph                                                       | Consumer must include TriggerIndicator                                                                     | Internal inline `IconCalendar`               | Decorative; trigger behavior/name come from React Aria                               |
| Calendar navigation               | Previous/next NavButton falls back to left/right chevrons according to `slot`                       | Consumer must include each NavButton                                                                       | Internal inline chevrons                     | Decorative; nav button behavior/name come from React Aria                            |
| Calendar year-picker trigger      | TriggerIndicator falls back to right chevron                                                        | Consumer must include the indicator                                                                        | Internal inline chevron                      | Decorative expanded-state cue                                                        |
| Calendar cell indicator           | Empty styled span; no SVG                                                                           | Consumer conditionally includes it                                                                         | CSS shape only                               | Decorative event/current-date marker                                                 |
| Pagination previous/next          | PreviousIcon/NextIcon parts fall back to chevrons; Ellipsis renders `&hellip;`                      | Consumer composes buttons and icon parts                                                                   | Internal inline chevrons                     | Icons/ellipsis are `aria-hidden`; buttons need text or an accessible label           |
| Alert status                      | Indicator falls back to Info/Success/Warning/Danger according to `status`                           | Consumer must include `Alert.Indicator`                                                                    | Internal inline status SVGs                  | Decorative; Alert root itself does not gain semantics from the icon                  |
| Toast default path                | Status icon by variant; Spinner for `isLoading`; X close button                                     | Default `Toast.Provider` composition inserts these automatically; custom composition can replace/omit them | Internal status SVGs, Spinner SVG, CloseIcon | Glyphs decorative; React Aria Toast/close button and Spinner wrapper carry semantics |
| Spinner                           | Always renders its built-in SVG                                                                     | Root automatic; no icon input required                                                                     | Inline SVG with gradients in spinner source  | SVG decorative, but wrapper is `role="status"` with `aria-label="Loading"`           |

## Detailed evidence

### Modal, AlertDialog and the shared close button

`Modal` is explicitly exported as a compound component, and `CloseTrigger` is only one member of
that namespace; the Root does not insert it
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/modal/index.ts#L17-L32)).
The official default demo manually places `<Modal.CloseTrigger />`
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/modal/default.tsx#L8-L18)).

`ModalCloseTrigger` delegates to the shared `CloseButton` with React Aria's `slot="close"`
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/modal/modal.tsx#L348-L366)).
`CloseButton` supplies `<CloseIcon>` only when children are absent, while the button itself has
`aria-label="Close"` and `type="button"`
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/close-button/close-button.tsx#L19-L45)).
The X SVG in the internal icon module is `aria-hidden` and `role="presentation"`
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/icons.tsx#L113-L135)).
Therefore the X is not required for closing or naming the button; it is the default visible glyph.

`Modal.Icon` is only a styled container and renders exactly its children, with no fallback
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/modal/modal.tsx#L320-L345)).
The official demo imports its Rocket from the external `@gravity-ui/icons` package, confirming that
this content is consumer-supplied rather than a HeroUI runtime default
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/modal/default.tsx#L1-L17)).

`AlertDialog.CloseTrigger` uses the same shared CloseButton. Separately, `AlertDialog.Icon` defaults
to HeroUI's local Info/Success/Warning/Danger SVG according to `status`; custom children replace it
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/alert-dialog/alert-dialog.tsx#L286-L349)).

### Select, ComboBox, Autocomplete and item checkmarks

`Select.Indicator` clones a custom child when supplied; otherwise it renders the local down-chevron
SVG and adds `data-open` from `SelectStateContext`
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/select/select.tsx#L104-L147)).
The official default composition manually places the indicator inside the trigger
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/select/default.tsx#L5-L11));
the custom-indicator demo supplies a Gravity UI glyph as children
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/select/custom-indicator.tsx#L1-L13)).

`ComboBox.Trigger` differs slightly: once the consumer includes an empty Trigger, the Trigger itself
uses the local down chevron as its `children ??` fallback
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/combo-box/combo-box.tsx#L155-L228)).
The official default demo uses exactly `<ComboBox.Trigger />`
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/combo-box/default.tsx#L7-L13)).

Autocomplete's Indicator has the same custom-child-or-chevron fallback. Its ClearButton always
renders the local X and supplies `aria-label="Clear selection"`; clearing the selection is handled
separately by the button's click handler
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/autocomplete/autocomplete.tsx#L166-L210),
[clear source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/autocomplete/autocomplete.tsx#L278-L332)).

Select, ComboBox and Autocomplete all use the shared ListBox composition for options. The consumer
must include `ListBox.ItemIndicator` in an item. With no custom child, it renders a local inline SVG
polyline whose stroke offset follows `state.isSelected`; both wrapper and SVG are hidden from the
accessibility tree
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/list-box-item/list-box-item.tsx#L51-L104)).
React Aria's `ListBoxItem` owns option selection semantics
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/list-box-item/list-box-item.tsx#L25-L49)).

### Accordion and Disclosure

`Accordion.Indicator` reads expanded state from React Aria's `DisclosureStateContext`, decorates a
custom child when present, and otherwise renders HeroUI's local chevron
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/accordion/accordion.tsx#L89-L132)).
The Indicator part must be placed inside the trigger. The official basic demo does so and happens to
supply a Gravity UI chevron
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/accordion/basic.tsx#L50-L69)).
The standalone Disclosure component follows the same local-chevron fallback pattern
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/disclosure/disclosure.tsx#L147-L185)).
Expansion behavior and accessible expanded state are provided by React Aria Disclosure/Button, not
by the SVG.

### Checkbox, Radio and Switch

`Checkbox.Indicator` is a manually composed part. Without custom children it renders either an
inline indeterminate line or an inline animated checkmark; both SVGs are presentation-only
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/checkbox/checkbox.tsx#L117-L181)).
The official basic composition explicitly nests Indicator under Control
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/checkbox/basic.tsx#L3-L13)).
React Aria's CheckboxField/CheckboxButton own checked semantics and interaction
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/checkbox/checkbox.tsx#L29-L80)).

Radio has no internal SVG. `Radio.Indicator` renders optional custom content, and its empty default
is a styled span
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/radio/radio.tsx#L103-L132)).
The installed `radio.css` creates the default dot with `.radio__indicator:empty::before`, while the
official basic example includes an empty `<Radio.Indicator />`
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/radio-group/basic.tsx#L8-L33)).

Switch likewise has no default icon. Its base composition is CSS track + thumb; `Switch.Icon` only
renders consumer children
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/switch/switch.tsx#L73-L158)).
The basic example uses no icon
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/switch/basic.tsx#L3-L13));
the icon example imports all glyphs from `@gravity-ui/icons` and supplies them through
`Switch.Icon`
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/switch/with-icons.tsx#L1-L67)).

### DatePicker and Calendar

`DatePicker.TriggerIndicator` is an `aria-hidden` wrapper that falls back to HeroUI's local calendar
SVG
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/date-picker/date-picker.tsx#L129-L159)).
The default demo manually composes Trigger and TriggerIndicator
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/date-picker/basic.tsx#L7-L18));
custom children replace the calendar glyph
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/date-picker/with-custom-indicator.tsx#L6-L20)).

`Calendar.NavButton` chooses local left/right chevrons from its `previous`/`next` slot when children
are absent
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/calendar/calendar.tsx#L206-L239)).
The consumer still composes both buttons
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/calendar/basic.tsx#L5-L19)).
The year-picker TriggerIndicator likewise supplies a local right-chevron fallback, but only after the
consumer includes the part
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/calendar-year-picker/calendar-year-picker.tsx#L179-L204)).

`Calendar.CellIndicator` contains no SVG at all. It is an `aria-hidden` styled span, conditionally
inserted by the consumer for events or other markers
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/calendar/calendar.tsx#L396-L423)).

### Pagination

Pagination does not generate the pagination model or navigation actions; consumers compose its
buttons. `PreviousIcon` and `NextIcon` are separate, manually inserted parts with local-chevron
fallbacks, each inside an `aria-hidden` wrapper
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/pagination/pagination.tsx#L185-L293)).
The official basic demo includes visible Previous/Next text as well as the icon parts
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/pagination/basic.tsx#L10-L33)).
Because the icon wrapper is hidden, an icon-only pagination button would need a separate accessible
label. `Pagination.Ellipsis` renders the typographic ellipsis itself and also hides it from assistive
technology
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/pagination/pagination.tsx#L295-L323)).

### Alert

`Alert.Indicator` maps status to HeroUI's local Info/Success/Warning/Danger inline SVG and lets
children replace it
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/alert/alert.tsx#L61-L103)).
It is not inserted by `Alert.Root`; the official examples explicitly include `<Alert.Indicator />`
and add a shared `CloseButton` only when desired
([demo](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/apps/docs/src/demos/en/alert/basic.tsx#L4-L91)).
The status SVGs are all presentation-only in the internal icon source. Also, `Alert.Root` defaults to
a `div` and does not add `role="alert"` in its implementation
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/alert/alert.tsx#L26-L59)).
Therefore the status glyph does not by itself announce status; semantic text and any consumer-added
live-region role remain important.

### Toast

Toast has both compound and high-level default paths. At part level, `Toast.Indicator` falls back to
the same local status SVGs, and `Toast.CloseButton` delegates to the shared CloseButton/X
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/toast/toast.tsx#L209-L318)).

Unlike most audited components, `Toast.Provider` owns a default composition when no custom children
are supplied. It automatically renders:

- no Indicator when `indicator === null`;
- Spinner inside Indicator when `isLoading`;
- otherwise Indicator with custom children or its status-icon fallback;
- and a CloseButton for every default toast.

This branch is visible in the official source
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/toast/toast.tsx#L425-L500)).
The public toast options expose `indicator` and `isLoading`, and `toast.promise` creates a loading
toast automatically
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/toast/toast-queue.ts#L121-L164),
[promise source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/toast/toast-queue.ts#L193-L228)).
Toast behavior and announcements come from React Aria's unstable Toast primitives, not from the
status SVG.

### Spinner

Spinner is the clearest true single-component default. `SpinnerRoot` always renders its private
inline SVG with two gradients. The SVG is `aria-hidden`, while the wrapper is `role="status"` and
has `aria-label="Loading"`
([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/spinner/spinner.tsx#L12-L97)).
Thus the drawn spinner is decorative, but the component's surrounding accessible status is not.
There is no icon prop or child-replacement seam in this implementation; a different drawing requires
a custom component rather than passing an icon to Spinner.

### Other built-in defaults

The same policy appears outside the requested component set:

- SearchField's manually composed `SearchIcon` falls back to the internal search SVG, while its
  ClearButton uses the shared close/X fallback
  ([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/search-field/search-field.tsx#L93-L149)).
- NumberField's manually composed increment/decrement buttons fall back to the internal plus/minus
  SVGs
  ([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/number-field/number-field.tsx#L92-L146)).
- MenuItem's manually composed selection indicator owns component-local dot/check SVGs, while its
  submenu indicator falls back to the internal right chevron
  ([source](https://github.com/heroui-inc/heroui/blob/21b1e8e53fd147284f7a19325db40330b84d0684/packages/react/src/components/menu-item/menu-item.tsx#L52-L158)).

These are consistent with the main finding: consumers explicitly compose behavior/visual parts,
and those parts may provide presentation-only fallback artwork.

## Implications for a Foldkit-native UI package

- Do not treat all HeroUI defaults as assets that every Root must inject. The v3 pattern is mostly
  “explicit part with a default glyph.” Foldkit parts can follow the same distinction.
- A small internal icon module is sufficient for close, chevrons, calendar and status glyphs. There
  is no need to make an external icon library a runtime or peer dependency merely to match HeroUI.
- Keep behavior attributes and accessible names on controls. Render fallback SVGs as
  `aria-hidden`/presentation-only so replacing a glyph cannot remove behavior or accessible state.
- Checkbox/ListBox checkmarks are state-derived visual output, not state owners. Foldkit should drive
  them from official RenderInfo/data attributes.
- Spinner is different: its glyph is still decorative, but its `role="status"` and accessible label
  belong to the component contract and should survive visual replacement.
- For Toast, decide explicitly whether the convenience API owns a default visual composition. That
  is the one audited HeroUI path where icons, Spinner and close control are genuinely inserted by a
  higher-level default recipe.
