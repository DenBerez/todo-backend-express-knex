const app = require('./server-config.js');
const routes = require('./server-routes.js');

const port = process.env.PORT || 5000;

// app.get('/', routes.getAllTodos);
// app.get('/:id', routes.getTodo);

// app.post('/', routes.postTodo);
// app.patch('/:id', routes.patchTodo);

// app.delete('/', routes.deleteAllTodos);
// app.delete('/:id', routes.deleteTodo);

// User routes
app.get('/users', routes.getAllUsers);
app.get('/users/:id', routes.getUser);
app.get('/users/username/:username', routes.getUserByUsername);
app.post('/users', routes.createUser);
app.patch('/users/:id', routes.updateUser);
app.delete('/users/:id', routes.deleteUser);

// Organization routes
app.get('/organizations', routes.getAllOrganizations);
app.get('/organizations/:id', routes.getOrganization);
app.post('/organizations', routes.createOrganization);
app.patch('/organizations/:id', routes.updateOrganization);
app.delete('/organizations/:id', routes.deleteOrganization);
app.get('/users/:userId/organizations', routes.getUserOrganizations);
app.get('/organizations/:orgId/users', routes.getOrganizationUsers);

// Project routes
app.get('/projects', routes.getAllProjects);
app.get('/projects/:id', routes.getProject);
app.post('/projects', routes.createProject);
app.patch('/projects/:id', routes.updateProject);
app.delete('/projects/:id', routes.deleteProject);
app.get('/organizations/:orgId/projects', routes.getOrgProjects);
app.patch('/projects/:id/archive', routes.archiveProject);

// Task routes
app.get('/tasks', routes.getAllTasks);
app.get('/tasks/:id', routes.getTask);
app.post('/tasks', routes.createTask);
app.patch('/tasks/:id', routes.updateTask);
app.delete('/tasks/:id', routes.deleteTask);
app.get('/projects/:projectId/tasks', routes.getProjectTasks);
app.get('/projects/:projectId/tasks/status/:status', routes.getTasksByStatus);
app.patch('/tasks/:id/status', routes.updateTaskStatus);

// Comment routes
app.get('/tasks/:taskId/comments', routes.getTaskComments);
app.get('/comments/:id', routes.getComment);
app.post('/comments', routes.createComment);
app.patch('/comments/:id', routes.updateComment);
app.delete('/comments/:id', routes.deleteComment);

// Task Assignment routes
app.post('/task-assignments', routes.assignTask);
app.delete('/tasks/:taskId/assignments/:userId', routes.unassignTask);
app.get('/tasks/:taskId/assignees', routes.getTaskAssignees);
app.get('/users/:userId/assigned-tasks', routes.getUserTasks);

// User Organization routes
app.post('/user-organizations', routes.addUserToOrg);
app.patch('/users/:userId/organizations/:orgId/role', routes.updateUserRole);
app.delete('/users/:userId/organizations/:orgId', routes.removeUserFromOrg);
app.get('/users/:userId/organizations/:orgId/role', routes.getUserOrgRole);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;