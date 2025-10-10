'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { Button } from '@stackspay/ui';
import { Input } from '@stackspay/ui';
import { Label } from '@stackspay/ui';
import { Switch } from '@stackspay/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stackspay/ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@stackspay/ui';
import { useSettings, useUpdateSettings } from '../../hooks/use-api';
import { Copy, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [settings, setSettings] = useState({
    businessName: '',
    email: '',
    webhookUrl: '',
    autoConvertEnabled: false,
    notificationEmail: '',
    notificationEnabled: true,
  });

  const { data: settingsData, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  React.useEffect(() => {
    if (settingsData) {
      setSettings({
        businessName: settingsData.businessName || '',
        email: settingsData.email || '',
        webhookUrl: settingsData.webhookUrl || '',
        autoConvertEnabled: settingsData.autoConvertEnabled || false,
        notificationEmail: settingsData.notificationEmail || '',
        notificationEnabled: settingsData.notificationEnabled !== false,
      });
    }
  }, [settingsData]);

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync(settings);
      // TODO: Show success toast
      console.log('Settings saved successfully');
    } catch (error) {
      // TODO: Show error toast
      console.error('Failed to save settings:', error);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingApiKey(true);
    // TODO: Implement API key generation
    setTimeout(() => {
      setIsGeneratingApiKey(false);
      // TODO: Show success message
    }, 2000);
  };

  const handleCopyApiKey = () => {
    // TODO: Copy API key to clipboard
    console.log('Copy API key');
  };

  // Mock API key for demo
  const mockApiKey = 'sk_live_1234567890abcdef1234567890abcdef12345678';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
          {updateSettingsMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoConvert">Auto Convert to USD</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically convert Bitcoin payments to USD
                  </p>
                </div>
                <Switch
                  id="autoConvert"
                  checked={settings.autoConvertEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoConvertEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Current API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={mockApiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" onClick={handleCopyApiKey}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your API key secure and never share it publicly
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium">Generate New API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    This will invalidate your current API key
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={isGeneratingApiKey}>
                      {isGeneratingApiKey ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate New Key'
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate New API Key</DialogTitle>
                      <DialogDescription>
                        This action will invalidate your current API key. You'll need to update your integrations with the new key.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleGenerateApiKey}>
                        Generate New Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://your-domain.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  We'll send payment updates to this URL
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Webhook Events</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Payment Confirmed</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Failed</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Expired</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notificationEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationEnabled: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
                  placeholder="notifications@your-domain.com"
                />
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Notification Types</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>New Payment Received</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Confirmed</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily Summary</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly Report</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
