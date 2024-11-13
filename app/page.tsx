import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import  {LandingPage}  from '../components/custom/landing'
import  {LoginPage}  from '../components/custom/login'

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingPage />
    </div>
  )
}