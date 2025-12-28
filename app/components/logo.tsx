import logoImage from "assets/logo.png";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    return (
        <img
            src={logoImage}
            alt="Roboflow"
            className="block rounded-full"
            width={size === "sm" ? 30 : size === "md" ? 55 : 70}
            height={size === "sm" ? 30 : size === "md" ? 55 : 70}
        />
    )
}