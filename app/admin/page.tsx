'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Layout } from '@/components/common/Layout';
import { KanbanBoard } from '@/components/custom/KanbanBoard';
import { UserDashboard } from '@/components/custom/UserDashboard';
import { StaffDashboard } from '@/components/custom/StaffDashboard';

export const roles = {
  SUPER_ADMIN: {
    name: "Super Admin",
    description: "Has full system access",
    permissions: ["ALL"]
  },
  SYSTEM_ADMIN: {
    name: "System Admin",
    description: "System administrator with limited access",
    permissions: [
      "manage_users",
      "manage_departments", 
      "view_analytics",
      "system_admin",
      "manage_documents"
    ]
  },
  DEPARTMENT_HEAD: {
    name: "Department Head", 
    description: "Head of department with approval authority",
    permissions: [
      "view_users",
      "manage_opinion_requests",
      "review_opinion_requests",
      "approve_opinion_requests", 
      "reject_opinion_requests",
      "view_analytics",
      "assign_experts",
      "manage_documents",
      "manage_comments"
    ]
  },
  SENIOR_EXPERT: {
    name: "Senior Expert",
    description: "Senior department expert with additional privileges",
    permissions: [
      "view_users",
      "review_opinion_requests",
      "approve_opinion_requests",
      "view_opinion_requests",
      "manage_documents", 
      "add_comments",
      "view_comments"
    ]
  },
  EXPERT: {
    name: "Expert",
    description: "Department expert who reviews requests",
    permissions: [
      "view_users",
      "review_opinion_requests",
      "view_opinion_requests",
      "upload_documents",
      "view_documents",
      "add_comments",
      "view_comments"
    ]
  },
  REGULAR_USER: {
    name: "Regular User",
    description: "Regular department user",
    permissions: [
      "create_opinion_request",
      "view_opinion_requests",
      "view_documents",
      "upload_documents", 
      "add_comments",
      "view_comments"
    ]
  },
  VIEWER: {
    name: "Viewer",
    description: "Can only view requests and comments",
    permissions: [
      "view_opinion_requests",
      "view_documents",
      "view_comments"
    ]
  }
};

interface JWTPayload {
  exp: number;
  roles: string[];
  is_superuser: boolean;
}

export default function Component() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('../');
        return;
      }

      try {
        const decodedToken = jwtDecode<JWTPayload>(token);
        console.log(decodedToken);
        
        // Check token expiration
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.clear();
          router.push('../');
          return;
        }

        setUserRole(decodedToken.roles);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.clear();
        router.push('../');
      }
    };

    checkAuth();
  }, []);

  const renderDashboard = () => {
    if (!isAuthenticated) return null;
  
    if (Array.isArray(userRole)) {
      // Check for admin roles
      if (userRole.includes("Super Admin") || userRole.includes("System Admin")) {
        return <KanbanBoard />;
      }
  
      // Check for staff roles
      if (
        userRole.includes("Department Head") || 
        userRole.includes("Senior Expert") || 
        userRole.includes("Expert")
      ) {
        return <StaffDashboard />;
      }
  
      // Default to user dashboard for Regular User and Viewer
      if (userRole.includes("Regular User") || userRole.includes("Viewer")) {
        return <UserDashboard />;
      }
    }
  
    // Log issue for debugging
    console.warn("userRole is invalid or not defined:", userRole);
  
    // Fallback case
    return <UserDashboard />;
  };
  
  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );  
}