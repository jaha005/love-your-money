import type { ReactNode } from "react";
import { Sidebar, type NavItem } from "@/components/sidebar";
import { signOut } from "@/app/login/actions";

/**
 * Editorial layout: sidebar 260px lijevo, sadržaj max 960px,
 * desno kolona 300px za kontekst. Na mobitelu rail ide ispod sadržaja.
 */
export function Shell({
  items,
  userName,
  userRole,
  rail,
  children,
}: {
  items: NavItem[];
  userName: string;
  userRole: string;
  rail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <a href="#sadrzaj" className="skip-link">
        Preskoči na sadržaj
      </a>
      <Sidebar items={items} userName={userName} userRole={userRole} signOut={signOut} />
      <div className="lg:pl-sidebar">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8 px-5 py-7 lg:flex-row lg:gap-9 lg:px-9 lg:py-9">
          <main id="sadrzaj" tabIndex={-1} className="min-w-0 flex-1 lg:max-w-content">
            {children}
          </main>
          {rail ? (
            <aside className="w-full shrink-0 lg:w-rail">
              <div className="lg:sticky lg:top-12">{rail}</div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
