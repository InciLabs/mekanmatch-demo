# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## UI System (Expo Native)

This app ships with a fully-migrated, Expo-native UI library located at `app/components/ui/`.

### Highlights

- **Theming**: All components consume `useTheme()` from `app/contexts/ThemeContext.tsx`.
- **Provider**: The app is wrapped with `ThemeProvider` in `app/_layout.tsx`.
- **Single entrypoint**: Import components from `app/components/ui/index.ts`.
- **Examples**: Every component has a Storybook story for quick testing.

### Common imports

```ts
import { Button, Card, Accordion, Select, Dialog, Sheet } from "@/app/components/ui";
```

### Components (selected)

- **Navigation/menus**: `NavigationMenu`, `Menubar`, `ContextMenu`, `Popover`, `DropdownMenu`, `Tabs`, `Drawer`, `Sidebar`
- **Layout/structure**: `Card`, `Breadcrumb`, `Pagination`, `AspectRatio`, `Separator`, `Collapsible`
- **Inputs/forms**: `Input`, `Checkbox`, `RadioGroup`, `Select`, `Textarea`, `Switch`, `Toggle`, `ToggleGroup`, `InputOTP`, `Form`
- **Feedback/display**: `Alert`, `ToastProvider/useToast`, `Avatar`, `Badge`, `Calendar`, `Carousel`, `SimpleBarChart`, `Progress`, `Slider`, `Skeleton`, `Table`, `Tooltip`, `AlertDialog`, `Dialog`, `Sheet`, `Accordion`
- **Utilities**: `ScrollArea`, `Resizable`

## Storybook (React Native)

All UI components include stories for rapid iteration under `app/components/ui/*.stories.tsx`.

### Run

Depending on your setup, you can run Storybook alongside Expo. A typical pattern:

```bash
# Example (adjust to your scripts)
npm run storybook
```

Open the Storybook UI and navigate through the `Components/UI/*` stories.

## TypeScript build / type-check

Because Expo uses Metro, there isn’t a traditional “tsc build” step for bundling; Metro transpiles on the fly. However, you should still run TypeScript’s type-checker to catch errors outside the runtime:

```bash
# Type-check the whole repo (no output files)
npx tsc -p tsconfig.json --noEmit

# Or add a script and run it
npm run typecheck
```

If the command reports no errors, your TypeScript types are sound. Editors like VS Code also run the TS server continuously for inline diagnostics.

## Legacy directories

- `replit-generated/` – legacy web scaffolding (Vite/Tailwind). Not used by the Expo app.
- `app/replit_ui/components/ui/` – legacy UI set. Its functionality has been migrated to `app/components/ui/`.

## Theming

- Provider: `ThemeProvider` in `app/_layout.tsx`
- Hook: `useTheme()` from `app/contexts/ThemeContext.tsx`
- Theme exposes `colors`, `spacing`, `radii`, and helpers like `toggleColorMode()`.

## Notifications (placeholder)

`NotificationProvider` lives at `app/contexts/NotificationContext.tsx` and currently logs notifications. Replace with Expo Notifications or your backend when ready.
