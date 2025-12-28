import logo from "assets/logo.png"

export function Header() {
    return (
        <div className="flex flex-col gap-1">
            <header className="flex flex-col">
                <div className="flex flex-row items-center gap-5">
                    <img
                    src={logo}
                    alt="Roboflow"
                    className="block rounded-full"
                    width={55}
                    height={55}
                    />
                    <h1 className="flex flex-row gap-2 text-4xl font-black items-center" style={{ color: "var(--rf-purple)" }}>
                        ZoneGuard
                    </h1>
                </div>
            </header>
        </div>
    )
}