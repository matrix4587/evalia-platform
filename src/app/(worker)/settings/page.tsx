"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Lock, CreditCard, Bell, ShieldAlert, 
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("security");

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Settings updated successfully!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    // Reduced overall container spacing
    <div className="space-y-6 max-w-5xl mx-auto px-4 md:px-8 pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "security" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Lock className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "payments" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <CreditCard className="w-4 h-4" /> Payouts
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "notifications" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab("danger")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "danger" ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <ShieldAlert className="w-4 h-4" /> Danger Zone
          </button>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          
          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b">
                <CardTitle className="text-lg md:text-xl">Security</CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password" className="text-sm font-bold">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" className="h-9 md:h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-sm font-bold">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" className="h-9 md:h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-sm font-bold">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" className="h-9 md:h-10 text-sm" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 mt-2">
                  <div>
                    <Label className="text-sm font-bold">Two-Factor Authentication (2FA)</Label>
                    <p className="text-xs text-slate-500">Require a code from your phone to log in.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 p-3 md:p-4 rounded-b-xl flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 h-9 text-sm w-full md:w-auto">
                  {isLoading ? "Saving..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* PAYOUTS TAB */}
          {activeTab === "payments" && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b">
                <CardTitle className="text-lg md:text-xl">Payout Methods</CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Manage where your earnings are sent.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3">
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 bg-green-100 text-green-600 rounded-full shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm">M-Pesa</p>
                      <p className="text-xs text-slate-500 truncate">+254 712 345 678 (Default)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm">PayPal</p>
                      <p className="text-xs text-slate-500 truncate">evans@example.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs">Edit</Button>
                </div>

                <Button variant="outline" className="w-full border-dashed h-10 text-xs text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50">
                  + Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB - REDUCED SPACING */}
          {activeTab === "notifications" && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b">
                <CardTitle className="text-lg md:text-xl">Notifications</CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Choose what updates you receive.</CardDescription>
              </CardHeader>
              {/* Reduced padding here from p-5 to p-4, and space-y-1 to space-y-0 */}
              <CardContent className="p-4 md:p-6 space-y-0">
                
                {/* THE FIX: Reduced vertical padding from p-3 to py-2.5 and removed gap-3 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-3 border-b">
                  <div className="space-y-0.5 pr-2 md:pr-4 mb-1 md:mb-0">
                    <Label className="text-sm md:text-base font-bold">New Task Alerts</Label>
                    <p className="text-xs md:text-sm text-slate-500">Get notified when a task matching your skills is posted.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-3 border-b">
                  <div className="space-y-0.5 pr-2 md:pr-4 mb-1 md:mb-0">
                    <Label className="text-sm md:text-base font-bold">Payout Updates</Label>
                    <p className="text-xs md:text-sm text-slate-500">Receive an email when your withdrawal is processed.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-3 border-b">
                  <div className="space-y-0.5 pr-2 md:pr-4 mb-1 md:mb-0">
                    <Label className="text-sm md:text-base font-bold">Assessment Results</Label>
                    <p className="text-xs md:text-sm text-slate-500">Get notified when your assessment is graded.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-3">
                  <div className="space-y-0.5 pr-2 md:pr-4 mb-1 md:mb-0">
                    <Label className="text-sm md:text-base font-bold">Marketing & News</Label>
                    <p className="text-xs md:text-sm text-slate-500">Receive updates about new platform features and AI news.</p>
                  </div>
                  <Switch />
                </div>

              </CardContent>
              <CardFooter className="border-t bg-slate-50 p-3 md:p-4 rounded-b-xl flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto h-9 text-sm">
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === "danger" && (
            <Card className="shadow-sm border-red-200">
              <CardHeader className="bg-red-50 rounded-t-xl border-b border-red-100 p-4 md:p-6 pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl text-red-700">Danger Zone</CardTitle>
                <CardDescription className="text-xs md:text-sm text-red-600/80 mt-1">Irreversible actions.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">Delete Account</h4>
                    <p className="text-xs md:text-sm text-slate-500 max-w-md mt-1">
                      This will permanently erase your earnings and task history.
                    </p>
                  </div>
                  <Button variant="destructive" className="shrink-0 bg-red-600 hover:bg-red-700 w-full sm:w-auto h-9 text-sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}