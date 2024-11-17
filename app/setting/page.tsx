'use client';

import * as React from "react";
import { useState } from "react";
import { Bot, X, ChevronDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../admin/_components/header";
import Sidebar from "../admin/_components/sidebar";
import Chatbot from '@/components/custom/chatbot'
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';

export default function Component() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState("/placeholder.svg");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [username, setUsername] = React.useState("kevinunhuy");
  const [profileName, setProfileName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
  const [showChatbot, setShowChatbot] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  // Fetch data from backend
  React.useEffect(() => {
    setTimeout(() => {
      setProfileName("Kevin Heart");
      setEmail("kev.heart@mail.com");
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const handleSaveChanges = () => {
    // Show confirmation toast
    toast.success("     Your changes have been successfully saved.");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <Header />
      <header className="flex justify-end p-4">
      </header>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-8">
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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">{text.profile}</TabsTrigger>
              <TabsTrigger value="account">{text.account}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>{text.profilePic}</Label>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={imageUrl} alt="Profile picture" />
                      <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border border-input file:bg-transparent file:border-0 file:text-sm file:font-medium"
                      />
                      <Button variant="destructive" size="sm" onClick={handleDeletePicture}>
                        {text.deletepic}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{text.profileName}</Label>
                  <Input value={profileName} readOnly />
                </div>

                <div className="space-y-2">
                  <Label >{text.username}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                    <Input 
                      id="username" 
                      className="pl-7" 
                      value={username} readOnly
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">{text.aboutme}</Label>
                  <Textarea
                    id="about"
                    defaultValue="Discuss only on work hour, unless you wanna discuss about music 🎵"
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleSaveChanges}>
                {text.saveChanges}
              </Button>
            </TabsContent>

            <TabsContent value="account" className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>{text.email}</Label>
                  <Input value={email} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{text.language}</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                
              <div className="space-y-2">
                <Label>{text.password}</Label>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      {text.changePassword}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{text.changePassword}</DialogTitle>
                      <DialogDescription>
                        Enter your current password and new password to change it.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-password" className="text-right">
                          Current
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-password" className="text-right">
                          New
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm-password" className="text-right">
                          Confirm
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">{text.saveChanges}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
                  {/* AI Assistant Button */}
      </Card>
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
    </>
  );
}