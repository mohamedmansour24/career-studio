export default function MajorsLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar placeholder */}
            <div className="w-full">
                <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
                    <div className="h-14 w-40 bg-foreground/10 rounded-xl animate-pulse" />
                    <div className="hidden md:flex items-center gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 w-16 bg-foreground/10 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-6xl px-6 pt-10 pb-20">
                {/* Title */}
                <div className="text-center">
                    <div className="h-12 w-64 mx-auto bg-foreground/10 rounded-xl animate-pulse" />
                    <div className="h-5 w-96 mx-auto mt-4 bg-foreground/10 rounded animate-pulse" />
                </div>

                {/* Buckets */}
                <div className="mt-12 flex justify-center gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="h-10 w-28 bg-foreground/10 rounded-xl animate-pulse" />
                            <div className="h-3 w-16 bg-foreground/10 rounded animate-pulse" />
                            <div className="h-1 w-16 bg-foreground/10 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Cards Grid */}
                <section className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-card/50 border border-border p-5"
                        >
                            <div className="h-7 w-3/4 mx-auto bg-foreground/10 rounded animate-pulse" />
                            <div className="mt-6 space-y-2">
                                <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                                <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-foreground/10 rounded animate-pulse" />
                            </div>
                            <div className="mt-8 h-10 w-full bg-foreground/10 rounded-lg animate-pulse" />
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
