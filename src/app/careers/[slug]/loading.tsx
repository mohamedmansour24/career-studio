export default function CareerProfileLoading() {
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

            {/* Profile Card */}
            <main className="mx-auto max-w-6xl px-6 pt-10 pb-20">
                <div className="rounded-3xl bg-card/50 border border-border p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10">
                        {/* Character Panel */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-64 h-80 bg-foreground/10 rounded-2xl animate-pulse" />
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-foreground/10 rounded-full animate-pulse" />
                                <div className="w-12 h-12 bg-foreground/10 rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            {/* Badge */}
                            <div className="h-6 w-24 bg-foreground/10 rounded-full animate-pulse" />

                            {/* Title */}
                            <div className="mt-4 h-12 w-80 bg-foreground/10 rounded-xl animate-pulse" />

                            {/* Intro */}
                            <div className="mt-4 space-y-2">
                                <div className="h-5 w-full bg-foreground/10 rounded animate-pulse" />
                                <div className="h-5 w-3/4 bg-foreground/10 rounded animate-pulse" />
                            </div>

                            {/* Category Pills */}
                            <div className="mt-8">
                                <div className="h-4 w-48 bg-foreground/10 rounded animate-pulse" />
                                <div className="mt-3 flex gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-10 w-24 bg-foreground/10 rounded-full animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="mt-8">
                                <div className="h-4 w-16 bg-foreground/10 rounded animate-pulse" />
                                <div className="mt-1 h-6 w-32 bg-foreground/10 rounded animate-pulse" />
                            </div>

                            {/* Section Tabs */}
                            <div className="mt-10 flex gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-5 w-20 bg-foreground/10 rounded animate-pulse" />
                                ))}
                            </div>

                            {/* Section Content */}
                            <div className="mt-8 rounded-2xl bg-foreground/5 p-6">
                                <div className="h-6 w-32 bg-foreground/10 rounded animate-pulse mb-4" />
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
