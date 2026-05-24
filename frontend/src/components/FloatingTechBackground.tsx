import { 
  Laptop, Smartphone, Cpu, Headphones, Speaker, Monitor, 
  Mouse, Keyboard, Watch, Camera, Wifi, BatteryCharging,
  Tablet, Gamepad, Tv, Server, HardDrive, Router, 
  Bluetooth, Radio, Plug, Webcam
} from "lucide-react";

const icons = [
  Laptop, Smartphone, Cpu, Headphones, Speaker, Monitor, 
  Mouse, Keyboard, Watch, Camera, Wifi, BatteryCharging,
  Tablet, Gamepad, Tv, Server, HardDrive, Router, 
  Bluetooth, Radio, Plug, Webcam
];

export default function FloatingTechBackground() {
  // Generate a deterministic but random-looking array of elements
  const elements = Array.from({ length: 45 }).map((_, i) => {
    const Icon = icons[i % icons.length];
    // We use a mix of fixed values to avoid hydration mismatch while still looking random
    const sizeMap = [24, 32, 40, 48, 56, 64, 72, 80];
    const leftMap = [2, 8, 15, 22, 28, 35, 42, 48, 55, 62, 68, 75, 82, 88, 95];
    const durationMap = [12, 15, 18, 20, 22, 25, 28, 30, 35];
    const delayMap = [0, -2, -5, -8, -12, -15, -18, -20, -25, -30, -35];

    return {
      id: i,
      Icon,
      size: sizeMap[(i * 3) % sizeMap.length],
      left: leftMap[(i * 7) % leftMap.length],
      duration: durationMap[(i * 5) % durationMap.length],
      delay: delayMap[(i * 11) % delayMap.length],
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {elements.map((el) => {
        const { Icon } = el;
        return (
          <div
            key={el.id}
            className="absolute bottom-0 text-indigo-500/80 dark:text-indigo-300/40 animate-float-up transition-colors duration-300"
            style={{
              left: `${el.left}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              width: el.size,
              height: el.size,
            }}
          >
            <Icon width={el.size} height={el.size} />
          </div>
        );
      })}
    </div>
  );
}
