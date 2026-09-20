import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { sans, serif } from "../fonts";

/** Mirno pojavljivanje: fade + mali pomak prema gore. Bez odskakanja. */
export const Rise: React.FC<{
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, duration = 18, distance = 14, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  return (
    <div style={{ ...style, opacity: t, transform: `translateY(${(1 - t) * distance}px)` }}>
      {children}
    </div>
  );
};

/** Tanka linija koja se izvlači slijeva. Zamjena za sjene i gradijente. */
export const Rule: React.FC<{ delay?: number; duration?: number; color?: string; width?: number | string }> = ({
  delay = 0,
  duration = 26,
  color = theme.line,
  width = "100%",
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  return (
    <div style={{ width, height: 1, background: theme.line, opacity: 0.6 }}>
      <div style={{ width: `${t * 100}%`, height: 1, background: color }} />
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = theme.muted,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: 20,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

export const H: React.FC<{ size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 88,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: serif,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      color: theme.text,
      ...style,
    }}
  >
    {children}
  </div>
);

export const P: React.FC<{ size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 30,
  children,
  style,
}) => (
  <div style={{ fontFamily: sans, fontSize: size, lineHeight: 1.55, color: theme.muted, ...style }}>
    {children}
  </div>
);

/** Kartica bez sjene, 1px granica, radius 8 - kao u aplikaciji. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number;
}> = ({ children, style, padding = 34 }) => (
  <div
    style={{
      border: `1px solid ${theme.line}`,
      borderRadius: 8,
      background: theme.bg,
      padding,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Avatar: React.FC<{ name: string; size?: number; stalled?: boolean }> = ({
  name,
  size = 46,
  stalled,
}) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size,
          border: `1px solid ${theme.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: serif,
          fontSize: size * 0.4,
          color: theme.muted,
        }}
      >
        {initials}
      </div>
      {stalled ? (
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: size * 0.26,
            height: size * 0.26,
            borderRadius: size,
            background: theme.danger,
          }}
        />
      ) : null}
    </div>
  );
};

/** Progres kao tanka linija, ne krug. */
export const Meter: React.FC<{ value: number; delay?: number; width?: number }> = ({
  value,
  delay = 0,
  width = 320,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });
  return (
    <div style={{ width, height: 1, background: theme.line }}>
      <div style={{ width: `${t * value}%`, height: 1, background: theme.accentText }} />
    </div>
  );
};

export const Btn: React.FC<{ children: React.ReactNode; variant?: "primary" | "secondary" }> = ({
  children,
  variant = "primary",
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      padding: "14px 26px",
      fontFamily: sans,
      fontSize: 22,
      fontWeight: 500,
      border: `1px solid ${variant === "primary" ? theme.accent : theme.line}`,
      background: variant === "primary" ? theme.accent : "transparent",
      // Tamni tekst na zlatnoj: isti kontrast kao u aplikaciji (5.9:1).
      color: theme.text,
    }}
  >
    {children}
  </div>
);

export const GoldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: sans,
      fontSize: 18,
      border: `1px solid ${theme.accentText}`,
      color: theme.accentText,
      borderRadius: 6,
      padding: "3px 10px",
    }}
  >
    {children}
  </span>
);
