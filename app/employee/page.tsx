'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Bot, Download, Filter, Grid2X2, Import, LayoutList, MoreVertical, Plus, Search, UserPlus } from 'lucide-react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Sidebar from '../admin/_components/sidebar'
import Header from '../admin/_components/header'
import Chatbot from '@/components/custom/chatbot'
import { translations } from '@/components/custom/translation'
import { useLanguageStore } from '@/store/useLanguageStore'

interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  avatar: string
  employeeId: string
  workType: string
  position: string
}

export default function Component() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({})
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;
  
  const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

  useEffect(() => {
    // Simulating initial data load
    setEmployees([
      {
        id: '1',
        name: 'Ahmed Mohamed',
        role: 'CEO',
        department: 'Managerial',
        email: 'a.mohamed@gmail.com',
        phone: '+971 50 123 1234',
        avatar: '/ADEO.svg',
        employeeId: 'EMP01',
        workType: 'Fulltime',
        position: 'Executive',
      },
      // Add more initial employees here
    ])
  }, [])

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || employee.workType.toLowerCase() === typeFilter.toLowerCase()
      const matchesDepartment = departmentFilter === 'all' || employee.department.toLowerCase() === departmentFilter.toLowerCase()
      const matchesRole = roleFilter === 'all' || employee.role.toLowerCase() === roleFilter.toLowerCase()
      return matchesSearch && matchesType && matchesDepartment && matchesRole
    })
    setFilteredEmployees(filtered)
  }, [employees, searchTerm, typeFilter, departmentFilter, roleFilter])

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        setEmployees(json as Employee[])
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'pdf') {
      const doc = new jsPDF()
      autoTable(doc, { html: '#employeeTable' })
      doc.save('employees.pdf')
    } else if (format === 'excel' || format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(employees)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees')
      XLSX.writeFile(workbook, `employees.${format === 'excel' ? 'xlsx' : 'csv'}`)
    }
  }

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      setEmployees([...employees, { ...newEmployee, id: Date.now().toString() } as Employee])
      setNewEmployee({})
      setShowAddEmployee(false)
    }
  }

  const handleEditEmployee = () => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp))
      setEditingEmployee(null)
    }
  }

  return (
    <>
    <Header />
    <div className="px-20 py-">
        <header className="flex justify-end p-4"></header>
    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{text.employeeManagement}</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="import"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
          />
          <label htmlFor="import" className="cursor-pointer">
            <Button variant="outline" size="sm">
              <Import className="h-4 w-4 mr-2" />
              {text.import}
            </Button>
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {text.export}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>{text.exportPDF}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>{text.exportExcel}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>{text.exportCSV}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {text.addEmployee}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{text.addNewEmployee}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder={text.name}
                  value={newEmployee.name || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
                <Input
                  placeholder={text.email}
                  type="email"
                  value={newEmployee.email || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
                <Input
                  placeholder={text.position}
                  value={newEmployee.position || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
                <Input
                  placeholder={text.employeeID}
                  value={newEmployee.employeeId || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                />
                <Select
                  value={newEmployee.workType || ''}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, workType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={text.workType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fulltime">Full Time</SelectItem>
                    <SelectItem value="Parttime">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={text.department}
                  value={newEmployee.department || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                />
                <Input
                  placeholder={text.phone}
                  value={newEmployee.phone || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setNewEmployee({ ...newEmployee, avatar: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
              <Button onClick={handleAddEmployee}>{text.addEmployee}</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder= {text.searchEmployee}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allTypes}</SelectItem>
              <SelectItem value="fulltime">Full Time</SelectItem>
              <SelectItem value="parttime">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allDepartments}</SelectItem>
              <SelectItem value="managerial">Managerial</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              {/* Add more departments as needed */}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allRoles}</SelectItem>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              {/* Add more roles as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
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
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader className="relative">
              <Badge variant="secondary" className="absolute right-6 top-6">
                {employee.department}
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
                  <Badge variant="secondary">{employee.position}</Badge>
                  <span className="text-muted-foreground">·</span>
                  <Badge variant="secondary">{employee.workType}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <a className="text-blue-600 hover:underline" href={`mailto:${employee.email}`}>
                    {employee.email}
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">{employee.phone}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center justify-between gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{employee.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <img
                          alt={employee.name}
                          className="rounded-full mx-auto"
                          height="150"
                          src={employee.avatar}
                          style={{
                            aspectRatio: "150/150",
                            objectFit: "cover",
                          }}
                          width="150"
                        />
                        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                        <p><strong>Position:</strong> {employee.position}</p>
                        <p><strong>Department:</strong> {employee.department}</p>
                        <p><strong>Email:</strong> {employee.email}</p>
                        <p><strong>Phone:</strong> {employee.phone}</p>
                        <p><strong>Work Type:</strong> {employee.workType}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingEmployee(employee)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setEmployees(employees.filter(e => e.id !== employee.id))}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editingEmployee && (
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder={text.name}
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
              />
              <Input
                placeholder={text.email}
                type="email"
                value={editingEmployee.email}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
              />
              <Input
                placeholder={text.position}
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
              />
              <Input
                placeholder={text.employeeID}
                value={editingEmployee.employeeId}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, employeeId: e.target.value })}
              />
              <Select
                value={editingEmployee.workType}
                onValueChange={(value) => setEditingEmployee({ ...editingEmployee, workType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={text.workType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fulltime">Full Time</SelectItem>
                  <SelectItem value="Parttime">Part Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Department"
                value={editingEmployee.department}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={editingEmployee.phone}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
              />
            </div>
            <Button onClick={handleEditEmployee}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      )}
      <table id="employeeTable" className="hidden">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Employee ID</th>
            <th>Work Type</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.employeeId}</td>
              <td>{employee.workType}</td>
              <td>{employee.department}</td>
              <td>{employee.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
         {/* AI Assistant Button */}
         <div className="fixed bottom-4 right-4">
            <div
                className={`relative rounded-full bg-primary text-primary-foreground p-3 cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'w-36' : 'w-12'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setShowChatbot(true)}
            >
            <Bot className="w-6 h-6" />
            {isHovered && (
                <span className="absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {text.ai}
                </span>
            )}
            </div>
        </div>
        {/* Chatbot component */}
        <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
    </>
  )
}