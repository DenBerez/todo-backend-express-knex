const _ = require('lodash');
const todos = require('./database/todo-queries.js');
const users = require('./database/user-queries.js');
const organizations = require('./database/organization-queries.js');
const projects = require('./database/project-queries.js');
const tasks = require('./database/task-queries.js');
const comments = require('./database/comment-queries.js');
const taskAssignments = require('./database/task-assignment-queries.js');
const userOrganizations = require('./database/user-organization-queries.js');

// Helper functions to format response data
function createToDo(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    title: data.title,
    order: data.order,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`
  };
}

function formatUser(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    url: `${protocol}://${host}/users/${id}`
  };
}

function formatOrganization(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    logo_url: data.logo_url,
    url: `${protocol}://${host}/organizations/${id}`
  };
}

function formatProject(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    organization_id: data.organization_id,
    background_color: data.background_color,
    is_archived: data.is_archived,
    url: `${protocol}://${host}/projects/${id}`
  };
}

function formatTask(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    project_id: data.project_id,
    status: data.status,
    order: data.order,
    due_date: data.due_date || null,
    completed: data.completed,
    priority: data.priority,
    label_color: data.label_color,
    url: `${protocol}://${host}/tasks/${id}`
  };
}

function formatComment(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;

  return {
    id: data.id,
    content: data.content,
    task_id: data.task_id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    url: `${protocol}://${host}/comments/${id}`
  };
}

// Todo routes
async function getAllTodos(req, res) {
  const allEntries = await todos.all();
  return res.send(allEntries.map(_.curry(createToDo)(req)));
}

async function getTodo(req, res) {
  const todo = await todos.get(req.params.id);
  return res.send(todo);
}

async function postTodo(req, res) {
  const created = await todos.create(req.body.title, req.body.order);
  return res.send(createToDo(req, created));
}

async function patchTodo(req, res) {
  const patched = await todos.update(req.params.id, req.body);
  return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req, res) {
  const deletedEntries = await todos.clear();
  return res.send(deletedEntries.map(_.curry(createToDo)(req)));
}

async function deleteTodo(req, res) {
  const deleted = await todos.delete(req.params.id);
  return res.send(createToDo(req, deleted));
}

// User routes
async function getAllUsers(req, res) {
  const allUsers = await users.all();
  return res.send(allUsers.map(_.curry(formatUser)(req)));
}

async function getUser(req, res) {
  const user = await users.get(req.params.id);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  return res.send(formatUser(req, user));
}

async function getUserByUsername(req, res) {
  const user = await users.getByUsername(req.params.username);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  return res.send(formatUser(req, user));
}

async function createUser(req, res) {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password_hash: req.body.password_hash,
    full_name: req.body.full_name,
    avatar_url: req.body.avatar_url
  };

  const created = await users.create(userData);
  return res.status(201).send(formatUser(req, created));
}

async function updateUser(req, res) {
  const updated = await users.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).send({ error: "User not found" });
  }
  return res.send(formatUser(req, updated));
}

async function deleteUser(req, res) {
  const deleted = await users.delete(req.params.id);
  if (!deleted) {
    return res.status(404).send({ error: "User not found" });
  }
  return res.send(formatUser(req, deleted));
}

// Organization routes
async function getAllOrganizations(req, res) {
  const allOrgs = await organizations.all();
  return res.send(allOrgs.map(_.curry(formatOrganization)(req)));
}

async function getOrganization(req, res) {
  const org = await organizations.get(req.params.id);
  if (!org) {
    return res.status(404).send({ error: "Organization not found" });
  }
  return res.send(formatOrganization(req, org));
}

async function createOrganization(req, res) {
  const orgData = {
    name: req.body.name,
    description: req.body.description,
    logo_url: req.body.logo_url
  };

  const created = await organizations.create(orgData);
  return res.status(201).send(formatOrganization(req, created));
}

async function updateOrganization(req, res) {
  const updated = await organizations.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).send({ error: "Organization not found" });
  }
  return res.send(formatOrganization(req, updated));
}

async function deleteOrganization(req, res) {
  const deleted = await organizations.delete(req.params.id);
  if (!deleted) {
    return res.status(404).send({ error: "Organization not found" });
  }
  return res.send(formatOrganization(req, deleted));
}

async function getUserOrganizations(req, res) {
  const orgs = await organizations.getUserOrganizations(req.params.userId);
  return res.send(orgs.map(_.curry(formatOrganization)(req)));
}

async function getOrganizationUsers(req, res) {
  const orgUsers = await organizations.getOrganizationUsers(req.params.orgId);
  return res.send(orgUsers.map(_.curry(formatUser)(req)));
}

// Project routes
async function getAllProjects(req, res) {
  const allProjects = await projects.all();
  return res.send(allProjects.map(_.curry(formatProject)(req)));
}

async function getProject(req, res) {
  const project = await projects.get(req.params.id);
  if (!project) {
    return res.status(404).send({ error: "Project not found" });
  }
  return res.send(formatProject(req, project));
}

async function createProject(req, res) {
  const projectData = {
    name: req.body.name,
    description: req.body.description,
    organization_id: req.body.organization_id,
    background_color: req.body.background_color,
    is_archived: req.body.is_archived || false
  };

  const created = await projects.create(projectData);
  return res.status(201).send(formatProject(req, created));
}

async function updateProject(req, res) {
  const updated = await projects.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).send({ error: "Project not found" });
  }
  return res.send(formatProject(req, updated));
}

async function deleteProject(req, res) {
  const deleted = await projects.delete(req.params.id);
  if (!deleted) {
    return res.status(404).send({ error: "Project not found" });
  }
  return res.send(formatProject(req, deleted));
}

async function getOrgProjects(req, res) {
  const orgProjects = await projects.getOrgProjects(req.params.orgId);
  return res.send(orgProjects.map(_.curry(formatProject)(req)));
}

async function archiveProject(req, res) {
  const archived = await projects.archiveProject(req.params.id);
  if (!archived) {
    return res.status(404).send({ error: "Project not found" });
  }
  return res.send(formatProject(req, archived));
}

// Task routes
async function getAllTasks(req, res) {
  const allTasks = await tasks.all();
  return res.send(allTasks.map(_.curry(formatTask)(req)));
}

async function getTask(req, res) {
  const task = await tasks.get(req.params.id);
  if (!task) {
    return res.status(404).send({ error: "Task not found" });
  }
  return res.send(formatTask(req, task));
}

async function createTask(req, res) {
  const taskData = {
    title: req.body.title,
    description: req.body.description,
    project_id: req.body.project_id || null,
    status: req.body.status || 'To Do',
    order: req.body.order,
    due_date: req.body.due_date || null,
    completed: req.body.completed || false,
    priority: req.body.priority || 'medium',
    label_color: req.body.label_color
  };

  const created = await tasks.create(taskData);
  return res.status(201).send(formatTask(req, created));
}

async function updateTask(req, res) {
  const updated = await tasks.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).send({ error: "Task not found" });
  }
  return res.send(formatTask(req, updated));
}

async function deleteTask(req, res) {
  const deleted = await tasks.delete(req.params.id);
  if (!deleted) {
    return res.status(404).send({ error: "Task not found" });
  }
  return res.send(formatTask(req, deleted));
}

async function getProjectTasks(req, res) {
  const projectTasks = await tasks.getProjectTasks(req.params.projectId);
  return res.send(projectTasks.map(_.curry(formatTask)(req)));
}

async function getTasksByStatus(req, res) {
  const statusTasks = await tasks.getTasksByStatus(req.params.projectId, req.params.status);
  return res.send(statusTasks.map(_.curry(formatTask)(req)));
}

async function updateTaskStatus(req, res) {
  const updated = await tasks.updateStatus(req.params.id, req.body.status);
  if (!updated) {
    return res.status(404).send({ error: "Task not found" });
  }
  return res.send(formatTask(req, updated));
}

// Comment routes
async function getTaskComments(req, res) {
  const taskComments = await comments.getTaskComments(req.params.taskId);
  return res.send(taskComments.map(_.curry(formatComment)(req)));
}

async function getComment(req, res) {
  const comment = await comments.get(req.params.id);
  if (!comment) {
    return res.status(404).send({ error: "Comment not found" });
  }
  return res.send(formatComment(req, comment));
}

async function createComment(req, res) {
  const commentData = {
    content: req.body.content,
    task_id: req.body.task_id,
    user_id: req.body.user_id
  };

  const created = await comments.create(commentData);
  return res.status(201).send(formatComment(req, created));
}

async function updateComment(req, res) {
  const updated = await comments.update(req.params.id, req.body.content);
  if (!updated) {
    return res.status(404).send({ error: "Comment not found" });
  }
  return res.send(formatComment(req, updated));
}

async function deleteComment(req, res) {
  const deleted = await comments.delete(req.params.id);
  if (!deleted) {
    return res.status(404).send({ error: "Comment not found" });
  }
  return res.send(formatComment(req, deleted));
}

// Task Assignment routes
async function assignTask(req, res) {
  const assignment = await taskAssignments.assignTask(req.body.task_id, req.body.user_id);
  return res.status(201).send(assignment);
}

async function unassignTask(req, res) {
  const unassigned = await taskAssignments.unassignTask(req.params.taskId, req.params.userId);
  if (!unassigned) {
    return res.status(404).send({ error: "Task assignment not found" });
  }
  return res.send(unassigned);
}

async function getTaskAssignees(req, res) {
  const assignees = await taskAssignments.getTaskAssignees(req.params.taskId);
  return res.send(assignees.map(_.curry(formatUser)(req)));
}

async function getUserTasks(req, res) {
  const userTasks = await taskAssignments.getUserTasks(req.params.userId);
  return res.send(userTasks.map(_.curry(formatTask)(req)));
}

// User Organization routes
async function addUserToOrg(req, res) {
  const userOrg = await userOrganizations.addUserToOrg(
    req.body.user_id,
    req.body.organization_id,
    req.body.role || 'member'
  );
  return res.status(201).send(userOrg);
}

async function updateUserRole(req, res) {
  const updated = await userOrganizations.updateUserRole(
    req.params.userId,
    req.params.orgId,
    req.body.role
  );
  if (!updated) {
    return res.status(404).send({ error: "User organization relationship not found" });
  }
  return res.send(updated);
}

async function removeUserFromOrg(req, res) {
  const removed = await userOrganizations.removeUserFromOrg(req.params.userId, req.params.orgId);
  if (!removed) {
    return res.status(404).send({ error: "User organization relationship not found" });
  }
  return res.send(removed);
}

async function getUserOrgRole(req, res) {
  const role = await userOrganizations.getUserOrgRole(req.params.userId, req.params.orgId);
  if (!role) {
    return res.status(404).send({ error: "User organization relationship not found" });
  }
  return res.send(role);
}

// Error handling wrapper
function addErrorReporting(func, message) {
  return async function (req, res) {
    try {
      return await func(req, res);
    } catch (err) {
      console.log(`${message} caused by:`, err);

      // Determine appropriate status code based on error type
      let statusCode = 500;
      if (err.name === 'ValidationError') statusCode = 400;
      if (err.name === 'NotFoundError') statusCode = 404;
      if (err.name === 'PermissionError') statusCode = 403;

      // In development, send detailed error; in production, send generic message
      const isDev = process.env.NODE_ENV === 'development';
      const errorResponse = {
        error: `Oops! ${message}.`,
        details: isDev ? err.message : undefined
      };

      res.status(statusCode).send(errorResponse);
    }
  }
}

const toExport = {
  // Todo routes
  getAllTodos: { method: getAllTodos, errorMessage: "Could not fetch all todos" },
  getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
  postTodo: { method: postTodo, errorMessage: "Could not post todo" },
  patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
  deleteAllTodos: { method: deleteAllTodos, errorMessage: "Could not delete all todos" },
  deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },

  // User routes
  getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users" },
  getUser: { method: getUser, errorMessage: "Could not fetch user" },
  getUserByUsername: { method: getUserByUsername, errorMessage: "Could not fetch user by username" },
  createUser: { method: createUser, errorMessage: "Could not create user" },
  updateUser: { method: updateUser, errorMessage: "Could not update user" },
  deleteUser: { method: deleteUser, errorMessage: "Could not delete user" },

  // Organization routes
  getAllOrganizations: { method: getAllOrganizations, errorMessage: "Could not fetch all organizations" },
  getOrganization: { method: getOrganization, errorMessage: "Could not fetch organization" },
  createOrganization: { method: createOrganization, errorMessage: "Could not create organization" },
  updateOrganization: { method: updateOrganization, errorMessage: "Could not update organization" },
  deleteOrganization: { method: deleteOrganization, errorMessage: "Could not delete organization" },
  getUserOrganizations: { method: getUserOrganizations, errorMessage: "Could not fetch user organizations" },
  getOrganizationUsers: { method: getOrganizationUsers, errorMessage: "Could not fetch organization users" },

  // Project routes
  getAllProjects: { method: getAllProjects, errorMessage: "Could not fetch all projects" },
  getProject: { method: getProject, errorMessage: "Could not fetch project" },
  createProject: { method: createProject, errorMessage: "Could not create project" },
  updateProject: { method: updateProject, errorMessage: "Could not update project" },
  deleteProject: { method: deleteProject, errorMessage: "Could not delete project" },
  getOrgProjects: { method: getOrgProjects, errorMessage: "Could not fetch organization projects" },
  archiveProject: { method: archiveProject, errorMessage: "Could not archive project" },

  // Task routes
  getAllTasks: { method: getAllTasks, errorMessage: "Could not fetch all tasks" },
  getTask: { method: getTask, errorMessage: "Could not fetch task" },
  createTask: { method: createTask, errorMessage: "Could not create task" },
  updateTask: { method: updateTask, errorMessage: "Could not update task" },
  deleteTask: { method: deleteTask, errorMessage: "Could not delete task" },
  getProjectTasks: { method: getProjectTasks, errorMessage: "Could not fetch project tasks" },
  getTasksByStatus: { method: getTasksByStatus, errorMessage: "Could not fetch tasks by status" },
  updateTaskStatus: { method: updateTaskStatus, errorMessage: "Could not update task status" },

  // Comment routes
  getTaskComments: { method: getTaskComments, errorMessage: "Could not fetch task comments" },
  getComment: { method: getComment, errorMessage: "Could not fetch comment" },
  createComment: { method: createComment, errorMessage: "Could not create comment" },
  updateComment: { method: updateComment, errorMessage: "Could not update comment" },
  deleteComment: { method: deleteComment, errorMessage: "Could not delete comment" },

  // Task Assignment routes
  assignTask: { method: assignTask, errorMessage: "Could not assign task" },
  unassignTask: { method: unassignTask, errorMessage: "Could not unassign task" },
  getTaskAssignees: { method: getTaskAssignees, errorMessage: "Could not fetch task assignees" },
  getUserTasks: { method: getUserTasks, errorMessage: "Could not fetch user tasks" },

  // User Organization routes
  addUserToOrg: { method: addUserToOrg, errorMessage: "Could not add user to organization" },
  updateUserRole: { method: updateUserRole, errorMessage: "Could not update user role" },
  removeUserFromOrg: { method: removeUserFromOrg, errorMessage: "Could not remove user from organization" },
  getUserOrgRole: { method: getUserOrgRole, errorMessage: "Could not fetch user organization role" }
}

for (let route in toExport) {
  toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
