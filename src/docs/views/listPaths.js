const listPaths = {
  '/api/lists': {
    post: {
      tags: ['Lists'],
      summary: 'Create a shopping list',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ListRequest' } }
        }
      },
      responses: {
        '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    get: {
      tags: ['Lists'],
      summary: 'Get all lists',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ListResponse' } } } } },
        '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/lists/{id}/items': {
    parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'List UUID' } ],
    post: {
      tags: ['Lists'],
      summary: 'Add item to a shopping list',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ItemRequest' } }
        }
      },
      responses: {
        '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemResponse' } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  }
  ,
  '/api/lists/{id}': {
    parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'List UUID' } ],
    put: {
      tags: ['Lists'],
      summary: 'Update a shopping list',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ListRequest' } } }
      },
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      tags: ['Lists'],
      summary: 'Delete a shopping list',
      security: [{ bearerAuth: [] }],
      responses: {
        '204': { description: 'No Content' },
        '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  }
};

export { listPaths };
