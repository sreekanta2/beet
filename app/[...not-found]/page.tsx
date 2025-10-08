import Link from "next/link";
export const metadata = {
  title: "Page Not Found | 404 Error",
  description: "The page you're looking for doesn't exist or has been moved.",
  openGraph: {
    title: "Page Not Found | 404 Error",
    description: "The page you're looking for doesn't exist or has been moved.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_URL}/404`, // Replace with your actual domain
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/og-image.png`, // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Page Not Found",
      },
    ],
  },
};

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Return to Homepage
        </Link>

        <div className="mt-8 text-base text-gray-500">
          <p>
            Need help?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
