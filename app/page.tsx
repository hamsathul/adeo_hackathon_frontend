import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="text-lg font-bold" href="#">
          IORMS
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Intelligent Opinion Request Management System
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline internal processes with AI-powered efficiency.
              </p>
              <Button>Get Started</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Intake</CardTitle>
                </CardHeader>
                <CardContent>AI-powered request categorization and routing.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Management</CardTitle>
                </CardHeader>
                <CardContent>Centralized repository with intelligent search.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Collaborative Workspace</CardTitle>
                </CardHeader>
                <CardContent>Real-time collaboration and standardized templates.</CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 IORMS. All rights reserved.</p>
      </footer>
    </div>
  )
}