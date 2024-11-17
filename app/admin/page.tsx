'use client'

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen  ">
      <KanbanBoard />
    </div>
  )
}

// import { Clock, DollarSign, Users, Bot } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import Header from "../admin/_components/header"
// import Sidebar from "../admin/_components/sidebar"
// import { useState } from 'react'
// import Chatbot from '@/components/custom/chatbot'  // Import the Chatbot component

// export default function Dashboard() {
//   const [showChatbot, setShowChatbot] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
//         <Header />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//           <div className="container mx-auto px-6 py-8">
//             <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
//             <div className="mt-4">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Total Revenue
//                     </CardTitle>
//                     <DollarSign className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">$45,231.89</div>
//                     <p className="text-xs text-muted-foreground">
//                       +20.1% from last month
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       Subscriptions
//                     </CardTitle>
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">+2350</div>
//                     <p className="text-xs text-muted-foreground">
//                       +180.1% from last month
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">Sales</CardTitle>
//                     <Clock className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">+12,234</div>
//                     <p className="text-xs text-muted-foreground">
//                       +19% from last month
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">Active Now</CardTitle>
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">+573</div>
//                     <p className="text-xs text-muted-foreground">
//                       +201 since last hour
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//             <div className="mt-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pl-2">
//                   {/* You can add content here */}
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Sales</CardTitle>
//                   <CardDescription>You made 265 sales this month.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-8">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="flex items-center">
//                         <div className="space-y-1">
//                           <p className="text-sm font-medium leading-none">
//                             Customer {i + 1}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             customer{i + 1}@example.com
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Trending Products</CardTitle>
//                   <CardDescription>Your top selling items this month.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-8">
//                     {['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map((product, i) => (
//                       <div key={i} className="flex items-center">
//                         <div className="space-y-1">
//                           <p className="text-sm font-medium leading-none">{product}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Category {String.fromCharCode(65 + i)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* AI Assistant Button */}
//       <div className="fixed bottom-4 right-4">
//         <div
//           className={`relative rounded-full p-3 cursor-pointer transition-all duration-300 ease-in-out 
//                       ${isHovered ? 'w-36 bg-gray-300' : 'w-12 border border-black'}`}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={() => setShowChatbot(true)}
//         >
//           <Bot className="w-6 h-6" />
//           {isHovered && (
//             <span className="absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
//               AI Assistant
//             </span>
//           )}
//         </div>
//       </div>
//       {/* Chatbot Component */}
//       <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
//     </div>
//   )
// }

import { KanbanBoard } from '../../components/custom/KanbanBoard'

