import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** App icon: a glossy yellow lotto ball with "1". */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 35% 30%, #FFE38A 0%, #FFC531 55%, #E09A00 100%)",
          borderRadius: 512,
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 300,
            background: "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 250,
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
