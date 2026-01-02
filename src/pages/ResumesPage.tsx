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
        <header className="sticky top-0 md:top-0 z-10 bg-background border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">My Resumes</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your resume versions
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2 h-9 sm:h-10 text-sm w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Resume
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {resumes.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-8 sm:py-12 text-center">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No Resumes Yet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Create your first resume to get started
                </p>
                <Button onClick={handleCreate} className="h-9 sm:h-10 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((r) => (
                <Card 
                  key={r.id} 
                  className={`cursor-pointer hover:border-primary/50 transition-colors ${
                    r.id === resume.id ? 'border-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">{r.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          Updated {formatDate(r.updatedAt)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                  This action cannot be undone. This will permanently delete "{r.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(r.id)} className="w-full sm:w-auto">
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
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-sm text-foreground font-medium truncate">
                        {r.contact.fullName || 'No name set'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.contact.email || 'No email set'}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1.5 sm:pt-2">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {r.experiences.length} Exp
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          {r.skills.length} Skills
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 sm:mt-4 h-8 sm:h-9 text-sm"
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
