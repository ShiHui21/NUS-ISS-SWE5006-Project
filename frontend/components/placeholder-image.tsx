interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  className?: string
}

export function PlaceholderImage({ width, height, text, className }: PlaceholderImageProps) {
  // Use a consistent color based on the text
  const colors = ["bg-blue-200", "bg-yellow-200", "bg-green-200", "bg-purple-200", "bg-pink-200", "bg-orange-200"]

  // Generate a consistent color based on the text or dimensions
  const seed = text || `${width}x${height}`
  const colorIndex = Math.abs(seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className={`flex items-center justify-center ${bgColor} ${className || ""}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <span className="text-gray-600 text-sm text-center px-2">{text || `${width}x${height}`}</span>
    </div>
  )
}
