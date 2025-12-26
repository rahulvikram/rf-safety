import logo from "assets/logo.png"

export function Header() {
    return (
        <div className="flex flex-col gap-1">
            <header className="flex flex-col items-center">
                <div className="p-4 flex flex-row items-center justify-center gap-5">
                    <img
                    src={logo}
                    alt="Roboflow"
                    className="block rounded-full"
                    width={55}
                    height={55}
                    />
                    <h1 className="flex flex-row gap-2 text-4xl font-black items-center justify-center" style={{ color: "var(--rf-purple)" }}>
                        ZoneGuard
                    </h1>
                </div>
            </header>
            <p className="text-md text-gray-500 text-center">Real-time, zone-based, safety analytics platform</p>
        </div>
    )
}