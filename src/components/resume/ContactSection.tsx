import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export function ContactSection() {
  const { resume, updateContact } = useResume();
  const { contact } = resume;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={contact.fullName}
              onChange={(e) => updateContact({ fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </Label>
            <Input
              id="phone"
              value={contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="location"
              value={contact.location}
              onChange={(e) => updateContact({ location: e.target.value })}
              placeholder="New York, NY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={contact.linkedin}
              onChange={(e) => updateContact({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              value={contact.website}
              onChange={(e) => updateContact({ website: e.target.value })}
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
