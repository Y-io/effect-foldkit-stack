# @pkg/ui

A styled, Foldkit-native UI layer. `@foldkit/ui` owns behavior and state;
`@pkg/ui` supplies complete default views, semantic variants and CSS.

The package has no build step. Its exports point directly to TypeScript and CSS
source, which the consuming application compiles.

```ts
import { Button, Dialog } from "@pkg/ui";
import "@pkg/ui/styles.css";
```

Component subpaths provide both a default facade and named exports:

```ts
import Dialog from "@pkg/ui/dialog";
import { view, type ViewInputs } from "@pkg/ui/dialog";
import DialogPrimitive from "@pkg/ui/primitives/dialog";
```

Stateful components use the normal Foldkit Submodel protocol:

```ts
h.submodel({
  slotId: "edit-dialog",
  model: model.dialog,
  view: Dialog.view,
  toParentMessage: (message) => GotDialogMessage({ message }),
  viewInputs: {
    heading: "Edit profile",
    description: "Changes take effect immediately.",
    content: () => formView(model, h),
    footer: () => footerView(model, h),
  },
});
```

The parent delegates `GotDialogMessage` to `Dialog.update` explicitly. The
styled package does not introduce hooks, callbacks, hidden component state or a
second component runtime.
