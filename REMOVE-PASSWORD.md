# 🔒 Site Password Protection (Testing Mode)

The site is currently password-protected for the testing/development phase.

**Password:** `testShoe Place@2026`

---

## How to Remove Password Protection (Go Live)

When you are ready to launch the site publicly, follow these **2 simple steps**:

### Step 1: Edit `components/Providers.tsx`

Open the file and change it from this:

```tsx
import { SiteGate } from './SiteGate';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteGate>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SiteGate>
  );
}
```

**To this** (just remove the SiteGate wrapper and its import):

```tsx
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
```

### Step 2: Delete the Gate File

Delete this file: `components/SiteGate.tsx`

---

### Step 3: Deploy

```bash
# On your VM terminal:
bash deploy.sh
```

That's it! The site will be fully public after deploying.
