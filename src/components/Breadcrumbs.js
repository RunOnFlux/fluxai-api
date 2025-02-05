import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <div className="text-sm font-semibold">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="mx-2">&gt;</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-400">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
