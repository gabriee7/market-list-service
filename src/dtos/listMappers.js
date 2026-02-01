export function mapListResponse(list) {
  return {
    id: list.id,
    name: list.name,
    userId: list.user_id || list.userId,
    createdAt: list.created_at || list.createdAt,
    items: (list.items || []).map((it) => ({
      id: it.id,
      productName: it.product_name || it.productName,
      quantity: it.quantity,
      unitPrice: Number(it.unit_price || it.unitPrice),
      subtotal: it.subtotal !== undefined ? it.subtotal : Number((it.quantity * (it.unit_price || it.unitPrice || 0)).toFixed(2))
    })),
    total: Number((list.total || 0).toFixed ? list.total : Number((list.total || 0)))
  };
}
