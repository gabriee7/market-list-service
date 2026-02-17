const schemas = {
  UserRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      password: { type: 'string', format: 'password', example: 'senha123' }
    }
  },
  UserResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' }
    }
  },
  ListRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Lista de Compras' }
    }
  },
  ItemRequest: {
    type: 'object',
    required: ['productName', 'quantity', 'unitPrice'],
    properties: {
      productName: { type: 'string', example: 'Arroz 5kg' },
      quantity: { type: 'integer', example: 2 },
      unitPrice: { type: 'number', format: 'double', example: 19.9 }
    }
  },
  ItemResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      productName: { type: 'string' },
      quantity: { type: 'integer' },
      unitPrice: { type: 'number', format: 'double' },
      subtotal: { type: 'number', format: 'double' }
    }
  },
  ListResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      items: { type: 'array', items: { $ref: '#/components/schemas/ItemResponse' } },
      total: { type: 'number', format: 'double' },
      itemCount: { type: 'integer', example: 0 },
      totalValue: { type: 'number', format: 'double' }
    }
  }
};

export default schemas;