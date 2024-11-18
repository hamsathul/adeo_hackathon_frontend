'use client';

import * as React from "react";
import { X } from 'lucide-react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import { Layout } from "@/components/common/Layout";

// Interface for User data
interface User {
  id: number;
  email: string;
  username: string;
  department: {
    name: string;
  };
}

export default function Component() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState("/placeholder.svg");
  const [username, setUsername] = React.useState("");
  const [profileName, setProfileName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [aboutMe, setAboutMe] = React.useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  // Fetch user data
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming you have the token stored in localStorage
        const token = localStorage.getItem('Token');
        if (!token) {
          toast.error("No authentication token found");
          return;
        }

        // Get user ID from token (you'll need to implement token decoding)
        const userId = decodeToken(token); 

        // Fetch user data
        const response = await axios.get(`/api/v1/auth/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;
        setUsername(userData.username);
        setEmail(userData.email);
        setProfileName(userData.department?.name || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  // Token decoding function (you'll need to implement this based on your token structure)
  const decodeToken = (token: string): number => {
    // This is a placeholder. Replace with actual token decoding logic
    // For example, using jwt-decode or your backend's token decoding method
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      toast.error("Invalid token");
      throw error;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleDeletePicture = () => {
    setImageUrl("/placeholder.svg");
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = decodeToken(token as string);

      await axios.put(`/api/v1/auth/users/${userId}`, 
        {
          username,
          aboutMe
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success("Your changes have been successfully saved.");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.put('/api/v1/auth/change-password', 
        {
          current_password: currentPassword,
          new_password: newPassword
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success("Password changed successfully");
      setIsPasswordDialogOpen(false);
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-primary">{text.settings}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-muted-foreground"
              aria-label="Close Settings"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">{text.profile}</TabsTrigger>
              <TabsTrigger value="account">{text.account}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{text.profilePic}</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="border border-gray-500 h-24 w-24">
                      <AvatarImage src={imageUrl} alt="Profile picture" />
                      <AvatarFallback>
                        <img src="/man.png" alt="Default profile" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border border-gray-500 file:bg-transparent file:border-0 file:text-sm file:font-medium"
                      />
                      <Button variant="destructive" size="sm" onClick={handleDeletePicture}>
                        {text.deletepic}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{text.profileName}</Label>
                  <Input 
                    className="border border-gray-500" 
                    value={profileName} 
                    readOnly 
                  />
                </div>

                <div className="space-y-2">
                  <Label>{text.username}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      className="border border-gray-500 pl-7"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">{text.aboutme}</Label>
                  <Textarea
                    id="about"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Explain about yourself..."
                    className="pl-7 border border-gray-500"
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleSaveChanges}>
                {text.saveChanges}
              </Button>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{text.email}</Label>
                  <Input 
                    className="border border-gray-500" 
                    value={email} 
                    readOnly 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{text.password}</Label>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="bg-gray-800 text-gray-100 w-full">
                      {text.changePassword}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{text.changePassword}</DialogTitle>
                      <DialogDescription>
                        {text.passwordDialog}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-password" className="text-right">
                          {text.current}
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-password" className="text-right">
                          {text.new}
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm-password" className="text-right">
                          {text.confirm}
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" onClick={handleChangePassword}>
                        {text.saveChanges}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}