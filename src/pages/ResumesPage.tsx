import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  Copy,
  MoreVertical,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ResumesPage() {
  const { resumes, resume, loadResume, createNewResume, deleteResume, updateResume } = useResume();
  const navigate = useNavigate();

  const handleCreate = () => {
    createNewResume();
    toast.success('New resume created!');
    navigate('/editor');
  };

  const handleLoad = (id: string) => {
    loadResume(id);
    navigate('/editor');
  };

  const handleDuplicate = (r: typeof resume) => {
    createNewResume();
    updateResume({
      ...r,
      id: crypto.randomUUID(),
      name: `${r.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast.success('Resume duplicated!');
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    toast.success('Resume deleted');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My Resumes</h1>
              <p className="text-sm text-muted-foreground">
                Manage your resume versions and tailored copies
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Resume
            </Button>
          </div>
        </header>

        <div className="p-6">
          {resumes.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Resumes Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first resume to get started
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((r) => (
                <Card 
                  key={r.id} 
                  className={`cursor-pointer hover:border-primary/50 transition-colors ${
                    r.id === resume.id ? 'border-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{r.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Updated {formatDate(r.updatedAt)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLoad(r.id)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(r)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "{r.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(r.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-foreground font-medium truncate">
                        {r.contact.fullName || 'No name set'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.contact.email || 'No email set'}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-2">
                        <Badge variant="secondary" className="text-xs">
                          {r.experiences.length} Experiences
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {r.skills.length} Skills
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => handleLoad(r.id)}
                    >
                      Open Resume
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
