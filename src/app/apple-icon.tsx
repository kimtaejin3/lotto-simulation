import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff4f1",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            background: "radial-gradient(circle at 35% 30%, #FFE38A 0%, #FFC531 55%, #E09A00 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 92,
            fontWeight: 800,
            color: "#3D2A00",
            fontFamily: "sans-serif",
          }}
        >
          1
        </div>
      </div>
    ),
    size,
  );
}
