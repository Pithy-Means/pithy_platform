interface Video {
  src: string;
  controls: boolean;
  width?: string;
  height?: string;
  className?: string;
}

export function Video({src, controls, width, height, className}: Video) {
  return (
    <video width={width} height={height} className={className} controls={controls} preload="none">
      <source src={src} type="video/mp4" />
    </video>
  )
}