'use client'

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, Clock, DollarSign, Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../admin/_components/header"
import Sidebar from "../admin/_components/sidebar"

// Sample data for the chart
const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={false} onClose={function (): void {
			  throw new Error('Function not implemented.')
		  } } />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriptions
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer> */}
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Customer {i + 1}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            customer{i + 1}@example.com
                          </p>
                        </div>
                        <div className="ml-auto font-medium">+${(Math.random() * 100).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Trending Products</CardTitle>
                  <CardDescription>Your top selling items this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map((product, i) => (
                      <div key={i} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{product}</p>
                          <p className="text-sm text-muted-foreground">
                            Category {String.fromCharCode(65 + i)}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {Math.random() > 0.5 ? (
                            <span className="text-green-600 flex items-center">
                              <ArrowUp className="mr-1 h-4 w-4" />
                              {(Math.random() * 10).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <ArrowDown className="mr-1 h-4 w-4" />
                              {(Math.random() * 10).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}