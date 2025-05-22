import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    resourceType: 'tasks',
    method: 'GET',
    endpoint: '/tasks',
    lastRequest: '',

    // Task fields
    id: '',
    title: '',
    description: '',
    project_id: '',
    status: 'To Do',
    order: '',
    due_date: '',
    completed: false,
    priority: 'medium',
    label_color: '',

    // Project fields for selection
    projects: [],

    response: [],
  };

  componentDidMount() {
    // Fetch projects for the project dropdown
    this.fetchProjects();
  }

  fetchProjects = async () => {
    try {
      const response = await fetch('/projects');
      if (response.ok) {
        const projects = await response.json();
        this.setState({ projects });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    let {
      method, endpoint, id, title, description, project_id,
      status, order, due_date, completed, priority, label_color
    } = this.state;

    let url = endpoint;
    if (id && (method === 'PATCH' || method === 'DELETE' || method === 'GET')) {
      url = `/tasks/${id}`;
    }

    let request = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Prepare request body for non-GET requests
    if (method !== "GET") {
      const taskData = {
        title,
        description,
        project_id: project_id ? Number(project_id) : undefined,
        status,
        order: order ? Number(order) : undefined,
        due_date,
        completed,
        priority,
        label_color
      };

      console.log(taskData);

      // Remove undefined values
      Object.keys(taskData).forEach(key =>
        taskData[key] === undefined && delete taskData[key]
      );

      request.body = JSON.stringify(taskData);
    }

    this.setState({ lastRequest: `${method} at ${url}` });

    try {
      let response;
      // Handle development environment special case
      if (process.env.NODE_ENV === "development" && method === "GET" && url === '/tasks') {
        response = await fetch('http://localhost:5000/tasks', request);
      } else {
        response = await fetch(url, request);
      }

      const contentType = response.headers.get('content-type');

      let body;
      if (contentType && contentType.includes('application/json')) {
        body = await response.json();
      } else if (contentType && contentType.includes('text/html')) {
        body = await response.text();
      }

      if (response.status >= 400) {
        console.log(body);
        this.setState({ response: [{ status: response.status, message: body }] });
        return;
      }

      // Ensures format of [{}, {}, {}]
      if (!Array.isArray(body))
        body = [body];

      this.setState({ response: body });

      // Clear form after successful POST
      if (method === 'POST' && response.status === 201) {
        this.clearForm();
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ response: [{ status: 'Error', message: error.message }] });
    }
  };

  clearForm = () => {
    this.setState({
      id: '',
      title: '',
      description: '',
      project_id: '',
      status: 'To Do',
      order: '',
      due_date: '',
      completed: false,
      priority: 'medium',
      label_color: ''
    });
  };

  changeMethod = event => {
    const method = event.target.value;
    this.setState({ method });
  };

  changeEndpoint = event => {
    const endpoint = event.target.value;
    this.setState({ endpoint });
  };

  render() {
    const {
      resourceType, method, endpoint, lastRequest, id, title, description,
      project_id, status, order, due_date, completed, priority,
      label_color, projects, response
    } = this.state;

    const isCreating = method === "POST";
    const isUpdating = method === "PATCH";
    const isDeleting = method === "DELETE";
    const isReading = method === "GET";

    const shouldShowTaskFields = isCreating || isUpdating;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Task Management System
          </p>
        </header>

        <div className="resource-selector">
          <h3>Resource Type:</h3>
          <select
            value={resourceType}
            onChange={e => this.setState({ resourceType: e.target.value })}
          >
            <option value="tasks">Tasks</option>
          </select>
        </div>

        <div className="endpoint-selector">
          <h3>Endpoint:</h3>
          <select value={endpoint} onChange={this.changeEndpoint}>
            <option value="/tasks">All Tasks</option>
            <option value="/tasks/:id">Task by ID</option>
            <option value="/projects/:projectId/tasks">Tasks by Project</option>
            <option value="/projects/:projectId/tasks/status/:status">Tasks by Status</option>
          </select>
        </div>

        <form onSubmit={this.handleSubmit} className="task-form">
          <h3>Request Details:</h3>

          <div className="form-group">
            <label>Method:</label>
            <select value={method} onChange={this.changeMethod}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {endpoint.includes(':id') && (
            <div className="form-group">
              <label>Task ID:</label>
              <input
                type="text"
                placeholder="Task ID"
                value={id}
                onChange={e => this.setState({ id: e.target.value })}
              />
            </div>
          )}

          {endpoint.includes(':projectId') && (
            <div className="form-group">
              <label>Project ID:</label>
              <input
                type="text"
                placeholder="Project ID"
                value={project_id}
                onChange={e => this.setState({ project_id: e.target.value })}
              />
            </div>
          )}

          {endpoint.includes(':status') && (
            <div className="form-group">
              <label>Status:</label>
              <select
                value={status}
                onChange={e => this.setState({ status: e.target.value })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Done">Done</option>
              </select>
            </div>
          )}

          {shouldShowTaskFields && (
            <>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={e => this.setState({ title: e.target.value })}
                  required={isCreating}
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  placeholder="Task description"
                  value={description}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Project:</label>
                <select
                  value={project_id}
                  onChange={e => this.setState({ project_id: e.target.value })}
                // required={isCreating}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={status}
                  onChange={e => this.setState({ status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label>Order:</label>
                <input
                  type="number"
                  placeholder="Task order"
                  value={order}
                  onChange={e => this.setState({ order: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Due Date:</label>
                <input
                  type="date"
                  value={due_date}
                  onChange={e => this.setState({ due_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  Completed:
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={e => this.setState({ completed: e.target.checked })}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>Priority:</label>
                <select
                  value={priority}
                  onChange={e => this.setState({ priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Label Color:</label>
                <input
                  type="color"
                  value={label_color || "#ffffff"}
                  onChange={e => this.setState({ label_color: e.target.value })}
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-button">
            Send Request
          </button>
        </form>

        <div className="response-section">
          <h3>{`Last Request: ${lastRequest}`}</h3>

          <div className="response-container">
            <h3>Response:</h3>
            {response.map((item, i) => (
              <div key={i} className="response-item">
                {item ? (
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;