import React, { useRef } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Camera, X } from 'lucide-react';

export function ContactSection() {
  const { resume, updateContact } = useResume();
  const { contact } = resume;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateContact({ profilePicture: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    updateContact({ profilePicture: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Profile Picture Upload */}
        <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b">
          <div className="relative shrink-0">
            {contact.profilePicture ? (
              <div className="relative">
                <img
                  src={contact.profilePicture}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/20"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  title="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center xs:text-left">
            <Label className="text-xs sm:text-sm font-medium">Profile Picture</Label>
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
              Optional. Add a professional photo for templates that support it.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs sm:text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              {contact.profilePicture ? 'Change' : 'Upload'}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={contact.fullName}
              onChange={(e) => updateContact({ fullName: e.target.value })}
              placeholder="John Doe"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="john@example.com"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              Phone
            </Label>
            <Input
              id="phone"
              value={contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="location"
              value={contact.location}
              onChange={(e) => updateContact({ location: e.target.value })}
              placeholder="New York, NY"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={contact.linkedin}
              onChange={(e) => updateContact({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="website" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              value={contact.website}
              onChange={(e) => updateContact({ website: e.target.value })}
              placeholder="johndoe.com"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
