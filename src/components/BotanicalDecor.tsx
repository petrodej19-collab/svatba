export function BotanicalDecor({ flip = false, position = "top" }: { flip?: boolean; position?: "top" | "bottom" }) {
  const isBottom = position === "bottom";
  return (
    <div className={`absolute ${isBottom ? "bottom-0" : "top-0"} ${flip ? "left-0 -scale-x-100" : "right-0"} w-40 h-56 sm:w-56 sm:h-72 ${isBottom ? "opacity-[0.07] rotate-180" : "opacity-[0.12]"} pointer-events-none`}>
      <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main branch */}
        <path d="M180 0 C170 40, 150 80, 140 120 C130 160, 135 200, 150 240" stroke="#7A9F80" strokeWidth="1.5" opacity="0.7"/>
        {/* Leaves */}
        <path d="M180 10 C165 25, 150 20, 145 35 C160 30, 170 40, 180 10Z" fill="#6B8F71" opacity="0.8"/>
        <path d="M175 40 C155 45, 145 55, 135 65 C150 60, 165 65, 175 40Z" fill="#8BAF92" opacity="0.6"/>
        <path d="M165 70 C145 75, 130 85, 125 100 C140 90, 155 95, 165 70Z" fill="#6B8F71" opacity="0.7"/>
        <path d="M155 100 C140 110, 125 105, 120 120 C135 115, 145 125, 155 100Z" fill="#8BAF92" opacity="0.5"/>
        <path d="M150 135 C130 140, 120 150, 115 165 C130 155, 145 160, 150 135Z" fill="#6B8F71" opacity="0.6"/>
        <path d="M145 170 C130 175, 115 170, 110 185 C125 180, 140 188, 145 170Z" fill="#8BAF92" opacity="0.5"/>
        <path d="M150 200 C135 210, 125 205, 120 220 C135 215, 145 225, 150 200Z" fill="#6B8F71" opacity="0.4"/>
        {/* Right side leaves */}
        <path d="M185 25 C195 35, 200 50, 195 65 C190 50, 188 40, 185 25Z" fill="#8BAF92" opacity="0.5"/>
        <path d="M170 55 C185 65, 195 80, 190 95 C182 80, 175 70, 170 55Z" fill="#6B8F71" opacity="0.4"/>
        <path d="M160 90 C175 100, 185 115, 180 130 C172 115, 165 105, 160 90Z" fill="#8BAF92" opacity="0.4"/>
        {/* Small accent leaves */}
        <ellipse cx="140" cy="50" rx="8" ry="4" transform="rotate(-30 140 50)" fill="#A3C4A9" opacity="0.3"/>
        <ellipse cx="130" cy="140" rx="6" ry="3" transform="rotate(-20 130 140)" fill="#A3C4A9" opacity="0.3"/>
      </svg>
    </div>
  );
}
