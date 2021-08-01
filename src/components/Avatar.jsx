export default function Avatar({ backgroundColor, src, rounded, ...props }) {
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
      }}
      className={rounded ? "p-2 rounded-full" : "p-3 rounded-3xl"}
      {...props}
    >
      <img
        src={src}
        alt="Widget Icon"
        className="h-10 w-10 object-cover rounded-full"
      />
    </div>
  );
}
