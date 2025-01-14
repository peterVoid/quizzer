import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-xl font-bold text-purple-600">
                            Quizzer
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/sign-in">Log in</Link>
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl py-20 text-center">
                        <div className="mb-8">
                            <h1 className="mb-4 text-4xl font-bold">
                                Welcome to <span className="text-purple-600">Quizzer</span>
                            </h1>
                            <div className="mb-4 text-5xl font-bold leading-tight">
                                {"The best way to learn is by testing yourself."}
                            </div>
                            <div className="text-xl text-muted-foreground">
                                - Lifelong Learners
                            </div>
                        </div>
                        <p className="mb-8 text-xl">
                            Create and deliver bell-to-bell curriculum resources that meet the
                            needs of every student.
                        </p>
                        <div className="flex flex-col justify-center gap-4 md:flex-row">
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                                Sign up for free
                                <span className="ml-2">→</span>
                            </Button>
                            <Button size="lg" variant="secondary">
                                Learn more
                                <span className="ml-2">→</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                </div>
            </div>
        </div>
    );
}
