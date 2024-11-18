'use client';

import * as React from "react";
import { X } from 'lucide-react';
import { useRouter } from "next/navigation";
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

export default function Component() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState("/placeholder.svg");
  const [username, setUsername] = React.useState("ahmed");
  const [profileName, setProfileName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  // Fetch data from backend
  React.useEffect(() => {
    setTimeout(() => {
      setProfileName("Ahmed Al Hasd");
      setEmail("ahmdhsd@ad.ae");
    }, 1000);
  }, []);

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
    toast.success("Your changes have been successfully saved.");
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
                  <Input className="border border-gray-500" value={profileName} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>{text.username}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      className="border border-gray-500 pl-7"
                      value={username} readOnly
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">{text.aboutme}</Label>
                  <Textarea
                    id="about"
                    defaultValue="Explain about yourself..."
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
                  <Input className="border border-gray-500" value={email} readOnly />
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
      </Card>
    </Layout>
  );
}
