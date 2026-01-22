import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
            <div className="text-center max-w-md">
                {/* 404 Icon */}
                <div className="mx-auto w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                    <svg
                        className="w-12 h-12 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/careers"
                        className="px-6 py-3 border border-border rounded-xl font-semibold hover:bg-foreground/5 transition"
                    >
                        Explore Careers
                    </Link>
                </div>
            </div>
        </div>
    );
}
