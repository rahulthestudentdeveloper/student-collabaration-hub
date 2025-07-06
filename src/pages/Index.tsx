
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, MessageSquare, FolderPlus, LogOut, Send, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  creator: string;
  members: string[];
  createdAt: string;
}

interface Message {
  id: string;
  projectId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Auth forms
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '' });
  const [newProjectForm, setNewProjectForm] = useState({ name: '', description: '' });

  useEffect(() => {
    // Initialize with sample data
    const sampleUsers = [
      { id: '1', username: 'alice', email: 'alice@student.edu' },
      { id: '2', username: 'bob', email: 'bob@student.edu' },
      { id: '3', username: 'charlie', email: 'charlie@student.edu' }
    ];
    
    const sampleProjects = [
      {
        id: '1',
        name: 'Web Development Final',
        description: 'Building a full-stack web application for our final project',
        creator: 'alice',
        members: ['alice', 'bob'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Data Science Research',
        description: 'Analyzing student performance data using machine learning',
        creator: 'bob',
        members: ['bob', 'charlie'],
        createdAt: new Date().toISOString()
      }
    ];

    const sampleMessages = [
      {
        id: '1',
        projectId: '1',
        userId: '1',
        username: 'alice',
        content: 'Hey team! I just pushed the initial frontend setup to our repo.',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        projectId: '1',
        userId: '2',
        username: 'bob',
        content: 'Great! I\'ll start working on the backend API endpoints.',
        timestamp: new Date().toISOString()
      }
    ];

    setUsers(sampleUsers);
    setProjects(sampleProjects);
    setMessages(sampleMessages);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username);
    if (user) {
      setCurrentUser(user);
      toast.success('Welcome back!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.username === signupForm.username)) {
      toast.error('Username already exists');
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      username: signupForm.username,
      email: signupForm.email
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    toast.success('Account created successfully!');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newProject = {
      id: Date.now().toString(),
      name: newProjectForm.name,
      description: newProjectForm.description,
      creator: currentUser.username,
      members: [currentUser.username],
      createdAt: new Date().toISOString()
    };

    setProjects([...projects, newProject]);
    setNewProjectForm({ name: '', description: '' });
    toast.success('Project created successfully!');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedProject || !newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      userId: currentUser.id,
      username: currentUser.username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProject(null);
    setActiveTab('dashboard');
    toast.success('Logged out successfully');
  };

  const getUserProjects = () => {
    if (!currentUser) return [];
    return projects.filter(p => p.members.includes(currentUser.username));
  };

  const getProjectMessages = (projectId: string) => {
    return messages.filter(m => m.projectId === projectId);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Collaboration Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="Your student email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Hub
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{currentUser.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <FolderPlus className="w-4 h-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.username}!</h2>
              <p className="text-gray-600">Here's an overview of your collaborative projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getUserProjects().map(project => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{project.members.length} members</span>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                        Active
                      </Badge>
                    </div>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab('chat');
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            </div>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create New Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={newProjectForm.name}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Input
                        id="project-description"
                        value={newProjectForm.description}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                        placeholder="Brief project description"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Project
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getUserProjects().map(project => (
                <Card key={project.id} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Members: {project.members.join(', ')}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveTab('chat');
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {!selectedProject ? (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Project</h3>
                  <p className="text-gray-500">Choose a project from your dashboard to start chatting with your team</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <p className="text-gray-600">Team chat</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700">
                    {selectedProject.members.length} members online
                  </Badge>
                </div>

                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <ScrollArea className="h-96 p-4">
                    <div className="space-y-4">
                      {getProjectMessages(selectedProject.id).map(message => (
                        <div key={message.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {message.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{message.username}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <div className="p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
