'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Download, Grid2X2, Import, LayoutList, MoreVertical, Plus, Search, UserPlus } from 'lucide-react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { translations } from '@/components/custom/translation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { Layout } from '@/components/common/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import  {jwtDecode } from 'jwt-decode';
import { useRouter } from "next/navigation";

const server_url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/api/v1'


interface User {
  id: number;
  username: string;
  roles: Array<{ name: string }>;
  department?: { name: string };
  email: string;
  is_active: boolean;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  employeeId: string;
  workType: string;
  position: string;
  password: string; // Add password property
}

const mapUserToEmployee = (user: User): Employee => ({
  id: user.id.toString(),
  name: user.username,
  role: user.roles[0]?.name || 'N/A',
  department: user.department?.name || 'N/A',
  email: user.email,
  phone: 'N/A', // Add if available in API
  avatar: '/man.png', // Default avatar
  employeeId: `EMP${user.id.toString().padStart(3, '0')}`,
  workType: user.is_active ? 'Fulltime' : 'Inactive',
  position: user.roles[0]?.name || 'N/A',
  password: '' // Default password, update as needed
})

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
  const router = useRouter();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  // useEffect(() => {
  //   // Simulating initial data load
  //   setEmployees([
  //     {
  //       id: '1',
  //       name: 'Ahmed Mohamed',
  //       role: 'CEO',
  //       department: 'Managerial',
  //       email: 'a.mohamed@gmail.com',
  //       phone: '+971 50 123 1234',
  //       avatar: '/man.png',
  //       employeeId: 'EMP01',
  //       workType: 'Fulltime',
  //       position: 'Executive',
  //     },
  //     // Add more initial employees here
  //   ])
  // }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log("Token:", token);
      if (!token) {
        toast.error("No authentication token found");
        router.push('/login'); // Redirect to login page
        return;
      }

      let decodedToken: { user_id: number };
      try {
        decodedToken = jwtDecode(token);
      } catch (error) {
        toast.error("Invalid token format");
        router.push('/login'); // Redirect to login page
        return;
      }

      if (!decodedToken.user_id) {
        toast.error("User ID not found in token");
        router.push('/login'); // Redirect to login page
        return;
      }

      const { data } = await axios.get(`${server_url}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const mappedEmployees = data.map(mapUserToEmployee);
      setEmployees(mappedEmployees);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
            if (error.response.status === 403) {
            alert("You don't have the permission to access this page");
          } else {
            toast.error(`Error: ${error.response.data.message || 'Failed to fetch user data'}`);
          }
        } else if (error.request) {
          toast.error("Server not responding. Please try again later.");
        } else {
          toast.error("Error setting up request");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Modified handleAddEmployee to work with API
  const handleAddEmployee = async () => {
    if (
      newEmployee.name && 
      newEmployee.email && 
      newEmployee.password // Add password check
    ) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No authentication token found");
          router.push('/login');
          return;
        }

        const { data } = await axios.post(`${server_url}/auth/users`, {
          email: newEmployee.email,
          username: newEmployee.name,
          password: newEmployee.password        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newEmp = mapUserToEmployee(data);
        setEmployees([...employees, newEmp]);
        setNewEmployee({});
        setShowAddEmployee(false);
        toast.success('Employee added successfully');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            toast.error(`Error: ${error.response.data.message || 'Failed to add employee'}`);
          } else if (error.request) {
            toast.error("Server not responding. Please try again later.");
          } else {
            toast.error("Error setting up request");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
        console.error('Error adding employee:', error);
      }
    } else {
      toast.error("Please fill in all required fields including password");
    }
  }

  const handleEditEmployee = async () => {
    if (editingEmployee) {
      try {
        // Add API call here when endpoint is available
        // For now, just update local state
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp))
        setEditingEmployee(null)
      } catch (error) {
        console.error('Error editing employee:', error)
        // Handle error appropriately
      }
    }
  }
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
      
      // Add first logo
      const logo1 = new Image()
      logo1.src = '/samah.png'
      doc.addImage(logo1, 'PNG', 10, 10, 30, 30)
      
      // Add separator line
      doc.setDrawColor(200, 200, 200) // Light gray color
      doc.line(45, 10, 45, 40) // Vertical line between logos
      
      // Add second logo
      const logo2 = new Image()
      logo2.src = '/ADEO.png'
      doc.addImage(logo2, 'PNG', 50, 10, 30, 30)
      
      // Add some space after logos
      doc.setFontSize(12)
      doc.text('Employee List', 10, 50)
      
      // Add table with offset for logos
      autoTable(doc, { 
        html: '#employeeTable',
        startY: 60
      })
      
      doc.save('employees.pdf')
    } else if (format === 'excel' || format === 'csv') {
      // For Excel/CSV, add both logos in separate cells
      const logoData = [{
        'Logo 1': 'Samah Logo: /samah.png',
        'Logo 2': 'ADEO Logo: /ADEO.png'
      }]
      const worksheet = XLSX.utils.json_to_sheet(logoData)
      
      // Add empty row after logos
      XLSX.utils.sheet_add_json(worksheet, [{}], { origin: -1 })
      
      // Add employee data
      XLSX.utils.sheet_add_json(worksheet, employees, { origin: -1 })
      
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees')
      XLSX.writeFile(workbook, `employees.${format === 'excel' ? 'xlsx' : 'csv'}`)
    }
  }
  



  return (
    <>
    <Layout>
    <header className="flex justify-end p-4"></header>
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
            required
          />
          <Input
            placeholder={text.email}
            type="email"
            value={newEmployee.email || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={newEmployee.password || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            required
          />
          <Input
            placeholder={text.position}
            value={newEmployee.position || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            required
          />
          <Input
            placeholder={text.employeeID}
            value={newEmployee.employeeId || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
            required
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
            required
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
              <SelectItem value="executive">Executive Office</SelectItem>
              <SelectItem value="administration">Administration Department</SelectItem>
              <SelectItem value="pld">Policy & Legislation Department</SelectItem>
              <SelectItem value="gsd">Government Services Department</SelectItem>
              <SelectItem value="did">Digital Innovation Department</SelectItem>
              <SelectItem value="std">Strategy & Planning Department</SelectItem>
              <SelectItem value="leg">Legal Affairs Department</SelectItem>
              <SelectItem value="fin">Finance Department</SelectItem>
              <SelectItem value="hrd">Human Resourse Department</SelectItem>
              <SelectItem value="itd">Information Technology Department</SelectItem>
              <SelectItem value="pmo">Project Management Office</SelectItem>
              <SelectItem value="qcd">Quality Control Department</SelectItem>
              <SelectItem value="ccd">Corporate Communications Department</SelectItem>
              <SelectItem value="ird">International Relations Department</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allRoles}</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="systemadmin">System Admin</SelectItem>
              <SelectItem value="departmenthead">Department Head</SelectItem>
              <SelectItem value="seniorexpert">Senior Expert</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="regularuser">Regular User</SelectItem>
              {/* Add more roles as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border-l-zinc-950">
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
          <Card key={employee.id} className="bg-slate-100 dark:bg-slate-900/50 border-2">
        <CardHeader className="relative">
          <Badge variant="secondary" className="absolute right-6 top-6">
            {employee.department}
          </Badge>
          <div className="flex flex-col items-center space-y-4 py-3">
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
            <div className="space-y-0 text-center">
          <h3 className="text-lg font-semibold">{employee.name}</h3>
          <p className="text-muted-foreground">{employee.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-bold text-foreground">#{employee.employeeId}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
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
              <Button variant="ghost" size="sm" style={{ border: '1px solid', borderColor: 'gray.300' }}>
            {text.viewDetails}
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
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">{text.moreOptions}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingEmployee(employee)}>{text.edit}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setEmployees(employees.filter(e => e.id !== employee.id))}>
                        {text.delete}
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
              <DialogTitle>{text.editEmployee}</DialogTitle>
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
            <Button onClick={handleEditEmployee}>{text.saveChanges}</Button>
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
    </Layout>
    </>
  )
}