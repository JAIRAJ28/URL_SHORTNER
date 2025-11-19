export default function PulseLoader() {
  return (
    <div className="flex items-center justify-center p-10">
      <span className="relative flex h-10 w-10">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
        <span className="relative inline-flex h-10 w-10 rounded-full bg-blue-600"></span>
      </span>
    </div>
  );
}
