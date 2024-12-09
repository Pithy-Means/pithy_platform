interface Video {
  src: string;
  controls: boolean;
  className?: string;
}

export function Video({src, controls, className}: Video) {
  return (
    <video width="320" height="240" className={className} controls={controls} preload="none">
      <source src={src} type="video/mp4" />
    </video>
  )
}