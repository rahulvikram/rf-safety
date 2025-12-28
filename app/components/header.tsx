import { Logo } from "./logo";

export function Header() {
    return (
        <div className="flex flex-col gap-1">
            <header className="flex flex-col">
                <div className="flex flex-row items-center gap-5">
                    <Logo size="md" />
                    <h1 className="flex flex-row gap-2 text-3xl font-black items-center" style={{ color: "var(--rf-purple)" }}>
                        ZoneGuard
                    </h1>
                </div>
            </header>
        </div>
    )
}