'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Filter, Grid2X2, Import, LayoutList, MoreVertical, Plus, Search, UserPlus } from 'lucide-react'
import Sidebar from '../admin/_components/sidebar'
import Header from '../admin/_components/header'

interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  joinDate: string
  avatar: string
  employeeId: string
  workType: string
}

export default function Component() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Bagus Fikri',
      role: 'CEO',
      department: 'Managerial',
      email: 'bagusfikri@gmail.com',
      phone: '+62 123 123 123',
      status: 'active',
      joinDate: '29 Oct, 2020',
      avatar: '/placeholder.svg',
      employeeId: 'EMP01',
      workType: 'Fulltime',
    },
    {
      id: '2',
      name: 'Ihdizein',
      role: 'Illustrator',
      department: 'Managerial',
      email: 'ihdizein@gmail.com',
      phone: '(40) 768 082 716',
      status: 'active',
      joinDate: '1 Feb, 2019',
      avatar: '/placeholder.svg',
      employeeId: 'EMP02',
      workType: 'Fulltime',
    },
    // Add more employee data as needed
  ])

  return (
        <>
        <Header />
      <div className="px-20 py-">
      <header className="flex justify-end p-4">
      </header>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Employee</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <span className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
              Active 28
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-100">
              <span className="mr-1 h-2 w-2 rounded-full bg-gray-500" />
              Inactive 4
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Import className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search employees..."
              type="search"
              />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fulltime">Full Time</SelectItem>
              <SelectItem value="parttime">Part Time</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Transfer Employee
          </Button>
          <div className="flex items-center rounded-md border">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none rounded-l-md"
              onClick={() => setView('grid')}
              >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none rounded-r-md"
              onClick={() => setView('list')}
              >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className={`grid gap-4 ${view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}`}>
        {employees.map((employee) => (
            <Card key={employee.id}>
            <CardHeader className="relative">
              <Badge
                variant="secondary"
                className={
                    employee.status === 'active'
                    ? 'absolute right-6 top-6 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                    : 'absolute right-6 top-6 bg-gray-100 text-gray-500 hover:bg-gray-100'
                }
                >
                <span className="mr-1 h-2 w-2 rounded-full bg-current" />
                {employee.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
              <div className="flex flex-col items-center space-y-3">
                <img
                  alt={employee.name}
                  className="rounded-full"
                  height="100"
                  src={employee.avatar}
                  style={{
                      aspectRatio: "100/100",
                      objectFit: "cover",
                    }}
                    width="100"
                    />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold">{employee.name}</h3>
                  <p className="text-muted-foreground">{employee.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">#{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{employee.department}</Badge>
                  <span className="text-muted-foreground">·</span>
                  <Badge variant="secondary">{employee.workType}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <a
                    className="text-blue-600 hover:underline"
                    href={`mailto:${employee.email}`}
                    >
                    {employee.email}
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">{employee.phone}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  Joined at {employee.joinDate}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    View details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  )
}