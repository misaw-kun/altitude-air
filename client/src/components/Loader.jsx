export default function Loader({ size="lg" }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${
          size === "sm" ? "w-4 h-4 border-2" : "w-12 h-12 border-8"
        } rounded-full animate-spin border-solid border-indigo-500 border-t-transparent`}
      ></div>
    </div>
  );
}
