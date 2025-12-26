import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function CertificationsSection() {
  const { resume, addCertification, updateCertification, removeCertification } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            Certifications
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addCertification} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.certifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No certifications added yet</p>
            <Button variant="link" onClick={addCertification} className="mt-2">
              Add a certification
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {resume.certifications.map((cert) => (
              <Collapsible
                key={cert.id}
                open={expandedId === cert.id}
                onOpenChange={(open) => setExpandedId(open ? cert.id : null)}
              >
                <div className="border border-border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {cert.name || 'Certification Name'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {cert.issuer || 'Issuer'} • {cert.date || 'Date'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCertification(cert.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Certification Name</Label>
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            placeholder="AWS Solutions Architect"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Issuing Organization</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            placeholder="Amazon Web Services"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                            placeholder="March 2023"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expiration Date (Optional)</Label>
                          <Input
                            value={cert.expirationDate || ''}
                            onChange={(e) => updateCertification(cert.id, { expirationDate: e.target.value })}
                            placeholder="March 2026"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Credential ID (Optional)</Label>
                        <Input
                          value={cert.credentialId || ''}
                          onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                          placeholder="ABC123XYZ"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
