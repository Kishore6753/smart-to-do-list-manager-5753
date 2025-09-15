const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do List API',
      version: '1.0.0',
      description: 'REST API for tasks, categories, reminders, and user preferences',
    },
    tags: [
      { name: 'Tasks', description: 'Task management' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Reminders', description: 'Reminder management' },
      { name: 'Preferences', description: 'User preference management' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
